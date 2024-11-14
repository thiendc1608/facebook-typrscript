import { IoMdClose } from "react-icons/io";
import anonymousAvatar from "@/assets/images/default_avatar.jpg";
import { FaCaretDown } from "react-icons/fa";
import "../ContentPost.css";
import { Button } from "../../ui/button";
import BackgroundPost from "./BackgroundPost";
import AddContent from "./AddContent";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import ViewerPost from "./ViewerPost";
import { ImageVideoState, postType, showEmojiType } from "@/types";
import { showModal } from "@/redux/modalSlice";
import { showEmoji } from "@/redux/emojiSlice";
import { cn } from "@/lib/utils";
import { setCheckIn } from "@/redux/postSlice";
import publicImage from "@/assets/images/public.png";

const CreatePost = () => {
  const dispatch = useDispatch();
  const { locationTag } = useSelector(
    (state: { post: postType }) => state.post
  );
  const { isShowEmoji } = useSelector(
    (state: { emoji: showEmojiType }) => state.emoji
  );
  const [isSelectMode, setIsSelectMode] = useState<boolean>(false);
  const createPostRef = useRef<HTMLDivElement>(null);
  const PostObjectRef = useRef<HTMLDivElement>(null);
  const { isEditImages } = useSelector(
    (state: { imageVideo: ImageVideoState }) => state.imageVideo
  );
  const { isTagName, isCheckIn } = useSelector(
    (state: { post: postType }) => state.post
  );
  const [selectPostObject, setSelectPostObject] = useState({
    icon: publicImage,
    name: "Công khai",
  });

  useEffect(() => {
    if (isSelectMode) {
      createPostRef.current!.style.transform = "translateX(-100%)";
      createPostRef.current!.style.visibility = "hidden";
      PostObjectRef.current!.style.transform = "translateX(-100%)";
      PostObjectRef.current!.style.visibility = "visible";
    } else {
      if (createPostRef.current) {
        createPostRef.current.style.transform = "translateX(0)";
        createPostRef.current.style.visibility = "visible";
      }
      if (PostObjectRef.current) {
        PostObjectRef.current.style.transform = "translateX(0)";
        PostObjectRef.current.style.visibility = "hidden";
      }
    }
  }, [isSelectMode]);

  return (
    <div className="relative">
      <div
        className={cn(
          "w-[500px] bg-white rounded-lg",
          (isEditImages || isTagName || isCheckIn) && "hidden"
        )}
        onClick={(e) => {
          e.stopPropagation();
          if (isShowEmoji) {
            dispatch(showEmoji({ isShowEmoji: !isShowEmoji }));
          }
        }}
        ref={createPostRef}
        style={{ transition: "transform 0.5s" }}
      >
        <div className="relative w-full h-[60px] border-b border-solid border-[#E5E5E5] flex items-center justify-center">
          <div className="text-[#050505] text-[20px] text-center">
            Tạo bài viết
          </div>
          <div
            className="absolute top-2 right-3 w-9 h-9 rounded-full bg-[#D8DADF] text-[#5B626A] flex items-center justify-center cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              dispatch(
                showModal({
                  isShowModal: false,
                  childrenModal: null,
                })
              );
            }}
          >
            <IoMdClose size={24} />
          </div>
        </div>
        <div className="mx-4">
          <div className="py-4 flex items-center gap-[10px]">
            <div>
              <img
                src={anonymousAvatar}
                alt="anonymousAvatar"
                className="w-10 h-10 rounded-full object-cover cursor-pointer"
              />
            </div>
            <div className="flex flex-col gap-[4px]">
              {locationTag ? (
                <span className="flex-none text-[#050505] text-[15px]">
                  Name đang ở{" "}
                  <span
                    className="hover:underline cursor-pointer font-semibold"
                    onClick={() => {
                      dispatch(setCheckIn(1));
                    }}
                  >
                    {locationTag.name}
                  </span>
                </span>
              ) : (
                <span className="text-[#050505] text-[15px]">Name</span>
              )}

              <div
                className="py-1 px-2 rounded-[4px] bg-[#E4E6EB] max-w-[130px]"
                onClick={() => setIsSelectMode(true)}
              >
                <span className="flex items-center justify-start cursor-pointer gap-1">
                  <img
                    src={selectPostObject.icon}
                    alt="icon"
                    className="w-3 h-3"
                  />
                  <span className="text-[#050505] text-[15px]">
                    {selectPostObject.name}
                  </span>
                  <FaCaretDown />
                </span>
              </div>
            </div>
          </div>
        </div>
        <BackgroundPost />
        <AddContent />
        <div className="mx-4 pb-4">
          <Button className="w-full bg-blue-500 hover:bg-blue-400">Đăng</Button>
        </div>
      </div>
      <ViewerPost
        ref={PostObjectRef}
        selectMode={selectPostObject}
        setIsSelectMode={setIsSelectMode}
        setSelectPostObject={setSelectPostObject}
      />
    </div>
  );
};

export default CreatePost;
