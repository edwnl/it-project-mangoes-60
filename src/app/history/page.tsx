"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button, Empty, Input, message, Tag } from "antd";
import { FilterOutlined, SearchOutlined } from "@ant-design/icons";
import moment from "moment";
import { Timestamp } from "firebase/firestore";
import NavBar from "@/components/Navbar";
import LoadingPage from "@/components/Loading";
import { SearchHistory, UserData } from "@/types/types";
import { useAuth } from "@/contexts/AuthContext";
import isBetween from "dayjs/plugin/isBetween";
import { deleteHistoryRecord, fetchAllUsers, fetchHistoryRecords, updateHistoryRecord } from "@/app/history/actions";
import dayjs, { Dayjs } from "dayjs";
import { useSubcategories } from "@/contexts/SubcategoriesContext";
import DailyRecord from "@/app/history/components/DailyRecord";
import FilterModal from "@/app/history/components/FilterModal";
import { EditHistory } from "@/app/history/components/EditHistory";
import { withGuard } from "@/components/GuardRoute";

dayjs.extend(isBetween);

// categorizes history records by their timestamp (formatted by date)
const categoriseByTime = (data: SearchHistory[]) => {
  let result: Record<string, Array<SearchHistory>> = {};
  for (const record of data) {
    const date = moment(
      new Date((record.timestamp as Timestamp).seconds * 1000),
    ).format("YYYY-MM-DD");
    if (result.hasOwnProperty(date)) {
      result[date]?.push(record);
    } else {
      result[date] = [record];
    }
  }
  return result;
};

// main component for displaying history records
const HistoryPage = () => {
  const [historyRecords, setHistoryRecords] = useState<SearchHistory[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<SearchHistory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [editInfo, setEditInfo] = useState<SearchHistory | undefined>(
    undefined,
  );
  const [users, setUsers] = useState<UserData[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<
    [Dayjs | null, Dayjs | null] | null
  >(null);
  const { user } = useAuth();
  const { subcategories, getSubcategoryById } = useSubcategories();

  // fetches and loads history records, sets user and record data
  useEffect(() => {
    const loadHistoryRecords = async () => {
      if (!user) return;
      setIsLoading(true);

      try {
        const records: SearchHistory[] = await fetchHistoryRecords(user.uid);
        const completedRecords = records.map((record) => ({
          ...record,
          results: record.results.map((result) =>
            getSubcategoryById(result.id),
          ),
        })) as SearchHistory[];
        setHistoryRecords(completedRecords);
        setFilteredRecords(completedRecords);
        const allUsers = await fetchAllUsers();
        setUsers(allUsers);
      } catch (error) {
        message.error(`Failed to load history records.`);
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (subcategories) {
      loadHistoryRecords();
    }
  }, [user, subcategories]);

  // applies filters to the loaded history records (search, user selection, date range)
  useEffect(() => {
    const filtered = historyRecords.filter((record) => {
      const subcategory = subcategories?.find(
        (sub) => sub.id === record.correct_subcategory_id,
      );
      const searchFields = [
        record.user_data?.name,
        record.user_data?.email,
        subcategory && subcategory.subcategory_name,
      ];

      const matchesSearch =
        searchTerm === "" ||
        searchFields.some(
          (field) =>
            field && field.toLowerCase().includes(searchTerm.toLowerCase()),
        );

      const matchesUser = !selectedUser || record.user_id === selectedUser;

      const recordDate = dayjs.unix((record.timestamp as Timestamp).seconds);
      const matchesDateRange =
        !dateRange ||
        (dateRange[0] &&
          dateRange[1] &&
          recordDate.isBetween(dateRange[0], dateRange[1], null, "[]"));

      return matchesSearch && matchesUser && matchesDateRange;
    });

    setFilteredRecords(filtered);
  }, [historyRecords, searchTerm, selectedUser, dateRange]);

  const categorisedRecords = useMemo(() => {
    return categoriseByTime(filteredRecords);
  }, [filteredRecords]);

  const handleSearch = (value: string) => {
    setSearchTerm(value.trim());
  };

  // opens modal to edit specific history record
  const openModal = (info: SearchHistory) => {
    setEditInfo(info);
    setModalOpen(true);
  };

  // handles updating a specific history record after editing
  const handleOk = async (updatedRecord: SearchHistory) => {
    try {
      await updateHistoryRecord(updatedRecord.history_id, {
        correct_subcategory_id: updatedRecord.correct_subcategory_id,
        scanned_quantity: updatedRecord.scanned_quantity,
      });

      setHistoryRecords((prevRecords) =>
        prevRecords.map((record) =>
          record.history_id === updatedRecord.history_id
            ? { ...record, ...updatedRecord }
            : record,
        ),
      );

      message.success("Record updated successfully");
      setModalOpen(false);
      setEditInfo(undefined);
    } catch (error) {
      console.error("Error updating record:", error);
      message.error("Failed to update record");
    }
  };

  // handles deletion of a specific history record
  const handleDelete = async () => {
    if (editInfo) {
      try {
        await deleteHistoryRecord(editInfo.history_id);
        setHistoryRecords((prevRecords) =>
          prevRecords.filter(
            (record) => record.history_id !== editInfo.history_id,
          ),
        );
        message.success("Record deleted successfully");
        setModalOpen(false);
        setEditInfo(undefined);
      } catch (error) {
        console.error("Error deleting record:", error);
        message.error("Failed to delete record");
      }
    }
  };

  // handles closing the edit modal without changes
  const handleCancel = () => {
    setModalOpen(false);
    setEditInfo(undefined);
  };

  // opens filter modal
  const openFilterModal = () => {
    setIsFilterModalOpen(true);
  };

  // handles closing the filter modal
  const handleFilterCancel = () => {
    setIsFilterModalOpen(false);
  };

  // applies selected filters
  const handleFilterApply = () => {
    setIsFilterModalOpen(false);
  };

  // clears all selected filters
  const clearFilters = () => {
    setSelectedUser(null);
    setDateRange(null);
  };

  if (isLoading) {
    return <LoadingPage />;
  }
  const displayDate = (time) => {
    let secondsElapsed = moment().diff(time, 'days');
    let displayString = moment(time).fromNow();
    if (secondsElapsed < 1) return "Today";
    return displayString;
  }
  // renders the page layout and UI components
  return (
    <>
      {/* renders navigation bar */}
      <NavBar />
      <div className="flex flex-row justify-center px-8">
        <div className="items-center flex-grow max-w-xl">
          <div className="items-start mb-8">
            <p className="text-3xl font-bold mb-4">History</p>

            {/* renders search input and filter button */}
            <div className="flex flex-row justify-between mb-4">
              <Input
                className="mr-4 flex-grow"
                prefix={<SearchOutlined />}
                placeholder="Search..."
                onChange={(e) => handleSearch(e.target.value)}
              />
              <Button
                icon={<FilterOutlined />}
                onClick={openFilterModal}
                className="w-300px text-base h-full border-dashed border-[#BF0018] text-[#BF0018]"
              >
                Filter
              </Button>
            </div>

            {/* renders applied filters as tags if present */}
            {(selectedUser || dateRange) && (
              <div className="mb-4">
                {selectedUser && (
                  <Tag
                    closable
                    onClose={() => setSelectedUser(null)}
                    color="blue"
                  >
                    User: {users.find((u) => u.id === selectedUser)?.name}
                  </Tag>
                )}
                {dateRange && (
                  <Tag
                    closable
                    onClose={() => setDateRange(null)}
                    color="green"
                  >
                    Date: {dateRange[0]?.format("YYYY-MM-DD")} to{" "}
                    {dateRange[1]?.format("YYYY-MM-DD")}
                  </Tag>
                )}
              </div>
            )}
          </div>

          {/* renders list of history records or empty state */}
          {historyRecords.length === 0 ? (
            <Empty />
          ) : (
            Object.keys(categorisedRecords)
              .sort((a, b) => (moment(a, "YYYY-MM-DD").isAfter(b) ? -1 : 1))
              .map((val) => (
                <DailyRecord
                  key={val}
                  historyRecords={categorisedRecords[val]!}
                  displayDate={displayDate(val)}
                  openModal={openModal}
                />
              ))
          )}

          {/* renders edit modal if edit info is available */}
          {editInfo && (
            <EditHistory
              record={editInfo}
              handleOk={handleOk}
              handleDelete={handleDelete}
              isModalOpen={isModalOpen}
              handleCancel={handleCancel}
            />
          )}

          {/* renders filter modal */}
          <FilterModal
            isOpen={isFilterModalOpen}
            onClose={handleFilterCancel}
            onApply={handleFilterApply}
            onClear={clearFilters}
            users={users}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            dateRange={dateRange}
            setDateRange={setDateRange}
          />
        </div>
      </div>
    </>
  );
};

export default withGuard(HistoryPage, { requireAuth: true });
