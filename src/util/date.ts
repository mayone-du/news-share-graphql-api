import dayjs from "dayjs";

/** DBで扱っているタイムゾーンはUTCなので注意 */
export const getOneDayBetween = (at: Date) => {
  const date = dayjs(dayjs(at).format("YYYY-MM-DD"));
  const yesterday = date.toDate();
  const tomorrow = date.add(1, "day").toDate();
  return {
    yesterday,
    tomorrow,
  };
};
