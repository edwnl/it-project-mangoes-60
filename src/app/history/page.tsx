"use client"
import React, {useMemo} from "react";
import Image from 'next/image'
import Title from "antd/lib/typography/Title";
import Search from "antd/lib/input/Search";
import { Button, List } from "antd";
import {FilterOutlined} from "@ant-design/icons";
import moment from "moment";
import {EditHistory} from "@/components/modals/EditHistory"

export interface HistoryRecordInterface {
  id: string | number,
  imageURL: string,
  name: string,
  time: Date,
  quantityChange: number,
}


// TODO: Fetch with real data from db
const _data :HistoryRecordInterface[]= [
  {
    id: 1,
    imageURL: "https:/picsum.photos/200",
    name: "Medtronics 10ml Syringe",
    time: new Date(Date.parse("13 Sep 2024 13:10:00 GMT+10")),
    quantityChange: 10,
  },
  {
    id: 2,
    imageURL: "https://picsum.photos/200",
    name: "Viscopaste PB7",
    time: new Date(Date.parse("12 Sep 2024 13:16:00 GMT+10")),
    quantityChange: 2,
  },
  {
    id: 3,
    imageURL: "https://picsum.photos/200",
    name: "Surviv-A-Wrap",
    time: new Date(Date.parse("13 Sep 2024 13:11:00 GMT+10")),
    quantityChange: 31,
  },
  {
    id: 4,
    imageURL: "https://picsum.photos/200",
    name: "Sentry Instant Ice Pack",
    time: new Date(Date.parse("13 Sep 2024 13:28:00 GMT+10")),
    quantityChange: 7,
  },
]

/**
 * Sort the records by time
 * @param data
 */
const categoriseByTime = (data: HistoryRecordInterface[]) => {


  // Classify by dates;
  let result: Record<string, Array<HistoryRecordInterface>> = {}
  for (const record of data){
    const date = moment(record.time).format("YYYY-MM-DD");
    if (result.hasOwnProperty(date)){
      result[date]?.push(record);
    } else {
      result[date] = [record];

    }
  }
  console.log(result);
  return result;
}

/**
 * Render daily record
 * @param historyRecords history records
 * @param displayDate date representation of the record
 */
const renderDailyRecord = (historyRecords: HistoryRecordInterface[], displayDate:string) => {
  let quantityTotal = 0;
  historyRecords.forEach((val) => {
    quantityTotal += val.quantityChange;
  })
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [editInfo, setEditInfo] = React.useState(undefined);
  const openModal = (info: any) => {
    console.log("open modal")
    if (!isModalOpen) setModalOpen(true);
    setEditInfo(info);
  }
  return (
    <div>
      <div>
        <div className="flex flex-row justify-between p-1">
          <h1>{displayDate}</h1>
          <div><b>{quantityTotal}</b> items</div>
        </div>
        <List
          dataSource={historyRecords}
          renderItem={(item) => (
            <List.Item key={item.id} className={"pr-2 pl-2"} onClick={() => openModal(item)}>
              <List.Item.Meta
                avatar={<Image src={item.imageURL} alt={"product photo"} width={50} height={50}
                               className={"rounded-md"} />}
                title={<b>{item.name}</b>}
                description={`${item.time.getHours()}:${item.time.getMinutes()}`}>
              </List.Item.Meta>
              <div>+{item.quantityChange}</div>
            </List.Item>
          )
          }
          className={"border-2 rounded-md p-2"}
        >
        </List>
        <EditHistory
          record={editInfo}
          handleOk={() => {console.log("handleOk")}}
          isModalOpen={isModalOpen}
          handleCancel={() => {setModalOpen(false);}}
          isScannedBy="Volunteer"
        />
      </div>
    </div>
  )
}



const HistoryPage = (props: any) => {

  const historyRecords = useMemo(() => {
    return categoriseByTime(_data)
  }, [_data]);

  return (

    <div className={"w-11/12 lg:w-1/3 items-center mt-4"}>
      <div className="header items-start w-full mb-10">
        <Title>History</Title>
        <div className="flex flex-row justify-between mb-4 h-full">
          <Search
            placeholder={"Search..."}
            size={"large"}
            className={"w-2/3"}
          />
          <Button className="w-300px h-full border-dashed border-[#BF0018] text-[#BF0018] pb-1.5 pt-1.5" onClick={() => {
            throw new Error("Button has not implemented");
          }}>
            Filter <FilterOutlined />
          </Button>
        </div>
      </div>
      {
        Object.keys(historyRecords)
          .sort((a,b) => moment(a,"YYYY-MM-DD").isAfter(b) ? -1 : 1)
          .map(val => renderDailyRecord(historyRecords[val]!, moment(val, "YYYY-MM-DD").fromNow()))
      }

    </div>
  )
}

export default HistoryPage;