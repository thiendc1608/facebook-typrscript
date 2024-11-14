import { storyDataType } from "@/types";

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
      return `${diffInMinutes === 0 ? 1 : diffInMinutes} phút trước`;  // Nếu dưới 1 giờ
  } else if (diffInHours < 24) {
      return `${diffInHours} giờ trước`;  // Nếu dưới 24 giờ
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
