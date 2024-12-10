import { showModal } from "@/redux/modalSlice";
import { ImageVideoState, postType } from "@/types";
import { useDispatch, useSelector } from "react-redux";
import ShowEmoji from "../ContentPost/CreatePost/ShowEmoji";
import { showEmoji, showEmojiType } from "@/redux/emojiSlice";
import { FaArrowLeft } from "react-icons/fa6";
import { RiImageAddFill } from "react-icons/ri";
import { Button } from "../ui/button";
import EditImages from "../ContentPost/CreatePost/EditImages";
import { editImages } from "@/redux/imageVideoSlice";
import { IoIosSearch } from "react-icons/io";
import { addTagName, setCheckIn } from "@/redux/postSlice";
import DisplayProvince from "../ContentPost/CreatePost/DisplayProvince";
import { useEffect, useState } from "react";
import useDebounce from "@/hooks/useDebounce";
import { messageSliceType, setChangeEmojiMessage } from "@/redux/messageSlice";

interface ModalProps {
  children: React.ReactNode;
}

const Modal = ({ children }: ModalProps) => {
  const dispatch = useDispatch();
  const { locationTag } = useSelector(
    (state: { post: postType }) => state.post
  );
  const { isShowEmoji } = useSelector(
    (state: { emoji: showEmojiType }) => state.emoji
  );
  const { isEditImages } = useSelector(
    (state: { imageVideo: ImageVideoState }) => state.imageVideo
  );
  const { isTagName, isCheckIn } = useSelector(
    (state: { post: postType }) => state.post
  );
  const { changeEmojiMessage } = useSelector(
    (state: { message: messageSliceType }) => state.message
  );
  const [location, setLocation] = useState<string>("");
  const searchLocationQuery = useDebounce(location, 500);

  useEffect(() => {
    if (searchLocationQuery) {
      setLocation(searchLocationQuery);
    }
  }, [searchLocationQuery]);

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        dispatch(
          showModal({
            isShowModal: false,
            childrenModal: null,
          })
        );
        if (isShowEmoji) {
          dispatch(showEmoji({ isShowEmoji: !isShowEmoji }));
        }
        if (changeEmojiMessage.isChangeEmoji) {
          dispatch(setChangeEmojiMessage({ isChangeEmoji: false }));
        }
      }}
      className="fixed inset-0 w-full h-full bg-[rgba(72,72,72,0.7)] flex items-center justify-center z-[100]"
    >
      {children}
      {isShowEmoji && <ShowEmoji />}
      {isShowEmoji && (
        <svg
          aria-hidden="true"
          height="12"
          viewBox="0 0 25 12"
          width="25"
          className="absolute top-[318px] left-[65%]"
          fill="#7B7B7C"
          style={{ transform: "scale(1, 1) translate(0px, 0px)" }}
        >
          <path d="M24.453.001c-2.791.32-5.922 1.53-7.78 3.455l-9.62 7.023c-2.45 2.54-5.78 1.645-5.78-2.487V1.983C1.273 1.089.746.32 0 0h24.453v.001Z"></path>
        </svg>
      )}
      {isEditImages && (
        <div
          className="absolute min-w-[500px] rounded-lg flex flex-col items-center justify-center bg-white z-[200]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="min-w-[500px] h-[60px] flex items-center">
            <div
              className="absolute top-3 left-2 cursor-pointer w-9 h-9 rounded-full bg-[#e4e6eb] hover:bg-[#D8DADF] flex items-center justify-center"
              onClick={() => dispatch(editImages(false))}
            >
              <FaArrowLeft size={20} />
            </div>
            <div className="mx-auto">
              <span className="text-[#050505] text-[20px]">Ảnh/Video</span>
            </div>
          </div>
          <div className="min-w-[500px] p-2 bg-[#DFE1E6]">
            <EditImages />
          </div>
          <div className="min-w-[500px] h-[60px] py-3 px-1">
            <div className="px-3 flex items-center float-right gap-[10px]">
              <div>
                <input
                  id="image-video"
                  type="file"
                  multiple
                  accept="image/*,image/heif,image/heic,video/*,video/mp4,video/x-m4v,video/x-matroska,.mkv"
                  className="hidden"
                  // onChange={(e) => {
                  //   if (e.target.files) {
                  //     setImageList([...imageList, ...Array.from(e.target.files)]);
                  //   }
                  // }}
                />
                <label
                  htmlFor="image-video"
                  className="px-3 w-auto h-8 text-[#005DC7] text-[15px] bg-white hover:bg-[#F2F2F2] flex items-center rounded-lg gap-2 cursor-pointer"
                >
                  <RiImageAddFill size={16} color="#005DC7" />
                  <span>Thêm ảnh/video</span>
                </label>
              </div>
              <div>
                <Button className="text-white bg-[#0861F2] hover:bg-blue-700 w-[116.05px]">
                  Xong
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isTagName && (
        <div
          className="absolute w-[500px] rounded-lg flex flex-col items-center justify-center bg-white z-[200]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-[500px] h-[60px] flex items-center">
            <div
              className="absolute top-3 left-2 cursor-pointer w-9 h-9 rounded-full bg-[#e4e6eb] hover:bg-[#D8DADF] flex items-center justify-center"
              onClick={() => {
                dispatch(addTagName(false));
              }}
            >
              <FaArrowLeft size={20} />
            </div>
            <div className="mx-auto">
              <span className="text-[#050505] text-[20px]">
                Gắn thẻ người khác
              </span>
            </div>
          </div>
          <div className="w-[500px] px-4 h-[52px] flex items-center border-t border-solid border-[#DFE1E6]">
            <div className="flex-1 h-[36px] flex items-center justify-center bg-[#F0F2F5] rounded-[100px]">
              <label htmlFor="tagName" className="pl-[10px]">
                <IoIosSearch size={20} />
              </label>
              <input
                type="text"
                placeholder="Tìm kiếm"
                id="tagName"
                className="w-full h-full bg-[#F0F2F5] outline-none rounded-[100px] pl-[6px]"
              />
            </div>
            <span className="pl-[20px] pr-[8px] text-blue-500 cursor-pointer hover:text-blue-700 text-[15px]">
              Xong
            </span>
          </div>
          <div className="pt-4 pb-2">
            <span className="text-center text-[#65676b] text-[15px]">
              Không có kết quả nào
            </span>
          </div>
        </div>
      )}
      {isCheckIn === 1 && (
        <div
          className="absolute w-[500px] rounded-lg flex flex-col bg-white z-[200]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-full h-[60px] flex items-center">
            <div
              className="absolute top-3 left-2 cursor-pointer w-9 h-9 rounded-full bg-[#e4e6eb] hover:bg-[#D8DADF] flex items-center justify-center"
              onClick={() => {
                if (locationTag) {
                  dispatch(setCheckIn(2));
                } else {
                  dispatch(setCheckIn(0));
                }
              }}
            >
              <FaArrowLeft size={20} />
            </div>
            <div className="mx-auto">
              <span className="text-[#050505] text-[20px]">
                Tìm kiếm vị trí
              </span>
            </div>
          </div>
          <div className="w-full px-4 h-[52px] flex flex-col justify-center border-t border-solid border-[#DFE1E6]">
            <div className="h-[36px] bg-[#F0F2F5] rounded-[100px]">
              <div className="flex items-center justify-center h-full">
                <label htmlFor="province_city" className="pl-[10px]">
                  <IoIosSearch size={20} />
                </label>
                <input
                  type="text"
                  placeholder="Hiện tại bạn đang ở tỉnh/thành nào?"
                  id="province_city"
                  className="w-full h-full bg-[#F0F2F5] outline-none rounded-[100px] pl-[6px]"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setLocation(e.target.value)
                  }
                  value={location}
                />
              </div>
            </div>
          </div>
          {locationTag && (
            <div className="p-2 h-auto">
              <span className="px-2 w-full leading-[21px] text-[#050505] text-[17px]">
                Được gắn thẻ
              </span>
              <DisplayProvince
                query={locationTag?.full_name}
                addToClose={true}
              />
            </div>
          )}
          <div className="p-2 h-[300px] overflow-y-scroll">
            <span className="px-2 w-full leading-[21px] text-[#050505] text-[17px]">
              Gợi ý
            </span>
            <DisplayProvince query={location} addToClose={false} />
          </div>
        </div>
      )}
      {/* {isChooseGIF && (
        <div
          className="absolute w-[500px] rounded-lg flex flex-col bg-white z-[200]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-full h-[60px] flex items-center">
            <div
              className="absolute top-3 left-2 cursor-pointer w-9 h-9 rounded-full bg-[#e4e6eb] hover:bg-[#D8DADF] flex items-center justify-center"
              onClick={() => {
                dispatch(setCheckIn(2));
              }}
            >
              <FaArrowLeft size={20} />
            </div>
            <div className="mx-auto">
              <span className="text-[#050505] text-[20px]">Chọn file GIF</span>
            </div>
          </div>
          <div className="w-full px-4 h-[52px] flex flex-col justify-center border-t border-solid border-[#DFE1E6]">
            <div className="h-[36px] bg-[#F0F2F5] rounded-[100px]">
              <div className="flex items-center justify-center h-full">
                <label htmlFor="province_city" className="pl-[10px]">
                  <IoIosSearch size={20} />
                </label>
                <input
                  type="text"
                  placeholder="Tìm kiếm"
                  id="province_city"
                  className="w-full h-full bg-[#F0F2F5] outline-none rounded-[100px] pl-[6px]"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setLocation(e.target.value)
                  }
                  value={location}
                />
              </div>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default Modal;
