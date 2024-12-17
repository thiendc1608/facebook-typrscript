import { removeCurrentConversation } from "@/redux/conversationSlice";
import {
  removeChatting,
  setIsOpenChatting,
  tinyChattingType,
} from "@/redux/notificationSlice";
import { IoIosClose } from "react-icons/io";
import { useDispatch } from "react-redux";

interface ShowTinyChatProps {
  showConversation: tinyChattingType;
  index: number;
}

const ShowTinyChat = ({ showConversation, index }: ShowTinyChatProps) => {
  const dispatch = useDispatch();

  return (
    <>
      <div
        className="fixed right-5 group"
        style={{ bottom: `${index * (40 + 20) + 40}px` }}
      >
        <div
          className="relative w-[48px] h-[48px] rounded-full cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            dispatch(
              setIsOpenChatting({
                isOpenChatting: true,
                isTinyChat: false,
                conversation: showConversation.conversation,
              })
            );
          }}
        >
          <img
            src={showConversation.conversation?.members.user.avatar}
            alt="anh"
            className="w-full h-full rounded-full object-cover"
          />
          <div
            className="absolute top-[-4px] right-[-5px] invisible w-5 h-5 none rounded-full bg-white shadow-default flex items-center justify-center transition-all duration-100 group-hover:scale-125 cursor-pointer group-hover:visible"
            onClick={(e) => {
              e.stopPropagation();
              dispatch(
                removeChatting({
                  conversation: showConversation.conversation,
                })
              );
              dispatch(
                removeCurrentConversation(showConversation.conversation)
              );
            }}
          >
            <IoIosClose size={20} color="#999ca0" />
          </div>
        </div>
      </div>
    </>
  );
};

export default ShowTinyChat;
