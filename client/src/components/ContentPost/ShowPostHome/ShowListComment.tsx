import { path } from "@/utils/path";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { infoComment } from "@/types";
import { useDispatch } from "react-redux";
import FormWriteComment from "./FormWriteComment";
import { commentAPI } from "@/apis/commentApi";
import { deleteComment } from "@/redux/commentSlice";
import InfoComment from "./InfoComment";
import EditDeleteComment from "./EditDeleteComment";

interface ShowListCommentProps {
  listComment: infoComment[];
  postId: string;
}

export interface executeCommentType {
  isEditComment: boolean;
  isDeleteComment: boolean;
  isClickComment: boolean;
  isHover?: boolean;
  postId: string;
  commentId: number | null;
  parentCommentId?: number | null;
  isClickResponse?: boolean;
  replyText?: string | null;
  user?: {
    lastName: string;
    firstName: string;
  };
}

const ShowListComment = ({ listComment, postId }: ShowListCommentProps) => {
  const dispatch = useDispatch();
  const commentsContainerRef = useRef<HTMLDivElement | null>(null);
  const [executeComment, setExecuteComment] = useState<executeCommentType>({
    isEditComment: false,
    isDeleteComment: false,
    isClickComment: false,
    isHover: false,
    postId: "",
    commentId: null,
  });

  const [commentResponse, setCommentResponse] = useState<executeCommentType[]>(
    []
  );

  useEffect(() => {
    // Kiểm tra nếu container có ref
    if (commentsContainerRef.current) {
      // Lưu vị trí hiện tại của thanh cuộn
      const currentScrollPosition = commentsContainerRef.current.scrollTop;

      // Sau khi render, "nhích" thanh cuộn lên 20px (hoặc giá trị bạn muốn)
      commentsContainerRef.current.scrollTop = currentScrollPosition - 20;
    }
  }, [listComment]); // Thực hiện sau khi danh sách comment thay đổi

  useEffect(() => {
    const handleClickOption = (e: Event) => {
      const clickOptionCommentEl = document.getElementById("option_comment");
      if (e.target instanceof Node && !clickOptionCommentEl?.contains(e.target))
        setExecuteComment({
          ...executeComment,
          isClickComment: false,
          postId: "",
          commentId: null,
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

  const renderChildComments = (parentId: number | null, level: number) => {
    return listComment
      .filter((comment) => {
        return (
          +comment.parent_comment_id! === +parentId! &&
          comment.post_id === postId
        );
      })
      .sort((a, b) => {
        // So sánh createdAt theo thứ tự giảm dần
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      })
      .map((comment) => {
        return renderComment(comment, level);
      });
  };

  const renderComment = (comment: infoComment, level: number = 0) => {
    return (
      <div
        key={comment.id}
        className="w-full mb-1"
        style={{ marginLeft: `${level * 20}px` }}
      >
        <div className="flex items-start w-full">
          <Link
            to={`/${path.PROFILE}/`}
            className="w-9 h-8 mt-[2px] mr-[6px] inline-block"
          >
            <img
              src={comment.user.avatar}
              alt="avatar"
              className="w-full h-full rounded-full object-cover"
            />
          </Link>
          <div className="flex flex-col justify-center w-full">
            <div className="flex items-center gap-1">
              <div className="flex flex-col justify-center max-w-[95%]">
                <div className="self-start w-full py-2 px-3 flex flex-col rounded-xl bg-[#f2f2f2] break-all">
                  <span className="text-[#080809] text-[13px] font-semibold">
                    {comment.user.lastName + " " + comment.user.firstName}
                  </span>
                  <span className="text-[#080809] text-[15px] leading-5">
                    {comment.comment_text}
                  </span>
                </div>
              </div>
              {/* option: edit, delete comment */}
              <EditDeleteComment
                el={comment}
                postId={postId}
                executeComment={executeComment}
                setExecuteComment={setExecuteComment}
                handleDeleteComment={handleDeleteComment}
              />
            </div>

            {/* time, like and reply comment */}
            <InfoComment
              el={comment}
              postId={postId}
              executeComment={executeComment}
              setExecuteComment={setExecuteComment}
              commentResponse={commentResponse}
              setCommentResponse={setCommentResponse}
            />
            {/* Hiển thị các comment con (comment của comment này) */}
            {renderChildComments(comment.id, level)}

            {/* Form viết comment */}
            {commentResponse.map(
              (response) =>
                response.parentCommentId === comment.id &&
                response.postId === postId &&
                response.isClickResponse && (
                  <div key={response.postId} className="flex items-start">
                    <Link
                      to={`/${path.PROFILE}/`}
                      className="w-8 h-8 mt-[2px] mr-[6px]"
                      style={{ marginLeft: `${level * 20}px` }}
                    >
                      <img
                        src={comment.user.avatar}
                        alt="avatar"
                        className="w-full h-full rounded-full object-cover"
                      />
                    </Link>
                    <FormWriteComment
                      replyCommentId={comment.id}
                      replyText={response.replyText || null}
                      commentResponse={commentResponse}
                      setCommentResponse={setCommentResponse}
                      parentCommentId={response.parentCommentId || null}
                      listComment={listComment}
                      responseUserComment={`${response.user?.lastName} ${response.user?.firstName}`}
                      postId={postId}
                      executeComment={executeComment}
                      setExecuteComment={setExecuteComment}
                    />
                  </div>
                )
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderComments = () => {
    return listComment
      .filter(
        (comment) =>
          comment.post_id === postId && comment.parent_comment_id === null
      )
      .map((comment) => renderComment(comment, 0)); // Đặt level = 0 cho comment cha
  };
  return <div ref={commentsContainerRef}>{renderComments()}</div>;

  // return (
  //   <>
  //     {listComment.length > 0 &&
  //       listComment
  //         .filter((comment) => comment.post_id === postId)
  //         .map((el) => (
  //           <div className="w-full">
  //             <div className="flex items-start w-full">
  //               <Link
  //                 to={`/${path.PROFILE}/`}
  //                 className="w-8 h-8 mt-[2px] mr-[6px]"
  //               >
  //                 <img
  //                   src={el.user.avatar}
  //                   alt="avatar"
  //                   className="w-full h-full rounded-full object-cover"
  //                 />
  //               </Link>
  //               {!(
  //                 executeComment.isEditComment &&
  //                 executeComment.postId === postId &&
  //                 executeComment.commentId === el.id
  //               ) ? (
  //                 <div className="flex flex-col justify-center w-full">
  //                   <div className="flex items-center gap-1">
  //                     <div className="flex flex-col justify-center max-w-[95%]">
  //                       <div className="self-start w-full py-2 px-3 flex flex-col rounded-xl bg-[#f2f2f2] break-all">
  //                         <span className="text-[#080809] text-[13px] font-semibold">
  //                           {el.user.lastName + " " + el.user.firstName}
  //                         </span>
  //                         <span className="text-[#080809] text-[15px] leading-5">
  //                           {el.comment_text}
  //                         </span>
  //                       </div>
  //                     </div>
  //                     {/* option: edit, delete comment */}
  //                     <EditDeleteComment
  //                       el={el}
  //                       postId={postId}
  //                       executeComment={executeComment}
  //                       setExecuteComment={setExecuteComment}
  //                       handleDeleteComment={handleDeleteComment}
  //                     />
  //                   </div>

  //                   {/* time, like and reply comment */}
  //                   <InfoComment
  //                     el={el}
  //                     postId={postId}
  //                     executeComment={executeComment}
  //                     setExecuteComment={setExecuteComment}
  //                     commentResponse={commentResponse}
  //                     setCommentResponse={setCommentResponse}
  //                   />
  //                   {/* Phản hồi comment */}
  //                   {commentResponse.length > 0 &&
  //                     commentResponse.map((item, idx) => (
  //                       <>
  //                         {item.parentCommentId === el.id &&
  //                           item.postId === postId &&
  //                           item.isClickResponse && (
  //                             <div key={idx} className="flex items-start mt-2">
  //                               <Link
  //                                 to={`/${path.PROFILE}/`}
  //                                 className="w-6 h-6 mt-[2px] mr-[6px]"
  //                               >
  //                                 <img
  //                                   src={el.user.avatar}
  //                                   alt="avatar"
  //                                   className="w-full h-full rounded-full object-cover"
  //                                 />
  //                               </Link>
  //                               <FormWriteComment
  //                                 replyCommentId={el.id}
  //                                 replyText={item.replyText || null}
  //                                 commentResponse={commentResponse}
  //                                 setCommentResponse={setCommentResponse}
  //                                 parentCommentId={item.parentCommentId || null}
  //                                 listComment={listComment}
  //                                 responseUserComment={
  //                                   item.user?.lastName +
  //                                   " " +
  //                                   item.user?.firstName
  //                                 }
  //                                 postId={postId}
  //                                 executeComment={executeComment}
  //                                 setExecuteComment={setExecuteComment}
  //                               />
  //                             </div>
  //                           )}
  //                       </>
  //                     ))}
  //                 </div>
  //               ) : (
  //                 executeComment.isEditComment && (
  //                   <div className="w-full flex flex-col items-start">
  //                     <FormWriteComment
  //                       commentId={el.id}
  //                       postId={postId}
  //                       executeComment={executeComment}
  //                       setExecuteComment={setExecuteComment}
  //                       defaultValueComment={el.comment_text}
  //                     />
  //                     <span
  //                       className="p-[6px] text-blue-600 text-[13px] cursor-pointer"
  //                       onClick={(e) => {
  //                         e.stopPropagation();
  //                         setExecuteComment({
  //                           ...executeComment,
  //                           isEditComment: false,
  //                         });
  //                       }}
  //                     >
  //                       Huỷ
  //                     </span>
  //                   </div>
  //                 )
  //               )}
  //             </div>
  //           </div>
  //         ))}
  //   </>
  // );
};

export default ShowListComment;
