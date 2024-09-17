"use client";

import React, { useState } from "react";

// Define the props interface
interface AddUserModalProps {
  visible: boolean;
  onClose: () => void;
}



// Defines the Modal function so it is only visible when the appropriate buttons are pressed
export default function AddUserModal({ visible, onClose }: AddUserModalProps) {
  if (!visible) return null;

  // Function to allow for a drop down menu with multiple role selections
  const [selectValue, setSelectValue] = useState("Select Role");
  const [isOpen, setIsOpen] = useState(false);

  const updateValue = (value: string) => {
    setSelectValue(value);
    setIsOpen(false);
  };

  // Styling for each role button
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

  // Main component building
  return (
    /*Styling of the blur/background when popup is open*/
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
      { /*Styling of the popup container itself*/}
      <div className="w-80 h-fit bg-white p-6 rounded-lg shadow-lg relative">
        { /*Styling of the title sub-container "Edit User    x" */}
        <div className="flex justify-between items-start mb-4">
          { /*Styling of the title sub-container "Edit User" */}
          <div className="flex items-center">
            { /*User avatar icon design*/}
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white mr-3">
              <span className="text-xl">&#128100;</span>
            </div>
            { /*Title text styling*/}
            <h2 className="text-2xl font-semibold">
              Edit User
            </h2>
          </div>
          { /*Button styling*/}
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">
            ✕
          </button>
        </div>

        { /*Name box styling*/}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            placeholder="Enter your name..."
            className="w-full p-2 border rounded-md"
          />
        </div>

        { /*Email box styling*/}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email..."
            className="w-full p-2 border rounded-md"
          />
        </div>

        { /*Reset your password text styling TODO Turn into button*/}
        <p className="text-sm text-blue-500 hover:underline cursor-pointer mb-4">
          Reset your password
        </p>

        { /*Container with 2 grids to add Role selection and Date joined*/}
        <div className="mb-4 grid grid-cols-2 gap-4">
          { /*Role selection Button Styling*/}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <div className="relative">
              <button
                className={`w-full p-2 text-left rounded-md shadow ${getRoleStyle()} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                onClick={() => setIsOpen(!isOpen)}
              >
                {selectValue}
              </button>
              {isOpen && (
                <div className="absolute w-full mt-1 bg-white border rounded-md shadow-lg">
                  <button
                    className="w-full p-2 text-left hover:bg-blue-100 text-blue-600"
                    onClick={() => updateValue("Volunteer")}
                  >
                    Volunteer
                  </button>
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
              defaultValue="2024-09-11" // Example date, can be dynamically set
            />
          </div>

        </div>

        <button className="mb-4 w-full p-2 bg-red-600 text-white rounded-md hover:scale-95">
          Update
        </button>

        <button className="mb-4 w-full p-2 border bg-white text-red-600 rounded-md hover:scale-95">
          Delete User
        </button>

      </div>
    </div>
  );
}