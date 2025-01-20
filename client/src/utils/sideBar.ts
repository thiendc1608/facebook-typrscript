import saved from "@/assets/images/save-instagram.png";
import feed from "@/assets/images/feed.png";
import messenger from "@/assets/images/messenger.png";
import reel from "@/assets/images/reel.png";
import { path } from "@/utils/path";

export const sideBar = [
  {
    id: 1,
    image: saved,
    name: "Đã lưu",
    url: "/saved",
  },
  {
    id: 2,
    image: feed,
    name: "Bảng feed",
    url: `/${path.FEED}`,
  },
  {
    id: 3,
    image: messenger,
    name: "Messenger",
    url: `/${path.MESSENGER}`,
  },
  {
    id: 4,
    image: reel,
    name: "Reels",
    url: `/${path.REELS}`,
  },
];
