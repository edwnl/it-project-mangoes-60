"use server";

import nodemailer from "nodemailer";
import { db } from "./firebaseClient";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

// function to send an invitation email with a link to create an account
export const sendInvitationEmail = async (
  email: string,
  invitationLink: string,
) => {
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
    subject: "Welcome to Medical Pantry - Your Invitation Inside",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Medical Pantry</title>
        <style>
          body { font-family: Montserrat, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #BF0018; color: white; padding: 10px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .button { display: inline-block; padding: 10px 20px; background-color: #BF0018; color: white !important; text-decoration: none; border-radius: 5px; }
          .footer { text-align: center; margin-top: 20px; font-size: 0.8em; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Medical Pantry</h1>
          </div>
          <div class="content">
            <h2>Dear Future Team Member,</h2>
            <p>We are excited to invite you to join Medical Pantry, your new platform for efficient medical waste management.</p>
            <p>To get started and create your account, please click the button below:</p>
            <p style="text-align: center;">
              <a href="${invitationLink}" class="button">Create Your Account</a>
            </p>
            <p><strong>Important:</strong> This invitation link will expire in 7 days for security reasons.</p>
            <p>At Medical Pantry, we are committed to revolutionizing medical waste management through innovative technology and sustainable practices. We look forward to having you on board!</p>
            <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
          </div>
          <div class="footer">
            <p>© 2024 Medical Pantry. All rights reserved.</p>
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
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

//get subscribers for internal updates
const _getInternalSubscribers = async () => {
  const subscribersCollectionRef = collection(db, "internalUpdateSubscribers");
  const querySnapshot = await getDocs(subscribersCollectionRef);
  const subscribers: string[] = [];
  querySnapshot.forEach((doc) => {
    subscribers.push(doc.data().email);
  });
  return subscribers;
};

// function to send an email notify when a box is full
export const sendBoxStatus = async (
  subcategoryName: string,
  subcategoryLocation: string,
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  for (const email of (await _getInternalSubscribers())) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Medical Pantry Alert: ${subcategoryName} Box is Full`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Medical Pantry Box Status Update</title>
          <style>
            body { font-family: Montserrat, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #BF0018; color: white; padding: 10px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .footer { text-align: center; margin-top: 20px; font-size: 0.8em; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Medical Pantry Box Status Alert</h1>
            </div>
            <div class="content">
              <h2>Dear Admin,</h2>
              <p>This is an automated notification to inform you that a medical waste box requires immediate attention:</p>
              <ul>
                <li><strong>Box Category:</strong> ${subcategoryName}</li>
                <li><strong>Location:</strong> ${subcategoryLocation}</li>
                <li><strong>Status:</strong> Full</li>
              </ul>
              <p>Please arrange for the box to be counted and uploaded to Shopify.</p>
              <p>If you have any questions or need further information, please contact the Medical Pantry support team.</p>
            </div>
            <div class="footer">
              <p>This is an automated message from Medical Pantry. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("Box status update email sent successfully");
    } catch (error) {
      console.error("Error sending Box status update email:", error);
      throw new Error("Failed to send Box status update email");
    }
  }
};