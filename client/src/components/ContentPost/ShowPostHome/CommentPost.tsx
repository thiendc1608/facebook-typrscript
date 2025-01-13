import { forwardRef, useContext } from "react";
import "./ShowPostHome.css";
import { useSelector } from "react-redux";
import { commentType } from "@/redux/commentSlice";
import ShowListComment from "./ShowListComment";
import FormWriteComment from "./FormWriteComment";
import { postResponseType } from "@/apis/postApi";
import { cn } from "@/lib/utils";
import { PostContext } from "@/context/PostContext";

interface CommentPostProps {
  item: postResponseType;
  postId: string;
}

const CommentPost = forwardRef<HTMLDivElement, CommentPostProps>(
  (props, ref) => {
    const { postId } = props;
    const { postClickImage } = useContext(PostContext);
    const { listComment } = useSelector(
      (state: { comment: commentType }) => state.comment
    );
    const commentCount = listComment.filter(
      (comment) => comment.post_id === postId
    ).length;

    return (
      <div className="border-t border-solid border-[#d9d9d9]">
        <div className="p-3 w-full flex flex-col gap-2">
          <ShowListComment listComment={listComment} postId={postId} />
          <div
            className={cn(
              postClickImage &&
                postClickImage?.id === postId &&
                "p-2 absolute bottom-0 left-0 right-0 border-t border-solid border-[#d9d9d9]",
              commentCount === 0 && "bottom-[330px]"
            )}
          >
            <div className="flex justify-start w-full">
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
        </div>
      </div>
    );
  }
);

export default CommentPost;
