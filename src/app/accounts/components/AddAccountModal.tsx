import React, { useState } from "react";
import { Form, Input, message, Modal, Select } from "antd";
import { createInvitation } from "@/app/accounts/actions";

const { Option } = Select;

interface AddUserModalProps {
  visible: boolean;
  onClose: () => void;
}

// modal that allows admins to invite a new user to the platform
const AddAccountModal: React.FC<AddUserModalProps> = ({ visible, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // sends an invitation to the specified email with the selected role
  const handleOk = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      await createInvitation(values.email, values.role);
      message.success("Invitation sent successfully");
      form.resetFields();
      onClose();
    } catch (error) {
      message.error("Failed to send invitation");
    } finally {
      setLoading(false);
    }
  };

  // renders modal with form fields for entering user email and role
  return (
    <Modal
      title="Invite New User"
      open={visible}
      onOk={handleOk}
      width={350}
      onCancel={onClose}
      okText="Send Invitation"
      cancelText="Cancel"
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical" disabled={loading}>
        {/* renders input field for email */}
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

        {/* renders select dropdown for user role */}
        <Form.Item
          name="role"
          label="Role"
          rules={[{ required: true, message: "Please select a role!" }]}
        >
          <Select>
            <Option value="volunteer">Volunteer</Option>
            <Option value="admin">Admin</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddAccountModal;