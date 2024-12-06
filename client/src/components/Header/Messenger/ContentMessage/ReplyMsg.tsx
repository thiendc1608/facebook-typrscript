import { cn } from "@/lib/utils";
import { allMessageType, UserType } from "@/types";
import { TiArrowBack, TiArrowForward } from "react-icons/ti";
import AvatarMsg from "./AvatarMsg";
import MediaMsg from "./MediaMsg";
import OptionMessage from "./OptionMessage";
import ShowEmoji from "./ShowEmoji";

interface ReplyMsgType {
  el: allMessageType;
  currentUser?: UserType | null;
  showAvatar?: boolean;
}
const ReplyMsg = ({ el, currentUser, showAvatar }: ReplyMsgType) => {
  let positionMes = "";
  if (currentUser?.id !== el.sender_id) {
    positionMes = "left";
  } else {
    positionMes = "right";
  }

  return (
    <div
      className={cn(
        "flex flex-col",
        currentUser?.id === el.sender_id
          ? `justify-end ${showAvatar ? "pr-[14px]" : "pr-[50px]"}`
          : `justify-start ${showAvatar ? "pl-[14px]" : "pl-[50px]"}`
      )}
    >
      {positionMes === "right" && (
        <div className="flex items-center">
          <div className="flex-1 min-w-[33%] max-w-full"></div>
          <div className="flex items-center gap-1 pr-[50px] whitespace-nowrap">
            <TiArrowBack size={20} />
            <div className="text-[#65686c] text-[12px]">
              {`Bạn đã trả lời ${
                currentUser?.id === el?.info_reply?.sender_id
                  ? "chính mình"
                  : `${el.info_reply?.senderInfo.lastName} ${el.info_reply?.senderInfo.firstName}`
              }`}
            </div>
          </div>
        </div>
      )}
      {positionMes === "left" && (
        <div className="flex items-center">
          <div className="flex items-center gap-1 pl-[50px] whitespace-nowrap">
            <div className="text-[#65686c] text-[12px]">
              {` ${
                currentUser?.id !== el?.info_reply?.sender_id
                  ? `${el?.info_reply?.senderInfo.lastName} ${el?.info_reply?.senderInfo.firstName} đã tự trả lời tin nhắn`
                  : `${el?.info_reply?.senderInfo.lastName} ${el?.info_reply?.senderInfo.firstName} đã trả lời tin nhắn của bạn`
              }`}
            </div>
            <TiArrowForward size={20} />
          </div>
          <div className="flex-1 min-w-[33%] max-w-full"></div>
        </div>
      )}

      <div className="flex items-end">
        {positionMes === "right" && (
          <div className="flex-1 min-w-[33%] max-w-full"></div>
        )}
        {positionMes === "left" && showAvatar && (
          <AvatarMsg el={el} currentUser={currentUser} />
        )}
        <div className="py-2 px-3 rounded-2xl bg-white cursor-pointer w-auto">
          {el.image_id ? (
            <div className="flex flex-col">
              <div
                className={cn(
                  "w-auto",
                  positionMes === "left" ? "text-left" : "text-right"
                )}
              >
                <span
                  className={cn(
                    "text-[#65686c] text-[13px] inline-block py-1 px-3 rounded-lg bg-[#f7f7f7]",
                    el.info_reply?.message.includes(
                      "đã thu hồi một tin nhắn"
                    ) && "italic"
                  )}
                >
                  {el.info_reply?.message.includes("đã thu hồi một tin nhắn")
                    ? "Đã gỡ tin nhắn"
                    : el.info_reply?.message}
                </span>
              </div>
              <MediaMsg
                el={el}
                currentUser={currentUser}
                showAvatar={false}
                isReply={true}
              />
            </div>
          ) : (
            <div className="flex items-center">
              <div className="flex items-center gap-2 w-auto">
                {positionMes === "right" && (
                  <OptionMessage
                    positionMes="right"
                    el={el}
                    currentUser={currentUser ?? null}
                  />
                )}
                <div
                  className={cn(
                    "relative py-1 px-3 rounded-2xl ",
                    positionMes === "right"
                      ? "bg-[#0866ff] text-white"
                      : "bg-[#d1d5db] text-black"
                  )}
                >
                  <div className="my-1 text-[15px]">{el.message}</div>
                  {positionMes === "right" && (
                    <ShowEmoji el={el} positionMes="right" />
                  )}
                  {positionMes === "left" && (
                    <ShowEmoji el={el} positionMes="left" />
                  )}
                </div>
                {positionMes === "left" && (
                  <OptionMessage
                    positionMes="left"
                    el={el}
                    currentUser={currentUser ?? null}
                  />
                )}
              </div>
            </div>
          )}
        </div>
        {positionMes === "right" && showAvatar && (
          <AvatarMsg el={el} currentUser={currentUser} />
        )}
        {positionMes === "left" && (
          <div className="flex-1 min-w-[33%] max-w-full"></div>
        )}
      </div>
    </div>
  );
};

export default ReplyMsg;
