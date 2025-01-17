import { SocketContext } from "@/context/SocketContext";
import { cn } from "@/lib/utils";
import {
  chattingUserType,
  setReplyMsg,
  setUpdateMessage,
} from "@/redux/conversationSlice";
import { notificationState } from "@/redux/notificationSlice";
import { allMessageType, emotionType, UserType } from "@/types";
import { useContext, useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaRegFaceSmileBeam } from "react-icons/fa6";
import { TiArrowBack, TiArrowForward } from "react-icons/ti";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";

interface OptionMessageProps {
  positionMes: "right" | "left";
  el: allMessageType;
  currentUser: UserType | null;
}

const OptionMessage = ({
  positionMes,
  el,
  currentUser,
}: OptionMessageProps) => {
  const dispatch = useDispatch();
  const { socket } = useContext(SocketContext)!;
  const { emojiList, private_chat } = useSelector(
    (state: { conversation: chattingUserType }) => state.conversation
  );
  const { tinyChatting } = useSelector(
    (state: { notification: notificationState }) => state.notification
  );
  const [listOption, setListOption] = useState({
    isEmoji: false,
    isArrowBack: false,
    isMoreSee: false,
  });
  const [seeMoreElement, setSeeMoreElement] = useState({
    isSeeMore: false,
    el: null as allMessageType | null,
  });

  const handleClickEmoji = async (
    e: React.MouseEvent<HTMLDivElement>,
    el: allMessageType,
    item: emotionType
  ) => {
    e.stopPropagation();
    setListOption({ ...listOption, isEmoji: false });
    socket?.emit("send_react_message", {
      receiver_id: private_chat.current_conversation?.members?.user_id,
      message_id: el.id,
      emoji_dropper_id: currentUser?.id as string,
      emoji_icon: item.emotion_icon,
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

  const handleClickReplyMsg = (el: allMessageType) => {
    dispatch(setReplyMsg(el));
  };

  const handleRemoveMes = (el: allMessageType) => {
    Swal.fire({
      title: "Are you sure",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        socket?.emit("remove_message", {
          receiver_id: private_chat.current_conversation?.members?.user_id,
          el,
        });
      }
    });
  };

  const handleUpdateMes = (el: allMessageType) => {
    dispatch(
      setUpdateMessage({
        isUpdateMsg: true,
        messageValue: el,
      })
    );
  };

  useEffect(() => {
    const handleCloseEmoji = (e: Event) => {
      const closeEmojiElement = document.getElementById("emoji");
      if (e.target instanceof Node && !closeEmojiElement?.contains(e.target)) {
        setListOption({ ...listOption, isEmoji: false });
      }
    };
    document.addEventListener("click", handleCloseEmoji);
    return () => document.removeEventListener("click", handleCloseEmoji);
  }, []);

  return (
    <>
      {positionMes === "right" && (
        <>
          {/* {showOptionMes && ( */}
          <div className="flex items-center gap-[2px]">
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
                <div className="absolute bottom-[30%] right-[30px] bg-white shadow-default rounded-md">
                  <ul className="py-2 w-[131.5px]">
                    <li
                      className="mx-2 py-3 px-2 hover:bg-[#f2f2f2] rounded-lg"
                      onClick={() => handleUpdateMes(el)}
                    >
                      <span className="text-[#080809] text-[15px] font-semibold">
                        Chỉnh sửa
                      </span>
                    </li>
                    <li
                      className="mx-2 py-3 px-2 hover:bg-[#f2f2f2] rounded-lg"
                      onClick={() => handleRemoveMes(el)}
                    >
                      <span className="text-[#080809] text-[15px] font-semibold">
                        Thu hồi
                      </span>
                    </li>
                    <li className="mx-2 py-3 px-2 hover:bg-[#f2f2f2] rounded-lg">
                      <span className="text-[#080809] text-[15px] font-semibold">
                        Chuyển tiếp
                      </span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer hover:bg-[#f2f2f2] text-[#606366]"
              title="Trả lời"
              onClick={() => handleClickReplyMsg(el)}
            >
              <TiArrowBack size={24} />
            </div>
            <div
              className="relative w-7 h-7 rounded-full flex items-center justify-center cursor-pointer hover:bg-[#f2f2f2] text-[#606366] z-[10]"
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
                <div
                  id="emoji"
                  className={cn(
                    "absolute top-[-50px] right-[-80px] py-2 px-3 flex items-center gap-1 shadow-blurEmoji rounded-[24px] z-[999] bg-white",
                    tinyChatting ? "right-[-40px]" : "right-[-80px]"
                  )}
                >
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
                <div
                  className={cn(
                    "absolute top-[-50px] py-2 px-3 flex items-center gap-1 shadow-blurEmoji rounded-[24px] z-[999] bg-white",
                    tinyChatting ? "left-[-40px]" : "left-[-80px]"
                  )}
                >
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
    </>
  );
};

export default OptionMessage;
