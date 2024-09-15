import { Form, Input } from "antd";
import { CameraOutlined, SearchOutlined } from "@ant-design/icons";
import React from "react";

export const SearchBar = () => (
  <div className="w-full">
    <Form
      name={"searchBar"}
      form={form}
      disabled={isLoading}
      onFinish={handleForm}
    >
      <Form.Item name={"query"}>
        <Input
          placeholder="Enter item name..."
          prefix={<SearchOutlined />}
          suffix={
            <CameraOutlined
              className="cursor-pointer"
              onClick={() => setIsImageModalVisible(true)}
            />
          }
          className="w-full"
          onPressEnter={(e) => {
            e.preventDefault();
            form.submit();
          }}
        />
      </Form.Item>
    </Form>
  </div>
);