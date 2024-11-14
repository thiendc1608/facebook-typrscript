import { userAPI } from "@/apis/userApi";
import { Button } from "@/components/ui/button";
import {
  notificationState,
  setIsOpenNotifications,
} from "@/redux/notificationSlice";
import { UserState } from "@/redux/userSlice";
import { UserType } from "@/types";
import { formatTimeAgo } from "@/utils/helpers";
import { path } from "@/utils/path";
import { FaUser } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Socket } from "socket.io-client";

interface FriendRequestProps {
  socket: Socket;
}
const FriendRequest = ({ socket }: FriendRequestProps) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(
    (state: { user: UserState }) => state.user.currentUser
  );
  const { notifications } = useSelector(
    (state: { notification: notificationState }) => state.notification
  );

  const handleConfirmFriend = async (friend: UserType) => {
    const response = await userAPI.confirmFriend(
      {
        friend,
      },
      currentUser!.id
    );
    if (response.success) {
      socket.emit("confirm_friend_request", {
        receiver: friend,
        sender: currentUser,
      });
      dispatch(setIsOpenNotifications(false));
    }
  };
  console.log(notifications);

  return (
    <>
      {notifications.length > 0 && (
        <div className="pt-5 px-4 pb-1">
          <div className="flex items-center justify-between">
            <span className="text-[#080809] text-[17px] leading-[13px]">
              Lời mời kết bạn
            </span>
            <Button variant={"ghost"} className="hover:bg-[#E6E8EA]">
              <Link
                to={`/${path.FRIENDS}`}
                className="text-[#0064d1] text-[15px]"
              >
                Xem tất cả
              </Link>
            </Button>
          </div>
        </div>
      )}
      {notifications.length > 0 &&
        notifications.map((notification) => (
          <div key={notification?.user?.id} className="px-2 cursor-pointer">
            <div className="p-2 flex items-start gap-2 bg-gray-200 rounded-lg hover:bg-gray-300">
              <div className="w-[56px] h-[56px]">
                <div className="w-[56px] h-[56px] relative border border-solid border-[#E1E0DF] rounded-full text-start">
                  <img
                    src={notification?.user?.avatar || ""}
                    alt="anh"
                    className="w-full h-full object-cover rounded-full"
                  />
                  <div className="absolute top-[70%] right-0 bg-[#1286E4] overflow-hidden rounded-full w-[28px] h-[28px] flex items-center justify-center">
                    <FaUser size={16} color="white" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex flex-col justify-center gap-[22px]">
                  <div className="flex flex-col">
                    <span className="text-[#080809] text-[15px] line-clamp-3 text-ellipsis leading-5 break-words">
                      {notification?.message}
                    </span>
                    <span className="text-[#0604d1] text-[13px] leading-5">
                      {formatTimeAgo(notification?.timeSend)}
                    </span>
                  </div>
                  {notification?.timeSend && (
                    <div className="flex items-center gap-2">
                      <Button
                        className="flex-1 hover:bg-[#0861F2] bg-[#0866ff]"
                        onClick={() => handleConfirmFriend(notification?.user)}
                      >
                        Xác nhận
                      </Button>
                      <Button className="flex-1 bg-[#e2e5e9] hover:bg-[#D6D9DD] text-black">
                        Xoá
                      </Button>
                    </div>
                  )}
                </div>
                <div>
                  <GoDotFill color="#0861F2" size={24} />
                </div>
              </div>
            </div>
          </div>
        ))}
    </>
  );
};

export default FriendRequest;
