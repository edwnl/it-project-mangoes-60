"use client";

import React, { useEffect, useState } from "react";
import { Button, Form, Input, message } from "antd";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import Logo from "@/assets/Logo.svg";
import { createUser, validateInvitation } from "@/app/accounts/actions";
import { withGuard } from "@/components/GuardRoute";
import LoadingPage from "@/components/Loading";

// sign up page that allows users to create a new account using an invitation link
const SignUpPage: React.FC = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const params = useParams();

  // checks if the invitation is valid, and if so, sets the email to display
  useEffect(() => {
    const checkInvitation = async () => {
      console.log("checking inviation");
      const invitation = await validateInvitation(
        params.invitation_id as string,
      );
      console.log(invitation);
      if (invitation) {
        setEmail(invitation.email);
      } else {
        message.error("Invalid or expired invitation");
        router.push("/");
      }
    };

    if (params.invitation_id) checkInvitation();
  }, [params.invitation_id, router]);

  // handles the form submission to create a new user account
  const onFinish = async (values: {
    name: string;
    password: string;
    confirmPassword: string;
  }) => {
    if (values.password !== values.confirmPassword) {
      message.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const userId = await createUser(
        params.invitation_id as string,
        values.name,
        values.password,
      );
      if (userId) {
        message.success("Account created successfully");
        router.push("/login");
      } else {
        throw new Error("Failed to create account");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // if email is not set, show a loading page while validating invitation
  if (!email) {
    return <LoadingPage />;
  }

  // renders the sign-up form with input fields for name, password, and confirmation
  return (
    <div className="flex md:min-h-screen justify-center">
      <div className="w-full max-w-md px-16 py-12">
        {/* renders the logo */}
        <div className="flex justify-center mb-8">
          <Image src={Logo} alt="Medical Pantry Logo" width={60} height={60} />
        </div>

        {/* renders the page title and subtitle */}
        <h1 className="text-center text-2xl font-bold">Create Your Account</h1>
        <p className="text-center mb-8">Please enter your details.</p>

        {/* renders the sign-up form */}
        <Form
          size="large"
          form={form}
          name="signup"
          onFinish={onFinish}
          layout="vertical"
        >
          {/* email input field (disabled, populated from invitation) */}
          <Form.Item name="email" label="Email">
            <Input disabled placeholder={email} className="rounded-md h-10" />
          </Form.Item>

          {/* name input field */}
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please input your name" }]}
          >
            <Input placeholder="Enter your name" className="rounded-md h-10" />
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

          {/* confirm password input field */}
          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            rules={[
              { required: true, message: "Please confirm your password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The two passwords do not match"),
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

          {/* create account button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full h-10 custom-button"
              loading={loading}
            >
              Create Account
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

export default withGuard(SignUpPage, { requireNonAuth: true });
