"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import DragDropImageUpload from "@/components/DragDropImageUpload";
import NavBar from "@/components/Navbar";


const ImageSearchPage: React.FC = () => {
    const router = useRouter(); 

    const handleSearch = (value: string) => {
        console.log("Searching for:", value);
    }; 

    const handleLogout = () => {
        console.log("Logging out");
        router.push("/login");
    }

    return (
        <main className="min-h-screen flex flex-col">
            <NavBar onSearch={handleSearch} onLogout={handleLogout} />
            <div className='flex-grow flex justify-center items-center'>
                <DragDropImageUpload/>
            </div>
        </main>
    );

};

export default ImageSearchPage;



// export default function Home() {
//   return (
//     <main className='absolute inset-0 flex justify-center items-center'>
//         <DragDropImageUpload />
//     </main>
//   );
// }