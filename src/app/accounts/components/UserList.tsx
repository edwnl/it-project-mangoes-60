import React, { useEffect } from "react";
import { UserData } from "@/types/types";
import { Button, Modal } from "antd";
import { TrashIcon } from "lucide-react";

interface UserListProps {
  users: UserData[];
  onUserClick: (user: UserData) => void;
}

// component that displays a list of users
const UserList: React.FC<UserListProps> = ({ users, onUserClick }) => {
  const [usersList, setUsersList] = React.useState(users);
  const [currentSelectedUserID, setCurrentSelectedUserID] =
    React.useState<string>("");

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
  // Delete accounts features

  const [confirmDelete, setConfirmDelete] = React.useState(false);
  function handleDelete(userID: string) {
    // Delete element from list
    setUsersList(usersList.filter((user) => user.id != userID));
    handleClose();
    setCurrentSelectedUserID("");
  }
  function handleOpen(userID: string) {
    setConfirmDelete(true);
    setCurrentSelectedUserID(userID);
  }
  function handleClose() {
    setConfirmDelete(false);
    setCurrentSelectedUserID("");
  }

  // renders each user as a list item with their initials and contact information
  return (
    <>
      <div className="border-2 rounded-md">
        {usersList.map((user) => (
          <div key={user.id} className="flex justify-between items-center p-3">
            <div
              className="flex items-center"
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
            {/*Render delete button*/}
            <div className="cursor-pointer">
              <Button onClick={() => handleOpen(user.id)}>
                <TrashIcon />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <Modal
        open={confirmDelete}
        onOk={() => handleDelete(currentSelectedUserID)}
        onCancel={handleClose}
      >
        WARNING: This action cannot be undone.
      </Modal>
    </>
  );
};

export default UserList;
