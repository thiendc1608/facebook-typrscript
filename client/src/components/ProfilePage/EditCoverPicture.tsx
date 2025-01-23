import { showModal } from "@/redux/modalSlice";
import {
  setConfirmCoverPicture,
  setCoverPictureUser,
  setPosCoverPicture,
  UserState,
} from "@/redux/userSlice";
import { useEffect, useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import { IoEarth } from "react-icons/io5";
import { toast } from "react-toastify";
import { userAPI } from "@/apis/userApi";
import { conversationAPI } from "@/apis/conversationApi";
import PulseLoader from "react-spinners/PulseLoader";

interface EditCoverPictureProps {
  coverPicture: File;
}
const EditCoverPicture = ({ coverPicture }: EditCoverPictureProps) => {
  const dispatch = useDispatch();
  const pictureRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [topOffset, setTopOffset] = useState(0);
  const [showInstruct, setShowInstruct] = useState(false);
  const { currentUser } = useSelector(
    (state: { user: UserState }) => state.user
  );
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setShowInstruct(true);
  }, []);

  const handleSaveChange = async () => {
    dispatch(setConfirmCoverPicture(false));
    const formData = new FormData();
    if (coverPicture) {
      if (!coverPicture.type.includes("image")) {
        toast.warning("File not support");
        return;
      }
      formData.append("imageInfo", coverPicture);
      setLoading(true);
      try {
        const response = await conversationAPI.uploadImageVideos(formData);
        if (response.success) {
          setLoading(false);
          const result = await userAPI.changeCoverPicture(
            {
              coverPicture: response.imageVideos[0].path,
              coverPicturePos: topOffset * 1.6,
            },
            currentUser!.id
          );

          if (result.success) {
            toast.success(result.message);
            dispatch(
              setCoverPictureUser(result.coverPictureUpdate.cover_picture)
            );
            dispatch(
              setPosCoverPicture(result.coverPictureUpdate.cover_picture_pos)
            );
            dispatch(
              showModal({
                isShowModal: false,
                childrenModal: null,
              })
            );
          } else {
            toast.error(result.message);
          }
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Hide loading spinner after API call
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLImageElement>) => {
    e.preventDefault();
    setShowInstruct(false);
    if (!pictureRef.current || !containerRef.current) return;
    const containerHeight = containerRef.current.offsetHeight; // Chiều cao vùng chứa
    const imageHeight = pictureRef.current.offsetHeight; // Chiều cao ảnh
    let newTopOffset = topOffset;
    switch (e.key) {
      case "ArrowUp":
        // Nếu ảnh chưa chạm đến đầu thì di chuyển lên
        if (newTopOffset < 0) {
          newTopOffset += 20;
        }
        break;

      case "ArrowDown":
        // Kiểm tra nếu ảnh chưa bị đẩy ra ngoài vùng chứa thì di chuyển xuống
        if (newTopOffset + imageHeight > containerHeight) {
          // Nếu phần dưới của ảnh đã chạm đáy vùng chứa
          newTopOffset -= 20; // Di chuyển ảnh lên (cắt bớt phần dưới)
        }
        break;
    }
    setTopOffset(newTopOffset);
  };

  return (
    <div
      className="relative w-[548px] h-[388px] bg-white rounded-lg"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {isLoading && (
        <div className="absolute inset-0 w-full h-full bg-[rgba(72,72,72,0.7)] flex flex-col items-center justify-center gap-4 z-10">
          <PulseLoader size={10} />
        </div>
      )}
      <div className="relative w-full h-[50px] border-b border-solid border-[#E5E5E5] flex items-center justify-center">
        <div className="text-[#050505] text-[20px] text-center">
          Chỉnh sửa ảnh bìa
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
      <div
        ref={containerRef}
        className="relative h-[210px] w-full overflow-hidden"
      >
        {showInstruct && (
          <div className="py-2 px-3 bg-[#1c1c1d99] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-10 text-white text-[15px] rounded-lg">
            Dùng phím mũi tên lên, xuống để đặt lại hình ảnh
          </div>
        )}
        <img
          src={URL.createObjectURL(coverPicture)}
          loading="lazy"
          alt="cover_picture"
          tabIndex={0}
          className="w-full object-cover p-2"
          ref={pictureRef}
          style={{
            position: "absolute",
            top: `${topOffset}px`,
          }}
          onKeyDown={(e) => handleKeyDown(e)}
        />
      </div>
      <div className="flex flex-col py-3 px-4 gap-4">
        <span className="flex gap-2 items-center text-[#75777B] p-2 text-[18px] border-b border-solid border-[#E5E5E5]">
          <IoEarth size={20} />
          Ảnh bìa của bạn hiển thị công khai
        </span>
        <div className="flex gap-4 self-end">
          <Button
            className="w-auto text-blue-600 bg-[#ffffff1a] hover:bg-[#ACACAC]"
            onClick={() => {
              dispatch(
                showModal({
                  isShowModal: false,
                  childrenModal: null,
                })
              );
              dispatch(
                setPosCoverPicture({
                  image_position: 0,
                })
              );
            }}
          >
            Huỷ
          </Button>
          <Button
            className="w-auto bg-blue-600 hover:bg-blue-400"
            onClick={handleSaveChange}
          >
            Lưu thay đổi
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditCoverPicture;
