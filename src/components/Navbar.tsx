"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Input, Button, Tag } from "antd";
import {
  SearchOutlined,
  LogoutOutlined,
  CameraOutlined,
} from "@ant-design/icons";
import FullLogo from "@/assets/full_logo.svg";

interface NavBarProps {
  onSearch: (value: string) => void;
  onLogout: () => void;
  // onCameraClick: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ onSearch, onLogout}) => {
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();  

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

  const SearchBar = () => (
    <div className="w-full">
      <Input
        placeholder="Enter item name..."
        prefix={<SearchOutlined />}
        // suffix={<CameraOutlined className="text-gray-400 cursor-pointer" />}
        onChange={(e) => onSearch(e.target.value)}
        className="w-full"
      />
    </div>
  );

  const CameraButton = () => (
    <Link href="/image-search" passHref>
      <Button 
        type="default"
        icon={<CameraOutlined />}
        className="custom-button text-zinc-50 cursor-pointer w-full"
      >
        Take a Photo 
      </Button>
    </Link>

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
      <div className="flex-grow flex justify-center gap-x-4 mx-10 max-w-md">
        <SearchBar />
        <CameraButton />
        
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
      <div className="mt-4 w-full space-y-4">
        <SearchBar />
        <CameraButton/>
      </div>
    </nav>
  );

  return isMobile ? <MobileNavBar /> : <DesktopNavBar />;
};

export default NavBar;
