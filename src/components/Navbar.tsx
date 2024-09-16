"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button, Tag, MenuProps, Typography, GetProp, Menu } from "antd";
import {
  LogoutOutlined,
  CameraOutlined, HistoryOutlined, InboxOutlined, MenuOutlined
} from "@ant-design/icons";
import FullLogo from "@/assets/full_logo.svg";
import Link from "next/link";

import { router } from "next/client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const {Title} = Typography
type MenuItem = GetProp<MenuProps, "items">[number];
const menuItems: MenuItem[] = [
  {
    key: 'scan',
    icon: <CameraOutlined style={{fontSize:'inherit'}}/>,
    label: (<Link href={"/scan"}>Scan</Link>)
  },
  {
    key: 'history',
    icon: <HistoryOutlined style={{fontSize:'inherit'}}/>,
    label: <Link href={"/history"}>History</Link>
  },
  {
    key: 'Category',
    icon: <InboxOutlined style={{fontSize:'inherit'}}/>,
    label: <Link href={"/category"}>Categories</Link>
  }
]

const LogoSection = () => (
  <div className="flex items-center">
    <Link href={"/dashboard"}>
      <Image src={FullLogo} alt="Medical Pantry Logo" />
    </Link>
    <Tag className="mx-2" color="red">
      Admin
    </Tag>
  </div>
);

const LogoutButton = (props:any) => (
  <Button
    type="primary"
    icon={<LogoutOutlined />}
    onClick={() => router.push("/")}
    className={"custom-button" + props.className ? props.className : ""}
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
      <Menu
        items={menuItems}
        mode={"horizontal"}
        className={"border-0"}
      />
    </div>
    <div className="flex justify-end">
      <LogoutButton />
    </div>
  </nav>
);

const MobileNavBar = () => {

  return (
    <>
      <nav className="flex flex-col px-4 py-6">
        <div className="flex justify-between items-center w-full">
          <LogoSection />
          <Sheet>
            <SheetTrigger><MenuOutlined/></SheetTrigger>
            <SheetContent>
              <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <SheetDescription className={"flex flex-col h-full justify-between"}>
                <div>
                <div className="flex flex-col justify-center items-center mt-5">
                  {/*Profile details*/}
                    <div className={"bg-red-800 rounded-full text-white w-[100px] h-[100px] flex justify-center text-xl" +
                      " flex-col items-center mb-2"}>VK</div>
                      <Title level={2}>Vicky Lucas</Title>
                </div>
                <Menu
                  defaultSelectedKeys={['scan']}
                  items={menuItems}
                  className={"text-xl"}
                />
                </div>
              <LogoutButton className={"mb-10"}/>
              </SheetDescription>
            </SheetContent>
          </Sheet>
        </div>

      </nav>


    </>
  )};

const NavBar: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);


  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile) return <MobileNavBar/>
  return <DesktopNavBar/>

};

export default NavBar;
