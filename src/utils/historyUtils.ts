import moment from "moment";
import { HistoryRecordInterface } from "@/types/HistoryTypes";

export const categoriseByTime = (
  data: HistoryRecordInterface[],
): Record<string, Array<HistoryRecordInterface>> => {
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
