"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button, Layout, Menu, Tag } from "antd";
import {
  CameraOutlined,
  CloudServerOutlined,
  HistoryOutlined,
  InboxOutlined,
  LogoutOutlined,
  MenuOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/contexts/AuthContext";
import FullLogo from "@/assets/FullLogo.svg";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";
import { useRouter } from "next/navigation";

const { Header } = Layout;

// navigation bar that displays links and user info
const NavBar = () => {
  const { userRole } = useAuth();
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const router = useRouter();

  const baseMenuItems = [
    {
      key: "scan",
      icon: <CameraOutlined />,
      label: "Scan",
      href: "/",
    },
    // {
    //   key: "scan_result",
    //   icon: <CloudServerOutlined />,
    //   label: "Scan Result",
    //   href: "scan/o0dwIzQ5T9loaIwesZeh",
    // },
    {
      key: "history",
      icon: <HistoryOutlined />,
      label: "History",
      href: "/history",
    },
    {
      key: "categories",
      icon: <InboxOutlined />,
      label: "Categories",
      href: "/categories",
    },
  ];

  const adminMenuItem = {
    key: "accounts",
    icon: <ProfileOutlined />,
    label: "Accounts",
    href: "/accounts",
  };

  const menuItems = {
    volunteer: baseMenuItems,
    admin: [...baseMenuItems, adminMenuItem],
  };

  // logs the user out and redirects to the login page
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // Clear any user data from local storage
      localStorage.removeItem("userRole");
      // Redirect to login page
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const renderMenuItem = (item) => (
    <Menu.Item key={item.key} icon={item.icon} onClick={item.onClick}>
      {item.href ? (
        <Link href={item.href} onClick={() => setMobileMenuVisible(false)}>
          {item.label}
        </Link>
      ) : (
        item.label
      )}
    </Menu.Item>
  );

  const renderAuthButton = () => {
    return (
      <Button
        type={"primary"}
        className={"hidden xl:flex"}
        icon={<LogoutOutlined />}
        onClick={handleSignOut}
      >
        Logout
      </Button>
    );
  };

  // renders the navigation links and logout button
  return (
    <>
      <Header className="p-0 h-auto bg-white mb-6">
        <div className="flex justify-between items-center h-16 px-8">
          {/* renders the logo with role tag */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image src={FullLogo} alt="Medical Pantry Logo" />
              {userRole && (
                <Tag
                  className="mx-2"
                  color={userRole === "admin" ? "red" : "blue"}
                >
                  {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                </Tag>
              )}
            </Link>
          </div>

          {/* renders the navigation links */}
          {userRole && (
            <div className="hidden xl:block absolute left-1/2 transform -translate-x-1/2 ">
              <Menu
                className="border-none bg-transparent"
                mode="horizontal"
                disabledOverflow={true}
                selectable={false}
                selectedKeys={[]}
              >
                {menuItems[userRole].map(renderMenuItem)}
              </Menu>
            </div>
          )}

          {/* renders the mobile navbar (un-expanded) */}
          <div className="flex items-center">
            {renderAuthButton()}
            {userRole && (
              <div className="xl:hidden ml-4">
                <Button
                  type="text"
                  icon={
                    <MenuOutlined className={"border-2 rounded-md p-1.5"} />
                  }
                  onClick={() => setMobileMenuVisible(!mobileMenuVisible)}
                />
              </div>
            )}
          </div>
        </div>

        {/* renders the mobile navbar (expanded) */}
        {mobileMenuVisible && userRole && (
          <div className="xl:hidden px-4">
            <Menu mode="vertical" className="absolute w-full z-40">
              {menuItems[userRole].map(renderMenuItem)}
              <Menu.Item
                key="logout"
                icon={<LogoutOutlined className={"font-semibold"} />}
                onClick={handleSignOut}
                className="font-semibold"
              >
                Logout
              </Menu.Item>
            </Menu>
          </div>
        )}
      </Header>
    </>
  );
};

export default NavBar;
