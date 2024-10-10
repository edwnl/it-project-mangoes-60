// allows filtering history records by user and date range
import { Modal } from "antd";
import React from "react";

const FilterModal: React.FC = ({}) => {
  // renders filter modal with user and date range filters
  return (
    <Modal title="Filter History" width={350}>
      {/* renders user selection dropdown */}
      <label className="block mb-2">Filter by User:</label>
    </Modal>
  );
};

export default FilterModal;
