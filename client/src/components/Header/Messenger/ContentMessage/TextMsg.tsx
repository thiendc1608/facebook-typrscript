import { cn } from "@/lib/utils";
import { allMessageType, UserType } from "@/types";
import AvatarMsg from "./AvatarMsg";
import { memo } from "react";
import { format } from "date-fns";

interface TextMsgType {
  el: allMessageType;
  currentUser?: UserType | null;
  showAvatar?: boolean;
}

const TextMsg = ({ el, currentUser, showAvatar }: TextMsgType) => {
  let positionMes = "";
  if (currentUser?.id !== el.sender_id) {
    positionMes = "left";
  } else {
    positionMes = "right";
  }

  return (
    <div
      className={cn(
        "flex items-end",
        currentUser?.id === el.sender_id
          ? `justify-end ${showAvatar ? "pr-[14px]" : "pr-[50px]"}`
          : `justify-start ${showAvatar ? "pl-[14px]" : "pl-[50px]"}`
      )}
    >
      {positionMes === "right" && (
        <div className="flex-1 min-w-[33%] max-w-full"></div>
      )}
      {positionMes === "left" && showAvatar && (
        <AvatarMsg el={el} currentUser={currentUser} />
      )}
      <div
        className={cn(
          "relative max-w-[480px] rounded-2xl h-auto flex items-end flex-col",
          el.message !== "👍" && "bg-[#0866FF] px-3",
          positionMes === "left" && "bg-gray-300"
        )}
      >
        <div
          className={cn(
            "text-[15px] text-white py-1 inline-block break-all",
            el.message === "👍" && "text-[20px]",
            positionMes === "left" && "text-black"
          )}
        >
          {el.message}
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
          {showAvatar && (
            <div>{`${el.senderInfo.lastName} ${el.senderInfo.firstName}`}</div>
          )}
          {positionMes === "left" && (
            <div className="text-[11px] text-gray-600">
              {format(new Date(el.send_at), "HH:mm a")}
            </div>
          )}
        </div>
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
