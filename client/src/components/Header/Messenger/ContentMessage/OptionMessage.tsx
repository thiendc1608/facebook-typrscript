import { SocketContext } from "@/context/SocketContext";
import { chattingUserType, setReplyMsg } from "@/redux/conversationSlice";
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
      receiver_id: private_chat.current_conversation?.members?.user?.id,
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

  const handleUpdateMes = (el: allMessageType) => {
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
          receiver_id: private_chat.current_conversation?.members?.user?.id,
          el,
        });
      }
    });
  };

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
                <div className="absolute bottom-[calc(100%+5px)] right-0 bg-white shadow-default rounded-md">
                  <ul className="py-2 w-[131.5px]">
                    <li
                      className="mx-2 py-3 px-2 hover:bg-[#f2f2f2] rounded-lg"
                      onClick={() => handleUpdateMes(el)}
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
