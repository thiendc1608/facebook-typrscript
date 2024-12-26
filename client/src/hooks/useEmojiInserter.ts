import { useEffect } from "react";

interface emojiInserterProps {
  currentPostId: string;
  insertEmojiPostId: string;
  divRef: React.RefObject<HTMLDivElement>;
  emoji: string;
  setCursorToEnd: (editableDiv: HTMLDivElement) => void;
  setInputValue: (value: string) => void;
}
const useEmojiInserter = ({
  currentPostId,
  insertEmojiPostId,
  divRef,
  emoji,
  setCursorToEnd,
  setInputValue,
}: emojiInserterProps) => {
  useEffect(() => {
    if (currentPostId === insertEmojiPostId && divRef.current && emoji) {
      const editableDiv = divRef.current;
      editableDiv.focus(); // Focus the div

      // Place the cursor at the end
      setCursorToEnd(editableDiv);

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
        setInputValue(editableDiv.innerText);
      }
    }
  }, [emoji, divRef]);
};

export default useEmojiInserter;
