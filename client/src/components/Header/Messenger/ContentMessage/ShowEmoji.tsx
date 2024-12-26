import { cn } from "@/lib/utils";
import { showModal } from "@/redux/modalSlice";
import { allMessageType, GroupedData } from "@/types";
import { useState } from "react";
import ShowReactMessage from "../ShowReactMessage";
import { useDispatch } from "react-redux";

interface ShowEmojiProps {
  el: allMessageType;
  positionMes: "right" | "left";
}
const ShowEmoji = ({ el, positionMes }: ShowEmojiProps) => {
  const dispatch = useDispatch();
  const [isHoverShowUserReact, setIsHoverShowUserReact] = useState({
    isHover: false,
    icon: "",
  });

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

  const groupedData: GroupedData = {};
  if (el?.messageReact?.length > 0) {
    el?.messageReact?.forEach((item) => {
      if (item) {
        // Add this type guard
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
      }
    });
  }

  return (
    <>
      {el?.messageReact &&
        Object.values(groupedData)?.map((elm, index) => (
          <div
            key={index}
            className={cn(
              "absolute bottom-[-12px]",
              positionMes === "left"
                ? index === 0
                  ? "left-5"
                  : `left-${4 * index}`
                : null,
              positionMes === "right"
                ? index === 0
                  ? "right-5"
                  : `right-${4 * index}`
                : null
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
                    {count_react.count > 1 && <div>{count_react.count}</div>}
                  </div>
                );
              }
            })}

            {isHoverShowUserReact.isHover &&
              isHoverShowUserReact.icon === elm.emoji_icon && (
                <div
                  className={cn(
                    "absolute top-[-40px] right-[-30px] my-[2px] w-auto rounded-xl overflow-hidden z-[100]",
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
    </>
  );
};

export default ShowEmoji;
