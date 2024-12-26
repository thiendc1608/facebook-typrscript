import { path } from "@/utils/path";
import { Link } from "react-router-dom";
import { BsThreeDots } from "react-icons/bs";
import { useEffect, useState } from "react";
import { emotionType, infoComment } from "@/types";
import { formatTimeAgo } from "@/utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import { chattingUserType } from "@/redux/conversationSlice";
import FormWriteComment from "./FormWriteComment";
import { commentAPI } from "@/apis/commentApi";
import { deleteComment } from "@/redux/commentSlice";

interface ShowListCommentProps {
  listComment: infoComment[];
  postId: string;
}

export interface executeCommentType {
  isEditComment: boolean;
  isDeleteComment: boolean;
  isClickComment: boolean;
  isHover: boolean;
  postId: string;
  commentId: number | undefined;
  parentCommentId?: string | null;
}

const ShowListComment = ({ listComment, postId }: ShowListCommentProps) => {
  const dispatch = useDispatch();
  const { emojiList } = useSelector(
    (state: { conversation: chattingUserType }) => state.conversation
  );

  const [executeComment, setExecuteComment] = useState<executeCommentType>({
    isEditComment: false,
    isDeleteComment: false,
    isClickComment: false,
    isHover: false,
    postId: "",
    commentId: undefined,
  });

  const [commentResponse, setCommentResponse] = useState<executeCommentType>({
    isEditComment: false,
    isDeleteComment: false,
    isClickComment: false,
    isHover: false,
    postId: "",
    commentId: undefined,
    parentCommentId: undefined,
  });

  useEffect(() => {
    const handleClickOption = (e: Event) => {
      const clickOptionCommentEl = document.getElementById("option_comment");
      if (e.target instanceof Node && !clickOptionCommentEl?.contains(e.target))
        setExecuteComment({
          ...executeComment,
          isClickComment: false,
          postId: "",
          commentId: undefined,
        });
    };
    document.addEventListener("click", handleClickOption);
    return () => document.removeEventListener("click", handleClickOption);
  }, [executeComment]);

  const handleDeleteComment = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setExecuteComment({
      ...executeComment,
      isDeleteComment: true,
      isClickComment: false,
    });

    try {
      const response = await commentAPI.deleteComment(
        executeComment.commentId!
      );
      if (response.success) {
        setExecuteComment({
          ...executeComment,
          isDeleteComment: false,
        });
        dispatch(deleteComment(response.deleteId));
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      {listComment.length > 0 &&
        listComment
          .filter((comment) => comment.post_id === postId)
          .map((el) => (
            <div className="w-full">
              <div className="flex items-start">
                <Link
                  to={`/${path.PROFILE}/`}
                  className="w-8 h-8 mt-[2px] mr-[6px] "
                >
                  <img
                    src={el.user.avatar}
                    alt="avatar"
                    className="w-full h-full rounded-full object-cover"
                  />
                </Link>
                {!(
                  executeComment.isEditComment &&
                  executeComment.postId === postId &&
                  executeComment.commentId === el.id
                ) ? (
                  <div className="flex flex-col justify-center">
                    <div className="flex items-center gap-1">
                      <div className="flex flex-col justify-center max-w-[95%]">
                        <div className="self-start w-full py-2 px-3 flex flex-col rounded-xl bg-[#f2f2f2] break-all">
                          <span className="text-[#080809] text-[13px] font-semibold">
                            {el.user.lastName + " " + el.user.firstName}
                          </span>
                          <span className="text-[#080809] text-[15px] leading-5">
                            {el.comment_text}
                          </span>
                        </div>
                      </div>
                      <div
                        className="relative w-[32px] h-[32px] rounded-full hover:bg-[#f2f2f2] flex items-center justify-center cursor-pointer"
                        title="Chỉnh sửa hoặc xoá bình luận này"
                        id="option_comment"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExecuteComment({
                            ...executeComment,
                            isClickComment: !executeComment.isClickComment,
                            postId: el.post_id,
                            commentId: el.id,
                          });
                        }}
                      >
                        <BsThreeDots size={18} color="#606366" />
                        {executeComment.isClickComment &&
                          executeComment.postId === postId &&
                          executeComment.commentId === el.id && (
                            <div className="absolute w-auto top-10 left-0 py-2 h-[86px] bg-white rounded-xl shadow-bgContent z-[10]">
                              <div
                                className="mx-2 py-2 px-3 h-[35px] text-[#080809] text-[15px] hover:bg-[#f2f2f2] rounded-lg whitespace-nowrap"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExecuteComment({
                                    ...executeComment,
                                    isEditComment: true,
                                    isClickComment: false,
                                  });
                                }}
                              >
                                Chỉnh sửa
                              </div>
                              <div
                                className="mx-2 py-2 px-3 h-[35px] text-[#080809] text-[15px] hover:bg-[#f2f2f2] rounded-md"
                                onClick={(
                                  e: React.MouseEvent<HTMLDivElement>
                                ) => handleDeleteComment(e)}
                              >
                                Xoá
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 pt-[3px] ml-1 text-[#65686c] text-[13px] cursor-pointer">
                      <span className="hover:underline text-center">
                        {formatTimeAgo(el.createdAt)?.replace(" trước", "")}
                      </span>
                      <span
                        className="relative text-center font-semibold"
                        onMouseEnter={() =>
                          setExecuteComment({
                            ...executeComment,
                            isHover: true,
                            postId: postId,
                            commentId: el.id,
                          })
                        }
                        onMouseLeave={() =>
                          setExecuteComment({
                            ...executeComment,
                            isHover: false,
                            postId: "",
                            commentId: undefined,
                          })
                        }
                      >
                        Thích
                        {executeComment.isHover &&
                          executeComment.postId === postId &&
                          executeComment.commentId === el.id && (
                            <div className="absolute bottom-6 left-[-4px] py-[6px] h-[49px] bg-white rounded-3xl shadow-bgContent">
                              <div className="flex items-center ">
                                {emojiList.map((emotion: emotionType) => (
                                  <div key={emotion.id} className="px-1">
                                    <div
                                      className="cursor-pointer w-[35px] h-[35px] hover:scale-125"
                                      title={emotion.emotion_name}
                                      // onClick={(e) =>
                                      //   handleClickEmotion(e, emotion, item.id)
                                      // }
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
                        onClick={() => setCommentResponse({})}
                      >
                        Phản hồi
                      </span>
                    </div>
                  </div>
                ) : (
                  executeComment.isEditComment && (
                    <div className="w-full flex flex-col items-start">
                      <FormWriteComment
                        commentId={el.id}
                        postId={postId}
                        executeComment={executeComment}
                        setExecuteComment={setExecuteComment}
                        defaultValueComment={el.comment_text}
                      />
                      <span
                        className="p-[6px] text-blue-600 text-[13px] cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExecuteComment({
                            ...executeComment,
                            isEditComment: false,
                          });
                        }}
                      >
                        Huỷ
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
    </>
  );
};

export default ShowListComment;
