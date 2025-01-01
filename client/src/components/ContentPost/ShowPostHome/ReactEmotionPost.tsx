import { chattingUserType } from "@/redux/conversationSlice";
import { UserState } from "@/redux/userSlice";
import { emotionType } from "@/types";
import { useSelector } from "react-redux";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { Socket } from "socket.io-client";
import { postResponseType } from "@/apis/postApi";
import "./ShowPostHome.css";
import { useState } from "react";
import { toast } from "react-toastify";
import { FaHeart } from "react-icons/fa6";

interface ReactEmotionPostProps {
  socket: Socket | null;
  isHoverLike: {
    isClickTabComment: boolean;
    isHover: boolean;
    post: postResponseType | null;
  };
  setIsHoverLike: React.Dispatch<
    React.SetStateAction<{
      isClickTabComment: boolean;
      isHover: boolean;
      post: postResponseType | null;
    }>
  >;
  item: postResponseType;
}

const ReactEmotionPost = ({
  socket,
  isHoverLike,
  setIsHoverLike,
  item,
}: ReactEmotionPostProps) => {
  const { emojiList } = useSelector(
    (state: { conversation: chattingUserType }) => state.conversation
  );
  const { currentUser } = useSelector(
    (state: { user: UserState }) => state.user
  );
  const [optimisticLike, setOptimisticLike] = useState<{
    isLiking: boolean;
    emotionName: string;
    postId: string;
  }>({
    isLiking: false,
    emotionName: "",
    postId: "",
  });

  const handleClickEmotion = async (
    e: React.MouseEvent<HTMLDivElement>,
    emotion: emotionType,
    postId: string
  ) => {
    e.stopPropagation();
    setOptimisticLike({
      isLiking: true,
      emotionName: emotion.emotion_name,
      postId,
    });
    setIsHoverLike({
      isClickTabComment: isHoverLike.isClickTabComment,
      isHover: false,
      post: null,
    });
    let emotionId: number | null = null;
    switch (emotion.emotion_name) {
      case "like":
        emotionId = 1;
        break;
      case "heart":
        emotionId = 2;
        break;
      case "haha":
        emotionId = 3;
        break;
      case "wow":
        emotionId = 4;
        break;
      case "sad":
        emotionId = 5;
        break;
      case "angry":
        emotionId = 6;
        break;
      default:
        break;
    }
    try {
      if (emotionId !== null) {
        const dataReactEmotionPost = {
          user_id: currentUser!.id,
          post_id: postId,
          emotion_id: emotionId,
        };
        socket?.emit("react_emotion_post", dataReactEmotionPost);
      }
    } catch (error) {
      console.error(error);
      socket?.on("error", (data) => {
        toast.error(data);
      });
      setOptimisticLike({
        isLiking: false,
        emotionName: "",
        postId: "",
      });
    }
  };

  const renderEmotionIcon = (emotion: {
    isLiking: boolean;
    emotionName: string;
    postId: string;
  }) => {
    switch (emotion?.emotionName) {
      case "like":
        return (
          <div className="py-[6px] px-1 zoomEmotion">
            <AiFillLike size={20} color="#0866ff" />
          </div>
        );
      case "heart":
        return (
          <div className="py-[6px] px-1 zoomEmotion">
            <FaHeart size={18} color="#EF424A" />
          </div>
        );
      case "haha":
        return (
          <div className="py-[6px] px-1 zoomEmotion">
            <img
              src="https://static.xx.fbcdn.net/images/emoji.php/v9/t8e/1/32/1f606.png"
              alt="haha"
              className="w-[20px] h-[20px] object-cover"
            />
          </div>
        );
      case "wow":
        return (
          <div className="py-[6px] px-1 zoomEmotion">
            <img
              src="https://static.xx.fbcdn.net/images/emoji.php/v9/t7b/1/32/1f62e.png"
              alt="wow"
              className="w-[20px] h-[20px] object-cover"
            />
          </div>
        );
      case "sad":
        return (
          <div className="py-[6px] px-1 zoomEmotion">
            <img
              src="https://static.xx.fbcdn.net/images/emoji.php/v9/tc8/1/32/1f622.png"
              alt="sad"
              className="w-[20px] h-[20px] object-cover"
            />
          </div>
        );
      case "angry":
        return (
          <div className="py-[6px] px-1 zoomEmotion">
            <img
              src="https://static.xx.fbcdn.net/images/emoji.php/v9/t47/1/32/1f621.png"
              alt="angry"
              className="w-[20px] h-[20px] object-cover"
            />
          </div>
        );
      default:
        return null;
    }
  };

  const renderEmotionText = (emotion: {
    isLiking: boolean;
    emotionName: string;
    postId: string;
  }) => {
    if (emotion.postId !== item.id) return null;
    switch (emotion?.emotionName) {
      case "like":
        return (
          <span className="py-[6px] px-1 text-[#0866ff] text-[15px]">
            Thích
          </span>
        );
      case "heart":
        return (
          <span className="py-[6px] px-1 text-[#EF424A] text-[15px]">
            Yêu thích
          </span>
        );
      case "haha":
        return (
          <span className="py-[6px] px-1 text-[#EBAE31] text-[15px]">Haha</span>
        );
      case "wow":
        return (
          <span className="py-[6px] px-1 text-[#EBAE31] text-[15px]">Wow</span>
        );
      case "sad":
        return (
          <span className="py-[6px] px-1 text-[#EBAE31] text-[15px]">Buồn</span>
        );
      case "angry":
        return (
          <span className="py-[6px] px-1 text-[#E07F30] text-[15px]">
            Phẫn nộ
          </span>
        );
      default:
        return null;
    }
  };

  const handleRemoveEmotion = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    socket?.emit("remove_emotion_post", {
      user_id: currentUser!.id,
      post_id: postId,
    });
    setOptimisticLike({
      isLiking: false,
      emotionName: "",
      postId: "",
    });
  };

  return (
    <div className="flex-1 px-2">
      <div
        className="relative my-1 cursor-pointer hover:bg-[#F2F2F2] flex items-center justify-center rounded-lg"
        onMouseEnter={() =>
          setIsHoverLike({
            isClickTabComment: isHoverLike.isClickTabComment,
            isHover: true,
            post: item,
          })
        }
        onMouseLeave={() =>
          setIsHoverLike({
            isClickTabComment: isHoverLike.isClickTabComment,
            isHover: false,
            post: item,
          })
        }
        onClick={(e) => handleRemoveEmotion(e, item.id)}
      >
        {item.id === optimisticLike.postId ? (
          <>
            {optimisticLike?.isLiking && (
              <>
                {renderEmotionIcon(optimisticLike)}
                {renderEmotionText(optimisticLike)}
              </>
            )}
            {/* Phần hover emoji */}
            {isHoverLike.isHover && isHoverLike.post?.id === item.id && (
              <div className="absolute bottom-7 left-[-4px] py-[6px] h-[49px] bg-white rounded-3xl shadow-bgContent">
                <div className="flex items-center ">
                  {emojiList.map((emotion: emotionType) => (
                    <div key={emotion.id} className="px-1">
                      <div
                        className="cursor-pointer w-[35px] h-[35px] hover:scale-125"
                        title={emotion.emotion_name}
                        onClick={(e) => handleClickEmotion(e, emotion, item.id)}
                      >
                        <img
                          src={emotion.emotion_icon}
                          alt="emoji"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {!optimisticLike.isLiking && (
              <>
                <div className="py-[6px] px-1 zoomEmotion">
                  <AiOutlineLike size={20} />
                </div>
                <span className="py-[6px] px-1 text-[#65686c] text-[15px]">
                  Thích
                </span>
                {isHoverLike.isHover && isHoverLike.post?.id === item.id && (
                  <div className="absolute bottom-8 left-[-4px] py-[6px] h-[49px] bg-white rounded-3xl shadow-bgContent">
                    <div className="flex items-center ">
                      {emojiList.map((emotion: emotionType) => (
                        <div key={emotion.id} className="px-1">
                          <div
                            className="cursor-pointer w-[35px] h-[35px] hover:scale-125"
                            title={emotion.emotion_name}
                            onClick={(e) =>
                              handleClickEmotion(e, emotion, item.id)
                            }
                          >
                            <img
                              src={emotion.emotion_icon}
                              alt="emoji"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ReactEmotionPost;
