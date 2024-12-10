import { conversationAPI } from "@/apis/conversationApi";
import { chattingUserType } from "@/redux/conversationSlice";
import {
  messageSliceType,
  setIdImage,
  setShowImage,
} from "@/redux/messageSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const StoreMediaFile = () => {
  const { private_chat } = useSelector(
    (state: { conversation: chattingUserType }) => state.conversation
  );
  const { showImage } = useSelector(
    (state: { message: messageSliceType }) => state.message
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchImages = async () => {
      const response = await conversationAPI.getAllImageConversation(
        private_chat.current_conversation!.id
      );

      if (response.success) {
        const mergeListImage: string[] = response.allImage.reduce<string[]>(
          (acc: string[], item) => {
            const images: string[] = JSON.parse(item.imageInfo.message_image); // Chuyển chuỗi thành mảng
            return acc.concat(images); // Gộp mảng vào accumulator
          },
          []
        );
        dispatch(setShowImage({ ...showImage, listImage: mergeListImage }));
      }
    };
    fetchImages();
  }, [private_chat, dispatch]);

  return (
    <div className="mt-[6px]">
      <div className="px-4">
        <div className="flex flex-wrap">
          {showImage.listImage.map((img, idx) => (
            <div
              key={idx}
              className="w-1/3 h-auto cursor-pointer"
              onClick={() => {
                dispatch(setShowImage({ ...showImage, isShowImage: true }));
                dispatch(setIdImage(idx));
              }}
            >
              <img src={img} alt="anh" loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoreMediaFile;
