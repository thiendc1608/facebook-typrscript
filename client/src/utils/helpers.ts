import { storyDataType } from "@/types";
import {
  format,
  isToday,
  isYesterday,
  getDay,
  addWeeks,
  isAfter,
} from "date-fns";

export const range = (start: number, stop: number, step: number) =>
  Array.from(
    { length: Math.ceil((stop - start) / step) },
    (_, i) => start + i * step
  );

export function formatTimeAgo(utcDate: string | number | Date) {
  const now = new Date();
  const date = new Date(utcDate);

  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);

  if (diffInMinutes < 60) {
    return `${diffInMinutes === 0 ? 1 : diffInMinutes} phút trước`; // Nếu dưới 1 giờ
  } else if (diffInHours < 24) {
    return `${diffInHours} giờ trước`; // Nếu dưới 24 giờ
  }
}

export const sortDateUtils = (data: storyDataType[]) => {
  return data.sort((a, b) => {
    const dateA = a?.createdAt && new Date(a.createdAt);
    const dateB = b?.createdAt && new Date(b.createdAt);
    if (dateA && dateB) {
      return dateB.getTime() - dateA.getTime();
    } else {
      return 0; // or any other default value that makes sense for your sorting logic
    }
  });
};

// Mảng các ngày trong tuần theo định dạng chữ
const daysOfWeek = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

export const formatDate = (dateString: Date) => {
  const vietnamTime = new Date(dateString); // Chuyển chuỗi ngày thành đối tượng Date

  // Kiểm tra xem ngày có phải là hôm nay không
  if (isToday(vietnamTime)) {
    return format(vietnamTime, "HH:mm"); // Chỉ hiển thị giờ và phút
  }

  // Kiểm tra xem ngày có phải là hôm qua không
  if (isYesterday(vietnamTime)) {
    return `${format(vietnamTime, "HH:mm")} ${daysOfWeek[getDay(vietnamTime)]}`; // Hiển thị giờ + T2 (hoặc các ngày trong tuần)
  }

  // Lấy ngày hôm nay
  const today = new Date();
  // Kiểm tra xem dateToCheck có cách ngày hôm nay ít nhất 1 tuần không
  const oneWeekLater = addWeeks(today, 1);
  // Nếu thời gian cách ngày hôm nay ít nhất 1 tuần, định dạng theo kiểu `hh:mm dd/mm/yy`
  if (isAfter(vietnamTime, oneWeekLater))
    return format(vietnamTime, "HH:mm dd MMMM, yyyy");

  // Đối với các ngày trước đó, hiển thị giờ + tên ngày trong tuần (T2, T3, ...)
  return `${format(vietnamTime, "HH:mm")} ${daysOfWeek[getDay(vietnamTime)]}`;
};
