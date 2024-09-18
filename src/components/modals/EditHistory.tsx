import {
  Modal,
  Button,
  Form,
  Input,
  Select,
  InputNumber,
  ConfigProvider,
  FormInstance,
  Image,
} from "antd";
import { HistoryRecordInterface } from "@/app/history/page";
import React from "react";
import Title from "antd/lib/typography/Title";
import { PencilLineIcon, TrashIcon } from "lucide-react";

const _options = [
  { value: "1", label: "10mL Luer Syringe" },
  { value: "2", label: "5mL Luer Syringe" },
  { value: "3", label: "Unknown" },
];

export interface EditHistoryProps {
  record: HistoryRecordInterface | undefined;
  handleOk: () => void;
  handleSubmit?: () => void;
  handleDelete?: () => void;
  handleCancel?: () => void;
  isModalOpen: boolean;
  isScannedBy: string;
}
interface SubmitBtnProps {
  form: FormInstance;
}
export const SubmitBtn: React.FC<React.PropsWithChildren<SubmitBtnProps>> = ({
  form,
  children,
}) => {
  const [submittable, setSubmittable] = React.useState(false);

  const watcher = Form.useWatch([], form);
  React.useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setSubmittable(true))
      .catch(() => setSubmittable(false));
  }, [form, watcher]);
  return (
    <Button
      htmlType={"submit"}
      key={"Update"}
      type={"primary"}
      className={"w-full"}
    >
      {children}
    </Button>
  );
};

export const EditHistory = ({
  record,
  handleOk,
  handleSubmit,
  handleDelete,
  isModalOpen,
  handleCancel,
  isScannedBy,
}: EditHistoryProps) => {
  const [form] = Form.useForm();

  return (
    isModalOpen && (
      <Modal
        title={"Edit History"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[null]}
      >
        <div className="flex flex-col items-center w-full">
          <Image width={200} src={record?.imageURL} className={"mb-4"} />
          <Form
            layout={"vertical"}
            autoComplete="off"
            initialValues={{ name: record?.name, "Sub-category": "1" }}
            className={"w-full"}
          >
            <Form.Item
              name={"name"}
              rules={[{ required: true }]}
              label={"Name"}
            >
              <Input placeholder={"Enter item's name"} />
            </Form.Item>
            <Form.Item name={"Sub-category"}>
              <p>Sub-Category</p>
              <Select showSearch options={_options} />
            </Form.Item>
            <div className="flex flex-row justify-items-start">
              <Form.Item name={"QuantityChange"} className={"mr-5"}>
                <p>Total Scanned</p>
                <InputNumber
                  defaultValue={record!.quantityChange}
                  title={"Quantity"}
                />
              </Form.Item>
              <Form.Item name={"ScannedBy"}>
                <p>Scanned By</p>
                <Title level={5}>{isScannedBy}</Title>
              </Form.Item>
            </div>
            <div className="flex flex-col justify-center">
              <Form.Item>
                <SubmitBtn form={form}>
                  <PencilLineIcon /> Update Item
                </SubmitBtn>
              </Form.Item>
              <Form.Item>
                <Button key={"Delete Item"} type="dashed" className={"w-full"}>
                  <TrashIcon /> Delete Item
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>
      </Modal>
    )
  );
};
