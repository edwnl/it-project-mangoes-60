"use client";

import React from "react";
import { Input, Button, Form } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Logo from "@/assets/logo_white_hole.svg";

const LoginPage: React.FC = () => {
  const [form] = Form.useForm();
  const router = useRouter();

  const onFinish = (values: { username: string; password: string }) => {
    console.log("Success:", values);
    router.push("/scan");
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
            name="username"
            label="Username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input
              placeholder="Enter your username"
              className="rounded-md h-10"
            />
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
            >
              Sign In
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
