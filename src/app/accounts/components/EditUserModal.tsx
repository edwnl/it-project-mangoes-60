import React, { useEffect } from "react";
import { Form, Input, message, Modal } from "antd";
import { UserData } from "@/types/types";
import { updateUser } from "@/app/accounts/actions";

interface EditUserModalProps {
  user: UserData | null;
  visible: boolean;
  onClose: () => void;
  onUpdateUser: (user: UserData) => void;
}

// modal that allows admins to edit the details of an existing user
const EditUserModal: React.FC<EditUserModalProps> = ({
  user,
  visible,
  onClose,
  onUpdateUser,
}) => {
  const [form] = Form.useForm();

  // sets the form fields based on the selected user's data when modal is opened
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
      });
    }
  }, [user, form]);

  // updates user details after validation
  const handleOk = async () => {
    if (!user) return;
    try {
      const values = await form.validateFields();
      await updateUser(user.id, values);
      const updatedUser: UserData = { ...user, ...values };
      onUpdateUser(updatedUser);
      message.success("User updated successfully");
      onClose();
    } catch (error) {
      message.error("Failed to update user");
    }
  };

  // renders modal with form fields for editing user's name and email
  return (
    <Modal
      title="Edit User"
      open={visible}
      width={350}
      onOk={handleOk}
      onCancel={onClose}
      okText="Update"
      cancelText="Cancel"
    >
      <Form form={form} layout="vertical">
        {/* renders input field for user name */}
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please input the name!" }]}
        >
          <Input />
        </Form.Item>

        {/* renders input field for user email */}
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please input the email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditUserModal;