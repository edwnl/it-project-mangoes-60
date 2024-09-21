import {
  Modal,
  Button,
  Form,
  Input,
  InputNumber,
  Image,
  FormInstance,
} from "antd";
import { HistoryRecordInterface } from "@/app/history/page";
import React, { useEffect, useState } from "react";
import { PencilLineIcon, TrashIcon } from "lucide-react";

export interface EditHistoryProps {
  // The record that is being edited
  record: HistoryRecordInterface | undefined;
  // Function that is called when updates are confirmed
  handleOk: (updatedRecord: HistoryRecordInterface) => void;
  // Function that is called when record is deleted
  handleDelete?: () => void;
  // Controls the visibility of popup
  isModalOpen: boolean;
  // Function that is called when you cancel the edit
  handleCancel: () => void;
  // ID of who scanned item
  isScannedBy: string;
}

interface SubmitBtnProps {
  form: FormInstance;
  originalValue: number;
}

// Submit button
// Disabled if there are no changes
export const SubmitBtn: React.FC<React.PropsWithChildren<SubmitBtnProps>> = ({
  form,
  children,
  originalValue,
}) => {
  const [submittable, setSubmittable] = React.useState(false);

  // Checks for changes in totalScanned field
  const totalScanned = Form.useWatch("totalScanned", form);

  // Determines if you can choose to submit
  React.useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => {
        // Only allow subit if totalScanned has changed and is valid
        setSubmittable(
          totalScanned !== undefined && totalScanned !== originalValue,
        );
      })
      .catch(() => setSubmittable(false));
  }, [form, totalScanned, originalValue]);

  return (
    <Button
      htmlType="submit"
      type="primary"
      className="w-full"
      disabled={!submittable}
    >
      {children}
    </Button>
  );
};

// Modal component for editing history
export const EditHistory: React.FC<EditHistoryProps> = ({
  record,
  handleOk,
  handleDelete,
  isModalOpen,
  handleCancel,
  isScannedBy,
}) => {
  const [form] = Form.useForm();
  const [originalTotalScanned, setOriginalTotalScanned] = useState<
    number | undefined
  >(undefined);

  // Effect that handles changes in the record
  useEffect(() => {
    if (record) {
      form.setFieldsValue({
        subCategory: record.subCategory,
        totalScanned: record.totalScanned,
      });
      setOriginalTotalScanned(record.totalScanned);
    }
  }, [record, form]);

  // Handles edits
  const onFinish = (values: any) => {
    if (record && values.totalScanned !== originalTotalScanned) {
      const updatedRecord = { ...record, totalScanned: values.totalScanned };
      handleOk(updatedRecord);
    }
  };

  // Handles cancellations
  const handleModalCancel = () => {
    form.resetFields();
    handleCancel();
  };

  return (
    <Modal
      title="Edit History"
      open={isModalOpen}
      onCancel={handleModalCancel}
      footer={null}
    >
      <div className="flex flex-col items-center w-full">
        {record && <Image width={200} src={record.imageURL} className="mb-4" />}
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="w-full"
        >
          <Form.Item name="subCategory" label="Sub-Category">
            <Input disabled />
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
            <Input value={isScannedBy} disabled />
          </Form.Item>
          <Form.Item>
            <SubmitBtn form={form} originalValue={originalTotalScanned || 0}>
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
