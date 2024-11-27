import { SocketContext } from "@/context/SocketContext";
import { setIsOpenChatting, setIsOpenMessage } from "@/redux/notificationSlice";
import { UserType } from "@/types";
import { memo, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UserState } from "@/redux/userSlice";
// import { conversationAPI } from "@/apis/conversationApi";

interface ShowSearchUserProps {
  searchList: UserType[];
  query: string;
  setIsFocusSearch: React.Dispatch<React.SetStateAction<boolean>>;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}

const ShowSearchUser = ({
  searchList,
  query,
  setIsFocusSearch,
  setQuery,
}: ShowSearchUserProps) => {
  const { socket } = useContext(SocketContext);
  const dispatch = useDispatch();
  const { currentUser } = useSelector(
    (state: { user: UserState }) => state.user
  );

  const handleOnClickUser = (
    e: React.MouseEvent<HTMLDivElement>,
    user: UserType
  ) => {
    e.stopPropagation();
    dispatch(setIsOpenMessage(false));
    dispatch(setIsOpenChatting(true));
    setIsFocusSearch(false);
    setQuery("");

    socket?.emit("start_conversation", {
      sender_id: currentUser?.id,
      receiver_id: user.id,
      conversation_name: null,
      type_conversation: "private",
      group_image: null,
    });
  };

  return (
    <>
      {searchList.length > 0 ? (
        searchList.map((user) => (
          <div
            key={user.id}
            className="absolute top-[90px] h-[calc(100vh-80px-110px)] right-[-6px] left-0 rounded-lg overflow-y-auto py-[6px] bg-white"
          >
            <div
              className="flex items-center gap-2 hover:bg-[#F2F2F2] rounded-lg cursor-pointer py-2 px-2"
              onClick={(e) => handleOnClickUser(e, user)}
            >
              <img
                src={user.avatar || ""}
                alt="anh"
                className="w-[36px] h-[36px] object-cover rounded-full"
              />
              <span className="text-[#080809] text-[15px]">{`${user.lastName} ${user.firstName}`}</span>
            </div>
          </div>
        ))
      ) : (
        <div className="absolute top-[100px] right-2 left-2 bg-white rounded-lg overflow-y-auto py-[6px]">
          <div className="p-3 text-center flex flex-col gap-2">
            <span className="text-[#080809] text-[17px]">
              Không tìm thấy kết quả
            </span>
            <span className="text-[#65686c] text-[15px]">
              {`Chúng tôi không tìm được kết quả nào cho "${query}"`}.
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default memo(ShowSearchUser);
