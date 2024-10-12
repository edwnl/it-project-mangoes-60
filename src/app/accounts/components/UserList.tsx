import React from "react";
import { UserData } from "@/types/types";

interface UserListProps {
  users: UserData[];
  onUserClick: (user: UserData) => void;
}

// component that displays a list of users
const UserList: React.FC<UserListProps> = ({ users, onUserClick }) => {
  // returns the initials of a given name (e.g., "John Doe" -> "JD")
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // renders each user as a list item with their initials and contact information
  return (
    <div className="border-2 rounded-md">
      {users.map((user) => (
        <div
          key={user.id}
          className="flex items-center p-3"
          onClick={() => onUserClick(user)}
        >
          {/* renders a circle with user's initials */}
          <div className="w-10 h-10 bg-[#d12220] rounded-full flex items-center justify-center text-white mr-3">
            <span className="text-sm">{getInitials(user.name)}</span>
          </div>

          {/* renders user's name and email */}
          <div className={"cursor-pointer hover:underline"}>
            <p className="text-sm font-semibold">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserList;
