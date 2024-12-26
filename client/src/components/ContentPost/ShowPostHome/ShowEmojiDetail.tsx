import { cn } from "@/lib/utils";
import { showModal } from "@/redux/modalSlice";
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { EmotionPostData } from "./ShowEmotionCount";
import { useState } from "react";
import { reactEmotionPostType } from "@/types";
import { IoMdPersonAdd } from "react-icons/io";
import { UserState } from "@/redux/userSlice";

interface ShowEmojiDetailProps {
  data: EmotionPostData;
  filterListEmotion: reactEmotionPostType[];
}
const ShowEmojiDetail = ({ data, filterListEmotion }: ShowEmojiDetailProps) => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector(
    (state: { user: UserState }) => state.user
  );
  const [emotionActive, setEmotionActive] = useState<{
    emoji_post: string;
    listUser: EmotionPostData | reactEmotionPostType[];
  }>({
    emoji_post: "Tất cả",
    listUser: [],
  });

  const handleSetEmotionActive = (emoji_post: string) => {
    if (emoji_post === "Tất cả") {
      setEmotionActive({
        ...emotionActive,
        emoji_post,
        listUser: filterListEmotion,
      });
    } else {
      setEmotionActive({
        ...emotionActive,
        emoji_post,
        listUser: data,
      });
    }
  };

  return (
    <div
      className="w-[548px] min-h-[294px] bg-white rounded-xl flex"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="px-4 w-full">
        <div className="flex items-center justify-between">
          <div className="w-full h-[60px] flex items-center">
            <div
              className="relative h-full px-4 leading-[60px] select-none cursor-pointer hover:bg-[#f2f2f2] rounded-xl"
              onClick={() => handleSetEmotionActive("Tất cả")}
            >
              <div
                className={cn(
                  emotionActive.emoji_post === "Tất cả" &&
                    "absolute bottom-0 left-0 right-0 border-b-[2px] border-[#0866ff] border-solid"
                )}
              ></div>
              <div
                className={cn(
                  "text-[15px] flex items-center gap-2",
                  emotionActive.emoji_post === "Tất cả"
                    ? "text-[#0866ff]"
                    : "text-[#606366]"
                )}
              >
                <span className="whitespace-nowrap">Tất cả</span>
                <span
                  className={cn(
                    "text-[#65686c] text-[15px]",
                    emotionActive.emoji_post === "Tất cả" && "text-[#0866ff]"
                  )}
                >
                  {filterListEmotion.length}
                </span>
              </div>
            </div>

            {data !== null &&
              Object.values(data).map((elm, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "relative h-full px-4 leading-[60px] select-none cursor-pointer rounded-xl",
                    elm.emoji_post !== emotionActive.emoji_post &&
                      "hover:bg-[#f2f2f2]"
                  )}
                  onClick={() => handleSetEmotionActive(elm.emoji_post)}
                >
                  <div
                    className={cn(
                      elm.emoji_post === emotionActive.emoji_post &&
                        "absolute bottom-0 left-0 right-0 border-b-[2px] border-[#0866ff] border-solid"
                    )}
                  ></div>
                  <div className="text-[15px] flex items-center gap-1">
                    <div className="w-[20px] h-[20px]">
                      <img
                        src={elm.emoji_post}
                        alt="icon"
                        className="w-full h-full"
                      />
                    </div>
                    <div
                      className={cn(
                        "text-[#65686c] text-[15px]",
                        elm.emoji_post === emotionActive.emoji_post &&
                          "text-[#0866ff]"
                      )}
                    >
                      {elm.listUser.length}
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <div className="h-[60px] flex items-center justify-center">
            <div
              className="w-9 h-9 rounded-full bg-[#D8DADF] text-[#5B626A] flex items-center justify-center cursor-pointer"
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
        </div>

        {/*  */}
        {emotionActive.emoji_post === "Tất cả" ? (
          filterListEmotion?.map((user, idx) => (
            <>
              <div key={idx} className="px-2">
                <div className="h-[56px] w-full flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="relative w-[40px] h-[40px]">
                      <img
                        src={user.userInfo.avatar}
                        alt="avatar"
                        className="w-full h-full rounded-full object-cover"
                      />
                      <span className="absolute bottom-[-5px] right-0">
                        <img
                          src={user.emotion.emotion_post}
                          alt="emoji"
                          className="w-[20px] h-[20px]"
                        />
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 justify-center">
                      <span className="text-[15px] text-[#080809]">
                        {`${user.userInfo.lastName} ${user.userInfo.firstName}`}
                      </span>
                    </div>
                  </div>
                  {/* con thieu check voi list ban be nua, de sau */}
                  {user.user_id !== currentUser?.id && (
                    <div className="px-3 w-auto h-[36px] flex items-center hover:bg-[#f2f2f2] rounded-md cursor-pointer">
                      <IoMdPersonAdd size={20} />
                      <span className="text-[15px] text-[#080809]">
                        Thêm bạn bè
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </>
          ))
        ) : (
          <>
            {Object.values(data)?.map((user, idx) => (
              <div key={idx}>
                {user.emoji_post === emotionActive.emoji_post &&
                  user.listUser.map((elm, idx) => (
                    <div
                      key={idx}
                      className="px-2 hover:bg-[#f2f2f2] rounded-xl"
                    >
                      <div className="h-[56px] w-full flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-2">
                          <div className="relative w-[40px] h-[40px]">
                            <img
                              src={elm.avatar}
                              alt="avatar"
                              className="w-full h-full rounded-full object-cover"
                            />
                            <span className="absolute bottom-[-5px] right-0">
                              <img
                                src={emotionActive.emoji_post}
                                alt="emoji"
                                className="w-[20px] h-[20px]"
                              />
                            </span>
                          </div>
                          <div className="flex flex-col gap-1 justify-center">
                            <span className="text-[15px] text-[#080809]">
                              {`${elm.lastName} ${elm.firstName}`}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default ShowEmojiDetail;
