import React from 'react';
import Search from "antd/lib/input/Search";
import { Typography, Button, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useRouter } from 'next/navigation'; 

const { Title, Paragraph, Text } = Typography;

const SkipItemModal = ({onConfirm}) => {
    const router = useRouter(); 

    const handleBack = () => {
        router.back(); 
    }; 

  return (
    <div className="p-4 border rounded-lg shadow-lg max-w-md mx-auto mt-4">
      <Title level={4} className="font-normal mb-4">Skip Item</Title>
      <Paragraph className="mb-4 text-gray-600">
        You have chosen to skip the categorisation of this item due to identification issues. 
        Please confirm the following actions:
      </Paragraph>
      
        <Text>1. Place the item back in the box.</Text> <br></br>
        <Text>2. Return the box to its original location.</Text><br></br>
        <Text>3. Notify the admin regarding this item.</Text> <br></br>
      
      <Space className="w-full justify-end mt-4">
        <Button 
            onClick={handleBack}
        >
            Back
        </Button>
        <Button 
            type="primary" 
            onClick={onConfirm}
        >
          Confirm
        </Button>
      </Space>
    </div>
  );
};

export default SkipItemModal;