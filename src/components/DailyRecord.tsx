// File: src/components/DailyRecord.tsx
"use client";
import React from "react";
import Image from "next/image";
import { List } from "antd";
import moment from "moment";
import { HistoryRecordInterface } from "@/types/HistoryTypes";

interface DailyRecordProps {
  historyRecords: HistoryRecordInterface[];
  displayDate: string;
  openModal: (info: HistoryRecordInterface) => void;
}

const DailyRecord: React.FC<DailyRecordProps> = ({
  historyRecords,
  displayDate,
  openModal,
}) => {
  let quantityTotal = historyRecords.reduce(
    (total, val) => total + val.totalScanned,
    0,
  );

  return (
    <div>
      <div className="flex flex-row justify-between p-1">
        <h1>{displayDate}</h1>
        <div>
          <b>{quantityTotal}</b> items
        </div>
      </div>
      <List
        dataSource={historyRecords}
        renderItem={(item) => (
          <List.Item
            key={item.id}
            className="pr-2 pl-2"
            onClick={() => openModal(item)}
          >
            <List.Item.Meta
              avatar={
                <Image
                  src={item.imageURL}
                  alt="product photo"
                  width={50}
                  height={50}
                  className="rounded-md"
                />
              }
              title={<b>{item.subCategory}</b>}
              description={moment(item.time).format("HH:mm")}
            />
            <div>+{item.totalScanned}</div>
          </List.Item>
        )}
        className="border-2 rounded-md p-2"
      />
    </div>
  );
};

export default DailyRecord;
