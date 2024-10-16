"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Image,
  Input,
  message,
  Modal,
  Popconfirm,
  Select,
} from "antd";
import { Subcategory } from "@/types/types";
import { useSubcategories } from "@/contexts/SubcategoriesContext";
import { AlertOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { deleteSubcategory, updateSubcategory } from "@/app/categories/actions";
import { sendBoxStatus } from "@/lib/emailService";
import ReportFullButton from "@/components/ReportFullButton";

const { Option } = Select;

interface SubcategoryDetailModalProps {
  isVisible: boolean;
  onClose: () => void;
  subcategory: Subcategory;
  isAdmin: boolean;
}

// modal that displays detailed information about a sub-category, with options for admins to update or delete
const SubcategoryDetailModal: React.FC<SubcategoryDetailModalProps> = ({
  isVisible,
  onClose,
  subcategory,
  isAdmin,
}) => {
  const [form] = Form.useForm();
  const { subcategories } = useSubcategories();
  const [isChanged, setIsChanged] = useState(false);

  // loads sub-category details into form when modal is opened
  useEffect(() => {
    if (isVisible) {
      form.setFieldsValue({
        ...subcategory,
        category_name: subcategory.category_name,
      });
      setIsChanged(false);
    } else {
      form.resetFields();
    }
  }, [isVisible, subcategory, form]);

  const handleClose = () => {
    form.resetFields();
    setIsChanged(false);
    onClose();
  };

  const handleValuesChange = () => {
    setIsChanged(true);
  };

  // handles saving changes to a sub-category
  const handleUpdate = async (values: any) => {
    try {
      await updateSubcategory(subcategory.id, values);
      onClose();
    } catch (error) {
      console.error("Failed to update subcategory:", error);
    }
  };

  // handles deleting a sub-category
  const handleDelete = async () => {
    try {
      await deleteSubcategory(subcategory.id);
      onClose();
    } catch (error) {
      console.error("Failed to delete subcategory:", error);
    }
  };

  // renders modal with form fields to edit sub-category details
  return (
    <Modal
      title="Item Details"
      open={isVisible}
      className={"top-10"}
      width={350}
      onCancel={handleClose}
      footer={null}
    >
      <Form
        form={form}
        onFinish={handleUpdate}
        layout="vertical"
        onValuesChange={handleValuesChange}
      >
        {/* renders sub-category image */}
        <div className="flex justify-center mb-4">
          <Image
            width={200}
            preview={false}
            src={subcategory.image_url}
            alt={subcategory.subcategory_name}
          />
        </div>

        {/* renders input field for sub-category name */}
        <Form.Item name="subcategory_name" label="Name">
          <Input disabled={!isAdmin} />
        </Form.Item>

        {/* renders select field for category */}
        <Form.Item
          rules={[
            { required: true, message: "Please select or enter a category" },
          ]}
          name="category_name"
          label="Category"
        >
          <Select
            mode="tags"
            maxCount={1}
            placeholder="Select or enter a category"
            style={{ width: "100%" }}
            disabled={!isAdmin}
          >
            {Array.from(
              new Set(subcategories.map((item) => item.category_name)),
            ).map((category) => (
              <Option key={category} value={category}>
                {category}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* renders input field for location */}
        <Form.Item name="location" label="Location">
          <Input disabled={!isAdmin} />
        </Form.Item>

        {/* renders input field for notes */}
        <Form.Item name="notes" label="Notes">
          <Input.TextArea disabled={!isAdmin} />
        </Form.Item>

        <ReportFullButton subcategory={subcategory} />

        {/* renders action buttons for saving or deleting sub-category (admin only) */}
        {isAdmin && (
          <Form.Item className="mt-4">
            <div className="flex justify-between w-full">
              <Button
                type="primary"
                htmlType="submit"
                className="flex-grow mr-2 custom-button"
                disabled={!isChanged}
              >
                Save Changes
              </Button>
              <Popconfirm
                title="Are you sure you want to delete this subcategory?"
                icon={<ExclamationCircleOutlined style={{ color: "red" }} />}
                onConfirm={handleDelete}
                okText="Yes"
                cancelText="No"
              >
                <Button danger className="flex-grow">
                  Delete
                </Button>
              </Popconfirm>
            </div>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default SubcategoryDetailModal;
