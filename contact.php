<?php
/**
 * Contact form — sends enquiries to site owner.
 * Hostinger: place in public_html next to index.html
 */

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

// Honeypot — bots often fill hidden fields
if (!empty($_POST['website'])) {
    echo json_encode(['ok' => true]);
    exit;
}

$to = 'georgefelner@gmail.com';

$name = trim((string) ($_POST['name'] ?? ''));
$email = trim((string) ($_POST['email'] ?? ''));
$location = trim((string) ($_POST['location'] ?? ''));
$format = trim((string) ($_POST['format'] ?? ''));
$message = trim((string) ($_POST['message'] ?? ''));

if ($name === '' || $email === '' || $format === '') {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Please fill in name, email, and service.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Please enter a valid email address.']);
    exit;
}

$formatLabels = [
    'fpv-tour' => 'One-shot FPV tour',
    'fpv-fullframe' => 'FPV & full-frame cinematography',
    'pictures-ai' => 'Pictures to cinematic video (AI)',
];
$formatLabel = $formatLabels[$format] ?? $format;

$subject = 'Cinematic Viewing — new enquiry from ' . $name;

$body = "New enquiry from CinematicViewing.com\n\n";
$body .= "Name: {$name}\n";
$body .= "Email: {$email}\n";
$body .= "Property location: " . ($location !== '' ? $location : '(not provided)') . "\n";
$body .= "Service: {$formatLabel}\n\n";
$body .= "Message:\n" . ($message !== '' ? $message : '(not provided)') . "\n\n";
$body .= "---\nSent: " . gmdate('Y-m-d H:i:s') . " UTC\n";

$from = 'noreply@cinematicviewing.com';
$headers = [
    'From: Cinematic Viewing <' . $from . '>',
    'Reply-To: ' . $name . ' <' . $email . '>',
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: PHP/' . phpversion(),
];

$sent = @mail($to, $subject, $body, implode("\r\n", $headers));

if (!$sent) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Could not send email. Please try again or email us directly.']);
    exit;
}

echo json_encode(['ok' => true, 'message' => 'Thank you — we will be in touch shortly.']);
