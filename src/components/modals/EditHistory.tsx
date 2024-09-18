import {
  Modal,
  Button,
  Form,
  InputNumber,
  Image,
  FormInstance,
  Tag,
  Select,
} from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { PencilLineIcon, TrashIcon } from "lucide-react";
import { HistoryRecordInterface } from "@/types/HistoryTypes";
import { categoryItems } from "@/lib/categoryLoader";
import assert from "node:assert";

export interface CategoryItem {
  id: string;
  subcategory_name: string;
  category_name: string;
  location: string;
  image_url: string;
  confidence?: number;
}

export interface EditHistoryProps {
  record: HistoryRecordInterface | undefined;
  handleOk: (updatedRecord: HistoryRecordInterface) => void;
  handleDelete?: () => void;
  isModalOpen: boolean;
  handleCancel: () => void;
  isScannedBy: string;
}

interface SubmitBtnProps {
  form: FormInstance<any>;
  originalValue: number;
  originalSubCategory: string;
}

export const SubmitBtn: React.FC<React.PropsWithChildren<SubmitBtnProps>> = ({
  form,
  children,
  originalValue,
  originalSubCategory,
}) => {
  const [submittable, setSubmittable] = React.useState(false);

  const totalScanned = Form.useWatch("totalScanned", form);
  const subCategory = Form.useWatch("subCategory", form);

  React.useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => {
        setSubmittable(
          (totalScanned !== undefined && totalScanned !== originalValue) ||
            (subCategory !== undefined && subCategory !== originalSubCategory),
        );
      })
      .catch(() => setSubmittable(false));
  }, [form, totalScanned, subCategory, originalValue, originalSubCategory]);

  return (
    <Button
      htmlType="submit"
      type="primary"
      className="w-full custom-button"
      disabled={!submittable}
    >
      {children}
    </Button>
  );
};

export const EditHistory: React.FC<EditHistoryProps> = ({
  record,
  handleOk,
  handleDelete,
  isModalOpen,
  handleCancel,
  isScannedBy,
}) => {
  const [form] = Form.useForm<{ subCategory: string; totalScanned: number }>();
  const [originalTotalScanned, setOriginalTotalScanned] = useState<
    number | undefined
  >(undefined);
  const [originalSubCategory, setOriginalSubCategory] = useState<
    string | undefined
  >(undefined);

  useEffect(() => {
    if (record) {
      form.setFieldsValue({
        subCategory: record.subCategory,
        totalScanned: record.totalScanned,
      });
      setOriginalTotalScanned(record.totalScanned);
      setOriginalSubCategory(record.subCategory);
    }
  }, [record, form]);

  const onFinish = (values: { subCategory: string; totalScanned: number }) => {
    if (
      record &&
      (values.totalScanned !== originalTotalScanned ||
        values.subCategory !== originalSubCategory)
    ) {
      const updatedRecord: HistoryRecordInterface = { ...record, ...values };
      handleOk(updatedRecord);
    }
  };

  const handleModalCancel = () => {
    form.resetFields();
    handleCancel();
  };

  // Group categoryItems by category_name
  const groupedCategoryItems = useMemo(() => {
    return categoryItems.reduce<Record<string, CategoryItem[]>>((acc, item) => {
      const categoryArray = acc[item.category_name] || [];
      return {
        ...acc,
        [item.category_name]: [...categoryArray, item],
      };
    }, {});
  }, []);

  return (
    <Modal
      title="Edit History"
      open={isModalOpen}
      onCancel={handleModalCancel}
      footer={null}
    >
      <div className="flex flex-col items-center w-full">
        {record && (
          <Image
            width={200}
            src={record.imageURL}
            alt="Record Image"
            className="mb-4"
          />
        )}
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="w-full"
        >
          <Form.Item
            name="subCategory"
            label="Sub-Category"
            rules={[
              { required: true, message: "Please select a sub-category" },
            ]}
          >
            <Select>
              {Object.entries(groupedCategoryItems).map(([category, items]) => (
                <Select.OptGroup key={category} label={category}>
                  {items.map((item) => (
                    <Select.Option key={item.id} value={item.subcategory_name}>
                      {item.subcategory_name}
                    </Select.Option>
                  ))}
                </Select.OptGroup>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="totalScanned"
            label="Total Scanned"
            rules={[
              {
                required: true,
                message: "Please input the total scanned amount!",
              },
            ]}
          >
            <InputNumber className="w-full" />
          </Form.Item>
          <Form.Item label="Scanned By">
            <Tag>{isScannedBy}</Tag>
          </Form.Item>
          <Form.Item>
            <SubmitBtn
              form={form}
              originalValue={originalTotalScanned || 0}
              originalSubCategory={originalSubCategory || ""}
            >
              <PencilLineIcon /> Update Item
            </SubmitBtn>
          </Form.Item>
          {handleDelete && (
            <Form.Item>
              <Button
                key="Delete Item"
                type="dashed"
                className="w-full"
                onClick={handleDelete}
              >
                <TrashIcon /> Delete Item
              </Button>
            </Form.Item>
          )}
        </Form>
      </div>
    </Modal>
  );
};
