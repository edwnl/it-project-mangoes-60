"use client";

import React, { useState } from "react";
import { Input, Button, Form, message } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  browserLocalPersistence,
  setPersistence,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../lib/firebaseClient";
import Logo from "@/assets/logo_white_hole.svg";

const LoginPage: React.FC = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      await setPersistence(auth, browserLocalPersistence);
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
        // makes information easily accessible so we don't need to fetch from firebase every time
        console.log(userData.role);
        // STILL NEED TO IMPLEMENT THE REDIRECTS
        switch (userData.role) {
          case "admin":
            router.push("/dashboard"); // just goes to dashboard - PROTOTYPE
            break;
          case "volunteer":
            router.push("/dashboard"); // just goes to dashboard - PROTOTYPE
            break;
          default:
            router.push("/");
        }
      } else {
        message.error("User role not found");
      }
      // Redirect based on role
    } catch (error) {
      console.error("Error:", error);
      message.error("Failed to sign in . Please check your credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = () => {
    router.push("/signup");
  };

  return (
    <div className="flex items-center min-h-screen justify-center bg-white ">
      <div className="w-full max-w-md p-16">
        <div className="flex justify-center mb-8">
          <Image src={Logo} alt="Medical Pantry Logo" width={60} height={60} />
        </div>

        <h1 className="text-center text-2xl font-bold ">Welcome Back!</h1>
        <p className="text-center mb-8">Please enter your details.</p>

        <Form form={form} name="login" onFinish={onFinish} layout="vertical">
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input placeholder="Enter your email" className="rounded-md h-10" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              placeholder="Password"
              className="rounded-md h-10"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full h-10 custom-button"
              loading={loading}
            >
              Sign In
            </Button>
            <Button
              onClick={handleSignUp}
              className="w-full h-10 mt-2 custom-button"
            >
              Sign Up
            </Button>
          </Form.Item>
        </Form>

        <p className="text-center text-gray-600 text-sm mt-8">
          © 2024 Medical Pantry
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

// need protected route
