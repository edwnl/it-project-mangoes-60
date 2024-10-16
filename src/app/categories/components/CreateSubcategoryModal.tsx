"use client";

import React, { useEffect, useState } from "react";
import { Button, Form, Input, message, Modal, Select } from "antd";
import { useSubcategories } from "@/contexts/SubcategoriesContext";
import { createSubcategory } from "@/app/categories/actions";
import DragDropImageUpload from "@/app/scan/components/DragDropImageUpload";

const { Option } = Select;

interface CreateSubcategoryModalProps {
  isVisible: boolean;
  onClose: () => void;
}

// modal that allows users to create a new sub-category
const CreateSubcategoryModal: React.FC<CreateSubcategoryModalProps> = ({
  isVisible,
  onClose,
}) => {
  const [form] = Form.useForm();
  const { subcategories } = useSubcategories();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      form.resetFields();
    }
  }, [isVisible, form]);

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  const handleCreateSubcategory = async (values: any) => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("file", values.image);
      formData.append("name", values.name);
      formData.append("category", values.category[0]);
      formData.append("location", values.location);
      formData.append("notes", values.notes || "");

      await createSubcategory(formData);
      message.success("Item created successfully");
      form.resetFields();
      onClose();
    } catch (error) {
      message.error("Failed to create item");
    } finally {
      setIsProcessing(false);
    }
  };

  const onSearchResult = async (formData: FormData) => {
    const file = formData.get("file") as File;
    form.setFieldsValue({ image: file });
  };

  // validates that the location input only contains numbers and dots
  const validateLocation = (_: any, value: string) => {
    if (!value) {
      return Promise.reject("Please input the location");
    }
    if (!/^[0-9.]+$/.test(value)) {
      return Promise.reject("Location can only contain numbers and dots");
    }
    return Promise.resolve();
  };

  // renders modal for creating a new item
  return (
    <Modal
      title="New Item"
      open={isVisible}
      width={350}
      className={"top-8"}
      onCancel={handleClose}
      footer={null}
    >
      <Form form={form} onFinish={handleCreateSubcategory} layout="vertical">
        {/* renders image upload field */}
        <Form.Item
          name="image"
          rules={[{ required: true, message: "Please upload an image" }]}
        >
          <DragDropImageUpload
            onSearchResult={onSearchResult}
            immediateUpload
          />
        </Form.Item>

        {/* renders input field for sub-category name */}
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please input the name" }]}
        >
          <Input />
        </Form.Item>

        {/* renders select field for category */}
        <Form.Item
          name="category"
          label="Category"
          rules={[
            { required: true, message: "Please select or enter a category" },
          ]}
        >
          <Select
            mode="tags"
            maxCount={1}
            placeholder="Select or enter a category"
            style={{ width: "100%" }}
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
        <Form.Item
          name="location"
          label="Location"
          rules={[
            { required: true, message: "Please input the location" },
            { validator: validateLocation },
          ]}
        >
          <Input />
        </Form.Item>

        {/* renders input field for additional notes */}
        <Form.Item name="notes" label="Notes">
          <Input.TextArea />
        </Form.Item>

        {/* renders action buttons: cancel and confirm */}
        <Form.Item>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={onClose} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="custom-button"
              loading={isProcessing}
            >
              Confirm
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateSubcategoryModal;
