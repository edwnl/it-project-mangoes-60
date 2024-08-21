"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Input, Button, Tag, Form } from "antd";
import {
  SearchOutlined,
  LogoutOutlined,
  CameraOutlined,
} from "@ant-design/icons";
import FullLogo from "@/assets/full_logo.svg";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DragDropImageUpload from "./modals/DragDropImageUpload";

interface SearchBarForm {
  query: string;
}

interface NavBarProps {
  onSearch: (query: string) => Promise<void>;
  onImageSearch: (image: File) => Promise<void>;
}

const NavBar: React.FC<NavBarProps> = ({ onSearch, onImageSearch }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const LogoSection = () => (
    <div className="flex items-center">
      <Link href="/dashboard">
        <Image src={FullLogo} alt="Medical Pantry Logo" />
      </Link>
      <Tag className="mx-2" color="red">
        Admin
      </Tag>
    </div>
  );

  const handleForm = async (value: SearchBarForm) => {
    setIsLoading(true);
    await onSearch(value.query);
    setIsLoading(false);
  };

  const handleImageUpload = async (file: File) => {
    setIsLoading(true);
    setIsImageModalVisible(false);
    await onImageSearch(file);
    setIsLoading(false);
  };

  const [form] = Form.useForm();
  const SearchBar = () => (
    <div className="w-full">
      <Form
        name={"searchBar"}
        form={form}
        disabled={isLoading}
        onFinish={handleForm}
      >
        <Form.Item name={"query"}>
          <Input
            placeholder="Enter item name..."
            prefix={<SearchOutlined />}
            suffix={
              <CameraOutlined
                className="cursor-pointer"
                onClick={() => setIsImageModalVisible(true)}
              />
            }
            className="w-full"
            onPressEnter={(e) => {
              e.preventDefault();
              form.submit();
            }}
          />
        </Form.Item>
      </Form>
    </div>
  );

  const LogoutButton = () => (
    <Button
      type="primary"
      icon={<LogoutOutlined />}
      onClick={() => router.push("/")}
      className="custom-button"
    >
      Logout
    </Button>
  );

  const DesktopNavBar = () => (
    <nav className="flex items-center justify-between px-8 py-6">
      <div className="">
        <LogoSection />
      </div>
      <div className="flex-grow flex justify-center mx-10 max-w-md">
        <SearchBar />
      </div>
      <div className="flex justify-end">
        <LogoutButton />
      </div>
    </nav>
  );

  const MobileNavBar = () => (
    <nav className="flex flex-col px-4 py-6">
      <div className="flex justify-between items-center w-full">
        <LogoSection />
        <LogoutButton />
      </div>
      <div className="mt-4 w-full">
        <SearchBar />
      </div>
    </nav>
  );

  return (
    <>
      {isMobile ? <MobileNavBar /> : <DesktopNavBar />}
      <DragDropImageUpload
        isVisible={isImageModalVisible}
        onClose={() => setIsImageModalVisible(false)}
        onImageConfirm={handleImageUpload}
      />
    </>
  );
};

export default NavBar;
