"use client";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Title from "antd/lib/typography/Title";
import Search from "antd/lib/input/Search";
import { Button, List, message, Spin } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import moment from "moment";
import { EditHistory } from "@/components/modals/EditHistory";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import NavBar from "@/components/Navbar";

// Structure of the matchingHistory record from the database
export interface HistoryRecordInterface {
  id: string;
  imageURL: string;
  subCategory: string;
  time: Date;
  totalScanned: number;
  userID: string;
}

// Categorize history records by date, this function groups records by their date
const categoriseByTime = (data: HistoryRecordInterface[]) => {
  let result: Record<string, Array<HistoryRecordInterface>> = {};
  for (const record of data) {
    const date = moment(record.time).format("YYYY-MM-DD");
    if (result.hasOwnProperty(date)) {
      result[date]?.push(record);
    } else {
      result[date] = [record];
    }
  }
  return result;
};

interface DailyRecordProps {
  historyRecords: HistoryRecordInterface[];
  displayDate: string;
  openModal: (info: HistoryRecordInterface) => void;
}

// Component to display the records for a single day
// This component will render a list of history records for a specific date, including summary of total items
const DailyRecord: React.FC<DailyRecordProps> = ({
  historyRecords,
  displayDate,
  openModal,
}) => {
  // Calculates total quantity for the day
  let quantityTotal = 0;
  historyRecords.forEach((val) => {
    quantityTotal += val.totalScanned;
  });

  return (
    <div>
      <div>
        <div className="flex flex-row justify-between p-1">
          <h1>{displayDate}</h1>
          <div>
            <b>{quantityTotal}</b> items
          </div>
        </div>
        {/* renders list of history records for the day */}
        <List
          dataSource={historyRecords}
          renderItem={(item) => (
            <List.Item
              key={item.id}
              className={"pr-2 pl-2"}
              onClick={() => openModal(item)} // This opens the edit modal when the item is clicked
            >
              <List.Item.Meta
                avatar={
                  <Image
                    src={item.imageURL}
                    alt={"product photo"}
                    width={50}
                    height={50}
                    className={"rounded-md"}
                  />
                }
                title={<b>{item.subCategory}</b>}
                description={`${moment(item.time).format("HH:mm")}`}
              ></List.Item.Meta>
              <div>+{item.totalScanned}</div>
            </List.Item>
          )}
          className={"border-2 rounded-md p-2"}
        ></List>
      </div>
    </div>
  );
};

// Main history page component
const HistoryPage = () => {
  // Stores all fetched history records
  const [historyRecords, setHistoryRecords] = useState<
    HistoryRecordInterface[]
  >([]);
  // Indicates if data is being fetched
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // Stores the current search term
  const [searchTerm, setSearchTerm] = useState<string>("");
  // Controls the visibility of edit modal
  const [isModalOpen, setModalOpen] = useState(false);
  // Stores the item record that's being edited
  const [editInfo, setEditInfo] = useState<HistoryRecordInterface | undefined>(
    undefined,
  );

  // Fetching the history from Firebase
  useEffect(() => {
    const fetchHistoryRecords = async () => {
      try {
        const historyCollection = collection(db, "matchingHistory");
        // Currently only taking the 50 most recent records
        const q = query(historyCollection, orderBy("time", "desc"), limit(50));
        const querySnapshot = await getDocs(q);

        // Maps firebase data to HistoryRecordInterface
        const records: HistoryRecordInterface[] = querySnapshot.docs.map(
          (doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              imageURL: data.imageURL,
              subCategory: data.subCategory,
              time: data.time.toDate(),
              totalScanned: data.totalScanned,
              userID: data.userID,
            };
          },
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

  // Updates searchTerm when the user types in the search box
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  // Called when user clicks on history record
  const openModal = (info: HistoryRecordInterface) => {
    setEditInfo(info);
    setModalOpen(true);
  };

  // Called when a user confirms changes in the edit modal
  const handleOk = async (updatedRecord: HistoryRecordInterface) => {
    try {
      // Updates the data in Firebase
      const docRef = doc(db, "matchingHistory", updatedRecord.id);
      await updateDoc(docRef, {
        totalScanned: updatedRecord.totalScanned,
      });

      // Updates the data locally
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

  // Called when a user deletes the record
  const handleDelete = async () => {
    if (editInfo) {
      try {
        // Delete the record in firebase
        const docRef = doc(db, "matchingHistory", editInfo.id);
        await deleteDoc(docRef);

        // updates the data locally
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

  // Called when you exit out of the edit modal
  const handleCancel = () => {
    setModalOpen(false);
    setEditInfo(undefined);
  };

  // Displays a loading symbol while data is being fetched
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  // Renders the history page
  return (
    <div
      className={
        "min-h-screen max-w-5xl mx-auto bg-white flex flex-row justify-center"
      }
    >
      <NavBar />
      <div className={"w-11/12 lg:w-2/3 items-center mt-4"}>
        <div className="header items-start w-full mb-10">
          <Title>History</Title>
          <div className="flex flex-row justify-between mb-4 h-full">
            <Search
              placeholder={"Search..."}
              size={"large"}
              className={"w-2/3"}
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
  );
};

export default HistoryPage;
