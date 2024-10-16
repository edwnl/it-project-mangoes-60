import React, { useEffect } from "react";
import { UserData } from "@/types/types";
import { Button, Popconfirm } from "antd";
import { DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";

interface UserListProps {
  users: UserData[];
  onUserClick: (user: UserData) => void;
}

// component that displays a list of users
const UserList: React.FC<UserListProps> = ({ users, onUserClick }) => {
  const [usersList, setUsersList] = React.useState(users);

  useEffect(() => {
    setUsersList(users);
  }, [users]);

  // returns the initials of a given name (e.g., "John Doe" -> "JD")
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  function handleDelete(userID: string) {
    // Delete user from list
    setUsersList(usersList.filter((user) => user.id != userID));
  }

  // renders each user as a list item with their initials and contact information
  return (
    <div className="border-2 rounded-md">
      {usersList.map((user) => (
        <div key={user.id} className="flex justify-between items-center p-3">
          <div className="flex items-center" onClick={() => onUserClick(user)}>
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

          {/*Render delete button*/}
          <Popconfirm
            title="Are you sure? This action is not recoverable."
            icon={<ExclamationCircleOutlined style={{ color: "#BF0018" }} />}
            onConfirm={() => handleDelete(user.id)}
            okText="Delete"
            cancelText="Cancel"
          >
            <Button icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ))}
    </div>
  );
};

export default UserList;
