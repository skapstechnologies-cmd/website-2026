<?php
// Simple handler for contact form submissions.
// Expects POST data from contact.html and returns JSON indicating success or failure.

header('Content-Type: application/json');

// DISABLED: legacy contact form handler no longer in use
http_response_code(410);
echo json_encode(['success' => false, 'message' => 'handler disabled']);
exit;

// helper function to send error response and exit
function fail($message, $code = 400) {
    http_response_code($code);
    echo json_encode(['success' => false, 'message' => $message]);
    exit;
}

// collect and sanitize inputs
$fname = isset($_POST['fname']) ? trim($_POST['fname']) : '';
$lastname = isset($_POST['lname']) ? trim($_POST['lname']) : '';
$phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$service = isset($_POST['service']) ? trim($_POST['service']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

if (empty($fname) || empty($email)) {
    fail('First name and email are required.', 422);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    fail('Invalid email address.', 422);
}

// TODO: customize behaviour – send email, save to database, etc.
// For now we'll attempt to email the submission to a fixed address and/or log to a file.

$to = 'connect@skapscorp.in';
$subject = 'New contact from website';
$body = "Name: {$fname} {$lastname}\n" .
        "Phone: {$phone}\n" .
        "Email: {$email}\n" .
        "Service: {$service}\n" .
        "Message:\n{$message}\n";
$headers = "From: {$email}\r\n" .
           "Reply-To: {$email}\r\n" .
           "Content-Type: text/plain; charset=UTF-8\r\n";

$mailSent = false;
if (function_exists('mail')) {
    $mailSent = @mail($to, $subject, $body, $headers);
}

// also append to a logfile for debugging
$logEntry = date('Y-m-d H:i:s') . " | {$fname} {$lastname} | {$email} | {$phone} | {$service} | {$message}\n";
file_put_contents(__DIR__ . '/leads.log', $logEntry, FILE_APPEND);

if ($mailSent) {
    echo json_encode(['success' => true]);
} else {
    // still respond success so JS shows success if email failed but logging succeeded
    echo json_encode(['success' => true, 'notice' => 'mail_not_sent']);
}
