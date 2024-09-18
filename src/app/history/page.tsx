// File: src/pages/HistoryPage.tsx
"use client";
import React, { useMemo, useEffect, useState } from "react";
import Search from "antd/lib/input/Search";
import { Button, Spin, message } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import moment from "moment";
import { EditHistory } from "@/components/modals/EditHistory";
import {
  collection,
  query,
  getDocs,
  orderBy,
  limit,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import SimpleNavBar from "@/components/SimpleNavBar";
import DailyRecord from "@/components/DailyRecord";
import { HistoryRecordInterface } from "@/types/HistoryTypes";
import { categoriseByTime } from "@/utils/historyUtils";

const HistoryPage: React.FC = () => {
  const [historyRecords, setHistoryRecords] = useState<
    HistoryRecordInterface[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [editInfo, setEditInfo] = useState<HistoryRecordInterface | undefined>(
    undefined,
  );

  useEffect(() => {
    const fetchHistoryRecords = async () => {
      try {
        const historyCollection = collection(db, "matchingHistory");
        const q = query(historyCollection, orderBy("time", "desc"), limit(50));
        const querySnapshot = await getDocs(q);

        const records: HistoryRecordInterface[] = querySnapshot.docs.map(
          (doc) => ({
            id: doc.id,
            imageURL: doc.data().imageURL,
            subCategory: doc.data().subCategory,
            time: doc.data().time.toDate(),
            totalScanned: doc.data().totalScanned,
            userID: doc.data().userID,
          }),
        );

        setHistoryRecords(records);
      } catch (error) {
        console.error("Error fetching history records:", error);
        message.error("Failed to load history records");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistoryRecords();
  }, []);

  const filteredRecords = useMemo(() => {
    return historyRecords.filter((record) =>
      record.subCategory.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [historyRecords, searchTerm]);

  const categorisedRecords = useMemo(() => {
    return categoriseByTime(filteredRecords);
  }, [filteredRecords]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const openModal = (info: HistoryRecordInterface) => {
    setEditInfo(info);
    setModalOpen(true);
  };

  const handleOk = async (updatedRecord: HistoryRecordInterface) => {
    try {
      const docRef = doc(db, "matchingHistory", updatedRecord.id);
      await updateDoc(docRef, {
        totalScanned: updatedRecord.totalScanned,
      });

      setHistoryRecords((prevRecords) =>
        prevRecords.map((record) =>
          record.id === updatedRecord.id ? updatedRecord : record,
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

  const handleDelete = async () => {
    if (editInfo) {
      try {
        const docRef = doc(db, "matchingHistory", editInfo.id);
        await deleteDoc(docRef);

        setHistoryRecords((prevRecords) =>
          prevRecords.filter((record) => record.id !== editInfo.id),
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

  const handleCancel = () => {
    setModalOpen(false);
    setEditInfo(undefined);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      <SimpleNavBar />
      <div className="min-h-screen max-w-5xl mx-auto bg-white flex flex-row justify-center">
        <div className="w-11/12 lg:w-2/3 items-center mt-4">
          <div className="header items-start w-full mb-10">
            <p className="text-3xl font-bold mb-4">History</p>
            <div className="flex flex-row justify-between mb-4 h-full">
              <Search
                placeholder="Search..."
                size="large"
                className="w-2/3"
                onSearch={handleSearch}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button
                className="w-300px h-full border-dashed border-[#BF0018] text-[#BF0018] pb-1.5 pt-1.5"
                onClick={() => {
                  message.info("Filter functionality not implemented yet");
                }}
              >
                Filter <FilterOutlined />
              </Button>
            </div>
          </div>

          {Object.keys(categorisedRecords)
            .sort((a, b) => (moment(a, "YYYY-MM-DD").isAfter(b) ? -1 : 1))
            .map((val) => (
              <DailyRecord
                key={val}
                historyRecords={categorisedRecords[val]!}
                displayDate={moment(val, "YYYY-MM-DD").fromNow()}
                openModal={openModal}
              />
            ))}

          {editInfo && (
            <EditHistory
              record={editInfo}
              handleOk={handleOk}
              handleDelete={handleDelete}
              isModalOpen={isModalOpen}
              handleCancel={handleCancel}
              isScannedBy={editInfo.userID}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default HistoryPage;
