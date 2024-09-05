"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import FullLogo from "@/assets/full_logo.svg";

const SimpleNavBar: React.FC = () => {
  return (
    <nav className="w-full bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-start h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/scan">
              <Image src={FullLogo} alt="Medical Pantry Logo" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SimpleNavBar;
