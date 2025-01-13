import { chattingUserType } from "@/redux/conversationSlice";
import { EmotionPostData, emotionType, infoComment } from "@/types";
import { formatTimeAgo } from "@/utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import { executeCommentType } from "./ShowListComment";
import React, { useState } from "react";
import { UserState } from "@/redux/userSlice";
import { commentAPI } from "@/apis/commentApi";
import {
  commentType,
  deleteEmotionComment,
  setEmotionComment,
  updateEmotionComment,
} from "@/redux/commentSlice";
import { cn } from "@/lib/utils";

interface InfoCommentProps {
  el: infoComment;
  postId: string;
  executeComment?: executeCommentType;
  setExecuteComment?: React.Dispatch<React.SetStateAction<executeCommentType>>;
  commentResponse?: executeCommentType[];
  setCommentResponse?: React.Dispatch<
    React.SetStateAction<executeCommentType[]>
  >;
}
const InfoComment = ({
  el,
  postId,
  executeComment,
  setExecuteComment,
  commentResponse,
  setCommentResponse,
}: InfoCommentProps) => {
  const dispatch = useDispatch();
  const { emojiList } = useSelector(
    (state: { conversation: chattingUserType }) => state.conversation
  );
  const { currentUser } = useSelector(
    (state: { user: UserState }) => state.user
  );
  const { listComment } = useSelector(
    (state: { comment: commentType }) => state.comment
  );
  const [isHoverLikeComment, setIsHoverLikeComment] = useState<{
    isHover: boolean;
    commentId: number | null;
  }>({
    isHover: false,
    commentId: null,
  });

  const showEmotionComment = listComment.find(
    (comment) => +comment.id === +el.id
  )?.emotion_comment as EmotionPostData[] | [];

  const totalUserReact =
    showEmotionComment &&
    showEmotionComment.reduce((sum, obj) => {
      // Lấy tất cả các đối tượng chứa "list"
      for (const key in obj) {
        if (obj[key]["listUser"]) {
          sum += obj[key]["listUser"].length;
        }
      }
      return sum;
    }, 0);

  const handleOnClickReply = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const newCommentResponse: executeCommentType = {
      isEditComment: false,
      isDeleteComment: false,
      isClickOptionComment: false,
      isClickResponse: true,
      postId,
      commentId: null,
      parentCommentId: el.id,
      user: {
        lastName: el.user.lastName,
        firstName: el.user.firstName,
      },
    };

    const findResponse = commentResponse?.find(
      (item) => item.parentCommentId === newCommentResponse.parentCommentId
    );
    if (findResponse) return;
    else setCommentResponse?.([...commentResponse!, newCommentResponse]);
  };

  const handleClickEmotion = async (
    e: React.MouseEvent<HTMLDivElement>,
    emotion: emotionType,
    commentId: number
  ) => {
    e.stopPropagation();
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
    setExecuteComment?.({
      ...executeComment!,
      isHover: false,
    });
    try {
      if (emotionId !== null) {
        const dataReactEmotionComment = {
          user_id: currentUser!.id,
          comment_id: commentId,
          emotion_id: emotionId,
        };
        const response = await commentAPI.reactEmotionComment(
          dataReactEmotionComment
        );
        if (
          response.success &&
          response.message === "Create emotion comment successfully"
        ) {
          dispatch(setEmotionComment(response.emotionComment));
        } else {
          dispatch(updateEmotionComment(response.emotionComment));
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleShowUserReact = () => {
    setIsHoverLikeComment({
      isHover: true,
      commentId: el.id,
    });
  };

  const handleCloseUserReact = () => {
    setIsHoverLikeComment({
      isHover: false,
      commentId: null,
    });
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

  const handleClickLike = async (
    e: React.MouseEvent<HTMLDivElement>,
    commentId: number
  ) => {
    setExecuteComment?.({
      ...executeComment!,
      isHover: false,
    });
    e.stopPropagation();
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
      const dataReactEmotionComment = {
        user_id: currentUser!.id,
        comment_id: commentId,
        emotion_id: emotionId!,
      };
      const response = await commentAPI.reactEmotionComment(
        dataReactEmotionComment
      );
      if (
        response.success &&
        response.message === "Delete emotion comment successfully"
      ) {
        dispatch(
          deleteEmotionComment({
            user_id: currentUser!.id,
            comment_id: commentId,
            nameEmotion: convertString(
              (e.target as HTMLElement).textContent as string
            ),
          })
        );
      } else {
        dispatch(setEmotionComment(response.emotionComment));
      }
    } catch (error) {
      console.error(error);
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

  const renderEmotionName = (el: infoComment) => {
    const emotionName = findKeyByValue(el.emotion_comment!);
    switch (emotionName) {
      case "like":
        return (
          <span className="text-[#0866ff] cursor-pointer hover:underline hover:text-[#0866ff]">
            Thích
          </span>
        );
      case "heart":
        return (
          <span className="text-[#EF424A] cursor-pointer hover:underline hover:text-[#EF424A]">
            Yêu thích
          </span>
        );
      case "haha":
        return (
          <span className="text-[#F8B734] cursor-pointer hover:underline hover:text-[#F8B734]">
            Haha
          </span>
        );
      case "wow":
        return (
          <span className="text-[#F8B734] cursor-pointer hover:underline hover:text-[#F8B734]">
            Wow
          </span>
        );
      case "sad":
        return (
          <span className="text-[#F8B734] cursor-pointer hover:underline hover:text-[#F8B734]">
            Buồn
          </span>
        );
      case "angry":
        return (
          <span className="text-[#E9710F] cursor-pointer hover:underline hover:text-[#E9710F]">
            Phẫn nộ
          </span>
        );
      default:
        return "Thích";
    }
  };

  return (
    <div className="w-full flex items-center justify-start gap-3 pt-[3px] ml-1 text-[#65686c] text-[13px] cursor-pointer">
      <span className="hover:underline text-center">
        {formatTimeAgo(el.createdAt, true)}
      </span>
      <span
        className="relative text-center font-semibold"
        onMouseEnter={() =>
          setExecuteComment?.({
            ...executeComment!,
            isHover: true,
            postId,
            commentId: el.id,
          })
        }
        onMouseLeave={() =>
          setExecuteComment?.({
            ...executeComment!,
            isHover: false,
            postId: "",
            commentId: null,
          })
        }
        onClick={(e: React.MouseEvent<HTMLDivElement>) =>
          handleClickLike(e, el.id)
        }
      >
        {renderEmotionName(el)}
        {executeComment!.isHover &&
          executeComment!.postId === postId &&
          executeComment!.commentId === el.id && (
            <div className="absolute bottom-4 left-[-4px] py-[6px] h-[49px] bg-white rounded-3xl shadow-bgContent">
              <div className="flex items-center ">
                {emojiList.map((emotion: emotionType) => (
                  <div key={emotion.id} className="px-1">
                    <div
                      className="cursor-pointer w-[35px] h-[35px] hover:scale-125"
                      title={emotion.emotion_name}
                      onClick={(e) => handleClickEmotion(e, emotion, el.id)}
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
      </span>
      <span
        className="text-center"
        onClick={(e: React.MouseEvent<HTMLDivElement>) => handleOnClickReply(e)}
      >
        Phản hồi
      </span>
      {showEmotionComment && showEmotionComment.length > 0 && (
        <div
          className="relative p-1 w-auto h-auto rounded-lg hover:bg-[#f2f2f2]"
          onMouseEnter={handleShowUserReact}
          onMouseLeave={handleCloseUserReact}
        >
          {isHoverLikeComment.isHover &&
            isHoverLikeComment.commentId === el.id && (
              <span
                className={cn(
                  "flex flex-col gap-2 absolute top-full right-0 w-[60px] h-auto bg-[#000000cc] p-3 rounded-lg z-[1]",
                  showEmotionComment.length === 1 && "w-auto right-[-20px]"
                )}
              >
                {showEmotionComment.length === 1 ? (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <img
                        src={Object.values(showEmotionComment[0])[0].emoji_post}
                        alt="emoji_post"
                        className="w-[18px] h-[18px]"
                      />
                      <span className="text-[#e2e5e9] text-[13px]">
                        {
                          Object.values(showEmotionComment[0])[0].listUser
                            .length
                        }
                      </span>
                    </div>
                    {Object.values(showEmotionComment[0])[0].listUser.map(
                      (elm, idx) => (
                        <div key={idx} className="flex items-center gap-1">
                          <span className="text-[#e2e5e9] text-[13px] whitespace-nowrap">
                            {elm.lastName + " " + elm.firstName}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  showEmotionComment.length > 1 &&
                  showEmotionComment.map((elm, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <img
                        src={Object.values(elm)[0].emoji_post}
                        alt="emoji_post"
                        className="w-[18px] h-[18px]"
                      />
                      <span className="text-[#e2e5e9] text-[13px]">
                        {Object.values(elm)[0].listUser.length}
                      </span>
                    </div>
                  ))
                )}
              </span>
            )}

          <div className="flex items-center gap-1 ">
            <span className="text-[#65676c] text-[14px]">
              {totalUserReact > 0 && totalUserReact}
            </span>
            {showEmotionComment.map((el, idx) => (
              <div key={idx}>
                <img
                  src={Object.values(el)[0].emoji_post}
                  alt="emoji_post"
                  className="w-[18px] h-[18px]"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InfoComment;
