import React from "react";
import Search from "antd/lib/input/Search";
import { Typography, Button, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

const { Title } = Typography;

const CategorySearchOptionModal = ({ onConfirm, onSearch }) => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="p-4 border rounded-lg shadow-lg max-w-md mx-auto mt-4">
      <Title level={4} className="font-normal mb-4">
        Category Search
      </Title>
      <Search placeholder="Search..." className="mb-4" onSearch={onSearch} />
      <Space className="w-full justify-end">
        <Button onClick={handleBack}>Back</Button>
        <Button type="primary" onClick={onConfirm}>
          Confirm
        </Button>
      </Space>
    </div>
  );
};

export default CategorySearchOptionModal;
