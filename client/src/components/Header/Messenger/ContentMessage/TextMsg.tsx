import { cn } from "@/lib/utils";
import { allMessageType, UserType } from "@/types";
import AvatarMsg from "./AvatarMsg";
import { memo, useContext, useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import {
  chattingUserType,
  getAllUserReactMessage,
} from "@/redux/conversationSlice";
import { IReactMessage } from "@/apis/emojiApi";
import { useAppDispatch } from "@/redux/store";
import { SocketContext } from "@/context/SocketContext";
import OptionMessage from "./OptionMessage";
import ShowEmoji from "./ShowEmoji";
import { useSelector } from "react-redux";
import { BsThreeDotsVertical } from "react-icons/bs";
import "../Messenger.css";
import { messageSliceType } from "@/redux/messageSlice";
import MessageSkeleton from "@/components/Skeleton/MessageSkeleton";

interface TextMsgType {
  el: allMessageType;
  currentUser?: UserType | null;
  showAvatar?: boolean;
  loadingGetAllMsg: boolean;
}

const TextMsg = ({
  el,
  currentUser,
  showAvatar,
  loadingGetAllMsg,
}: TextMsgType) => {
  const { socket } = useContext(SocketContext)!;
  const dispatch = useAppDispatch();
  const { private_chat } = useSelector(
    (state: { conversation: chattingUserType }) => state.conversation
  );
  const [seeMoreElement, setSeeMoreElement] = useState({
    isSeeMore: false,
    el: null as allMessageType | null,
  });
  const { updateMessage, searchMessage } = useSelector(
    (state: { conversation: chattingUserType }) => state.conversation
  );
  const { themeMessage, changeEmojiMessage } = useSelector(
    (state: { message: messageSliceType }) => state.message
  );
  const [showOptionMes, setShowOptionMes] = useState<boolean>(false);
  let positionMes = "";
  if (currentUser?.id !== el.sender_id) {
    positionMes = "left";
  } else {
    positionMes = "right";
  }
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!socket) return;

    // Hủy sự kiện cũ trước khi đăng ký mới
    socket.off("new_react_message");

    // Đăng ký sự kiện mới
    const handleReactMessage = async (
      data: { data: IReactMessage } & {
        filteredReactionData: { message: string };
      }
    ) => {
      const { message_id } = data.data;

      if (
        data.filteredReactionData.message ===
          "Create react message successfully" ||
        data.filteredReactionData.message ===
          "Update react message successfully" ||
        data.filteredReactionData.message ===
          "Delete react message successfully"
      ) {
        dispatch(getAllUserReactMessage(message_id));
      }
    };

    socket.on("new_react_message", handleReactMessage);

    return () => {
      socket?.off("new_react_message", handleReactMessage);
    };
  }, [socket, dispatch, el]);

  const handleRemoveMes = (el: allMessageType) => {
    socket?.emit("remove_message", {
      receiver_id: private_chat.current_conversation?.members?.user?.id,
      el,
    });
  };

  useEffect(() => {
    const handleCloseSeeMore = (e: Event) => {
      const closeSeeMore = document.getElementById("see-more");
      if (e.target instanceof Node && !closeSeeMore?.contains(e.target))
        setSeeMoreElement({
          isSeeMore: false,
          el: null,
        });
    };
    document.addEventListener("click", handleCloseSeeMore);
    return () => document.removeEventListener("click", handleCloseSeeMore);
  }, []);

  useEffect(() => {
    if (el.id === searchMessage?.id) {
      messageRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      messageRef.current?.scrollTo(0, 0); // Scroll lên 50px
      setTimeout(() => {
        messageRef.current?.classList.add("zoomInOut"); // Thêm animation
      }, 100);
    }
  }, [searchMessage, el]);

  return (
    <div className="relative z-0">
      {loadingGetAllMsg && <MessageSkeleton count_message={3} />}
      {!loadingGetAllMsg && (
        <div
          className={cn(
            "flex items-end pb-2 pt-4",
            currentUser?.id === el.sender_id
              ? `justify-end ${showAvatar ? "pr-[14px]" : "pr-[50px]"}`
              : `justify-start ${showAvatar ? "pl-[14px]" : "pl-[50px]"}`
          )}
          // onMouseEnter={() => {
          //   setShowOptionMes(true);
          // }}
          // onMouseLeave={() => {
          //   setShowOptionMes(false);
          // }}
        >
          {positionMes === "right" && (
            <div className="flex-1 min-w-[33%] max-w-full"></div>
          )}
          {positionMes === "left" && showAvatar && (
            <AvatarMsg el={el} currentUser={currentUser} />
          )}
          <div className="flex items-center gap-2">
            {positionMes === "right" &&
              (el.message?.includes("đã thu hồi một tin nhắn") ? (
                <div
                  id="see-more"
                  className="relative w-7 h-7 rounded-full flex items-center justify-center cursor-pointer hover:bg-[#f2f2f2] text-[#606366]"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSeeMoreElement({
                      ...seeMoreElement,
                      isSeeMore: !seeMoreElement.isSeeMore,
                      el,
                    });
                  }}
                >
                  <BsThreeDotsVertical size={18} />
                  {seeMoreElement.isSeeMore && (
                    <div className="absolute bottom-[calc(100%+5px)] right-0 bg-white shadow-default rounded-md">
                      <ul className="w-[80px]">
                        <li
                          className="py-3 px-2 hover:bg-[#f2f2f2] rounded-lg text-center"
                          onClick={() => handleRemoveMes(el)}
                        >
                          <span className="text-[#080809] text-[15px] font-semibold">
                            Gỡ
                          </span>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <OptionMessage
                  positionMes="right"
                  el={el}
                  currentUser={currentUser ?? null}
                />
              ))}
            <div
              ref={messageRef}
              className={`${
                el.id === searchMessage?.id &&
                "border-[2px] border-black rounded-2xl p-[3px]"
              }`}
            >
              <div
                style={{
                  backgroundColor:
                    el.message !==
                      (!isNaN(
                        parseInt(`0x${changeEmojiMessage.emojiValue}`, 16)
                      ) &&
                        String?.fromCodePoint(
                          parseInt(`0x${changeEmojiMessage.emojiValue}`, 16)
                        )) && el.message !== String.fromCodePoint(0x1f44d)
                      ? positionMes === "left"
                        ? "gray"
                        : themeMessage
                      : "transparent",
                }}
                className={cn(
                  "relative max-w-[480px] rounded-xl h-auto flex items-end flex-col",
                  el.message !==
                    (!isNaN(
                      parseInt(`0x${changeEmojiMessage.emojiValue}`, 16)
                    ) &&
                      String?.fromCodePoint(
                        parseInt(`0x${changeEmojiMessage.emojiValue}`, 16)
                      )) &&
                    el.message !== "👍" &&
                    "px-3 py-1"
                )}
              >
                {positionMes === "right" && (
                  <ShowEmoji el={el} positionMes="right" />
                )}
                <div
                  className={cn(
                    "text-[15px] text-white py-1 inline-block break-all",
                    el.message ===
                      (!isNaN(
                        parseInt(`0x${changeEmojiMessage.emojiValue}`, 16)
                      ) &&
                        String?.fromCodePoint(
                          parseInt(`0x${changeEmojiMessage.emojiValue}`, 16)
                        )) &&
                      el.message === "👍" &&
                      "text-[20px]",
                    positionMes === "left" && "text-black",
                    el.message === "Bạn đã thu hồi một tin nhắn" &&
                      "opacity-70 italic"
                  )}
                >
                  {el.message?.includes("đã thu hồi một tin nhắn")
                    ? `${
                        currentUser?.id === el.sender_id
                          ? "Bạn đã thu hồi một tin nhắn"
                          : `${private_chat.current_conversation?.members.nickname} đã thu hồi một tin nhắn`
                      }`
                    : el.message}
                </div>

                <div
                  className={cn(
                    "absolute top-[-15px] right-0 w-auto whitespace-nowrap flex gap-2",
                    positionMes === "left" && "left-0"
                  )}
                >
                  {positionMes === "right" && (
                    <div className="text-[11px] text-gray-600">
                      {format(new Date(el.send_at), "HH:mm a")}
                    </div>
                  )}
                  {positionMes === "left" && (
                    <div className="text-[11px] text-gray-600">
                      {format(new Date(el.send_at), "HH:mm a")}
                    </div>
                  )}
                </div>
                {positionMes === "left" && (
                  <ShowEmoji el={el} positionMes="left" />
                )}
              </div>
            </div>
            {positionMes === "left" &&
            el.message?.includes("đã thu hồi một tin nhắn") ? (
              <>
                <div
                  id="see-more"
                  className="relative w-7 h-7 rounded-full flex items-center justify-center cursor-pointer hover:bg-[#f2f2f2] text-[#606366]"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSeeMoreElement({
                      ...seeMoreElement,
                      isSeeMore: !seeMoreElement.isSeeMore,
                      el,
                    });
                  }}
                >
                  <BsThreeDotsVertical size={18} />
                  {seeMoreElement.isSeeMore && (
                    <div className="absolute bottom-[calc(100%+5px)] left-0 bg-white shadow-default rounded-md">
                      <ul className="w-[80px]">
                        <li
                          className="py-3 px-2 hover:bg-[#f2f2f2] rounded-lg text-center"
                          onClick={() => handleRemoveMes(el)}
                        >
                          <span className="text-[#080809] text-[15px] font-semibold">
                            Gỡ
                          </span>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </>
            ) : (
              positionMes === "left" && (
                <OptionMessage
                  positionMes="left"
                  el={el}
                  currentUser={currentUser ?? null}
                />
              )
            )}
          </div>
          {positionMes === "left" && (
            <div className="flex-1 min-w-[33%] max-w-full"></div>
          )}
          {positionMes === "right" && showAvatar && (
            <AvatarMsg el={el} currentUser={currentUser} />
          )}
        </div>
      )}

      {updateMessage.messageValue !== null &&
        el.id !== updateMessage.messageValue?.id && (
          <div className="absolute inset-0 bg-[rgba(72,72,72,0.7)] z-10"></div>
        )}
    </div>
  );
};

export default memo(TextMsg);
