"use client";

import React, { useState } from "react";
import { Search, UserCircle } from "lucide-react";
import AddUserModal from "@/components/modals/AddUserModal";
import EditUserModal from "@/components/modals/EditUserModal";
import { useProtectedRoute } from "@/hooks/useProtectedRoutes";

const UsersPage = () => {

  // Use protected route hook to only let admins access
  const { isAuthorised, isLoading } = useProtectedRoute(['admin']); // only admins can access this page


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

  // Mock User definition
  interface User {
    name: string;
    status: string;
  }

  // Functions for add user popup
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const handleOnClose = () => setShowAddUserModal(false);

  // Functions for edit user popup
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const handleUserClick = (user: User) => setSelectedUser(user);
  const handleCloseUserDetails = () => setSelectedUser(null);

  // Handle loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Handle unauthorised access
  if (!isAuthorised) {
    return <div> You are not authorised to view this page </div>;
  }

  return (
    <div className="p-20 w-full max-w-md mx-auto px-4 sm:px-6 md:max-w-2xl lg:max-w-4xl xl:max-w-5xl">
      <div className="max-w-md mx-auto">
        {/*User title and total*/}
        <h1 className="text-2xl font-bold mb-1">Users</h1>
        <p className="text-sm text-gray-500 mb-4">123 users total</p>

        {/* Search bar */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search by name..."
            className="w-full p-2 pl-10 border rounded-md"
          />
          {/* Search icon image */}
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>

        {/* New User button */}
        <button
          onClick={() => setShowAddUserModal(true)}
          className="w-full sm:w-auto px-4 bg-red-600 text-white py-2 rounded-md mb-4 hover:scale-95"
        >
          + New User
        </button>

        <div className="bg-white rounded-md shadow">
          {/* Map through users array to render each user */}
          {users.map((user, index) => (
            <div
              key={index}
              className="flex items-center p-3 border-b last:border-b-0"
              onClick={() => handleUserClick(user)}
            >
              {/* User avatar image */}
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white mr-3">
                <span className="text-xl">
                  <UserCircle />
                </span>{" "}
                {/* Person emoji */}
              </div>
              {/* User details */}
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-gray-500">{user.status}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Add User Popup function */}
        <AddUserModal onClose={handleOnClose} visible={showAddUserModal} />
        {/* Edit User Popup function */}
        <EditUserModal
          user={selectedUser}
          onClose={handleCloseUserDetails}
          visible={!!selectedUser}
        />
      </div>
    </div>
  );
};

export default UsersPage;

// If a volunteer tries to access the accounts page, they will be routed to an "Unauthorised access page".
