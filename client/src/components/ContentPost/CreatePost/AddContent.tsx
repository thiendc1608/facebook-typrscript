import { IoImagesOutline } from "react-icons/io5";
import { GiPositionMarker } from "react-icons/gi";
import { HiOutlineGif } from "react-icons/hi2";
import { FaUserTag } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addImageVideo, ImageVideoState } from "@/redux/imageVideoSlice";
import { cn } from "@/lib/utils";
import {
  addTagName,
  postType,
  setCheckIn,
  setChooseGIF,
} from "@/redux/postSlice";

const AddContent = () => {
  const dispatch = useDispatch();
  const { isAddImageVideo, showOrHiddenImageVideo } = useSelector(
    (state: { imageVideo: ImageVideoState }) => state.imageVideo
  );
  const { tagUserList } = useSelector(
    (state: { post: postType }) => state.post
  );

  return (
    <div className="py-4">
      <div className="mx-4 p-2 flex items-center justify-between border border-solid rounded-lg">
        <span className="text-[#050505] text-[15px] leading-[21px] select-none">
          Thêm vào bài viết của bạn
        </span>
        <div className="flex items-center">
          <div
            title="Ảnh/video"
            className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#F2F2F2]",
              showOrHiddenImageVideo ? "pointer-events-none" : "cursor-pointer"
            )}
            onClick={() => {
              if (!isAddImageVideo) {
                dispatch(addImageVideo(!isAddImageVideo));
              }
              dispatch(setCheckIn(0));
            }}
          >
            <IoImagesOutline
              size={24}
              color={showOrHiddenImageVideo ? "#D9D9D9" : "#41B35D"}
            />
          </div>
          <div
            title="Gắn thẻ người khác"
            className="w-9 h-9 cursor-pointer rounded-full flex items-center justify-center hover:bg-[#F2F2F2]"
            onClick={() => {
              dispatch(addTagName({ ...tagUserList, isTagName: true }));
            }}
          >
            <FaUserTag size={24} color="#1771E6" />
          </div>
          <div
            title="Checkin"
            className="w-9 h-9 cursor-pointer rounded-full flex items-center justify-center hover:bg-[#F2F2F2]"
            onClick={() => {
              dispatch(setCheckIn(1));
            }}
          >
            <GiPositionMarker size={24} color="#E94F3A" />
          </div>
          <div
            title="File GIF"
            className="w-9 h-9 cursor-pointer rounded-full flex items-center justify-center hover:bg-[#F2F2F2]"
            onClick={() => {
              dispatch(setChooseGIF(true));
            }}
          >
            <HiOutlineGif size={24} color="#28B19E" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddContent;
