import React from "react";
import { BsThreeDots } from "react-icons/bs";
import { executeCommentType } from "./ShowListComment";
import { infoComment } from "@/types";
interface InfoCommentProps {
  el: infoComment;
  postId: string;
  executeComment?: executeCommentType;
  setExecuteComment?: React.Dispatch<React.SetStateAction<executeCommentType>>;
  handleDeleteComment: (e: React.MouseEvent<HTMLDivElement>) => void;
}
const EditDeleteComment = ({
  el,
  postId,
  executeComment,
  setExecuteComment,
  handleDeleteComment,
}: InfoCommentProps) => {
  return (
    <div
      className="relative w-[32px] h-[32px] rounded-full hover:bg-[#f2f2f2] flex items-center justify-center cursor-pointer"
      title="Chỉnh sửa hoặc xoá bình luận này"
      id="option_comment"
      onClick={(e) => {
        e.stopPropagation();
        setExecuteComment?.({
          ...executeComment!,
          isClickComment: !executeComment!.isClickComment,
          postId: el.post_id,
          commentId: el.id,
        });
      }}
    >
      <BsThreeDots size={18} color="#606366" />
      {executeComment!.isClickComment &&
        executeComment!.postId === postId &&
        executeComment!.commentId === el.id && (
          <div className="absolute w-auto top-10 left-0 py-2 h-[86px] bg-white rounded-xl shadow-bgContent z-[10]">
            <div
              className="mx-2 py-2 px-3 h-[35px] text-[#080809] text-[15px] hover:bg-[#f2f2f2] rounded-lg whitespace-nowrap"
              onClick={(e) => {
                e.stopPropagation();
                setExecuteComment?.({
                  ...executeComment!,
                  isEditComment: true,
                  isClickComment: false,
                });
              }}
            >
              Chỉnh sửa
            </div>
            <div
              className="mx-2 py-2 px-3 h-[35px] text-[#080809] text-[15px] hover:bg-[#f2f2f2] rounded-md"
              onClick={(e: React.MouseEvent<HTMLDivElement>) =>
                handleDeleteComment(e)
              }
            >
              Xoá
            </div>
          </div>
        )}
    </div>
  );
};

export default EditDeleteComment;
