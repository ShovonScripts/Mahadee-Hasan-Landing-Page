<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Load Composer's autoloader or custom require if you downloaded PHPMailer directly.
// Assuming PHPMailer is in a folder named PHPMailer
require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Sanitize and collect data
    $name = htmlspecialchars(strip_tags(trim($_POST['name'])));
    $phone = htmlspecialchars(strip_tags(trim($_POST['phone'])));
    $email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
    $message = htmlspecialchars(strip_tags(trim($_POST['message'])));

    // Basic validation
    if (empty($name) || empty($phone) || empty($email) || empty($message)) {
        echo json_encode(['status' => 'error', 'message' => 'All fields are required.']);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid email address.']);
        exit;
    }

    // Initialize PHPMailer
    $mail = new PHPMailer(true);

    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host = 'mail.eminentoverseas.uk';
        $mail->SMTPAuth = true;
        $mail->Username = 'info@eminentoverseas.uk';
        $mail->Password = 'Pele@2468';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port = 465;
        $mail->CharSet = 'UTF-8';

        // Recipients
        $mail->setFrom('info@eminentoverseas.uk', 'Mahadee Hasan Landing Page');
        $mail->addAddress('info@eminentoverseas.uk'); // Send to this email
        // You can add a BCC or other addresses if needed: $mail->addBCC('bcc@example.com');

        // Content
        $mail->isHTML(true);
        $mail->Subject = 'New Contact Form Submission from ' . $name;

        $bodyHtml = "<h2>New Contact Form Submission</h2>";
        $bodyHtml .= "<p><strong>Name:</strong> {$name}</p>";
        $bodyHtml .= "<p><strong>Phone:</strong> {$phone}</p>";
        $bodyHtml .= "<p><strong>Email:</strong> {$email}</p>";
        $bodyHtml .= "<p><strong>Message:</strong><br/>" . nl2br($message) . "</p>";

        $mail->Body = $bodyHtml;
        $mail->AltBody = "Name: $name\nPhone: $phone\nEmail: $email\nMessage:\n$message";

        $mail->send();

        echo json_encode(['status' => 'success', 'message' => 'Thank you! Your message has been sent successfully.']);

    }
    catch (Exception $e) {
        // Return a generic error to the frontend, you might want to log $mail->ErrorInfo on the server side
        echo json_encode(['status' => 'error', 'message' => 'Message could not be sent. Please try again later.']);
    }
}
else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
}
?>
