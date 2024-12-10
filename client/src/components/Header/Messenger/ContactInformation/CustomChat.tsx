import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { FaDotCircle } from "react-icons/fa";
import { BiSolidLike } from "react-icons/bi";
import { PiTextAaBold } from "react-icons/pi";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showModal } from "@/redux/modalSlice";
import CustomTheme from "./CustomTheme";
import { messageSliceType, setChangeEmojiMessage } from "@/redux/messageSlice";
import EmojiPickerComponent from "../EmojiPicker";
import CustomName from "./CustomName";

const CustomChat = () => {
  const dispatch = useDispatch();
  const [isCustomMessage, setIsCustomMessage] = useState(true);
  const { themeMessage, changeEmojiMessage } = useSelector(
    (state: { message: messageSliceType }) => state.message
  );

  const handleCustomMessage = (title: string) => {
    if (title === "Đổi chủ đề") {
      dispatch(
        showModal({ isShowModal: true, childrenModal: <CustomTheme /> })
      );
    }
    if (title === "Thay đổi biểu tượng cảm xúc") {
      dispatch(setChangeEmojiMessage({ isChangeEmoji: true }));
      dispatch(
        showModal({
          isShowModal: true,
          childrenModal: <EmojiPickerComponent />,
        })
      );
    }
    if (title === "Chỉnh sửa biệt danh") {
      dispatch(
        showModal({
          isShowModal: true,
          childrenModal: <CustomName />,
        })
      );
    }
  };

  return (
    <div className="relative p-2 cursor-pointer">
      <div
        className="p-[6px] flex items-center justify-between hover:bg-[#f2f2f2] rounded-lg h-[36px]"
        onClick={() => setIsCustomMessage(!isCustomMessage)}
      >
        <div className="w-full">
          <span className="text-[15px] text-[#080809] font-semibold select-none">
            Tuỳ chỉnh đoạn chat
          </span>
        </div>
        {isCustomMessage ? (
          <IoIosArrowUp size={20} />
        ) : (
          <IoIosArrowDown size={20} />
        )}
      </div>
      {isCustomMessage && (
        <ul className="w-full h-full">
          <li
            className="h-[40px] w-full flex items-center hover:bg-[#f2f2f2] rounded-lg"
            onClick={() => handleCustomMessage("Đổi chủ đề")}
          >
            <div className="p-[6px] w-[32px] h-[32px]">
              <FaDotCircle size={20} color={`${themeMessage}`} />
            </div>
            <span className="p-[6px] text-[#080809] text-[15px]">
              Đổi chủ đề
            </span>
          </li>
          <li
            className="h-[40px] w-full flex items-center hover:bg-[#f2f2f2] rounded-lg"
            onClick={() => handleCustomMessage("Thay đổi biểu tượng cảm xúc")}
          >
            <div className="p-[6px] w-[32px] h-[32px]">
              {changeEmojiMessage.emojiValue ? (
                <div className="text-[18px]">
                  {String.fromCodePoint(
                    parseInt(`0x${changeEmojiMessage.emojiValue}`, 16)
                  )}
                </div>
              ) : (
                <BiSolidLike size={24} color="#0866ff" />
              )}
            </div>
            <span className="p-[6px] text-[#080809] text-[15px]">
              Thay đổi biểu tượng cảm xúc
            </span>
          </li>
          <li
            className="h-[40px] w-full flex items-center hover:bg-[#f2f2f2] rounded-lg"
            onClick={() => handleCustomMessage("Chỉnh sửa biệt danh")}
          >
            <div className="p-[6px] w-[32px] h-[32px]">
              <PiTextAaBold size={20} />
            </div>
            <span className="p-[6px] text-[#080809] text-[15px]">
              Chỉnh sửa biệt danh
            </span>
          </li>
        </ul>
      )}
    </div>
  );
};

export default CustomChat;
