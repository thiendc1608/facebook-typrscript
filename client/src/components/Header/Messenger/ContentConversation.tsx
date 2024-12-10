import { useContext, useEffect, useRef } from "react";
import { MdInfo } from "react-icons/md";
import { useSelector } from "react-redux";
import {
  addToMessage,
  chattingUserType,
  fetchAllMessage,
  removeMessage,
  removeTempMessage,
  setShowContact,
} from "@/redux/conversationSlice";
import { useAppDispatch } from "@/redux/store";
import { SocketContext } from "@/context/SocketContext";
import { allMessageType, messageType } from "@/types";
import Form from "./Form";
import Timeline from "./ContentMessage/Timeline";
import MediaMsg from "./ContentMessage/MediaMsg";
import TextMsg from "./ContentMessage/TextMsg";
import { GoArrowDown } from "react-icons/go";
import { UserState } from "@/redux/userSlice";
import ReplyForm from "./ContentMessage/ReplyForm";
import ReplyMsg from "./ContentMessage/ReplyMsg";
import { cn } from "@/lib/utils";
import { messageSliceType } from "@/redux/messageSlice";
import { TiMessages } from "react-icons/ti";

const ContentConversation = () => {
  const dispatch = useAppDispatch();
  const { socket } = useContext(SocketContext);

  const { room_id, private_chat, reply_message, isShowContact, updateMessage } =
    useSelector(
      (state: { conversation: chattingUserType }) => state.conversation
    );
  const contentRef = useRef<null | HTMLDivElement>(null);
  const scrollButton = useRef<null | HTMLDivElement>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const { currentUser } = useSelector(
    (state: { user: UserState }) => state.user
  );
  const { themeMessage } = useSelector(
    (state: { message: messageSliceType }) => state.message
  );

  useEffect(() => {
    if (room_id != "") {
      dispatch(fetchAllMessage({ conversation_id: room_id }));
    }
  }, [room_id, dispatch]);

  useEffect(() => {
    socket?.off("new_message");

    socket?.on(
      "new_message",
      async (data: {
        message: allMessageType;
        timeMessage: messageType | null;
      }) => {
        const message = data.message;
        const timeMessage = data.timeMessage;
        if (private_chat.current_conversation?.id === message.conversation_id) {
          dispatch(
            addToMessage({
              messages: message,
              timeMessage,
            })
          );
        }
      }
    );

    socket?.on(
      "update_remove_message",
      async (data: { message: allMessageType[] | string[] }) => {
        const message = data.message;
        if (
          message.every((item) => typeof item === "object" && item !== null)
        ) {
          dispatch(
            removeTempMessage({
              messages: message,
            })
          );
        } else {
          dispatch(
            removeMessage({
              messages: message,
            })
          );
        }
      }
    );
    return () => {
      socket?.off("new_message");
      socket?.off("update_remove_message");
    };
  }, [socket, dispatch, private_chat]);

  useEffect(() => {
    // Scroll to the bottom of the message list when new messages are added
    const timer = setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [private_chat.current_messages]);

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
          100
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

  return (
    <div
      className={cn(
        "sticky top-0 w-[66.67%] flex flex-col justify-start h-full z-0",
        !isShowContact && "w-full"
      )}
    >
      <div className="relative z-[999]">
        <div className="w-full h-[64px] shadow-headerContent">
          <div className="px4 py-3">
            <div className="px-[6px]">
              <div className="flex items-center justify-between">
                {private_chat.conversations && (
                  <div className="flex items-center gap-2">
                    <img
                      src={
                        private_chat.conversations[0]?.group_image ||
                        private_chat.conversations[0]?.members?.user?.avatar
                      }
                      alt="anh"
                      className="w-[40px] h-[40px] object-cover rounded-full"
                    />
                    <span className="text-[#080809] text-[16px] font-bold">
                      {`${
                        private_chat.conversations[0]?.conversation_name ||
                        private_chat.conversations[0]?.members?.nickname
                      }`.trim()}
                    </span>
                  </div>
                )}
                <div
                  className="w-[36px] h-[36px] rounded-full hover:bg-[#f2f2f2] flex items-center justify-center cursor-pointer"
                  onClick={() => dispatch(setShowContact(!isShowContact))}
                >
                  <MdInfo size={24} color={`${themeMessage}`} />
                </div>
              </div>
            </div>
          </div>
        </div>
        {updateMessage.messageValue !== null && (
          <div className="absolute inset-0 bg-[rgba(72,72,72,0.7)] z-10"></div>
        )}
      </div>
      <div
        className="w-full h-[calc(100vh-64px-60px-56px)] overflow-y-auto"
        ref={contentRef}
      >
        {private_chat.conversations ? (
          <div className="relative z-0">
            <div className="pt-5 px-3 pb-3">
              <div className="flex flex-col items-center justify-center gap-3">
                <img
                  src={
                    private_chat.conversations[0]?.group_image ||
                    private_chat.conversations[0]?.members?.user?.avatar
                  }
                  alt="anh"
                  className="w-[60px] h-[60px] rounded-full object-cover"
                />
                <span className="text-[17px] text-[#080809] font-semibold">
                  {`${
                    private_chat.conversations[0]?.conversation_name ||
                    private_chat.conversations[0]?.members?.nickname
                  }`.trim()}
                </span>
              </div>
            </div>
            {updateMessage.messageValue !== null && (
              <div className="absolute inset-0 bg-[rgba(72,72,72,0.7)] z-10"></div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <span className="text-[20px] text-[#080809] font-semibold">{`Xin chào 👋 ${
              currentUser?.lastName + " " + currentUser?.firstName
            } 🎉`}</span>
            <span className="text-[17px] text-[#080809]">
              Hãy lựa chọn 1 cuộc hội thoại để bắt đầu nhắn tin
            </span>
            <span>
              <TiMessages size={40} color={`${themeMessage}`} />
            </span>
          </div>
        )}
        <div className="flex flex-col gap-4">
          {private_chat.current_messages?.map((el, index: number) => {
            const nextMessage = private_chat.current_messages[index + 1];
            const showAvatar =
              nextMessage?.sender_id !== el.sender_id || !nextMessage;
            switch (el.type_msg) {
              case "divider":
                return (
                  // Timeline
                  <Timeline el={el.send_at} />
                );

              case "msg":
                switch (el.sub_type) {
                  case "image":
                    return (
                      // Media Message
                      <MediaMsg
                        el={el}
                        currentUser={currentUser}
                        showAvatar={showAvatar}
                      />
                    );

                  // case "doc":
                  //   return (
                  //     // Doc Message
                  //     <DocMsg el={el} menu={menu} />
                  //   );
                  // case "Link":
                  //   return (
                  //     //  Link Message
                  //     <LinkMsg el={el} menu={menu} />
                  //   );

                  case "reply":
                    return (
                      //  ReplyMessage
                      <ReplyMsg
                        el={el}
                        currentUser={currentUser}
                        showAvatar={showAvatar}
                      />
                    );

                  default:
                    return (
                      // Text Message
                      <TextMsg
                        el={el}
                        currentUser={currentUser}
                        showAvatar={showAvatar}
                        loadingGetAllMsg={private_chat.loadingGetAllMsg}
                      />
                    );
                }

              default:
                return <></>;
            }
          })}
          <div ref={messagesEndRef} />{" "}
          {/* Phần tử này giúp chúng ta cuộn đến cuối */}
        </div>
      </div>
      <div
        className="absolute left-[50%] translate-x-[-50%] bottom-[10px] w-[40px] h-[40px] bg-white rounded-full shadow-default z-[999]"
        ref={scrollButton}
        onClick={scrollToBottom}
      >
        <button className="w-full h-full flex items-center justify-center">
          <GoArrowDown size={20} color="#0866ff" />
        </button>
      </div>
      {private_chat.conversations && (
        <div className="sticky bottom-0 left-0 min-h-[60px] flex w-full">
          {reply_message?.conversation_id ===
            private_chat.current_conversation?.id && (
            <ReplyForm currentUser={currentUser} isReply={true} />
          )}
          {updateMessage?.isUpdateMsg && (
            <ReplyForm currentUser={currentUser} isReply={false} />
          )}
          <Form />
        </div>
      )}
    </div>
  );
};

export default ContentConversation;
