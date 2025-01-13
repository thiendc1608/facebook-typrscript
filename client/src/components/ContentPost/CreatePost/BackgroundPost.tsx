import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import backgroundPost from "@/assets/images/background_post.png";
import { BsEmojiSmile } from "react-icons/bs";
import { FaAngleLeft } from "react-icons/fa6";
import { backGroundContent } from "@/utils/path";
import { useDispatch, useSelector } from "react-redux";
import { RiImageAddFill } from "react-icons/ri";
import { IoIosClose } from "react-icons/io";
import {
  addImageVideo,
  editImages,
  ImageVideoState,
  removeImageVideoTag,
} from "@/redux/imageVideoSlice";
import { showEmoji, showEmojiType } from "@/redux/emojiSlice";
import { postType, setInputTextPost } from "@/redux/postSlice";
import { MdEdit } from "react-icons/md";
import DisplayImages from "./DisplayImages";
import Map from "./Map";
import { toast } from "react-toastify";
import { conversationAPI } from "@/apis/conversationApi";
import { messageSliceType, setPostImageList } from "@/redux/messageSlice";
import PulseLoader from "react-spinners/PulseLoader";

interface BackgroundPostProps {
  colorBackground: {
    color: string;
    color_id: number;
  };
  setColorBackground: React.Dispatch<
    React.SetStateAction<{
      color: string;
      color_id: number;
    }>
  >;
}

const BackgroundPost = ({
  colorBackground,
  setColorBackground,
}: BackgroundPostProps) => {
  const dispatch = useDispatch();
  const divRef = useRef<HTMLDivElement | null>(null);
  const [isChangeBackground, setIsChangeBackground] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isScrolling, setIsScrolling] = useState(false);
  const [isElementHidden, setIsElementHidden] = useState(false);

  const { selectImageList } = useSelector(
    (state: { message: messageSliceType }) => state.message
  );
  const { textPost, isCheckIn } = useSelector(
    (state: { post: postType }) => state.post
  );
  const { isShowEmoji, emoji } = useSelector(
    (state: { emoji: showEmojiType }) => state.emoji
  );
  const { isAddImageVideo } = useSelector(
    (state: { imageVideo: ImageVideoState }) => state.imageVideo
  );

  // Thêm sự kiện để xử lý Enter
  // useEffect(() => {
  //   const editableDiv = divRef.current;
  //   editableDiv?.focus();
  //   if (!editableDiv) return;
  //   if (editableDiv) {
  //     editableDiv.innerHTML = textPost;
  //     setCursorToEnd(editableDiv);
  //   }

  //   const handleKeyDown = (event: KeyboardEvent) => {
  //     if (event.key === "Enter") {
  //       dispatch(setInputTextPost("\n"));
  //       event.preventDefault(); // Ngừng hành động mặc định của phím Enter

  //       // Lấy đối tượng selection hiện tại
  //       const selection = window.getSelection();
  //       if (!selection) return;
  //       const range = selection.getRangeAt(0);

  //       if (range) {
  //         // Tạo thẻ <br> cho dòng mới
  //         const br = document.createElement("br");
  //         const br2 = document.createElement("br"); // Chèn <br> vào vị trí con trỏ
  //         range.deleteContents(); // Xóa nội dung tại vị trí con trỏ
  //         range.insertNode(br); // Thêm <br>
  //         range.insertNode(br2); // Thêm thêm một <br> nữa để chắc chắn xuống dòng
  //         // Di chuyển con trỏ vào sau thẻ <br> vừa thêm
  //         const newRange = document.createRange();
  //         newRange.setStartAfter(br2); // Đặt con trỏ sau <br> thứ hai
  //         newRange.setEndAfter(br2); // Đặt kết thúc phạm vi sau <br> thứ hai
  //         selection.removeAllRanges();
  //         selection.addRange(newRange);

  //         // Cuộn xuống nếu cần
  //         // editableDiv.scrollTop = editableDiv.scrollHeight;
  //       }
  //     }
  //   };

  //   if (editableDiv) {
  //     editableDiv.addEventListener("keydown", handleKeyDown);

  //     // Dọn dẹp sự kiện khi component bị unmount
  //     return () => {
  //       editableDiv.removeEventListener("keydown", handleKeyDown);
  //     };
  //   }
  // }, [colorBackground]); // Cập nhật khi colorBackground thay đổi

  useEffect(() => {
    if (divRef.current) {
      if (colorBackground.color.includes("rgba(255, 255, 255, 1)")) {
        dispatch(removeImageVideoTag({ isDisplay: false }));
      } else {
        dispatch(removeImageVideoTag({ isDisplay: true }));
      }
      if (colorBackground.color.startsWith("rgb")) {
        divRef.current.style.backgroundColor = colorBackground.color;
        divRef.current.style.backgroundImage = "";
      } else {
        divRef.current.style.backgroundColor = "";
        divRef.current.style.backgroundImage = colorBackground.color;
      }
      // backgroundPostEle?.focus();
    }
  }, [colorBackground, dispatch]);

  useEffect(() => {
    const editableDiv = divRef.current;
    const checkScroll = () => {
      if (editableDiv) {
        // Kiểm tra xem thanh cuộn có xuất hiện hay không
        if (editableDiv.scrollHeight > editableDiv.clientHeight) {
          setIsScrolling(true); // Thanh cuộn xuất hiện
        } else {
          setIsScrolling(false); // Thanh cuộn không xuất hiện
        }
      }
    };

    // Lắng nghe sự thay đổi nội dung trong div
    const handleInput = () => {
      checkScroll(); // Kiểm tra khi có sự thay đổi nội dung
    };

    // Lắng nghe sự kiện input (khi người dùng gõ ký tự)
    if (editableDiv) {
      editableDiv.addEventListener("input", handleInput);
      // Kiểm tra ngay khi component mount
      checkScroll();
    }

    // Dọn dẹp sự kiện khi component unmount
    return () => {
      if (editableDiv) {
        editableDiv.removeEventListener("input", handleInput);
      }
    };
  }, []);

  useEffect(() => {
    if (divRef.current) {
      const editableDiv = divRef.current;
      editableDiv!.innerHTML = textPost;
      setCursorToEnd(editableDiv);
      editableDiv?.focus();
    }
  }, [isAddImageVideo, textPost]);

  // Logic để ẩn phần tử khi thanh cuộn xuất hiện
  useEffect(() => {
    if (isScrolling) {
      setIsElementHidden(true); // Ẩn phần tử khi có thanh cuộn
    } else {
      setIsElementHidden(false); // Hiện phần tử khi không có thanh cuộn
    }
  }, [isScrolling]);

  function setCursorToEnd(element: HTMLElement) {
    const range = document.createRange();
    const selection = window.getSelection();

    range.selectNodeContents(element); // Chọn toàn bộ nội dung
    range.collapse(false); // Đặt con trỏ ở cuối

    selection?.removeAllRanges(); // Xóa tất cả các vùng chọn hiện tại
    selection?.addRange(range); // Thêm vùng chọn mới vào cuối
  }

  useEffect(() => {
    if (divRef.current && emoji) {
      const editableDiv = divRef.current;
      editableDiv.focus();

      // Đặt con trỏ vào cuối nội dung hiện tại
      setCursorToEnd(editableDiv);

      // Lấy đối tượng selection và range hiện tại
      const selection = window.getSelection();
      const range = selection?.getRangeAt(0);

      if (range) {
        // Xóa nội dung đang được chọn
        range.deleteContents();

        // Tạo một thẻ span chứa emoji
        const emojiNode = document.createElement("span");
        emojiNode.textContent = emoji;
        emojiNode.style.whiteSpace = "normal"; // Đảm bảo emoji có thể xuống dòng nếu cần

        // Chèn emoji vào range hiện tại
        range.insertNode(emojiNode);

        // Đặt con trỏ sau emoji
        range.setStartAfter(emojiNode);
        range.setEndAfter(emojiNode);

        // Cập nhật selection
        selection?.removeAllRanges();
        selection?.addRange(range);

        // Cập nhật giá trị input
        dispatch(setInputTextPost(editableDiv.innerHTML));
      }
    }
  }, [emoji, dispatch]);

  const handleOnInput = (e: React.ChangeEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).innerHTML.trim() === "<br>") {
      (e.target as HTMLElement).innerHTML = ""; // Xóa toàn bộ nội dung, bao gồm cả thẻ <br>
    }
    const textContent = e.target.innerHTML;
    if (textContent !== null) {
      dispatch(setInputTextPost(textContent.trim()));
    }
  };

  const handlePostImage = async (files: File[]) => {
    if (!files?.length) return;
    setLoading(true);
    const data = new FormData();
    for (const file of files) {
      if (file.type !== "image/png" && file.type !== "image/jpeg") {
        toast.warning("File not support");
        return;
      }
      data.append("imageInfo", file);
    }

    try {
      const response = await conversationAPI.uploadImages(data);
      if (response.success) {
        setLoading(false);
        dispatch(setPostImageList(response.images));
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Hide loading spinner after API call
    }
  };

  return (
    <div
      id="post-container"
      className={cn(
        "px-4 relative",
        colorBackground.color === "rgba(255, 255, 255, 1)"
          ? "h-[154px]"
          : "h-[347.22px] px-0",
        isAddImageVideo && "h-[240px] overflow-y-scroll"
      )}
    >
      {!isAddImageVideo && (
        <div
          autoFocus
          contentEditable="true"
          ref={divRef}
          className={cn(
            "pb-10 w-full h-full outline-none text-[20px] select-text leading-[32px] bg-cover caret-black text-[#222] overflow-y-auto",
            colorBackground.color !== "rgba(255, 255, 255, 1)" &&
              "place-holder-center caret-slate-200 text-white text-center"
          )}
          onInput={(e: React.ChangeEvent<HTMLDivElement>) => handleOnInput(e)}
        />
      )}
      {isAddImageVideo && (
        <>
          <div
            autoFocus
            contentEditable="true"
            ref={divRef}
            className={cn(
              "w-[calc(100%-24px)] h-auto bg-100 caret-black text-[#222] text-[18px] leading-[30px] outline-none resize-none",
              colorBackground.color !== "rgba(255, 255, 255, 1)" &&
                "place-holder-center text-center caret-slate-200 text-white"
            )}
            // onInput={(e) => handleOnInput(e)}
          />
          <div className="mt-8 p-2 border border-solid border-[#CED0D4] rounded-lg h-auto relative">
            {isCheckIn === 0 ? (
              <div className="bg-[#F7F8FA] hover:cursor-pointer hover:bg-[#EAEBED] rounded-lg min-h-[150px] flex items-center justify-center">
                {loading && (
                  <div className="absolute inset-0 w-full h-full bg-[rgba(72,72,72,0.7)] flex flex-col items-center justify-center gap-4">
                    <PulseLoader size={10} color="white" />
                    <span className="text-white text-[18px] whitespace-nowrap">
                      Đang tải ảnh
                    </span>
                  </div>
                )}
                {!loading && selectImageList.length > 0 ? (
                  <DisplayImages selectImageList={selectImageList} />
                ) : (
                  <>
                    <input
                      id="image-video"
                      type="file"
                      multiple
                      accept="image/*,image/heif,image/heic,video/*,video/mp4,video/x-m4v,video/x-matroska,.mkv"
                      className="hidden"
                      onChange={(e) => handlePostImage([...e.target.files!])}
                    />
                    <label
                      htmlFor="image-video"
                      className="flex flex-col items-center justify-center w-full h-auto gap-1"
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
                {selectImageList.length > 0 && (
                  <div className="absolute top-2 left-1 flex gap-[10px]">
                    <div className="p-[6px]">
                      <div
                        className="px-3 w-auto h-8 text-[#050505] text-[15px] bg-white hover:bg-[#F2F2F2] flex items-center rounded-md gap-2"
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
                        onChange={(e) => handlePostImage([...e.target.files!])}
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
        </>
      )}
      {!isAddImageVideo && !isElementHidden && (
        <>
          {isChangeBackground ? (
            <div
              className={cn(
                "absolute left-4 flex gap-2",
                colorBackground.color === "rgba(255, 255, 255, 1)"
                  ? "bottom-0"
                  : "bottom-2"
              )}
            >
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
                      style={{
                        backgroundColor: item.backGround,
                      }}
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
                      style={{
                        backgroundImage: item.backGround,
                      }}
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
              // onClick={() => setIsChangeBackground(true)}
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
