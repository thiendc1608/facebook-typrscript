import { postType } from "@/redux/postSlice";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import { ModalState, showModal } from "@/redux/modalSlice";
import CreatePost from "../ContentPost/CreatePost/CreatePost";
import { addImageVideo, ImageVideoState } from "@/redux/imageVideoSlice";
import { useEffect } from "react";

const ImageVideoProfile = () => {
  const dispatch = useDispatch();
  const { listUserPost } = useSelector(
    (state: { post: postType }) => state.post
  );
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
    <div className="p-4 w-full bg-white rounded-md h-auto flex flex-col justify-center">
      <div className="flex items-center justify-between">
        <div className="w-full text-[#080809] text-[20px] mt-1 mx-[10px] mb-5">
          Ảnh/Video
        </div>
        <Button
          variant="ghost"
          className="text-blue-600 hover:bg-[#F2F2F2] text-[17px]"
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
          Thêm ảnh/video
        </Button>
      </div>
      <div className="w-full">
        {listUserPost.length === 0 ? (
          <div className="text-[#65686c] text-[20px] py-6 px-9 text-center">
            Không có ảnh hay video nào.
          </div>
        ) : (
          <div className="grid grid-cols-4 w-full gap-2 mt-4">
            {listUserPost.map((item) => (
              <div
                key={item.id}
                className="col-span-1 h-[160px] rounded-lg bg-white border border-solid border-[#f2f2f2]"
              >
                {JSON.parse(item?.imageInfo.message_image).map((el: string) =>
                  el.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                    // Hiển thị ảnh
                    <img
                      loading="lazy"
                      src={JSON.parse(item?.imageInfo.message_image)}
                      alt="anh"
                      className="w-auto h-full object-cover"
                    />
                  ) : (
                    // Hiển thị video
                    <video width="100%" controls className="h-full">
                      <source
                        src={JSON.parse(item?.imageInfo.message_image)}
                        type="video/mp4"
                      />
                    </video>
                  )
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageVideoProfile;
