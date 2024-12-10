import { cn } from "@/lib/utils";
import { allMessageType, UserType } from "@/types";
import AvatarMsg from "./AvatarMsg";
import { format } from "date-fns";
import OptionMessage from "./OptionMessage";
import ShowEmoji from "./ShowEmoji";
import { useSelector } from "react-redux";
import { chattingUserType } from "@/redux/conversationSlice";

interface MediaMsgType {
  el: allMessageType;
  currentUser?: UserType | null;
  showAvatar?: boolean;
  isReply?: boolean;
}

const MediaMsg = ({ el, currentUser, showAvatar, isReply }: MediaMsgType) => {
  let parsedMessage: string[] | null | undefined = null;
  if (typeof el.imageInfo?.message_image === "string") {
    parsedMessage = JSON.parse(el.imageInfo.message_image);
  } else {
    parsedMessage = el?.imageInfo?.message_image;
  }

  let positionMes = "";
  if (currentUser?.id !== el.sender_id) {
    positionMes = "left";
  } else {
    positionMes = "right";
  }

  const { updateMessage } = useSelector(
    (state: { conversation: chattingUserType }) => state.conversation
  );

  return (
    <div className="relative z-0">
      <div
        className={cn(
          "flex items-end",
          currentUser?.id === el.sender_id
            ? `justify-end ${showAvatar ? "pr-[14px]" : "pr-[50px]"}`
            : `justify-start ${showAvatar ? "pl-[14px]" : "pl-[50px]"}`,
          isReply && "px-0"
        )}
      >
        {parsedMessage?.length === 1 && (
          <>
            {positionMes === "left" && showAvatar && (
              <AvatarMsg el={el} currentUser={currentUser} />
            )}
            <div className="flex items-center justify-center gap-2">
              {positionMes === "right" && (
                <OptionMessage
                  positionMes="right"
                  el={el}
                  currentUser={currentUser ?? null}
                />
              )}
              <div
                className={cn(
                  "relative rounded-2xl max-h-[300px] max-w-[480px] shadow-bgContent",
                  el.message &&
                    "flex flex-col justify-start gap-2 shadow-default rounded-2xl bg-[#0866FF]"
                )}
              >
                <div className="h-auto overflow-hidden">
                  {parsedMessage?.map((item, index) => (
                    <img
                      loading="lazy"
                      alt="anh"
                      key={index}
                      src={item}
                      className="w-full h-full max-h-[300px] object-cover rounded-2xl cursor-pointer hover:opacity-90 duration-300"
                    />
                  ))}
                </div>
                {el.message && (
                  <div className="text-[13px] text-white px-2 pb-2 break-words">
                    {el.message}
                  </div>
                )}

                <div
                  className={cn(
                    "absolute top-[-16px] right-0 text-[11px] text-black flex w-auto whitespace-nowrap gap-2",
                    positionMes === "left" && "left-0"
                  )}
                >
                  {!isReply && positionMes === "right" && (
                    <div className="text-[11px] text-gray-600">
                      {format(new Date(el.send_at), "HH:mm a")}
                    </div>
                  )}
                  {!isReply && positionMes === "left" && (
                    <div className="text-[11px] text-gray-600">
                      {format(new Date(el.send_at), "HH:mm a")}
                    </div>
                  )}
                </div>
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
            {positionMes === "right" && showAvatar && (
              <AvatarMsg el={el} currentUser={currentUser} />
            )}
          </>
        )}

        {parsedMessage?.length === 2 && (
          <>
            {positionMes === "left" && showAvatar && (
              <AvatarMsg el={el} currentUser={currentUser} />
            )}
            <div className="flex items-center gap-2">
              {positionMes === "right" && (
                <OptionMessage
                  positionMes="right"
                  el={el}
                  currentUser={currentUser ?? null}
                />
              )}
              <div
                className={cn(
                  "relative rounded-2xl max-h-[300px] max-w-[384px] shadow-bgContent",
                  el.message &&
                    `flex flex-col justify-start gap-2 shadow-default rounded-2xl bg-[#0866FF] ${
                      positionMes === "left" && "bg-gray-100"
                    }`
                )}
              >
                <div className="w-full h-auto grid grid-cols-2 overflow-hidden gap-2">
                  {parsedMessage?.map((item, index) => (
                    <img
                      alt="anh"
                      key={index}
                      src={item}
                      className="flex-1 w-full h-full object-cover rounded-2xl cursor-pointer hover:opacity-90 duration-300"
                    />
                  ))}
                </div>
                {el.message && (
                  <div
                    className={cn(
                      "text-[13px] text-white px-2 pb-2 break-words",
                      positionMes === "left" && "text-black"
                    )}
                  >
                    {el.message}
                  </div>
                )}
                <div
                  className={cn(
                    "absolute top-[-16px] right-0 text-[11px] text-black flex w-auto whitespace-nowrap gap-2",
                    positionMes === "left" && "left-0"
                  )}
                >
                  {!isReply && positionMes === "right" && (
                    <div className="text-[11px] text-gray-600">
                      {format(new Date(el.send_at), "HH:mm a")}
                    </div>
                  )}
                  {!isReply && positionMes === "left" && (
                    <div className="text-[11px] text-gray-600">
                      {format(new Date(el.send_at), "HH:mm a")}
                    </div>
                  )}
                </div>
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
            {positionMes === "right" && showAvatar && (
              <AvatarMsg el={el} currentUser={currentUser} />
            )}
          </>
        )}
        {parsedMessage && parsedMessage?.length > 2 && (
          <>
            {positionMes === "left" && showAvatar && (
              <AvatarMsg el={el} currentUser={currentUser} />
            )}
            <div className="flex items-center gap-2">
              {positionMes === "right" && (
                <OptionMessage
                  positionMes="right"
                  el={el}
                  currentUser={currentUser ?? null}
                />
              )}
              <div
                className={cn(
                  "relative rounded-2xl max-h-[300px] max-w-[384px] shadow-bgContent",
                  el.message &&
                    "flex flex-col justify-start gap-2 shadow-default rounded-2xl bg-[#0866FF] "
                )}
              >
                <div
                  className={`w-full h-auto grid grid-cols-3 overflow-hidden gap-2 grid-rows-${Math.ceil(
                    parsedMessage.length / 3
                  )}`}
                >
                  {parsedMessage?.map((item, index) => (
                    <img
                      alt="anh"
                      key={index}
                      src={item}
                      className="flex-1 w-full h-full object-cover rounded-2xl cursor-pointer hover:opacity-90 duration-300"
                    />
                  ))}
                </div>
                {el.message && (
                  <div className="text-[13px] text-white px-2 pb-2 break-words">
                    {el.message}
                  </div>
                )}
                <div
                  className={cn(
                    "absolute top-[-16px] right-0 text-[11px] text-black flex w-auto whitespace-nowrap gap-2",
                    positionMes === "left" && "left-0"
                  )}
                >
                  {!isReply && positionMes === "right" && (
                    <div className="text-[11px] text-gray-600">
                      {format(new Date(el.send_at), "HH:mm a")}
                    </div>
                  )}
                  {!isReply && positionMes === "left" && (
                    <div className="text-[11px] text-gray-600">
                      {format(new Date(el.send_at), "HH:mm a")}
                    </div>
                  )}
                </div>
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
            {positionMes === "right" && showAvatar && (
              <AvatarMsg el={el} currentUser={currentUser} />
            )}
          </>
        )}
      </div>
      {updateMessage.messageValue && (
        <>
          <div className="absolute inset-0 bg-[rgba(72,72,72,0.7)] z-10"></div>
        </>
      )}
    </div>
  );
};

export default MediaMsg;
