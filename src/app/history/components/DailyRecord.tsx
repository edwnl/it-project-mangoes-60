"use client";

import React from "react";
import Image from "next/image";
import { List } from "antd";
import moment from "moment";
import { SearchHistory } from "@/types/types";
import { Timestamp } from "firebase/firestore";
import { useSubcategories } from "@/contexts/SubcategoriesContext";

interface DailyRecordProps {
  historyRecords: SearchHistory[];
  displayDate: string;
  openModal: (info: SearchHistory) => void;
}

// displays records for a specific day
const DailyRecord: React.FC<DailyRecordProps> = ({
  historyRecords,
  displayDate,
  openModal,
}) => {
  const { getSubcategoryById } = useSubcategories();

  // calculates the total scanned quantity for the day
  let quantityTotal = historyRecords.reduce(
    (total, val) => total + (val.scanned_quantity || 0),
    0,
  );

  // renders the records list for a specific day
  return (
    <div className={"mb-8"}>
      <div>
        {/* renders date and total scanned quantity for the day */}
        <div className="flex flex-row justify-between text-sm opacity-70 font-semibold mb-2">
          <h1>{displayDate}</h1>
          <div>{quantityTotal} items</div>
        </div>

        {/* renders each history record as a list item */}
        <List
          dataSource={historyRecords}
          bordered={false}
          renderItem={(item) => (
            <List.Item
              key={item.history_id}
              className={
                "rounded-lg transition-colors duration-200 hover:underline cursor-pointer"
              }
              onClick={() => openModal(item)}
            >
              <List.Item.Meta
                avatar={
                  <Image
                    src={item.image_url}
                    alt={"product photo"}
                    width={50}
                    height={50}
                    className={"rounded-md ml-3"}
                  />
                }
                description={
                  <div className={"flex flex-col"}>
                    <p className={"font-semibold text-black"}>
                      {
                        getSubcategoryById(item.correct_subcategory_id)
                          .subcategory_name
                      }
                    </p>
                    <p>
                      {moment(
                        new Date((item.timestamp as Timestamp).seconds * 1000),
                      ).format("HH:mm")}
                      {" • "}
                      {(item && item.user_data && item.user_data.name) ||
                        "Unknown"}
                    </p>
                  </div>
                }
              ></List.Item.Meta>
              <div className={"mr-3"}>+{item.scanned_quantity || 0}</div>
            </List.Item>
          )}
          className={"border-2 rounded-md"}
        ></List>
      </div>
    </div>
  );
};

export default DailyRecord;
