"use client";

import React, { useState } from "react";
import { Button, Form, Input, message } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  browserSessionPersistence,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebaseClient";
import Logo from "@/assets/Logo.svg";
import { withGuard } from "@/components/GuardRoute";

// login page that allows users to sign in to their account
const LoginPage: React.FC = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // handles the form submission for signing in
  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      await setPersistence(auth, browserSessionPersistence);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password,
      );
      const user = userCredential.user;

      // Fetch user role from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.data();

      if (userData && userData.role) {
        // Store user role in the browsers local storage
        localStorage.setItem("userRole", userData.role);

        switch (userData.role) {
          case "admin":
          case "volunteer":
            router.push("/");
            break;
          default:
            router.push("/login");
        }
      } else {
        message.error("User role not found");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("Failed to sign in. Please check your credentials!");
    } finally {
      setLoading(false);
    }
  };

  // renders the login form with input fields for email and password
  return (
    <div className="flex items-center md:min-h-screen justify-center">
      <div className="w-full max-w-md p-16">
        {/* renders the logo */}
        <div className="flex justify-center mb-8">
          <Image src={Logo} alt="Medical Pantry Logo" width={60} height={60} />
        </div>

        {/* renders the welcome message */}
        <h1 className="text-center text-2xl font-bold ">Welcome Back!</h1>
        <p className="text-center mb-8">Please enter your details.</p>

        {/* renders the login form */}
        <Form
          size="large"
          form={form}
          name="login"
          onFinish={onFinish}
          layout="vertical"
        >
          {/* email input field */}
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input placeholder="Enter your email" className="rounded-md h-10" />
          </Form.Item>

          {/* password input field */}
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please input your password" }]}
          >
            <Input.Password
              placeholder="Password"
              className="rounded-md h-10"
            />
          </Form.Item>

          {/* sign in button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full h-10 custom-button"
              loading={loading}
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>
      </div>

      {/* footer with copyright message */}
      <p className="absolute bottom-5 text-gray-600 text-sm mt-8">
        © 2024 Medical Pantry
      </p>
    </div>
  );
};

export default withGuard(LoginPage, { requireNonAuth: true });
