import anonymousAvatar from "@/assets/images/default_avatar.jpg";
import { Button } from "../ui/button";
import { IoImagesOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
// import ViewerPost from "./CreatePost/ViewerPost";
import CreatePost from "./CreatePost/CreatePost";
import { ModalState, showModal } from "@/redux/modalSlice";
import { addImageVideo, ImageVideoState } from "@/redux/imageVideoSlice";
import { GiPositionMarker } from "react-icons/gi";
import { setCheckIn } from "@/redux/postSlice";
import { useEffect } from "react";

const WriteStatus = () => {
  const dispatch = useDispatch();
  const { isAddImageVideo } = useSelector(
    (state: { imageVideo: ImageVideoState }) => state.imageVideo
  );
  const { isShowModal } = useSelector(
    (state: { modal: ModalState }) => state.modal
  );

  useEffect(() => {
    if (isShowModal) {
      document.body.style.overflow = "hidden"; // Disable scroll
    } else {
      document.body.style.overflow = "auto"; // Re-enable scroll
    }

    return () => {
      document.body.style.overflow = "auto"; // Cleanup
    };
  }, [isShowModal]);

  return (
    <>
      <div className="w-full bg-white pt-3 px-4 pb-[10px] rounded-lg">
        <div className="flex items-center gap-[10px]">
          <div>
            <img
              src={anonymousAvatar}
              alt="anonymousAvatar"
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>
          <div
            className="hover:bg-[#E4E6E9] bg-[#f0f2f5] rounded-3xl w-full h-[40px] flex items-center 
        justify-start cursor-pointer"
            onClick={() => {
              dispatch(
                showModal({
                  isShowModal: true,
                  childrenModal: <CreatePost />,
                })
              );
              if (isAddImageVideo) {
                dispatch(addImageVideo(false));
              }
            }}
          >
            <span className="py-2 px-3 text-[17px] text-[#65676b] inline-block w-full">
              Bạn ơi, bạn đang nghĩ gì thế?
            </span>
          </div>
        </div>
        <div className="mt-3 border-t border-solid border-[#dddfe2]">
          <div className="flex items-center p-2">
            <Button
              variant="ghost"
              className="p-2 flex-1 rounded-lg hover:bg-[#F2F2F2]"
              onClick={() => {
                dispatch(
                  showModal({
                    isShowModal: true,
                    childrenModal: <CreatePost />,
                  })
                );
                if (!isAddImageVideo) {
                  dispatch(addImageVideo(!isAddImageVideo));
                }
              }}
            >
              <IoImagesOutline
                style={{ width: "24px", height: "24px", color: "#41B35D" }}
              />
              <span className="text-[#65676b] text-[15px]">Ảnh/Video</span>
            </Button>
            <Button
              variant="ghost"
              className="p-2 flex-1 rounded-lg hover:bg-[#F2F2F2]"
              onClick={() => {
                dispatch(
                  showModal({
                    isShowModal: true,
                    childrenModal: <CreatePost />,
                  })
                );
                dispatch(setCheckIn(1));
              }}
            >
              <GiPositionMarker
                style={{ width: "24px", height: "24px", color: "#E94F3A" }}
              />
              <span className="text-[#65676b] text-[15px]">CheckIn</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default WriteStatus;
