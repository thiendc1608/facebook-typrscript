import { cn } from "@/lib/utils";
import { allMessageType, UserType } from "@/types";
import { TiArrowBack, TiArrowForward } from "react-icons/ti";
import AvatarMsg from "./AvatarMsg";
import MediaMsg from "./MediaMsg";
import OptionMessage from "./OptionMessage";
import ShowEmoji from "./ShowEmoji";
import { useSelector } from "react-redux";
import { chattingUserType } from "@/redux/conversationSlice";

interface ReplyMsgType {
  el: allMessageType;
  currentUser?: UserType | null;
  showAvatar?: boolean;
}
const ReplyMsg = ({ el, currentUser }: ReplyMsgType) => {
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
          "flex flex-col",
          currentUser?.id === el.sender_id
            ? "justify-end pr-[14px]"
            : "justify-start pl-[14px]"
        )}
      >
        {positionMes === "right" && (
          <div className="flex items-center">
            <div className="flex-1 min-w-[33%] max-w-full"></div>
            <div className="flex items-center gap-1 whitespace-nowrap">
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
            <div className="flex items-center gap-1 whitespace-nowrap">
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
          {positionMes === "left" && (
            <AvatarMsg el={el} currentUser={currentUser} />
          )}
          <div className="rounded-2xl bg-white cursor-pointer w-auto">
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
                      "text-[#252525] text-[13px] inline-block py-1 px-3 rounded-lg bg-gray-300",
                      el.info_reply?.message?.includes(
                        "đã thu hồi một tin nhắn"
                      ) && "italic"
                    )}
                  >
                    {el.info_reply?.message?.includes("đã thu hồi một tin nhắn")
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
                      "flex flex-col",
                      positionMes === "left" ? "items-start" : "items-end"
                    )}
                  >
                    <div
                      className={cn(
                        "w-auto",
                        positionMes === "left" ? "text-left" : "text-right"
                      )}
                    >
                      <span
                        className={cn(
                          "text-[#252525] text-[13px] inline-block py-1 px-3 rounded-lg bg-gray-300",
                          el.info_reply?.message?.includes(
                            "đã thu hồi một tin nhắn"
                          ) && "italic"
                        )}
                      >
                        {el.info_reply?.message?.includes(
                          "đã thu hồi một tin nhắn"
                        )
                          ? "Đã gỡ tin nhắn"
                          : el.info_reply?.message}
                      </span>
                    </div>
                    <div
                      className={cn(
                        "py-1 px-3 rounded-xl w-fit",
                        positionMes === "right"
                          ? "bg-[#0866ff] text-white"
                          : "bg-[#d1d5db] text-black"
                      )}
                    >
                      <span className="my-1 text-[15px]">{el.message}</span>
                      {positionMes === "right" && (
                        <ShowEmoji el={el} positionMes="right" />
                      )}
                      {positionMes === "left" && (
                        <ShowEmoji el={el} positionMes="left" />
                      )}
                    </div>
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
          {positionMes === "left" && (
            <div className="flex-1 min-w-[33%] max-w-full"></div>
          )}
        </div>
      </div>
      {updateMessage.messageValue && (
        <>
          <div className="absolute inset-0 bg-[rgba(72,72,72,0.7)] z-10"></div>
        </>
      )}
    </div>
  );
};

export default ReplyMsg;
