import { chattingUserType, setReplyMsg } from "@/redux/conversationSlice";
import { UserState } from "@/redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { IoIosClose } from "react-icons/io";

const ReplyMessage = () => {
  const dispatch = useDispatch();
  const { reply_message } = useSelector(
    (state: { conversation: chattingUserType }) => state.conversation
  );
  const { currentUser } = useSelector(
    (state: { user: UserState }) => state.user
  );
  return (
    <div className="absolute bottom-[100%] left-0 w-full h-[46.69px] z-[999] bg-white">
      <div className="pt-[10px] px-[15px] pb-[3px] border-t border-[#d0d3d7] h-full flex items-center justify-between">
        <div className="flex flex-col gap-1 w-[90%]">
          <span className="text-[#080809] text-[15px] font-semibold">
            {`Đang trả lời ${
              currentUser?.id === reply_message?.sender_id
                ? "chính mình"
                : `${reply_message?.senderInfo.lastName} ${reply_message?.senderInfo.firstName}`
            }`}
          </span>
          <span className="text-[#65686c] text-[13px] line-clamp-1 text-ellipsis whitespace-nowrap">
            {reply_message?.message}
          </span>
        </div>
        <div className="w-[28px] h-[28px] rounded-full hover:bg-[#f2f2f2] flex items-center justify-center cursor-pointer">
          <IoIosClose size={22} onClick={() => dispatch(setReplyMsg(null))} />
        </div>
      </div>
    </div>
  );
};

export default ReplyMessage;
