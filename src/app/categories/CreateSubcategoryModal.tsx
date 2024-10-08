"use client";

import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Button, message } from "antd";
import { useSubcategories } from "@/contexts/SubcategoriesContext";
import DragDropImageUpload from "@/components/DragDropImageUpload";
import { createSubcategory } from "./actions";

const { Option } = Select;

interface CreateSubcategoryModalProps {
  isVisible: boolean;
  onClose: () => void;
}

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
      message.success("Subcategory created successfully");
      form.resetFields();
      onClose();
    } catch (error) {
      message.error("Failed to create subcategory");
    } finally {
      setIsProcessing(false);
    }
  };

  const onSearchResult = async (formData: FormData) => {
    const file = formData.get("file") as File;
    form.setFieldsValue({ image: file });
  };

  const validateLocation = (_: any, value: string) => {
    if (!value) {
      return Promise.reject("Please input the location");
    }
    if (!/^[0-9.]+$/.test(value)) {
      return Promise.reject("Location can only contain numbers and dots");
    }
    return Promise.resolve();
  };

  return (
    <Modal
      title="New Sub-Category"
      open={isVisible}
      width={350}
      className={"top-8"}
      onCancel={handleClose}
      footer={null}
    >
      <Form form={form} onFinish={handleCreateSubcategory} layout="vertical">
        <Form.Item
          name="image"
          rules={[{ required: true, message: "Please upload an image" }]}
        >
          <DragDropImageUpload onSearchResult={onSearchResult} />
        </Form.Item>
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please input the name" }]}
        >
          <Input />
        </Form.Item>
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
        <Form.Item name="notes" label="Notes">
          <Input.TextArea />
        </Form.Item>
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
