// src/services/emailService.js
const nodemailer = require('nodemailer');
// Correct path from src/services to root .env file
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });


const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587', 10),
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
});

transporter.verify((error, success) => {
  if (error) {
    console.error('Error with email transporter configuration:', error);
  } else {
    console.log('Email transporter is configured correctly and ready to send emails.');
  }
});

/**
 * Sends an email.
 * @param {string} to - Recipient's email address.
 * @param {string} subject - Email subject.
 * @param {string} text - Plain text body of the email.
 * @param {string} [html] - HTML body of the email (optional).
 */
const sendEmail = async (to, subject, text, html) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: to,
      subject: subject,
      text: text,
      html: html, // HTML body
    };

    let info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
    // Preview URL for ethereal.email or similar if used
    // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error; // Rethrow to be handled by caller
  }
};

module.exports = { sendEmail };
