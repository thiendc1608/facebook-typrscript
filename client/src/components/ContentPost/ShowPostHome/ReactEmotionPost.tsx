import { chattingUserType } from "@/redux/conversationSlice";
import { UserState } from "@/redux/userSlice";
import { EmotionPostData, emotionType } from "@/types";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { Socket } from "socket.io-client";
import "./ShowPostHome.css";
import { useCallback, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { FaHeart } from "react-icons/fa6";
import { PostContext } from "@/context/PostContext";
import { postType, removeReactEmotionPost } from "@/redux/postSlice";

interface ReactEmotionPostProps {
  socket: Socket | null;
  postId: string;
}

const ReactEmotionPost = ({ socket, postId }: ReactEmotionPostProps) => {
  const dispatch = useDispatch();
  const { emojiList } = useSelector(
    (state: { conversation: chattingUserType }) => state.conversation
  );
  const { allPost } = useSelector((state: { post: postType }) => state.post);
  const { currentUser } = useSelector(
    (state: { user: UserState }) => state.user
  );

  const { isHoverLike, setIsHoverLike, postClickImage } =
    useContext(PostContext);

  const detailPost =
    allPost.listAllPost &&
    allPost.listAllPost.find((post) => post.id === postId);

  useEffect(() => {
    socket?.off("remove_react");

    socket?.on(
      "remove_react",
      async (data: {
        user_id: string;
        post_id: string;
        nameEmotion: string;
      }) => {
        dispatch(
          removeReactEmotionPost({
            user_id: data.user_id,
            post_id: data.post_id,
            nameEmotion: convertString(data.nameEmotion),
          })
        );
      }
    );
    return () => {
      socket?.off("remove_react");
    };
  }, [socket, dispatch]);

  const handleClickEmotion = async (
    e: React.MouseEvent<HTMLDivElement>,
    emotion: emotionType,
    postId: string
  ) => {
    e.stopPropagation();
    setIsHoverLike({
      ...isHoverLike,
      isHover: false,
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
    }
  };

  function findKeyByValue(el: EmotionPostData[]) {
    // Duyệt qua mỗi đối tượng trong mảng
    if (el && el.length > 0) {
      for (const obj of el) {
        // Duyệt qua từng key trong mỗi đối tượng
        for (const key in obj) {
          if (obj[key].listUser) {
            // Tìm kiếm người dùng trong listUser có id trùng với id truyền vào
            const user = obj[key].listUser.find(
              (user) => user.id === currentUser?.id
            );
            if (user) {
              return key; // Trả về key nếu tìm thấy
            }
          }
        }
      }
    }
    return null; // Trả về null nếu không tìm thấy giá trị
  }

  const renderEmotionIcon = () => {
    const emotionName = findKeyByValue(detailPost!.listReactEmotionPost!);
    switch (emotionName) {
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

  const renderEmotionText = () => {
    const emotionName = findKeyByValue(detailPost!.listReactEmotionPost!);
    switch (emotionName) {
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

  const convertString = (text: string) => {
    let textConvert = null;
    switch (text) {
      case "Thích":
        textConvert = "like";
        break;
      case "Yêu thích":
        textConvert = "heart";
        break;
      case "Haha":
        textConvert = "haha";
        break;
      case "Wow":
        textConvert = "wow";
        break;
      case "Buồn":
        textConvert = "sad";
        break;
      case "Phẫn nộ":
        textConvert = "angry";
        break;
      default:
        break;
    }
    return textConvert;
  };

  const handleClickLike = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    setIsHoverLike({
      ...isHoverLike,
      isHover: false,
    });
    let emotionId: number | null = null;
    switch ((e.target as HTMLElement).textContent) {
      case "Thích":
        emotionId = 1;
        break;
      case "Yêu thích":
        emotionId = 2;
        break;
      case "Haha":
        emotionId = 3;
        break;
      case "Wow":
        emotionId = 4;
        break;
      case "Buồn":
        emotionId = 5;
        break;
      case "Phẫn nộ":
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
          nameEmotion: (e.target as HTMLElement).textContent,
        };
        socket?.emit("react_emotion_post", dataReactEmotionPost);
      }
    } catch (error) {
      console.error(error);
      socket?.on("error", (data) => {
        toast.error(data);
      });
    }
  };

  const handleHoverIn = useCallback(() => {
    setIsHoverLike({
      ...isHoverLike,
      isHover: true,
      postId: detailPost!.id,
    });
  }, [detailPost, isHoverLike, setIsHoverLike]);

  const handleHoverOut = useCallback(() => {
    setIsHoverLike({
      ...isHoverLike,
      isHover: false,
    });
  }, [isHoverLike, setIsHoverLike]);

  return (
    <div className="flex-1 px-2">
      <div
        className="relative my-1 cursor-pointer hover:bg-[#F2F2F2] flex items-center justify-center rounded-lg"
        onMouseEnter={handleHoverIn} // Tạo sự kiện hover vào
        onMouseLeave={handleHoverOut} // Tạo sự kiện hover ra
        onClick={(e) => handleClickLike(e, detailPost!.id)}
      >
        {/* Phần hover emoji */}
        {isHoverLike.isHover && isHoverLike.postId === detailPost?.id && (
          <div className="absolute bottom-7 left-[-4px] py-[6px] h-[49px] bg-white rounded-3xl shadow-bgContent">
            <div className="flex items-center ">
              {emojiList.map((emotion: emotionType) => (
                <div key={emotion.id} className="px-1">
                  <div
                    className="cursor-pointer w-[35px] h-[35px] hover:scale-125"
                    title={emotion.emotion_name}
                    onClick={(e) =>
                      handleClickEmotion(e, emotion, detailPost.id)
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

        {detailPost &&
        findKeyByValue(detailPost.listReactEmotionPost) !== null ? (
          <>
            {renderEmotionIcon()}
            {!postClickImage && renderEmotionText()}
          </>
        ) : (
          <>
            <div className="py-[6px] px-1 zoomEmotion">
              <AiOutlineLike size={20} />
            </div>
            {!postClickImage && (
              <span className="py-[6px] px-1 text-[#65686c] text-[15px]">
                Thích
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ReactEmotionPost;
