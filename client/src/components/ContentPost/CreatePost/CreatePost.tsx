import { IoMdClose } from "react-icons/io";
import { FaCaretDown } from "react-icons/fa";
import "../ContentPost.css";
import { Button } from "../../ui/button";
import BackgroundPost from "./BackgroundPost";
import AddContent from "./AddContent";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { showModal } from "@/redux/modalSlice";
import { addEmojiToPost, showEmoji, showEmojiType } from "@/redux/emojiSlice";
import { cn } from "@/lib/utils";
import {
  addTagName,
  postType,
  resetTextPost,
  setCheckIn,
  setListPost,
  setSelectObjectPost,
} from "@/redux/postSlice";
import { objectPost } from "@/utils/path";
import { UserState } from "@/redux/userSlice";
import { postAPI } from "@/apis/postApi";
import PulseLoader from "react-spinners/PulseLoader";
import { Link } from "react-router-dom";
import { messageSliceType, setSelectedImageList } from "@/redux/messageSlice";
import { addImageVideo, ImageVideoState } from "@/redux/imageVideoSlice";

const CreatePost = () => {
  const dispatch = useDispatch();
  const [isSelectMode, setIsSelectMode] = useState<boolean>(false);
  const [colorBackground, setColorBackground] = useState({
    color: "rgba(255, 255, 255, 1)",
    color_id: 1,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const wrapperPostRef = useRef<HTMLDivElement>(null);

  const { isShowEmoji } = useSelector(
    (state: { emoji: showEmojiType }) => state.emoji
  );
  const { selectImageList } = useSelector(
    (state: { message: messageSliceType }) => state.message
  );
  const { isEditImages, isAddImageVideo } = useSelector(
    (state: { imageVideo: ImageVideoState }) => state.imageVideo
  );
  const { tagUserList, isCheckIn, selectObjectPost, locationTag, textPost } =
    useSelector((state: { post: postType }) => state.post);
  const { currentUser } = useSelector(
    (state: { user: UserState }) => state.user
  );

  useEffect(() => {
    dispatch(addTagName({ ...tagUserList, isTagName: false }));

    if (wrapperPostRef.current) {
      const handleCloseSelectObject = (e: Event) => {
        const closeSelectObjectEl = document.getElementById("select-object");
        if (
          e.target instanceof Node &&
          !closeSelectObjectEl?.contains(e.target)
        )
          setIsSelectMode(false);
      };
      const currentWrapperPostRef = wrapperPostRef.current;
      currentWrapperPostRef.addEventListener("click", handleCloseSelectObject);
      return () =>
        currentWrapperPostRef.removeEventListener(
          "click",
          handleCloseSelectObject
        );
    }
  }, [dispatch]);

  const handlePostArticle = async () => {
    const newMessage = [];
    if (selectImageList) {
      if (selectImageList.length > 0) {
        newMessage.push(["imageInfo", { list_image: selectImageList }]);
      }
    }
    const postArticle = {
      user_id: currentUser?.id,
      post_content: textPost,
      post_background: colorBackground.color,
      post_object: selectObjectPost.name,
      list_image: selectImageList.length > 0 ? selectImageList : null,
    };
    setIsLoading(true);
    try {
      const response = await postAPI.createPost(postArticle);
      if (response.success) {
        dispatch(setListPost(response.post));
        dispatch(resetTextPost());
        dispatch(addEmojiToPost(""));
        dispatch(setSelectedImageList([]));
        dispatch(showModal({ isShowModal: false, childrenModal: null }));
        dispatch(addImageVideo(!isAddImageVideo));
      }
    } catch (error) {
      console.error("Error create post:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="relative">
        {isLoading ? (
          <div className="absolute inset-0 w-full h-full bg-[rgba(72,72,72,0.7)] flex flex-col items-center justify-center gap-4">
            <PulseLoader size={10} />
            <span className="text-[#080809] text-[20px] whitespace-nowrap">
              Đang đăng
            </span>
          </div>
        ) : (
          <div
            className={cn(
              "w-[500px] bg-white rounded-lg",
              (isEditImages || tagUserList.isTagName || isCheckIn) && "hidden"
            )}
            onClick={(e) => {
              e.stopPropagation();
              if (isShowEmoji) {
                dispatch(showEmoji({ isShowEmoji: !isShowEmoji }));
              }
            }}
            ref={wrapperPostRef}
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
                <Link
                  to={{
                    pathname: "/profile",
                    search: `?id=${currentUser?.id}`,
                  }}
                >
                  <img
                    src={currentUser?.avatar}
                    alt="anonymousAvatar"
                    className="w-10 h-10 rounded-full object-cover cursor-pointer"
                  />
                </Link>
                <div className="flex flex-col gap-[4px]">
                  <div className="text-[#050505] text-[15px] cursor-pointer">
                    <Link
                      to={{
                        pathname: "/profile",
                        search: `?id=${currentUser?.id}`,
                      }}
                      className="hover:underline cursor-pointer"
                    >
                      {currentUser?.lastName + " " + currentUser?.firstName}{" "}
                    </Link>
                    {locationTag && (
                      <span>
                        đang ở
                        <span
                          className="hover:underline cursor-pointer font-semibold"
                          onClick={() => {
                            dispatch(setCheckIn(1));
                          }}
                        >
                          {locationTag.name}
                        </span>
                      </span>
                    )}
                    {tagUserList.listTag?.length > 0 && (
                      <span>
                        cùng với{" "}
                        {tagUserList.listTag.map((item, index) => (
                          <span
                            key={index}
                            className="hover:underline cursor-pointer font-semibold mr-2"
                            onClick={() => {
                              // dispatch(setCheckIn(1));
                              dispatch(
                                addTagName({ ...tagUserList, isTagName: true })
                              );
                            }}
                          >
                            {item.lastName + " " + item.firstName}
                          </span>
                        ))}
                      </span>
                    )}
                  </div>

                  <div
                    className="relative py-1 px-2 rounded-[6px] bg-[#E4E6EB] max-w-[130px]"
                    id="select-object"
                    onClick={() => setIsSelectMode(!isSelectMode)}
                  >
                    <div className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-1">
                        <selectObjectPost.icon size={12} />
                        <span className="text-[#050505] text-[15px]">
                          {selectObjectPost.name}
                        </span>
                      </div>
                      <FaCaretDown />
                    </div>
                    {isSelectMode && (
                      <ul className="absolute top-full left-0 w-full bg-white shadow-default rounded-bl-lg rounded-br-lg z-10">
                        {objectPost.map((item) => (
                          <li
                            key={item.id}
                            className="px-2 py-2 hover:bg-[#F0F2F5] cursor-pointer flex items-center gap-1"
                            onClick={() => {
                              dispatch(setSelectObjectPost(item));
                              setIsSelectMode(false);
                            }}
                          >
                            <item.icon size={12} />
                            <span className="text-[#050505] text-[15px]">
                              {item.name}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <BackgroundPost
              colorBackground={colorBackground}
              setColorBackground={setColorBackground}
            />
            <AddContent />
            <div className="mx-4 pb-4">
              <Button
                className={cn(
                  "w-full",
                  textPost || selectImageList.length > 0
                    ? "bg-blue-500 hover:bg-blue-400"
                    : "bg-[#E2E5E9] cursor-no-drop text-[#BCC0C4] hover:bg-[#E2E5E9]"
                )}
                onClick={handlePostArticle}
              >
                Đăng
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CreatePost;
