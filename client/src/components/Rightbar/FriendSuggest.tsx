import { path } from "@/utils/path";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { UserType } from "@/types";
import { userAPI } from "@/apis/userApi";
import { memo, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { UserState } from "@/redux/userSlice";
import { SocketContext } from "@/context/SocketContext";

interface FriendSuggestProps {
  friendSuggestList: UserType[];
  setFriendSuggestList: React.Dispatch<React.SetStateAction<UserType[]>>;
}
const FriendSuggest = ({
  friendSuggestList,
  setFriendSuggestList,
}: // friendRequestList,
FriendSuggestProps) => {
  const { socket } = useContext(SocketContext);
  const [friendRequests, setFriendRequests] = useState<UserType[]>([]);
  const currentUser = useSelector(
    (state: { user: UserState }) => state.user.currentUser
  );
  const [isAddFriend, setIsAddFriend] = useState(true);

  useEffect(() => {
    socket?.on("get_friend_request", (data) => {
      setFriendRequests((prevRequests) => [...prevRequests, data.sender]);
    });
    socket?.on("friendRequestConfirmed", (data) => {
      setFriendRequests((prevRequests) =>
        prevRequests.filter(
          (request) =>
            request?.id !== data.receiver?.id && request?.id !== data.sender?.id
        )
      );
      setFriendSuggestList((prevRequests) =>
        prevRequests.filter(
          (request) =>
            request?.id !== data.receiver?.id && request?.id !== data.sender?.id
        )
      );
    });
    socket?.on("friendRequestCancelled", (data) => {
      setFriendRequests((prevRequests) =>
        prevRequests.filter((request) => request === data.sender)
      );
    });
    return () => {
      socket?.off("get_friend_request");
      socket?.off("friendRequestConfirmed");
      socket?.off("friendRequestCancelled");
    };
  }, [setFriendSuggestList, socket]);

  const handleAddOrRemoveFriend = async (friend: UserType) => {
    const response = await userAPI.addAndRemoveFriend(
      {
        friend,
      },
      currentUser!.id
    );

    if (response.success) {
      if (response.message.includes("Remove friend request")) {
        setIsAddFriend(true);
        socket?.emit("cancel_friend_request", {
          receiver: friend,
          sender: currentUser,
        });
      } else {
        socket?.emit("send_friend_request", {
          receiver: friend,
          sender: currentUser,
          timeSend: new Date(),
        });
        setIsAddFriend(false);
      }
    }
  };

  const handleConfirmFriend = async (friend: UserType) => {
    const response = await userAPI.confirmFriend(
      {
        friend,
      },
      currentUser!.id
    );
    if (response.success) {
      socket?.emit("confirm_friend_request", {
        receiver: friend,
        sender: currentUser,
      });
    }
  };

  return (
    <div className="pt-2 pr-2 flex flex-col">
      {friendSuggestList?.length > 0 && (
        <div className="pl-2 pt-2 pb-1 flex items-center justify-between leading-[21px]">
          <span className="text-[17px] text-[#65686c]">Gợi ý kết bạn</span>
          <Button variant={"ghost"} className="hover:bg-[#E6E8EA]">
            <Link
              to={`/${path.FRIENDS}`}
              className="text-[#0064d1] text-[15px]"
            >
              Xem tất cả
            </Link>
          </Button>
        </div>
      )}

      {friendSuggestList?.length > 0 &&
        friendSuggestList
          .map(
            (user) =>
              friendRequests.find((item) => item?.id === user?.id) || user
          )
          .map((user) => (
            <Link
              key={user.id}
              to="/"
              className="p-2 flex items-center gap-3 hover:bg-[#E6E8EA] rounded-lg"
            >
              <>
                <div className="w-[60px] h-[60px]">
                  <img
                    src={user.avatar || ""}
                    alt="anh"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-[15px] text-[#080809]">{`${user.lastName} ${user.firstName}`}</span>
                  <div className="flex items-center gap-2">
                    {friendRequests.includes(user) ? (
                      <>
                        <Button
                          className="flex-1 hover:bg-[#0861F2] bg-[#0866ff]"
                          onClick={() => handleConfirmFriend(user)}
                        >
                          Xác nhận
                        </Button>
                        <Button className="flex-1 bg-[#e2e5e9] hover:bg-[#D6D9DD] text-black">
                          Từ chối
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          className="flex-1 hover:bg-[#0861F2] bg-[#0866ff]"
                          onClick={() => handleAddOrRemoveFriend(user)}
                        >
                          {isAddFriend ? "Thêm bạn bè" : "Huỷ lời mời"}
                        </Button>
                        <Button className="flex-1 bg-[#e2e5e9] hover:bg-[#D6D9DD] text-black">
                          Xoá
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </>
            </Link>
          ))}
    </div>
  );
};

export default memo(FriendSuggest);
