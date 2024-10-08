"use client";
import React, { useMemo, useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import NavBar from "@/components/Navbar";
import SkipItemModal from "./SkipItemModal";


//import CategorySearchOptionModal from "./CategorySearchOptionModal";

const SkipItemPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter(); 


  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleConfirm = (selected) => {
    // Handle confirmation to skip the item 
    console.log("Confirm skip item :", selected);
    // Navigate to the /scan page
    router.push('/');
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
        onConfirm={handleConfirm}
      />
    </div>
  );
};

export default SkipItemPage;