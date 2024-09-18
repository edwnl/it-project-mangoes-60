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
  record: HistoryRecordInterface | undefined;
  handleOk: (updatedRecord: HistoryRecordInterface) => void;
  handleDelete?: () => void;
  isModalOpen: boolean;
  handleCancel: () => void;
  isScannedBy: string;
}

interface SubmitBtnProps {
  form: FormInstance;
  originalValue: number;
}

export const SubmitBtn: React.FC<React.PropsWithChildren<SubmitBtnProps>> = ({
  form,
  children,
  originalValue,
}) => {
  const [submittable, setSubmittable] = React.useState(false);

  const totalScanned = Form.useWatch('totalScanned', form);

  React.useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => {
        setSubmittable(totalScanned !== undefined && totalScanned !== originalValue);
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

export const EditHistory: React.FC<EditHistoryProps> = ({
  record,
  handleOk,
  handleDelete,
  isModalOpen,
  handleCancel,
  isScannedBy,
}) => {
  const [form] = Form.useForm();
  const [originalTotalScanned, setOriginalTotalScanned] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (record) {
      form.setFieldsValue({
        subCategory: record.subCategory,
        totalScanned: record.totalScanned,
      });
      setOriginalTotalScanned(record.totalScanned);
    }
  }, [record, form]);

  const onFinish = (values: any) => {
    if (record && values.totalScanned !== originalTotalScanned) {
      const updatedRecord = { ...record, totalScanned: values.totalScanned };
      handleOk(updatedRecord);
    }
  };

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
        {record && (
          <Image width={200} src={record.imageURL} className="mb-4" />
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
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="totalScanned"
            label="Total Scanned"
            rules={[{ required: true, message: 'Please input the total scanned amount!' }]}
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