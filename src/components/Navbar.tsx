"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button, GetProp, Menu, MenuProps, Tag, Typography } from "antd";
import {
  CameraOutlined,
  HistoryOutlined,
  InboxOutlined,
  LogoutOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import FullLogo from "@/assets/full_logo.svg";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useRouter } from "next/navigation";

const { Title } = Typography;
type MenuItem = GetProp<MenuProps, "items">[number];

const menuItems: MenuItem[] = [
  {
    key: "scan",
    icon: <CameraOutlined style={{ fontSize: "inherit" }} />,
    label: <Link href={"/scan"}>Scan</Link>,
  },
  {
    key: "history",
    icon: <HistoryOutlined style={{ fontSize: "inherit" }} />,
    label: <Link href={"/history"}>History</Link>,
  },
  {
    key: "Category",
    icon: <InboxOutlined style={{ fontSize: "inherit" }} />,
    label: <Link href={"/category"}>Categories</Link>,
  },
];

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

const LogoutButton = (props: any) => {
  const router = useRouter();
  return (
    <Button
      type="primary"
      icon={<LogoutOutlined />}
      onClick={() => router.push("/")}
      className={"custom-button" + props.className ? props.className : ""}
    >
      Logout
    </Button>
  );
};

const DesktopNavBar = ({ username }: { username: string }) => (
  <nav className="flex items-center justify-between px-8 py-6">
    <div className="">
      <LogoSection />
    </div>
    <div className="flex-grow flex justify-center mx-10 max-w-md">
      <Menu
        items={menuItems}
        mode={"horizontal"}
        className={"border-0"}
        style={{ minWidth: 0, flex: "auto" }}
      />
    </div>
    <div className="flex justify-end">
      <LogoutButton />
    </div>
  </nav>
);

const MobileNavBar = ({ username }: { username: string }) => {
  return (
    <>
      <nav className="flex flex-col px-4 py-6">
        <div className="flex justify-between items-center w-full">
          <LogoSection />
          <Sheet>
            <SheetTrigger>
              <MenuOutlined />
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <SheetDescription
                className={"flex flex-col h-full justify-between"}
              >
                <div>
                  <div className="flex flex-col justify-center items-center mt-5">
                    {/*Profile details*/}
                    <div
                      className={
                        "bg-red-800 rounded-full text-white w-[100px] h-[100px] flex justify-center text-xl" +
                        " flex-col items-center mb-2"
                      }
                    >
                      {username
                        .split(" ")
                        .flatMap((value) => value[0]?.toUpperCase())
                        .toString()
                        .replaceAll(",", "")}
                    </div>
                    <Title level={2}>{username}</Title>
                  </div>
                  <Menu
                    defaultSelectedKeys={["scan"]}
                    items={menuItems}
                    className={"text-xl"}
                  />
                </div>
                <LogoutButton className={"mb-10"} />
              </SheetDescription>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </>
  );
};

const NavBar: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [username, setUsername] = useState("Volunteer");

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    setUsername("Vicky Lucas");
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile) return <MobileNavBar username={username} />;
  return <DesktopNavBar username={username} />;
};

export default NavBar;
