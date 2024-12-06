import { cn } from "@/lib/utils";
import { allMessageType, UserType } from "@/types";
import AvatarMsg from "./AvatarMsg";
import { memo, useContext, useEffect, useState } from "react";
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

interface TextMsgType {
  el: allMessageType;
  currentUser?: UserType | null;
  showAvatar?: boolean;
}

const TextMsg = ({ el, currentUser, showAvatar }: TextMsgType) => {
  const { socket } = useContext(SocketContext)!;
  const dispatch = useAppDispatch();
  const { private_chat } = useSelector(
    (state: { conversation: chattingUserType }) => state.conversation
  );
  const [seeMoreElement, setSeeMoreElement] = useState({
    isSeeMore: false,
    el: null as allMessageType | null,
  });
  const [showOptionMes, setShowOptionMes] = useState<boolean>(false);
  let positionMes = "";
  if (currentUser?.id !== el.sender_id) {
    positionMes = "left";
  } else {
    positionMes = "right";
  }

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

  return (
    <div
      className={cn(
        "flex items-end",
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
          className={cn(
            "relative max-w-[480px] rounded-2xl h-auto flex items-end flex-col",
            el.message !== "👍" && "bg-[#0866FF] px-3 py-1",
            positionMes === "left" && "bg-gray-300"
          )}
        >
          {positionMes === "right" && <ShowEmoji el={el} positionMes="right" />}
          <div
            className={cn(
              "text-[15px] text-white py-1 inline-block break-all",
              el.message === "👍" && "text-[20px]",
              positionMes === "left" && "text-black",
              el.message === "Bạn đã thu hồi một tin nhắn" &&
                "opacity-70 italic"
            )}
          >
            {el.message?.includes("đã thu hồi một tin nhắn")
              ? `${
                  currentUser?.id === el.sender_id
                    ? "Bạn đã thu hồi một tin nhắn"
                    : `${private_chat.current_conversation?.members.user.lastName} ${private_chat.current_conversation?.members.user.firstName} đã thu hồi một tin nhắn`
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
          {positionMes === "left" && <ShowEmoji el={el} positionMes="left" />}
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
  );
};

export default memo(TextMsg);
