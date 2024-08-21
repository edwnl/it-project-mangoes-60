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
import { smartSearch } from "@/app/api/search/smartSearch";
import { TopCategoryAIResponse } from "@/types";

interface NavBarProps {
  onSearch: (value: TopCategoryAIResponse) => void;
  onLogout: () => void;
}
interface searchBarForm {
  query: string;
}

const NavBar: React.FC<NavBarProps> = ({ onSearch, onLogout }) => {
  const [isMobile, setIsMobile] = useState(false);

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
      <Image src={FullLogo} alt="Medical Pantry Logo" />
      <Tag className="mx-2" color="red">
        Admin
      </Tag>
    </div>
  );
  const handleForm = async (value: searchBarForm) => {
    console.log(value);
    // TODO: uncomment this
    // console.log(await smartSearch(value.query));
    onSearch(await smartSearch(value.query));
  };

  const [form] = Form.useForm();
  // @ts-ignore
  const SearchBar = () => (
    <div className="w-full">
      <Form name={"searchBar"} form={form} onFinish={handleForm}>
        <Form.Item name={"query"}>
          <Input
            placeholder="Enter item name..."
            prefix={<SearchOutlined />}
            suffix={<CameraOutlined className="text-gray-400 cursor-pointer" />}
            className="w-full"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Search
          </Button>
        </Form.Item>
      </Form>
    </div>
  );

  const LogoutButton = () => (
    <Button
      type="primary"
      icon={<LogoutOutlined />}
      onClick={onLogout}
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

  return isMobile ? <MobileNavBar /> : <DesktopNavBar />;
};

export default NavBar;
