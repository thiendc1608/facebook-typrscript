import { cn } from "@/lib/utils";
import { addEmojiToCommentPost, commentType } from "@/redux/commentSlice";
import { addEmojiToPost, showEmojiType } from "@/redux/emojiSlice";
import { messageSliceType, setChangeEmojiMessage } from "@/redux/messageSlice";
import { showModal } from "@/redux/modalSlice";
import EmojiPicker, { EmojiStyle, SkinTones } from "emoji-picker-react";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

interface EmojiProps {
  activeSkinTone: SkinTones;
  unified: string;
  unifiedWithoutSkinTone: string;
  emoji: string; // the emoji character, for example: '😀'. Emoji ID in custom emojis
  isCustom: boolean; // whether the emoji is a custom emoji or not
  names: string[];
  imageUrl: string; // the url of the emoji image with the current emoji style applied
  getImageUrl: (emojiStyle: EmojiStyle) => string; // a function that receives an emoji style and returns the url of the emoji image with the provided style applied
}

interface EmojiPickerProps {
  setPickerOpen?: (pickerOpen: boolean) => void;
  setEmoji?: (emoji: string) => void;
}
const EmojiPickerComponent = ({
  setPickerOpen,
  setEmoji,
}: EmojiPickerProps) => {
  const dispatch = useDispatch();
  const pickerRef = useRef<HTMLDivElement>(null);
  const { changeEmojiMessage } = useSelector(
    (state: { message: messageSliceType }) => state.message
  );
  const { isShowEmoji } = useSelector(
    (state: { emoji: showEmojiType }) => state.emoji
  );
  const { valueEmoji } = useSelector(
    (state: { comment: commentType }) => state.comment
  );

  useEffect(() => {
    const pickerEle = (e: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(e.target as Node | null)
      )
        setPickerOpen?.(false);
    };
    document.addEventListener("mousedown", pickerEle);
    return () => {
      document.removeEventListener("mousedown", pickerEle); // Use the copied value in the cleanup function
    };
  }, [setPickerOpen]);

  return (
    <div
      className={cn(
        "shadow-blurEmoji overflow-hidden rounded-lg",
        !changeEmojiMessage.isChangeEmoji &&
          "absolute bottom-[55px] right-0 z-[999]",
        isShowEmoji && "absolute bottom-[200px] right-[80px]"
      )}
      ref={pickerRef}
      onClick={(e) => e.stopPropagation()}
    >
      <EmojiPicker
        height={400}
        width={350}
        onEmojiClick={(emoji: EmojiProps) => {
          if (!changeEmojiMessage.isChangeEmoji) {
            if (isShowEmoji) dispatch(addEmojiToPost(emoji.emoji));
            else if (valueEmoji.isShowEmojiPost) {
              dispatch(
                addEmojiToCommentPost({ ...valueEmoji, emoji: emoji.emoji })
              );
            } else setEmoji?.(emoji.emoji);
          } else {
            dispatch(
              setChangeEmojiMessage({
                isChangeEmoji: false,
                emojiValue: emoji.unified,
              })
            );
            dispatch(showModal({ isShowModal: false, childrenModal: null }));
          }
        }}
      />
    </div>
  );
};

export default EmojiPickerComponent;
