import React, { useState } from "react";
import { Button, message } from "antd";
import { AlertOutlined } from "@ant-design/icons";
import { Subcategory } from "@/types/types";
import { sendBoxStatus } from "@/lib/emailService";

interface ReportFullButtonProps {
  subcategory: Subcategory;
  onReportSuccess?: () => void;
}

const ReportFullButton: React.FC<ReportFullButtonProps> = ({
  subcategory,
  onReportSuccess,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleReportFull = async () => {
    if (!subcategory) {
      message.error("Internal error - could not detect subcategory.");
      return;
    }

    setIsLoading(true);
    try {
      await sendBoxStatus(subcategory.subcategory_name, subcategory.location);
      message.success("Item successfully reported as full.");
      onReportSuccess?.();
    } catch (error) {
      message.error("Failed to report as full.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      className="w-full"
      icon={<AlertOutlined />}
      onClick={handleReportFull}
      loading={isLoading}
    >
      Report Item Full
    </Button>
  );
};

export default ReportFullButton;
