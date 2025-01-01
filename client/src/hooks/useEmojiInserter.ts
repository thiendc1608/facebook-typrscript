import { useEffect } from "react";

interface emojiInserterProps {
  currentPostId: string; // ID của bài post
  replyCommentId?: number; // ID của bình luận con (nếu có)
  parentCommentId?: number; // ID của bình luận cha nếu đang là bình luận con
  insertEmojiPostId: string; // Post hoặc comment ID để xác định phần cần chèn emoji
  divRef: React.RefObject<HTMLDivElement>; // Ref của div input
  emoji: string; // Emoji mà người dùng chọn
  setCursorToEnd: (editableDiv: HTMLDivElement) => void; // Hàm di chuyển con trỏ đến cuối
  setInputValue: (value: string) => void; // Hàm cập nhật giá trị input
}
const useEmojiInserter = ({
  replyCommentId,
  parentCommentId,
  currentPostId,
  insertEmojiPostId,
  divRef,
  emoji,
  setCursorToEnd,
  setInputValue,
}: emojiInserterProps) => {
  useEffect(() => {
    if (
      (!parentCommentId && !replyCommentId) ||
      (parentCommentId &&
        replyCommentId === parentCommentId &&
        divRef &&
        emoji &&
        currentPostId === insertEmojiPostId)
    ) {
      const editableDiv = divRef.current;
      editableDiv!.focus(); // Focus the div

      // Place the cursor at the end
      setCursorToEnd(editableDiv!);

      const selection = window.getSelection();
      const range = selection?.getRangeAt(0);

      if (range) {
        // Delete any currently selected content
        range.deleteContents();

        // Create a text node with the emoji
        const emojiNode = document.createTextNode(emoji);

        // Insert the emoji into the document
        range.insertNode(emojiNode);

        // Move the cursor after the emoji
        range.setStartAfter(emojiNode);
        range.setEndAfter(emojiNode);

        // Update the selection to reflect the new cursor position
        selection?.removeAllRanges();
        selection?.addRange(range);

        // Update the value of the input (inner text of the div)
        setInputValue(editableDiv!.innerText);
      }
    }
  }, [emoji, divRef, replyCommentId, currentPostId, insertEmojiPostId]);
};

export default useEmojiInserter;
