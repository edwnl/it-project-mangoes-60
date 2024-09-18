"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Search } from "lucide-react";
import AddUserModal from "@/components/modals/AddUserModal";

const UsersPage = () => {
  // Mock data for users
  const users = [
    { name: "Jack", status: "Joined on 11th September" },
    { name: "Jack", status: "Joined on 11th September" },
    { name: "Jack", status: "Joined on 11th September" },
    { name: "Jack", status: "Joined on 11th September" },
    { name: "Jack", status: "Joined on 11th Septembere" },
    { name: "Jack", status: "Joined on 11th September" },
    { name: "Jack", status: "Joined on 11th September" },
  ];

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const handleOnClose = () => setShowAddUserModal(false);

  return (
    // Main container with responsive width and center alignment
    <div className="p-20 w-full max-w-md mx-auto px-4 sm:px-6 md:max-w-2xl lg:max-w-4xl xl:max-w-5xl">
      {/* Content wrapper */}
      <div className="max-w-md mx-auto">
        {/* Header section */}
        <h1 className="text-2xl font-bold mb-1">Users</h1>
        <p className="text-sm text-gray-500 mb-4">123 users total</p>

        {/* Search input field */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search by name..."
            className="w-full p-2 pl-10 border rounded-md"
          />
          {/* Search icon from lucide-react */}
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>

        {/* New User button */}
        <button
          onClick={() => setShowAddUserModal(true)}
          className="w-full sm:w-auto px-4 bg-red-600 text-white py-2 rounded-md mb-4 hover:scale-95"
        >
          + New User
        </button>

        {/* Users list container */}
        <div className="bg-white rounded-md shadow">
          {/* Map through users array to render each user */}
          {users.map((user, index) => (
            <div
              key={index}
              className="flex items-center p-3 border-b last:border-b-0"
            >
              {/* User avatar (placeholder) */}
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white mr-3">
                <span className="text-xl">&#128100;</span> {/* Person emoji */}
              </div>
              {/* User details */}
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-gray-500">{user.status}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination controls */}
        <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
          <button>&lt;</button>
          <span>1/20</span>
          <button>&gt;</button>
        </div>

        <AddUserModal onClose={handleOnClose} visible={showAddUserModal} />
      </div>
    </div>
  );
};

export default UsersPage;
