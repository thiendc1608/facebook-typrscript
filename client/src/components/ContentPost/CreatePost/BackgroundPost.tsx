import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import backgroundPost from "@/assets/images/background_post.png";
import { BsEmojiSmile } from "react-icons/bs";
import { FaAngleLeft } from "react-icons/fa6";
import { backGroundContent } from "@/utils/path";
import { useDispatch, useSelector } from "react-redux";
import { ImageVideoState, postType, showEmojiType } from "@/types";
import { RiImageAddFill } from "react-icons/ri";
import { IoIosClose } from "react-icons/io";
import {
  addImageVideo,
  addImageToList,
  editImages,
  removeImageVideoTag,
} from "@/redux/imageVideoSlice";
import { showEmoji } from "@/redux/emojiSlice";
import { setTextPost } from "@/redux/postSlice";
import { MdEdit } from "react-icons/md";
import DisplayImages from "./DisplayImages";
import Map from "./Map";

const BackgroundPost = () => {
  const dispatch = useDispatch();
  const { imageList, listObjectImage } = useSelector(
    (state: { imageVideo: ImageVideoState }) => state.imageVideo
  );
  const { textPost, isCheckIn } = useSelector(
    (state: { post: postType }) => state.post
  );
  const { isShowEmoji } = useSelector(
    (state: { emoji: showEmojiType }) => state.emoji
  );
  const { isAddImageVideo } = useSelector(
    (state: { imageVideo: ImageVideoState }) => state.imageVideo
  );
  const myRef = useRef<HTMLTextAreaElement | null>(null);
  const [isChangeBackground, setIsChangeBackground] = useState(false);
  const [colorBackground, setColorBackground] = useState({
    color: "rgba(255, 255, 255, 1)",
    color_id: 1,
  });

  useEffect(() => {
    myRef.current!.value = `${textPost}`;
    myRef.current?.focus();
  }, [textPost]);

  useEffect(() => {
    if (myRef.current) {
      if (colorBackground.color.includes("rgba(255, 255, 255, 1)")) {
        dispatch(removeImageVideoTag({ isDisplay: false }));
      } else {
        dispatch(removeImageVideoTag({ isDisplay: true }));
      }
      if (colorBackground.color.startsWith("rgb")) {
        myRef.current.style.backgroundColor = colorBackground.color;
        myRef.current.style.backgroundImage = "";
      } else {
        myRef.current.style.backgroundColor = "";
        myRef.current.style.backgroundImage = colorBackground.color;
      }
      // backgroundPostEle?.focus();
    }
  }, [colorBackground, dispatch]);

  const handleOnInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    dispatch(setTextPost((e.target as HTMLTextAreaElement)?.value));
    myRef.current!.style.height = "auto";
    myRef.current!.style.height = `${myRef.current!.scrollHeight}px`;
  };

  return (
    <div
      className={cn(
        "px-4 relative overflow-y-auto",
        colorBackground.color === "rgba(255, 255, 255, 1)"
          ? "h-[154px]"
          : "h-[347.22px] px-0",
        isAddImageVideo && "h-[270px]"
      )}
    >
      {!isAddImageVideo && (
        <textarea
          autoFocus
          ref={myRef}
          rows={4}
          cols={50}
          placeholder="Bạn đang nghĩ gì thế?"
          className={cn(
            "w-full h-full outline-none text-[24px] break-words whitespace-pre-wrap select-text leading-[30px] bg-100 caret-black text-[#222]",
            colorBackground.color !== "rgba(255, 255, 255, 1)" &&
              "place-holder-center text-center  caret-slate-200 text-white"
          )}
        />
      )}
      {isAddImageVideo && (
        <div>
          <textarea
            value={textPost}
            autoFocus
            ref={myRef}
            rows={1}
            cols={50}
            placeholder="Bạn đang nghĩ gì thế?"
            className={cn(
              "w-[calc(100%-24px)] h-auto bg-100 caret-black text-[#222] text-[15px] leading-[20px] outline-none resize-none",
              colorBackground.color !== "rgba(255, 255, 255, 1)" &&
                "place-holder-center text-center caret-slate-200 text-white"
            )}
            onInput={(e) => handleOnInput(e)}
          ></textarea>
          <div className="mt-8 p-2 border border-solid border-[#CED0D4] rounded-lg h-full relative">
            {isCheckIn === 0 ? (
              <div className="bg-[#F7F8FA] hover:cursor-pointer hover:bg-[#EAEBED] rounded-lg h-[240px] max-h-[464px] flex items-center justify-center">
                {listObjectImage.length > 0 ? (
                  <DisplayImages listObjectImage={listObjectImage} />
                ) : (
                  <>
                    <input
                      id="image-video"
                      type="file"
                      multiple
                      accept="image/*,image/heif,image/heic,video/*,video/mp4,video/x-m4v,video/x-matroska,.mkv"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files) {
                          dispatch(
                            addImageToList([...Array.from(e.target.files)])
                          );
                        }
                      }}
                    />
                    <label
                      htmlFor="image-video"
                      className="flex flex-col items-center justify-center w-full h-full gap-1"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#D8DADF] flex items-center justify-center">
                        <RiImageAddFill size={20} />
                      </div>
                      <span className="text-[15px] text-[#050505]">
                        Thêm ảnh/video
                      </span>
                      <span className="text-[12px] text-[#65676b]">
                        hoặc kéo và thả
                      </span>
                    </label>
                  </>
                )}
                {imageList.length > 0 && (
                  <div className="absolute top-0 left-1 flex gap-[10px]">
                    <div className="p-[6px]">
                      <div
                        className="px-3 w-auto h-8 text-[#050505] text-[15px] bg-white hover:bg-[#F2F2F2] flex items-center rounded-lg gap-2"
                        onClick={() => dispatch(editImages(true))}
                      >
                        <MdEdit size={16} />
                        <span>Chỉnh sửa</span>
                      </div>
                    </div>
                    <div className="p-[6px]">
                      <input
                        id="image-video"
                        type="file"
                        multiple
                        accept="image/*,image/heif,image/heic,video/*,video/mp4,video/x-m4v,video/x-matroska,.mkv"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files) {
                            dispatch(
                              addImageToList([
                                ...imageList,
                                ...Array.from(e.target.files),
                              ])
                            );
                          }
                        }}
                      />
                      <label
                        htmlFor="image-video"
                        className="px-3 w-auto h-8 text-[#050505] text-[15px] bg-white hover:bg-[#F2F2F2] flex items-center rounded-lg gap-2 cursor-pointer"
                      >
                        <RiImageAddFill size={16} />
                        <span className="text-[15px] text-[#050505]">
                          Thêm ảnh/video
                        </span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <Map />
              </div>
            )}
            <div
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white flex items-center justify-center cursor-pointer hover:scale-110 hover:text-red-500"
              onClick={() => dispatch(addImageVideo(!isAddImageVideo))}
            >
              <IoIosClose size={24} />
            </div>
          </div>
        </div>
      )}
      {!isAddImageVideo && (
        <>
          {isChangeBackground ? (
            <div className="absolute bottom-0 left-4 flex gap-2">
              <div
                className="w-9 h-9 cursor-pointer bg-[#E4E6EB] flex items-center justify-center rounded-lg"
                onClick={() => setIsChangeBackground(false)}
              >
                <FaAngleLeft size={20} />
              </div>
              {backGroundContent.map((item) => (
                <>
                  {item.backGround.includes("rgba") ? (
                    <div
                      key={item.id}
                      style={{ backgroundColor: item.backGround }}
                      className={cn(
                        "w-9 h-9 cursor-pointer bg-[#E4E6EB] flex items-center justify-center rounded-lg bg-100",
                        colorBackground.color_id === item.id &&
                          "shadow-bgContent"
                      )}
                      onClick={() => {
                        setColorBackground({
                          color: item.backGround,
                          color_id: item.id,
                        });
                      }}
                    ></div>
                  ) : (
                    <div
                      key={item.id}
                      style={{ backgroundImage: item.backGround }}
                      className={cn(
                        "w-9 h-9 cursor-pointer bg-[#E4E6EB] flex items-center justify-center rounded-lg bg-100",
                        colorBackground.color_id === item.id &&
                          "shadow-bgContent"
                      )}
                      onClick={() =>
                        setColorBackground({
                          color: item.backGround,
                          color_id: item.id,
                        })
                      }
                    ></div>
                  )}
                </>
              ))}
            </div>
          ) : (
            <div
              className={cn("absolute bottom-0 left-4")}
              onClick={() => setIsChangeBackground(true)}
            >
              <img
                src={backgroundPost}
                alt="backgroundPost"
                className="w-[38px] h-[38px] cursor-pointer"
              />
            </div>
          )}
        </>
      )}

      <div
        title="Emoji"
        className={cn(
          "absolute right-4 cursor-pointer",
          isAddImageVideo ? "top-2" : "bottom-2"
        )}
        onClick={() => {
          dispatch(showEmoji({ isShowEmoji: !isShowEmoji }));
        }}
      >
        <BsEmojiSmile
          size={24}
          color={
            colorBackground.color === "rgba(255, 255, 255, 1)"
              ? "#6C737B"
              : "white"
          }
        />
      </div>
    </div>
  );
};

export default BackgroundPost;
