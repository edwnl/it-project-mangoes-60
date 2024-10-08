"use client";
import React, { useMemo, useEffect, useState } from "react";
import Image from "next/image";
import Title from "antd/lib/typography/Title";
import Search from "antd/lib/input/Search";
import { Button, List, Spin, message } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import NavBar from "@/components/Navbar";
import SkipItemModal from "./SkipItemModal";

//import CategorySearchOptionModal from "./CategorySearchOptionModal";

const SkipItemPage = () => {
  const [searchTerm, setSearchTerm] = useState("");


  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleCategoryConfirm = (selectedCategory) => {
    // Handle the selected category
    console.log("Selected category:", selectedCategory);
  };

  
  // Render main page 
  return (
    <div>
      <NavBar />
      {/* <CategorySearchOptionModal
        onConfirm={handleCategoryConfirm}
        onSearch={handleSearch}
      /> */}
      <SkipItemModal
        onConfirm={handleCategoryConfirm}
      />
    </div>
  );
};

export default SkipItemPage;