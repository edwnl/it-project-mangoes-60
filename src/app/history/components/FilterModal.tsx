import React from "react";
import { Button, DatePicker, Modal, Select } from "antd";
import { UserData } from "@/types/types";
import { Dayjs } from "dayjs";

const { RangePicker } = DatePicker;

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
  onClear: () => void;
  users: UserData[];
  selectedUser: string | null;
  setSelectedUser: (userId: string | null) => void;
  dateRange: [Dayjs | null, Dayjs | null] | null;
  setDateRange: (range: [Dayjs | null, Dayjs | null] | null) => void;
}

// allows filtering history records by user and date range
const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  onApply,
  onClear,
  users,
  selectedUser,
  setSelectedUser,
  dateRange,
  setDateRange,
}) => {
  // renders filter modal with user and date range filters
  return (
    <Modal
      title="Filter History"
      open={isOpen}
      width={350}
      onCancel={onClose}
      footer={[
        <Button key="clear" onClick={onClear}>
          Clear Filters
        </Button>,
        <Button key="apply" type="primary" onClick={onApply}>
          Apply Filters
        </Button>,
      ]}
    >
      {/* renders user selection dropdown */}
      <div className="mb-4">
        <label className="block mb-2">Filter by User:</label>
        <Select
          style={{ width: "100%" }}
          placeholder="Select a user"
          value={selectedUser}
          onChange={setSelectedUser}
          allowClear
        >
          {users.map((user) => (
            <Select.Option key={user.id} value={user.id}>
              {user.name}
            </Select.Option>
          ))}
        </Select>
      </div>

      {/* renders date range picker */}
      <div>
        <label className="block mb-2">Filter by Date Range:</label>
        <div className={"block lg:hidden"}>
          <DatePicker
            placeholder="Start Date"
            className={"w-full mb-2"}
            value={dateRange ? dateRange[0] : null}
            onChange={(date) =>
              setDateRange([date, dateRange ? dateRange[1] : null])
            }
          />
          <DatePicker
            className={"w-full mb-2"}
            placeholder="End Date"
            value={dateRange ? dateRange[1] : null}
            onChange={(date) =>
              setDateRange([dateRange ? dateRange[0] : null, date])
            }
          />
        </div>
        <RangePicker
          style={{ width: "100%" }}
          value={dateRange}
          className={"hidden lg:flex"}
          onChange={(dates) => setDateRange(dates)}
        />
      </div>
    </Modal>
  );
};

export default FilterModal;
