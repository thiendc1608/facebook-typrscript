import EmojiPicker, { EmojiStyle, SkinTones } from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";

interface EmEmojiProps {
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
  setPickerOpen: (pickerOpen: boolean) => void;
}
const EmojiPickerComponent = ({ setPickerOpen }: EmojiPickerProps) => {
  const pickerRef = useRef<HTMLDivElement>(null);
  const [emoji, setEmoji] = useState<string>("");

  useEffect(() => {
    const pickerEle = (e: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(e.target as Node | null)
      )
        setPickerOpen(false);
    };
    document.addEventListener("mousedown", pickerEle);
    return () => {
      document.removeEventListener("mousedown", pickerEle); // Use the copied value in the cleanup function
    };
  }, [setPickerOpen]);

  return (
    <div
      className="absolute bottom-[60px] right-[-50px] z-[100] shadow-default overflow-hidden rounded-lg"
      ref={pickerRef}
    >
      <EmojiPicker
        height={400}
        width={350}
        onEmojiClick={(emoji: EmEmojiProps) => setEmoji(emoji.emoji)}
      />
    </div>
  );
};

export default EmojiPickerComponent;