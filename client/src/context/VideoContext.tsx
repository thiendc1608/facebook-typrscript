import React, { createContext, useState } from "react";

interface VideoContextType {
  currentPlayingVideo: string | null;
  playVideo: (videoId: string) => void;
  stopVideo: () => void;
}
// Tạo Context để quản lý video đang phát
const VideoContext = createContext<VideoContextType>({
  currentPlayingVideo: null,
  playVideo: () => {},
  stopVideo: () => {},
});

export const VideoProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentPlayingVideo, setCurrentPlayingVideo] = useState<string | null>(
    null
  ); // Trạng thái video đang phát

  // Hàm để cập nhật video đang phát
  const playVideo = (videoId: string) => {
    setCurrentPlayingVideo(videoId);
  };

  // Hàm để dừng video đang phát
  const stopVideo = () => {
    setCurrentPlayingVideo(null);
  };

  return (
    <VideoContext.Provider
      value={{ currentPlayingVideo, playVideo, stopVideo }}
    >
      {children}
    </VideoContext.Provider>
  );
};
