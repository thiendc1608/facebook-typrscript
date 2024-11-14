import { FaFacebookMessenger } from "react-icons/fa6";
import { IoNotificationsSharp } from "react-icons/io5";
import { PiDotsNineBold } from "react-icons/pi";
import anonymousAvatar from "@/assets/images/default_avatar.jpg";
import { cn } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import {
  notificationState,
  setIsOpenMessage,
  setIsOpenNotifications,
} from "@/redux/notificationSlice";
import { useEffect, useState } from "react";

const RightHeader = () => {
  const dispatch = useDispatch();
  const { isOpenNotifications, notifications, isOpenMessage } = useSelector(
    (state: { notification: notificationState }) => state.notification
  );
  const [isShowNotifications, setIsShowNotifications] = useState(false);

  useEffect(() => {
    if (notifications.length > 0) {
      setIsShowNotifications(false);
    }
  }, [notifications]);
  return (
    <>
      <ul className="flex items-center justify-center gap-[10px] h-full">
        <li
          className="w-10 h-10 rounded-full flex items-center justify-center bg-[#D8DADF] cursor-pointer"
          title="Menu"
        >
          <PiDotsNineBold size={28} />
        </li>
        <li
          className={cn(
            "relative w-10 h-10 rounded-full flex items-center justify-center bg-[#D8DADF] cursor-pointer",
            isOpenMessage && "bg-[#DFE9F2]"
          )}
          title="Messenger"
          onClick={(e) => {
            e.stopPropagation();
            dispatch(setIsOpenMessage(!isOpenMessage));
          }}
        >
          <FaFacebookMessenger size={20} />
        </li>
        <li
          className={cn(
            "relative w-10 h-10 rounded-full flex items-center justify-center bg-[#D8DADF] cursor-pointer",
            isOpenNotifications && "bg-[#DFE9F2]"
          )}
          title="Thông báo"
          onClick={(e) => {
            e.stopPropagation();
            dispatch(setIsOpenNotifications(!isOpenNotifications));
            setIsShowNotifications(true);
          }}
        >
          <IoNotificationsSharp
            size={22}
            className={cn(isOpenNotifications && "text-[#0861F2]")}
          />
          {notifications.length > 0 && !isShowNotifications && (
            <div className="absolute top-0 right-0 p-1 w-[20px] h-[20px] rounded-full bg-red-600">
              <span className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-[14px] text-white">
                {notifications.length}
              </span>
            </div>
          )}
        </li>
        <li className="w-10 h-10 rounded-full cursor-pointer" title="Tài khoản">
          <img
            src={anonymousAvatar}
            alt="defaultAvatar"
            className="w-full h-full object-cover"
          />
        </li>
      </ul>
    </>
  );
};

export default RightHeader;
