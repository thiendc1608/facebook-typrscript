import { chattingUserType } from "@/redux/conversationSlice";
import { EmotionPostData, emotionType, infoComment } from "@/types";
import { formatTimeAgo } from "@/utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import { executeCommentType } from "./ShowListComment";
import React, { useState } from "react";
import { UserState } from "@/redux/userSlice";
import { commentAPI } from "@/apis/commentApi";
import { commentType, setEmotionComment } from "@/redux/commentSlice";
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
  )?.emotion_comment as EmotionPostData | undefined;

  const handleOnClickResponse = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const newCommentResponse: executeCommentType = {
      isEditComment: false,
      isDeleteComment: false,
      isClickComment: false,
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
        if (response.success) {
          dispatch(setEmotionComment(response.emotionComment));
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

  return (
    <div className="w-full flex items-center justify-start gap-3 pt-[3px] ml-1 text-[#65686c] text-[13px] cursor-pointer">
      <span className="hover:underline text-center">
        {formatTimeAgo(el.createdAt)?.replace(" trước", "")}
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
      >
        Thích
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
        onClick={(e: React.MouseEvent<HTMLDivElement>) =>
          handleOnClickResponse(e)
        }
      >
        Phản hồi
      </span>
      {showEmotionComment !== undefined && (
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
                  Object.keys(showEmotionComment).length === 1 &&
                    "w-auto right-[-20px]"
                )}
              >
                {Object.keys(showEmotionComment).length === 1 ? (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <img
                        src={Object.values(showEmotionComment)[0].emoji_post}
                        alt="emoji_post"
                        className="w-[18px] h-[18px]"
                      />
                      <span className="text-[#e2e5e9] text-[13px]">
                        {Object.values(showEmotionComment)[0].listUser.length}
                      </span>
                    </div>
                    {Object.values(showEmotionComment)[0].listUser.map(
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
                  Object.keys(showEmotionComment).length > 1 &&
                  Object.values(showEmotionComment).map((elm, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <img
                        src={elm.emoji_post}
                        alt="emoji_post"
                        className="w-[18px] h-[18px]"
                      />
                      <span className="text-[#e2e5e9] text-[13px]">
                        {elm.listUser.length}
                      </span>
                    </div>
                  ))
                )}
              </span>
            )}

          <div className="flex items-center gap-1 ">
            <span className="text-[#65676c] text-[14px]">
              {Object.values(showEmotionComment).length}
            </span>
            {Object.values(showEmotionComment).map((el, idx) => (
              <div key={idx}>
                <img
                  src={el.emoji_post}
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
