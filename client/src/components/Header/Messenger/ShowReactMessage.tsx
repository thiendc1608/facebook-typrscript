import { cn } from "@/lib/utils";
import { chattingUserType } from "@/redux/conversationSlice";
import { showModal } from "@/redux/modalSlice";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";

const ShowReactMessage = ({ message_id }: { message_id: string }) => {
  const dispatch = useDispatch();
  const [emotionActive, setEmotionActive] = useState<{
    icon: string;
    userReactList:
      | {
          message_id: string;
          emoji_dropper_id: string;
          emoji_icon: string;
          userReact: {
            id: string;
            firstName: string;
            lastName: string;
            avatar: string;
          };
        }[]
      | [];
  }>({
    icon: "Tất cả",
    userReactList: [],
  });
  const [countReact, setCountReact] = useState(0);
  const { current_messages } = useSelector(
    (state: { conversation: chattingUserType }) =>
      state.conversation.private_chat
  );

  const currentReactMessage = current_messages.find(
    (message) => message.id === message_id
  );

  useEffect(() => {
    setEmotionActive({
      ...emotionActive,
      userReactList: currentReactMessage?.messageReact ?? [],
    });
  }, []);

  useEffect(() => {
    const countReact = currentReactMessage?.countReactMes[message_id].reduce(
      (accumulator, currentValue) => accumulator + currentValue.count,
      0
    );
    setCountReact(countReact || 0);
  }, [currentReactMessage, message_id]);

  const handleSetEmotionActive = (icon: string) => {
    if (icon === "Tất cả") {
      setEmotionActive({
        ...emotionActive,
        icon,
        userReactList: currentReactMessage?.messageReact ?? [],
      });
    } else {
      const userReactElementList = currentReactMessage?.messageReact.filter(
        (el) => el.emoji_icon === icon
      );
      setEmotionActive({
        ...emotionActive,
        icon,
        userReactList: userReactElementList ?? [],
      });
    }
  };

  return (
    <div
      className="w-[548px] min-h-[294px] bg-white rounded-xl"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="relative w-full h-[60px] border-b border-solid border-[#E5E5E5] flex items-center justify-center">
        <div className="text-[#050505] text-[20px] text-center">
          Cảm xúc về tin nhắn
        </div>
        <div
          className="absolute top-2 right-3 w-9 h-9 rounded-full bg-[#D8DADF] text-[#5B626A] flex items-center justify-center cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            dispatch(
              showModal({
                isShowModal: false,
                childrenModal: null,
              })
            );
          }}
        >
          <IoMdClose size={24} />
        </div>
      </div>
      <div className="p-4">
        <div className="w-full h-[60px] flex items-center">
          <div
            className="relative h-full px-4 leading-[60px] select-none cursor-pointer hover:bg-[#f2f2f2] rounded-xl"
            onClick={() => handleSetEmotionActive("Tất cả")}
          >
            <div
              className={cn(
                emotionActive.icon === "Tất cả" &&
                  "absolute bottom-0 left-0 right-0 border-b-[2px] border-[#0866ff] border-solid"
              )}
            ></div>
            <span
              className={cn(
                "text-[15px] flex items-center gap-2",
                emotionActive.icon === "Tất cả"
                  ? "text-[#0866ff]"
                  : "text-[#606366]"
              )}
            >
              Tất cả
              <div
                className={cn(
                  "text-[#65686c] text-[15px]",
                  emotionActive.icon === "Tất cả" && "text-[#0866ff]"
                )}
              >
                {countReact}
              </div>
            </span>
          </div>
          {currentReactMessage !== null &&
            currentReactMessage?.countReactMes[message_id].map((elm, idx) => (
              <div
                key={idx}
                className={cn(
                  "relative h-full px-4 leading-[60px] select-none cursor-pointer rounded-xl",
                  elm.emoji_icon !== emotionActive.icon && "hover:bg-[#f2f2f2]"
                )}
                onClick={() => handleSetEmotionActive(elm.emoji_icon)}
              >
                <div
                  className={cn(
                    elm.emoji_icon === emotionActive.icon &&
                      "absolute bottom-0 left-0 right-0 border-b-[2px] border-[#0866ff] border-solid"
                  )}
                ></div>
                <div className="text-[15px] flex items-center gap-1 ">
                  <img
                    src={elm.emoji_icon}
                    alt="icon"
                    className="w-[20px] h-[20px]"
                  />
                  <div
                    className={cn(
                      "text-[#65686c] text-[15px]",
                      elm.emoji_icon === emotionActive.icon && "text-[#0866ff]"
                    )}
                  >
                    {elm.count}
                  </div>
                </div>
              </div>
            ))}
        </div>
        {emotionActive.userReactList !== null &&
          emotionActive.userReactList?.map((message_user, idx) => (
            <div key={idx} className="px-2 hover:bg-[#f2f2f2] rounded-xl">
              <div className="h-[56px] w-full flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2">
                  <img
                    src={message_user.userReact.avatar}
                    alt="avatar"
                    className="w-[40px] h-[40px] rounded-full object-cover"
                  />
                  <div className="flex flex-col gap-1 justify-center">
                    <span className="text-[15px] text-[#080809]">
                      {`${message_user.userReact.lastName} ${message_user.userReact.firstName}`}
                    </span>
                    <span className="text-[12px] text-[#65686c]">
                      Nhấp để xem trang cá nhân
                    </span>
                  </div>
                </div>
                <div>
                  <img
                    src={message_user.emoji_icon}
                    alt="icon"
                    className="w-[30px] h-[30px]"
                  />
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ShowReactMessage;
