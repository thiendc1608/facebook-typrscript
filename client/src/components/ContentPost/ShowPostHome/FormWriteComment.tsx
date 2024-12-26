import { commentAPI } from "@/apis/commentApi";
import EmojiPickerComponent from "@/components/Header/Messenger/EmojiPicker";
import useEmojiInserter from "@/hooks/useEmojiInserter";
import { cn } from "@/lib/utils";
import {
  addEmojiToCommentPost,
  commentType,
  setListComment,
} from "@/redux/commentSlice";
import { UserState } from "@/redux/userSlice";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { CiFaceSmile } from "react-icons/ci";
import { HiOutlineGif } from "react-icons/hi2";
import { IoMdSend } from "react-icons/io";
import { TiCameraOutline } from "react-icons/ti";
import { useDispatch, useSelector } from "react-redux";
import { executeCommentType } from "./ShowListComment";

interface FormWriteCommentProps {
  postId: string;
  commentId?: number;
  executeComment?: executeCommentType;
  setExecuteComment?: React.Dispatch<React.SetStateAction<executeCommentType>>;
  defaultValueComment?: string;
}

const FormWriteComment = forwardRef<HTMLDivElement, FormWriteCommentProps>(
  (props, ref) => {
    console.log(props.commentId);

    const inputRef = useRef<HTMLDivElement | null>(null);
    const [inputValue, setInputValue] = useState<string>("");
    const { currentUser } = useSelector(
      (state: { user: UserState }) => state.user
    );
    const { valueEmoji, listComment } = useSelector(
      (state: { comment: commentType }) => state.comment
    );
    const dispatch = useDispatch();
    const [pickerOpen, setPickerOpen] = useState<boolean>(false);
    useImperativeHandle(
      ref,
      () =>
        ({
          focus: () => {
            inputRef.current?.focus();
          },
        } as HTMLDivElement)
    );

    const handleOnChangeComment = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if ((e.target as HTMLElement).innerHTML.trim() === "<br>") {
        (e.target as HTMLElement).innerHTML = ""; // Xóa toàn bộ nội dung, bao gồm cả thẻ <br>
      }
      setInputValue((e.target as HTMLElement).innerText ?? "");
    };

    const setCursorToEnd = (editableDiv: HTMLDivElement): void => {
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(editableDiv);
      range.collapse(false); // Move the cursor to the end
      selection?.removeAllRanges();
      selection?.addRange(range);
    };

    useEmojiInserter({
      currentPostId: props.postId,
      insertEmojiPostId: valueEmoji.postId,
      divRef: inputRef,
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
        parent_comment_id: null,
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
            dispatch(setListComment(response.comment));
          }
        } else {
          const response = await commentAPI.createComment(dataComment);
          if (response.success) {
            setInputValue("");
            dispatch(setListComment(response.comment));
          }
        }
      } catch (error) {
        console.error("Error create comment:", error);
      }
    };

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current!.innerHTML = "";
        setInputValue("");
        inputRef.current!.focus();
      }
    }, [listComment]);

    useEffect(() => {
      if (inputRef.current && props.defaultValueComment !== undefined) {
        inputRef.current!.textContent = props.defaultValueComment;
        inputRef.current!.focus();
        setCursorToEnd(inputRef.current!);
      }
    }, [props.defaultValueComment]);

    return (
      <form
        id="comment-post"
        className="flex-1 relative rounded-2xl bg-[#F0F2F5] w-full"
        onSubmit={(e) => handleSendComment(e)}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-3 py-2">
          <div
            className="w-full text-[#65686c] text-[15px] outline-none break-all leading-5 h-auto"
            contentEditable="true"
            ref={inputRef}
            onKeyUp={(e: React.KeyboardEvent<HTMLDivElement>) =>
              handleOnChangeComment(e)
            }
          />
          <div className="flex justify-between items-center">
            <ul className="flex items-center mt-2 gap-1">
              <li
                className="relative cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setPickerOpen((prev) => !prev);
                  dispatch(
                    addEmojiToCommentPost({
                      ...valueEmoji,
                      isShowEmojiPost: !valueEmoji.isShowEmojiPost,
                      postId: props.postId,
                    })
                  );
                }}
              >
                <CiFaceSmile size={20} />
                {pickerOpen && props.postId === valueEmoji.postId && (
                  <div className="absolute bottom-[-30px] right-0">
                    <EmojiPickerComponent setPickerOpen={setPickerOpen} />
                  </div>
                )}
              </li>
              <li className="cursor-pointer">
                <TiCameraOutline size={20} />
              </li>
              <li className="cursor-pointer">
                <HiOutlineGif size={20} />
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

export default FormWriteComment;
