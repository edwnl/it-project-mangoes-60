"use client";

import React, { useEffect, useState } from "react";
import { Button, Input, message, Pagination } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import NavBar from "@/components/Navbar";
import { UserData } from "@/types/types";
import { fetchAllUsers } from "./actions";
import AddAccountModal from "@/app/accounts/components/AddAccountModal";
import UserList from "@/app/accounts/components/UserList";
import EditUserModal from "@/app/accounts/components/EditUserModal";
import { withGuard } from "@/components/GuardRoute";

// main page for managing users, including adding and editing users
const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showAddUserModal, setShowAddUserModal] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 5;

  // loads all users from Firestore on component mount
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const fetchedUsers = await fetchAllUsers();
        setUsers(fetchedUsers);
        setFilteredUsers(fetchedUsers);
      } catch (error) {
        message.error("Failed to load users");
      }
    };
    loadUsers();
  }, []);

  // filters users based on the search term
  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchTerm, users]);

  // handles the search input change
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  // opens the modal to add a new user
  const handleAddUser = () => {
    setShowAddUserModal(true);
  };

  // handles the click event for a user to edit their details
  const handleUserClick = (user: UserData) => {
    setSelectedUser(user);
  };

  // handles closing any open modal (add user or edit user)
  const handleCloseModal = () => {
    setShowAddUserModal(false);
    setSelectedUser(null);
  };

  // changes the current page of the pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // calculates the users to display on the current page
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  // renders the page content, including the navbar, search input, and user list
  return (
    <>
      <NavBar />

      {/* renders main content area */}
      <div className="flex flex-row justify-center px-8">
        <div className="items-center flex-grow max-w-xl">
          <div className="items-start mb-8">
            {/* renders page title */}
            <p className="text-3xl font-bold mb-4">Users</p>

            {/* renders search input and add user button */}
            <div className="flex flex-row justify-between mb-4">
              <Input
                className="mr-4 flex-grow"
                prefix={<SearchOutlined />}
                placeholder="Search by name or email..."
                onChange={(e) => handleSearch(e.target.value)}
              />
              <Button
                icon={<PlusOutlined />}
                type="primary"
                onClick={handleAddUser}
                className="text-base h-full"
              >
                Add
              </Button>
            </div>
          </div>

          {/* renders list of users */}
          <UserList users={paginatedUsers} onUserClick={handleUserClick} />

          {/* renders pagination controls */}
          <div className="mt-4 flex justify-center">
            <Pagination
              current={currentPage}
              total={filteredUsers.length}
              pageSize={pageSize}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>

          {/* renders modal for adding a new user */}
          <AddAccountModal
            visible={showAddUserModal}
            onClose={handleCloseModal}
          />

          {/* renders modal for editing an existing user */}
          <EditUserModal
            user={selectedUser}
            visible={!!selectedUser}
            onClose={handleCloseModal}
            onUpdateUser={(updatedUser) => {
              setUsers(
                users.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
              );
            }}
          />
        </div>
      </div>
    </>
  );
};

export default withGuard(UsersPage, {
  requireAuth: true,
  allowedRoles: ["admin"],
});