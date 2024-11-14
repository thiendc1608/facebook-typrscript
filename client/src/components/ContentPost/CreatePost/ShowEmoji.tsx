import { getEmojiList } from "@/redux/emojiSlice";
import { addEmoji } from "@/redux/postSlice";
import { emojiType, showEmojiType } from "@/types";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const ShowEmoji = () => {
  const { emojiList } = useSelector(
    (state: { emoji: showEmojiType }) => state.emoji
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getEmojiList());
  }, []);

  return (
    <div
      className="absolute top-[70px] left-[54%] w-[340px] h-[250px] bg-white rounded-lg shadow-default z-[101] flex flex-wrap overflow-y-scroll overflow-x-hidden pt-2"
      onClick={(e) => e.stopPropagation()}
    >
      {emojiList.length > 0 &&
        emojiList.map((item: emojiType, idx) => (
          <div
            key={idx}
            className="w-[40px] h-[40px] hover:bg-[#F2F2F2] rounded-full flex items-center justify-center"
            onClick={() => {
              dispatch(
                addEmoji(String.fromCodePoint(parseInt(item.codePoint, 16)))
              );
            }}
          >
            <div className="text-[22px] cursor-pointer">{item.character}</div>
          </div>
        ))}
    </div>
  );
};

export default ShowEmoji;
