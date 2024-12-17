import { IoIosArrowDown } from "react-icons/io";
import { GoArrowDown, GoDash } from "react-icons/go";
import { IoCloseOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import {
  removeChatting,
  setIsOpenChatting,
  setIsOpenMessage,
  tinyChattingType,
} from "@/redux/notificationSlice";
import { memo, useContext, useEffect, useRef, useState } from "react";
// import { SocketContext } from "@/context/SocketContext";
import { cn } from "@/lib/utils";
import "./Messenger.css";
import { SocketContext } from "@/context/SocketContext";
import { allMessageType, conversationType, messageType } from "@/types";
import {
  addToConventions,
  addToMessage,
  chattingUserType,
  removeCurrentConversation,
  selectRoom,
  setCurrentConversation,
  updateContentMessage,
} from "@/redux/conversationSlice";
import AllMessageType from "./ContentMessage/AllMessageType";
import { UserState } from "@/redux/userSlice";
import Form from "./Form";
import ReplyForm from "./ContentMessage/ReplyForm";
import { messageSliceType } from "@/redux/messageSlice";

interface ShowChattingProps {
  showConversation: tinyChattingType;
  index: number;
}
const ShowChatting = ({ showConversation, index }: ShowChattingProps) => {
  const dispatch = useDispatch();
  const [changeColor, setChangeColor] = useState<string>("#0866ff");
  const [shadowActiveChat, setShadowActiveChat] = useState<boolean>(false);

  const { selectImageList } = useSelector(
    (state: { message: messageSliceType }) => state.message
  );

  const scrollButton = useRef<null | HTMLDivElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { socket } = useContext(SocketContext)!;

  const { private_chat, reply_message, updateMessage } = useSelector(
    (state: { conversation: chattingUserType }) => state.conversation
  );
  const { currentUser } = useSelector(
    (state: { user: UserState }) => state.user
  );

  const listMessageOfChat = private_chat.current_messages.filter(
    (el) => el.conversation_id === showConversation.conversation?.id
  );

  useEffect(() => {
    if (socket) {
      socket.off("start_chat");
      socket.on(
        "start_chat",
        (data: { new_conversation: conversationType }) => {
          const { new_conversation } = data;
          dispatch(addToConventions({ conversation: new_conversation }));
          dispatch(selectRoom({ room_id: new_conversation.id }));
          dispatch(setCurrentConversation(new_conversation));
        }
      );

      socket?.off("new_message");
      socket?.on(
        "new_message",
        async (data: {
          message: allMessageType;
          timeMessage: messageType | null;
        }) => {
          const message = data.message;
          const timeMessage = data.timeMessage;
          if (
            private_chat.current_conversation?.id === message.conversation_id
          ) {
            dispatch(
              addToMessage({
                messages: message,
                timeMessage,
              })
            );
          }
        }
      );

      socket?.on("updated_message", (data: { message: allMessageType }) => {
        dispatch(updateContentMessage(data.message));
      });
    }
    return () => {
      socket?.off("start_chat");
      socket?.off("new_message");
      socket?.off("updated_message");
    };
  }, [socket, dispatch, private_chat]);

  useEffect(() => {
    if (divRef.current) {
      divRef.current.focus();
      formRef.current?.focus();
    }
    const handleClickOutSideInput = (event: MouseEvent) => {
      event.stopPropagation();

      // Kiểm tra nếu người dùng click ra ngoài inputElement
      if (
        event.target !== divRef.current &&
        !divRef.current?.contains(event.target as Node)
      ) {
        formRef.current?.blur(); // Mất focus
        setChangeColor("#b6b9be");
      } else {
        formRef.current?.focus(); // focus
        setChangeColor("#0866ff");
      }
    };
    document.addEventListener("click", handleClickOutSideInput);
    return () => document.removeEventListener("click", handleClickOutSideInput);
  }, []);

  // useEffect(() => {
  //   if (contentRef.current)
  //     if (selectImageList.length === 0) {
  //       if (inputRef.current!.clientHeight === 36) {
  //         contentRef.current.style.height = `${
  //           347 + 36 - inputRef.current!.clientHeight
  //         }px`;
  //       } else {
  //         const match = contentRef.current.style.height.match(/\d+/);
  //         if (match) {
  //           contentRef.current.style.height = `${Number(match[0]) - 16}px`;
  //         }
  //       }
  //     } else {
  //       if (inputRef.current!.clientHeight === 36) {
  //         contentRef.current.style.height = `${
  //           347 - 72 + 36 - inputRef.current!.clientHeight
  //         }px`;
  //       } else {
  //         const match = contentRef.current.style.height.match(/\d+/);
  //         if (match) {
  //           contentRef.current.style.height = `${Number(match[0]) - 20}px`;
  //           contentRef.current.style.maxHeight =
  //             contentRef.current.style.height;
  //         }
  //       }
  //     }
  // }, [selectImageList, inputRef.current?.clientHeight]);

  useEffect(() => {
    dispatch(setIsOpenMessage(false));
    contentRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [dispatch]);

  useEffect(() => {
    const contentElement = contentRef.current;
    scrollButton.current!.style.display = "none";
    scrollButton.current!.style.bottom = "10px";
    const handleScroll = () => {
      if (contentElement) {
        if (
          contentElement.scrollHeight -
            contentElement.scrollTop -
            contentElement.clientHeight >
          50
        ) {
          scrollButton.current!.style.display = "block";
          scrollButton.current!.style.bottom = "60px";
        } else {
          scrollButton.current!.style.display = "none";
          scrollButton.current!.style.bottom = "10px";
        }
      }
    };
    contentElement?.addEventListener("scroll", handleScroll);
    return () => {
      contentElement?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Hàm cuộn xuống cuối khi nhấn nút
  const scrollToBottom = () => {
    const container = contentRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (divRef.current) {
      divRef.current.focus();
      formRef.current?.focus();
    }
  }, [private_chat.current_conversation?.id]);

  return (
    <div
      className={cn(
        "fixed bottom-0 z-[50]",
        shadowActiveChat && "shadow-activeTinyChatting"
      )}
      style={{ right: `${index * (328 + 12) + 80}px` }}
      ref={divRef}
      onClick={() => {
        setShadowActiveChat(true);
        dispatch(setCurrentConversation(showConversation.conversation));
      }}
    >
      <div
        className="absolute left-[50%] translate-x-[-50%] bottom-0 w-[40px] h-[40px] bg-white rounded-full shadow-default z-[999]"
        ref={scrollButton}
        onClick={scrollToBottom}
      >
        <button className="w-full h-full flex items-center justify-center">
          <GoArrowDown size={20} color="#0866ff" />
        </button>
      </div>
      <div
        className="w-[328px] h-[455px] bg-white rounded-lg shadow-default"
        tabIndex={-1}
      >
        <div className="relative z-[999] p-2 h-[48px] shadow-default">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 w-auto">
              <img
                src={
                  showConversation?.conversation?.members.user.avatar ||
                  private_chat.current_conversation?.members.user.avatar
                }
                alt="anh"
                className="w-[32px] h-[32px] rounded-full object-cover"
              />
              <span className="text-[15px] text-[#080809] font-semibold">
                {showConversation?.conversation?.members.nickname ||
                  private_chat.current_conversation?.members.nickname}
              </span>
              <IoIosArrowDown
                size={20}
                color={changeColor}
                className="cursor-pointer"
              />
            </div>
            <div className="flex items-center gap-2">
              <GoDash
                size={24}
                color={changeColor}
                className="cursor-pointer"
                title="Thu nhỏ đoạn chat"
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(
                    setIsOpenChatting({
                      isOpenChatting: false,
                      isTinyChat: true,
                      conversation: showConversation.conversation,
                    })
                  );
                }}
              />
              <IoCloseOutline
                size={24}
                color={changeColor}
                title="Đóng đoạn chat"
                className="cursor-pointer"
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
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col h-full">
          <div
            ref={contentRef}
            className={cn(
              "flex-1 max-h-[347px] overflow-y-scroll",
              selectImageList.length > 0 && "max-h-[347px]"
            )}
          >
            <div className="relative z-0">
              <div className="pt-5 px-3 pb-3">
                <div className="flex flex-col items-center justify-center gap-3">
                  <img
                    src={
                      showConversation?.conversation?.members.user.avatar ||
                      private_chat.current_conversation?.members.user.avatar
                    }
                    alt="anh"
                    className="w-[60px] h-[60px] rounded-full object-cover"
                  />
                  <span className="text-[17px] text-[#080809] font-semibold">
                    {showConversation?.conversation?.members.nickname ||
                      private_chat.current_conversation?.members.nickname}
                  </span>
                </div>
              </div>
              {updateMessage.messageValue !== null &&
                updateMessage.messageValue?.conversation_id ===
                  showConversation.conversation?.id && (
                  <div className="absolute inset-0 bg-[rgba(72,72,72,0.7)] z-10"></div>
                )}
            </div>
            <AllMessageType
              currentUser={currentUser}
              listMsg={listMessageOfChat}
            />
          </div>
          {updateMessage.messageValue?.conversation_id ===
            showConversation.conversation?.id && (
            <div className="absolute bottom-0 left-0 min-h-[60px] flex w-full">
              {reply_message?.conversation_id ===
                private_chat.current_conversation?.id && (
                <ReplyForm currentUser={currentUser} isReply={true} />
              )}
              {updateMessage?.isUpdateMsg &&
                updateMessage.messageValue?.conversation_id ===
                  private_chat.current_conversation?.id && (
                  <ReplyForm currentUser={currentUser} isReply={false} />
                )}
            </div>
          )}
          <Form
            index={index}
            ref={formRef}
            changeColor={changeColor}
            showConversation={showConversation}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(ShowChatting);
