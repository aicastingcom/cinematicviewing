#!/usr/bin/env node
/**
 * Upload site to Hostinger via FTP.
 * Requires .env.deploy in project root (see .env.deploy.example).
 */

const fs = require("fs");
const path = require("path");
const { Client } = require("basic-ftp");

const ROOT = path.join(__dirname, "..");
const ENV_PATH = path.join(ROOT, ".env.deploy");

function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error("\nMissing .env.deploy — copy .env.deploy.example and add your Hostinger FTP details.\n");
    process.exit(1);
  }
  const env = {};
  for (const line of fs.readFileSync(filePath, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    env[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
  return env;
}

function listFiles(dir, base = dir) {
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const rel = path.relative(base, full).split(path.sep).join("/");
    if (fs.statSync(full).isDirectory()) {
      out.push(...listFiles(full, base));
    } else {
      out.push({ local: full, remote: rel });
    }
  }
  return out;
}

async function main() {
  const env = loadEnv(ENV_PATH);
  const host = env.FTP_HOST;
  const user = env.FTP_USER;
  const password = env.FTP_PASSWORD;
  const port = Number(env.FTP_PORT || 21);
  const remoteDir = (env.FTP_REMOTE_DIR || "/public_html").replace(/\/$/, "");

  if (!host || !user || !password) {
    console.error("FTP_HOST, FTP_USER, and FTP_PASSWORD are required in .env.deploy");
    process.exit(1);
  }

  const uploads = [
    { local: path.join(ROOT, "index.html"), remote: "index.html" },
    ...listFiles(path.join(ROOT, "assets")).map(({ local, remote }) => ({
      local,
      remote: `assets/${remote}`,
    })),
  ];

  const client = new Client(60_000);
  client.ftp.verbose = process.env.DEPLOY_VERBOSE === "1";

  console.log(`Connecting to ${host}…`);
  await client.access({ host, user, password, port, secure: false });
  await client.ensureDir(remoteDir);
  await client.cd(remoteDir);

  console.log(`Uploading to ${remoteDir} (${uploads.length} files)…`);
  for (const { local, remote } of uploads) {
    const remotePath = remote.replace(/\\/g, "/");
    const remoteFolder = path.posix.dirname(remotePath);
    if (remoteFolder && remoteFolder !== ".") {
      await client.ensureDir(remoteFolder);
    }
    process.stdout.write(`  ${remotePath}\n`);
    await client.uploadFrom(local, remotePath);
  }

  client.close();
  console.log("\nDeploy finished. Check https://cinematicviewing.com (hard refresh: Cmd+Shift+R).\n");
}

main().catch((err) => {
  console.error("\nDeploy failed:", err.message);
  process.exit(1);
});
