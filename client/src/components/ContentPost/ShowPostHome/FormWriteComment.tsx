import { commentAPI } from "@/apis/commentApi";
import EmojiPickerComponent from "@/components/Header/Messenger/EmojiPicker";
import useEmojiInserter from "@/hooks/useEmojiInserter";
import { cn } from "@/lib/utils";
import {
  addEmojiToCommentPost,
  commentType,
  setListComment,
  updateComment,
} from "@/redux/commentSlice";
import { UserState } from "@/redux/userSlice";
import {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { CiFaceSmile } from "react-icons/ci";
import { IoMdSend } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { executeCommentType } from "./ShowListComment";
import { infoComment } from "@/types";
import { setCursorToEnd } from "@/utils/helpers";

interface FormWriteCommentProps {
  replyText?: string | null;
  replyCommentId?: number;
  parentCommentId?: number | null;
  listComment?: infoComment[];
  postId: string;
  commentId?: number;
  executeComment?: executeCommentType;
  setExecuteComment?: React.Dispatch<React.SetStateAction<executeCommentType>>;
  defaultValueComment?: string;
  responseUserComment?: string;
  commentResponse?: executeCommentType[];
  setCommentResponse?: React.Dispatch<
    React.SetStateAction<executeCommentType[]>
  >;
}

const FormWriteComment = forwardRef<HTMLDivElement, FormWriteCommentProps>(
  (props, ref) => {
    const divRefs = useRef<HTMLDivElement | null>(null);
    const [inputValue, setInputValue] = useState<string>("");
    const [lastCommentedPost, setLastCommentedPost] = useState<string | null>(
      null
    );
    const { currentUser } = useSelector(
      (state: { user: UserState }) => state.user
    );
    const { valueEmoji, listComment } = useSelector(
      (state: { comment: commentType }) => state.comment
    );
    const dispatch = useDispatch();

    useImperativeHandle(
      ref,
      () =>
        ({
          focus: () => {
            divRefs.current?.focus();
          },
        } as HTMLDivElement)
    );

    const handleOnChangeComment = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if ((e.target as HTMLElement).innerHTML.trim() === "<br>") {
        (e.target as HTMLElement).innerHTML = ""; // Xóa toàn bộ nội dung, bao gồm cả thẻ <br>
      }
      setInputValue((e.target as HTMLElement).innerText ?? "");
      if (valueEmoji.isShowEmojiPost) {
        dispatch(
          addEmojiToCommentPost({
            ...valueEmoji,
            isShowEmojiPost: !valueEmoji.isShowEmojiPost,
          })
        );
      }
    };

    useEffect(() => {
      if (inputValue && props.commentResponse) {
        const commentResponse = props.commentResponse?.map((item) => {
          if (
            item.postId === props.postId &&
            item.parentCommentId === props.parentCommentId
          ) {
            return {
              ...item,
              replyText: inputValue,
            };
          }
          return item;
        });
        props.setCommentResponse!(commentResponse!);
      }
    }, [inputValue, props]);

    useEmojiInserter({
      replyCommentId: props.replyCommentId,
      parentCommentId: valueEmoji.parentCommentId || undefined,
      currentPostId: props.postId,
      insertEmojiPostId: valueEmoji.postId,
      divRef: divRefs,
      emoji: valueEmoji.emoji,
      setCursorToEnd,
      setInputValue,
    });

    const handleSendComment = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const dataComment = {
        post_id: props.postId,
        user_id: currentUser!.id,
        comment_text: inputValue,
        parent_comment_id: +props.parentCommentId! || null,
      };
      try {
        if (props.executeComment && props.executeComment.isEditComment) {
          props.setExecuteComment!({
            ...props.executeComment!,
            isEditComment: false,
          });
          const mergedObj = {
            ...dataComment,
            id: props.commentId!,
          };

          const response = await commentAPI.updateComment(mergedObj);

          if (response.success) {
            dispatch(updateComment(response.comment));
            dispatch(
              addEmojiToCommentPost({
                ...valueEmoji,
                isShowEmojiPost: !valueEmoji.isShowEmojiPost,
              })
            );
          }
        } else {
          const response = await commentAPI.createComment(dataComment);
          if (response.success) {
            setInputValue("");
            dispatch(setListComment(response.comment));
            dispatch(
              addEmojiToCommentPost({
                ...valueEmoji,
                isShowEmojiPost: !valueEmoji.isShowEmojiPost,
              })
            );
            setLastCommentedPost(props.postId);
          }
        }
      } catch (error) {
        console.error("Error create comment:", error);
      }
    };

    useEffect(() => {
      setTimeout(() => {
        if (divRefs.current && props.responseUserComment && props.replyText) {
          const p = document.createElement("p");
          p.style.display = "flex";
          const selection = window.getSelection();
          const range = document.createRange();
          if (
            props.responseUserComment !==
            currentUser?.lastName + " " + currentUser?.firstName
          ) {
            const span1 = document.createElement("span");
            span1.className = "bg-[#C2D6F7]"; // Thêm class cho phần background
            span1.innerHTML = props.responseUserComment;
            p.appendChild(span1);

            const space = document.createElement("span");
            space.innerHTML = "&nbsp;";
            p.appendChild(space);
            // Đặt con trỏ vào cuối span1 (nếu span2 chưa có nội dung)
            range.setStartAfter(span1);
            range.collapse(true);
          }
          const span2 = document.createElement("span"); // Tạo một text node rỗng
          span2.innerHTML = props.replyText;
          p.appendChild(span2); // Thêm vào div

          // Đặt con trỏ vào bên trong span2
          setTimeout(() => {
            range.selectNodeContents(span2); // Đảm bảo con trỏ được đặt vào span2
            selection?.removeAllRanges();
            selection?.addRange(range); // Thiết lập phạm vi con trỏ vào span2
            divRefs.current!.focus(); // Đặt focus vào inputRef
          }, 0); // Chạy
          divRefs.current.appendChild(p);
        }
      }, 0);
    }, [currentUser, props.responseUserComment]);

    useEffect(() => {
      if (lastCommentedPost === props.postId) {
        setTimeout(() => {
          divRefs.current?.focus();
          divRefs.current!.innerHTML = "";
          setLastCommentedPost(null);
        }, 100);
      }
    }, [listComment, props.postId, lastCommentedPost]);

    useEffect(() => {
      if (divRefs.current) {
        divRefs.current.innerHTML = "";
        setInputValue("");
      }
    }, [listComment]);

    useEffect(() => {
      if (divRefs.current && props.defaultValueComment !== undefined) {
        divRefs.current.textContent = props.defaultValueComment;
        divRefs.current.focus();
        setCursorToEnd(divRefs.current);
      }
    }, [props.defaultValueComment]);

    return (
      <form
        id="comment-post"
        className="flex-1 relative rounded-xl bg-[#F0F2F5] w-full"
        onSubmit={(e) => handleSendComment(e)}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-3 pt-2">
          <div
            ref={divRefs}
            className="w-full text-[#65686c] text-[15px] outline-none break-all leading-5 h-auto"
            contentEditable="true"
            onKeyUp={(e: React.KeyboardEvent<HTMLDivElement>) =>
              handleOnChangeComment(e)
            }
            dangerouslySetInnerHTML={{
              __html: `<span class="bg-[#C2D6F7] h-5 w-auto">${props.responseUserComment}</span>`,
            }}
          />
          <div className="flex justify-between items-center">
            <ul className="flex items-center">
              <li
                className="relative cursor-pointer w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#E4E6E9]"
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(
                    addEmojiToCommentPost({
                      ...valueEmoji,
                      isShowEmojiPost: !valueEmoji.isShowEmojiPost,
                      postId: props.postId,
                      parentCommentId: props.parentCommentId,
                    })
                  );
                }}
              >
                <CiFaceSmile size={20} />
                {valueEmoji.isShowEmojiPost &&
                  props.postId === valueEmoji.postId &&
                  props.parentCommentId === valueEmoji.parentCommentId && (
                    <div className="absolute bottom-[-30px] right-0">
                      <EmojiPickerComponent />
                    </div>
                  )}
              </li>
            </ul>
            <button
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                inputValue !== ""
                  ? "hover:bg-[#E4E6E9] cursor-pointer"
                  : "cursor-no-drop"
              )}
              disabled={inputValue === "" ? true : false}
              type="submit"
            >
              <IoMdSend
                size={20}
                color={inputValue === "" ? "#d9d9d9" : "#0866ff"}
              />
            </button>
          </div>
        </div>
      </form>
    );
  }
);

export default memo(FormWriteComment);
