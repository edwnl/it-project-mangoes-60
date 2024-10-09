"use client";

import React, { useState } from "react";
import { Input, Button, Form, Select, message } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../lib/firebaseClient";
import Logo from "@/assets/logo_white_hole.svg";
import { withGuard } from "@/components/GuardRoute";

const { Option } = Select;

const SignUpPage: React.FC = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: {
    email: string;
    password: string;
    role: string;
  }) => {
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password,
      );
      const user = userCredential.user;

      // Create a document for the user in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: values.email,
        role: values.role,
      });

      message.success("User registered successfull!");
      router.push("login");
    } catch (error) {
      console.error("Error:", error);
      message.error("Failed to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center min-h-screen justify-center bg-white">
      <div className="w-full max-w-md p-16">
        <div className="flex justify-center mb-8">
          <Image src={Logo} alt="Medical Pantry Logo" width={60} height={60} />
        </div>

        <h1 className="text-center text-2xl font-bold">Sign Up</h1>
        <p className="text-center mb-8">Create your account</p>

        <Form form={form} name="signup" onFinish={onFinish} layout="vertical">
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
            rules={[
              { required: true, message: "Please input your password" },
              {
                min: 6,
                message: "Password must be at least 6 characters long",
              },
            ]}
            hasFeedback
          >
            <Input.Password
              placeholder="Password"
              className="rounded-md h-10"
            />
          </Form.Item>
          <Form.Item
            name="confirmpassword"
            label="Confirm Password"
            dependencies={["password"]}
            hasFeedback
            rules={[
              { required: true, message: "Please confirm your password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The two passwords do not match."),
                  );
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="Confirm password"
              className="rounded-md h-10"
            />
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Please select a role" }]}
          >
            <Select placeholder="Select your role">
              <Option value="admin">Admin</Option>
              <Option value="volunteer">Volunteer</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full h-10 custom-button"
              loading={loading}
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

export default withGuard(SignUpPage, { requireNonAuth: true });
