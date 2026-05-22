#!/usr/bin/env node
/**
 * Commit site files and push to GitHub (for Hostinger Git deploy).
 * Requires .env.github — see .env.github.example
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const ENV_PATH = path.join(ROOT, ".env.github");

const SITE_PATHS = ["index.html", "assets"];

function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error("\nMissing .env.github");
    console.error("  cp .env.github.example .env.github");
    console.error("  Add a GitHub token (repo scope). Never paste the token in chat.\n");
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

function run(cmd, options = {}) {
  execSync(cmd, { cwd: ROOT, stdio: "inherit", ...options });
}

function runCapture(cmd) {
  return execSync(cmd, { cwd: ROOT, encoding: "utf8" }).trim();
}

const env = loadEnv(ENV_PATH);
const token = env.GITHUB_TOKEN;
const user = env.GITHUB_USER || "aicastingcom";
const repo = env.GITHUB_REPO || "cinematicviewing";

if (!token || token.includes("your_token")) {
  console.error("\nSet a real GITHUB_TOKEN in .env.github\n");
  process.exit(1);
}

const message =
  process.argv.slice(2).join(" ").trim() || "Deploy from Cursor";

let status;
try {
  status = runCapture("git status --porcelain -- index.html assets");
} catch {
  console.error("\nGit not initialized in this folder.\n");
  process.exit(1);
}

if (!status) {
  console.log("\nNo changes in index.html or assets/ — nothing to deploy.\n");
  process.exit(0);
}

console.log("\nCommitting site files…\n");
for (const p of SITE_PATHS) {
  if (fs.existsSync(path.join(ROOT, p))) {
    run(`git add "${p}"`);
  }
}

run(`git commit -m ${JSON.stringify(message)}`);

const remote = `https://x-access-token:${token}@github.com/${user}/${repo}.git`;
console.log("\nPushing to GitHub…\n");
run(`git push ${remote} main`, {
  env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
});

console.log("\nDone. GitHub updated.");
console.log("If Hostinger Auto Deployment is on, the site updates in a minute.");
console.log("Otherwise: hPanel → Git → Deploy on cinematicviewing.\n");
