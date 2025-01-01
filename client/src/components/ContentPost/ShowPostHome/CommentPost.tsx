import { forwardRef } from "react";
import "./ShowPostHome.css";
import { useSelector } from "react-redux";
import { commentType } from "@/redux/commentSlice";
import ShowListComment from "./ShowListComment";
import FormWriteComment from "./FormWriteComment";

interface CommentPostProps {
  postId: string;
  isClickTabComment: boolean;
}

const CommentPost = forwardRef<HTMLDivElement, CommentPostProps>(
  (props, ref) => {
    const { postId } = props;

    const { listComment } = useSelector(
      (state: { comment: commentType }) => state.comment
    );

    return (
      <div className="border-t border-solid border-[#d9d9d9]">
        {props.isClickTabComment && (
          <div className="p-3 w-full flex flex-col gap-2">
            <ShowListComment listComment={listComment} postId={postId} />
            <div className="flex items-center">
              <div className="mt-[2px] mr-[6px]">
                <img
                  src=""
                  alt="anh"
                  className="w-[32px] h-[32px] rounded-full object-cover"
                />
              </div>
              <FormWriteComment ref={ref} postId={postId} />
            </div>
          </div>
        )}
      </div>
    );
  }
);

export default CommentPost;
