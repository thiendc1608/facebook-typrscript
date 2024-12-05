import { cn } from "@/lib/utils";
import { allMessageType, emotionType, UserType } from "@/types";
import AvatarMsg from "./AvatarMsg";
import { memo, useContext, useEffect, useState } from "react";
import { format } from "date-fns";
import { BsThreeDotsVertical } from "react-icons/bs";
import { TiArrowBack, TiArrowForward } from "react-icons/ti";
import { FaRegFaceSmileBeam } from "react-icons/fa6";
import {
  chattingUserType,
  getAllUserReactMessage,
  setReplyMsg,
} from "@/redux/conversationSlice";
import { useDispatch, useSelector } from "react-redux";
import emojiAPI, { IReactMessage } from "@/apis/emojiApi";
import { showModal } from "@/redux/modalSlice";
import ShowReactMessage from "../ShowReactMessage";
import { useAppDispatch } from "@/redux/store";
import { SocketContext } from "@/context/SocketContext";

interface TextMsgType {
  el: allMessageType;
  currentUser?: UserType | null;
  showAvatar?: boolean;
}

interface GroupedData {
  [key: string]: {
    message_id: string;
    emoji_icon: string;
    list: {
      firstName: string;
      lastName: string;
      avatar: string;
    }[];
  };
}

const TextMsg = ({ el, currentUser, showAvatar }: TextMsgType) => {
  const { socket } = useContext(SocketContext)!;
  const dispatch = useAppDispatch();
  const dispatchReply = useDispatch();
  const [isHoverShowUserReact, setIsHoverShowUserReact] = useState({
    isHover: false,
    icon: "",
  });
  const [showOptionMes, setShowOptionMes] = useState<boolean>(false);
  const { emojiList } = useSelector(
    (state: { conversation: chattingUserType }) => state.conversation
  );
  const { private_chat } = useSelector(
    (state: { conversation: chattingUserType }) => state.conversation
  );
  const [listOption, setListOption] = useState({
    isEmoji: false,
    isArrowBack: false,
    isMoreSee: false,
  });
  let positionMes = "";
  if (currentUser?.id !== el.sender_id) {
    positionMes = "left";
  } else {
    positionMes = "right";
  }
  const handleClickEmoji = async (
    e: React.MouseEvent<HTMLDivElement>,
    el: allMessageType,
    item: emotionType
  ) => {
    e.stopPropagation();
    setListOption({ ...listOption, isEmoji: false });
    socket?.emit("send_react_message", {
      receiver_id: private_chat.current_conversation?.members?.user?.id,
      message_id: el.id,
      emoji_dropper_id: currentUser?.id as string,
      emoji_icon: item.emotion_icon,
    });
  };

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

  const handleMouseEnter = (icon: string) => {
    setIsHoverShowUserReact({
      isHover: true,
      icon,
    });
  };

  const handleMouseLeave = () => {
    setIsHoverShowUserReact({
      isHover: false,
      icon: "",
    });
  };

  // Tạo một đối tượng để nhóm dữ liệu theo message_id và emoji_icon
  const groupedData: GroupedData = {};

  el?.messageReact?.forEach((item) => {
    const messageId = item.message_id;
    const emojiIcon = item.emoji_icon;

    // Nếu chưa có message_id này trong groupedData, tạo một nhóm mới
    if (!groupedData[emojiIcon]) {
      groupedData[emojiIcon] = {
        message_id: messageId,
        emoji_icon: emojiIcon,
        list: [],
      };
    }

    // Thêm emoji_dropper_id vào mảng list của nhóm tương ứng
    groupedData[emojiIcon].list.push(item.userReact);
  });

  const handleClickReplyMsg = (el: allMessageType) => {
    dispatchReply(setReplyMsg(el));
  };

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
        {positionMes === "right" && (
          <>
            {/* {showOptionMes && ( */}
            <div className="flex items-center gap-[2px]">
              <div
                className="relative w-7 h-7 rounded-full flex items-center justify-center cursor-pointer hover:bg-[#f2f2f2] text-[#606366]"
                title="Xem thêm"
              >
                <BsThreeDotsVertical size={18} />
              </div>
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer hover:bg-[#f2f2f2] text-[#606366]"
                title="Trả lời"
                onClick={() => handleClickReplyMsg(el)}
              >
                <TiArrowBack size={24} />
              </div>
              <div
                className="relative w-7 h-7 rounded-full flex items-center justify-center cursor-pointer hover:bg-[#f2f2f2] text-[#606366]"
                title="Bày tỏ cảm xúc"
                onClick={(e) => {
                  e.stopPropagation();
                  setListOption({
                    ...listOption,
                    isEmoji: !listOption.isEmoji,
                  });
                }}
              >
                <FaRegFaceSmileBeam size={18} />
                {listOption.isEmoji && (
                  <div className="absolute top-[-50px] right-[-80px] py-2 px-3 flex items-center gap-1 shadow-blurEmoji rounded-[24px] z-[999] bg-white">
                    {emojiList &&
                      emojiList.map((item: emotionType) => (
                        <div
                          key={item.id}
                          className="cursor-pointer p-[2px] w-[32px] h-[32px] hover:scale-125"
                          title={item.emotion_name}
                          onClick={(e) => handleClickEmoji(e, el, item)}
                        >
                          <img
                            src={item.emotion_icon}
                            alt="emoji"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
            {/* )} */}
          </>
        )}
        <div
          className={cn(
            "relative max-w-[480px] rounded-2xl h-auto flex items-end flex-col",
            el.message !== "👍" && "bg-[#0866FF] px-3 py-1",
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
              <div>{`${el?.senderInfo?.lastName} ${el?.senderInfo?.firstName}`}</div>
            )}
            {positionMes === "left" && (
              <div className="text-[11px] text-gray-600">
                {format(new Date(el.send_at), "HH:mm a")}
              </div>
            )}
          </div>
          {el?.messageReact &&
            Object.values(groupedData)?.map((elm, index) => (
              <div
                key={index}
                className={cn(
                  "absolute bottom-[-10px]",
                  index === 0 ? "right-[-4px]" : `right-${4 * index}`
                )}
                onMouseEnter={() => {
                  handleMouseEnter(elm.emoji_icon);
                }}
                onMouseLeave={() => {
                  handleMouseLeave();
                }}
              >
                {el.countReactMes[el.id]?.map((count_react, idx) => {
                  if (count_react.emoji_icon === elm.emoji_icon) {
                    return (
                      <div
                        key={idx}
                        className={cn(
                          "w-auto h-auto rounded-full bg-[#f2f2f2] flex items-center  justify-center cursor-pointer p-[2px]",
                          count_react.count > 1 && "gap-[2px]"
                        )}
                      >
                        <img
                          src={elm.emoji_icon}
                          alt="icon"
                          className="w-[14px] h-[14px] object-cover"
                        />
                        {count_react.count > 1 && (
                          <div>{count_react.count}</div>
                        )}
                      </div>
                    );
                  }
                })}

                {isHoverShowUserReact.isHover &&
                  isHoverShowUserReact.icon === elm.emoji_icon && (
                    <div
                      className={cn(
                        "absolute top-[-40px] right-[-30px] my-[2px] w-auto rounded-xl overflow-hidden",
                        elm.list.length > 1 && "top-[-58px]"
                      )}
                    >
                      <div className="p-3 bg-[#303030] text-white w-full h-auto">
                        {elm.list.map((showName, idx) => (
                          <div
                            key={idx}
                            className="text-[12px] whitespace-nowrap cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              dispatch(
                                showModal({
                                  isShowModal: true,
                                  childrenModal: (
                                    <ShowReactMessage message_id={el.id} />
                                  ),
                                })
                              );
                            }}
                          >
                            {`${showName.lastName} ${showName.firstName}`}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            ))}
        </div>
        {positionMes === "left" && (
          <>
            {/* {showOptionMes && ( */}
            <div className="flex items-center gap-[2px]">
              <div
                className="relative w-7 h-7 rounded-full flex items-center justify-center cursor-pointer hover:bg-[#f2f2f2] text-[#606366]"
                title="Bày tỏ cảm xúc"
                onClick={(e) => {
                  e.stopPropagation();
                  setListOption({
                    ...listOption,
                    isEmoji: !listOption.isEmoji,
                  });
                }}
              >
                <FaRegFaceSmileBeam size={18} />
                {listOption.isEmoji && (
                  <div className="absolute top-[-50px] left-[-100px] py-2 px-3 flex items-center gap-1 shadow-blurEmoji rounded-[24px] z-[999] bg-white">
                    {emojiList &&
                      emojiList.map((item: emotionType) => (
                        <div
                          key={item.id}
                          className="cursor-pointer p-[2px] w-[32px] h-[32px] hover:scale-125"
                          title={item.emotion_name}
                          onClick={(e) => handleClickEmoji(e, el, item)}
                        >
                          <img
                            src={item.emotion_icon}
                            alt="emoji"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                  </div>
                )}
              </div>
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer hover:bg-[#f2f2f2] text-[#606366]"
                title="Trả lời"
                onClick={() => handleClickReplyMsg(el)}
              >
                <TiArrowForward size={24} />
              </div>
              <div
                className="relative w-7 h-7 rounded-full flex items-center justify-center cursor-pointer hover:bg-[#f2f2f2] text-[#606366]"
                title="Xem thêm"
              >
                <BsThreeDotsVertical size={18} />
              </div>
            </div>
            {/* )} */}
          </>
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
