"use client";

import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Button, Image, Popconfirm } from "antd";
import { Subcategory } from "@/types/types";
import { useSubcategories } from "@/contexts/SubcategoriesContext";
import { deleteSubcategory, updateSubcategory } from "./actions";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const { Option } = Select;

interface SubcategoryDetailModalProps {
  isVisible: boolean;
  onClose: () => void;
  subcategory: Subcategory;
  isAdmin: boolean;
}

const SubcategoryDetailModal: React.FC<SubcategoryDetailModalProps> = ({
  isVisible,
  onClose,
  subcategory,
  isAdmin,
}) => {
  const [form] = Form.useForm();
  const { subcategories } = useSubcategories();
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    if (isVisible) {
      form.setFieldsValue({
        ...subcategory,
        category_name: [subcategory.category_name],
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

  const handleUpdate = async (values: any) => {
    try {
      await updateSubcategory(subcategory.id, values);
      onClose();
    } catch (error) {
      console.error("Failed to update subcategory:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteSubcategory(subcategory.id);
      onClose();
    } catch (error) {
      console.error("Failed to delete subcategory:", error);
    }
  };

  return (
    <Modal
      title="Subcategory Details"
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
        <Image
          width={300}
          preview={false}
          src={subcategory.image_url}
          alt={subcategory.subcategory_name}
        />

        <Form.Item name="subcategory_name" label="Name">
          <Input disabled={!isAdmin} />
        </Form.Item>

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

        <Form.Item name="location" label="Location">
          <Input disabled={!isAdmin} />
        </Form.Item>

        <Form.Item name="notes" label="Notes">
          <Input.TextArea disabled={!isAdmin} />
        </Form.Item>

        {isAdmin && (
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginRight: 8 }}
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
              <Button danger>Delete</Button>
            </Popconfirm>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default SubcategoryDetailModal;