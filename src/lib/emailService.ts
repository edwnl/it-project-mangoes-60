"use server";

import nodemailer from "nodemailer";

// function to send an invitation email with a link to create an account
export const sendInvitationEmail = async (
  email: string,
  invitationLink: string,
) => {
  // sets up the transporter using nodemailer with Gmail credentials
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Invitation to join Medical Pantry",
    html: `
      <h1>Welcome to Medical Pantry</h1>
      <p>You have been invited to join our platform. Please click the link below to create your account:</p>
      <a href="${invitationLink}">Create Your Account</a>
      <p>This link will expire in 7 days.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Invitation email sent successfully");
  } catch (error) {
    console.error("Error sending invitation email:", error);
    throw new Error("Failed to send invitation email");
  }
};
