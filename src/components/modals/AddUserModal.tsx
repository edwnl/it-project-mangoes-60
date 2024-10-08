"use client";

import React, { useState } from "react";
import { UserCircle } from "lucide-react";

// Definition of Add User modal props
interface AddUserModalProps {
  visible: boolean;
  onClose: () => void;
}

// Modal function definition for visibility semantics
export default function AddUserModal({ visible, onClose }: AddUserModalProps) {
  if (!visible) return null;

  // Function and state definition for role drop down menu
  const [selectValue, setSelectValue] = useState("Select Role");
  const [isOpen, setIsOpen] = useState(false);

  const updateValue = (value: string) => {
    setSelectValue(value);
    setIsOpen(false);
  };

  // Styling for each role in the role dropdown menu
  const getRoleStyle = () => {
    switch (selectValue) {
      case "Volunteer":
        return "bg-blue-400 text-white";
      case "Admin":
        return "bg-red-400 text-white";
      default:
        return "bg-white text-black";
    }
  };

  return (
    // Container and layout styling
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
      <div className="w-80 h-fit bg-white p-6 rounded-lg shadow-lg relative">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            {/*User avatar image styling */}
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white mr-3">
              <span className="text-xl">
                <UserCircle />
              </span>
            </div>

            <h2 className="text-2xl font-semibold">Add New User</h2>
          </div>
          {/*Close Button styling*/}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕
          </button>
        </div>

        {/*Name box styling*/}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            placeholder="Enter name..."
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/*Email box styling*/}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter email..."
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div className="mb-4 grid grid-cols-2 gap-4">
          {/*Role selection dropdown menu styling*/}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>

            {/* Role button styling and function */}
            <div className="relative">
              {/* getRoleStyle() changes the styling of the button based on which role is selected (Volunteer/Admin) */}
              {/* setIsOpen() toggles the dropdown menu to be visible when the "Role" button is clicked and closed when it is clicked again*/}
              <button
                className={`w-full p-2 text-left rounded-md shadow ${getRoleStyle()} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                onClick={() => setIsOpen(!isOpen)}
              >
                {/* Displays the selected role */}
                {selectValue}
              </button>

              {/* Conditional rendering for when the dropdown menu is visible/IsOpen */}
              {isOpen && (
                <div className="absolute w-full mt-1 bg-white border rounded-md shadow-lg">
                  {/* Updates the button styling to volunteer-style if selected, and updates the user role itself to Volunteer */}
                  <button
                    className="w-full p-2 text-left hover:bg-blue-100 text-blue-600"
                    onClick={() => updateValue("Volunteer")}
                  >
                    Volunteer
                  </button>
                  {/* Updates the button styling to admin-style if selected, and updates the user role itself to Admin */}
                  <button
                    className="w-full p-2 text-left hover:bg-red-100 text-red-600"
                    onClick={() => updateValue("Admin")}
                  >
                    Admin
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Date Joined input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Joined
            </label>
            <input
              type="date"
              className="w-full p-2 border rounded-md"
              defaultValue="2024-09-11"
            />
          </div>
        </div>
        {/* Confirm button styling */}
        <button className="mb-4 w-full p-2 bg-red-600 text-white rounded-md hover:scale-95">
          Confirm User
        </button>
      </div>
    </div>
  );
}
