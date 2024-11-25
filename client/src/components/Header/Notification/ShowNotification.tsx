import MenuNotification from "@/components/Header/Notification/MenuNotification";
import FriendRequest from "@/components/Header/Notification/FriendRequest";
import { BsThreeDots } from "react-icons/bs";
import { Socket } from "socket.io-client";

interface ShowNotificationProps {
  socket: Socket | null;
}
const ShowNotification = ({ socket }: ShowNotificationProps) => {
  return (
    <div
      className="absolute top-0 right-4 bg-white rounded-lg w-[360px] h-[535px] overflow-y-auto shadow-default z-50"
      id="notification"
    >
      <div className="flex flex-col">
        <div className="flex items-center justify-between mt-5 mx-4 mb-3 leading-[17px]">
          <span className="text-[#080809] text-[24px] leading-[21px]">
            Thông báo
          </span>
          <span className="cursor-pointer">
            <BsThreeDots size={20} />
          </span>
        </div>
        <MenuNotification />
        <FriendRequest socket={socket} />
      </div>
    </div>
  );
};

export default ShowNotification;
