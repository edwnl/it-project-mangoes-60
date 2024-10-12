"use server";

import nodemailer from "nodemailer";
import { db } from "./firebaseClient";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

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
  // sets up the transporter using nodemailer with Gmail credentials
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  (await _getInternalSubscribers()).forEach(async (email) => {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "A Subcategory has been filled!",
      html: `
      <h1>Dear Admins</h1>
      <p>The box ${subcategoryName} at ${subcategoryLocation} has been reported to be filled out.</p>
    `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("Box status update email sent successfully");
    } catch (error) {
      console.error("Error sending Box status update email:", error);
      throw new Error("Failed to send Box status update email");
    }
  });
};
