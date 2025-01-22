import { showModal } from "@/redux/modalSlice";
import { IoMdClose } from "react-icons/io";
import { useDispatch } from "react-redux";
import Avatar from "./Avatar";
import { useState } from "react";
import PulseLoader from "react-spinners/PulseLoader";

const EditAvatarModal = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="fixed inset-0 w-full h-full bg-[rgba(0,0,0,0.1)] flex items-center justify-center z-[100]">
      <div
        className="w-[500px] bg-white rounded-lg overflow-hidden"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {isLoading && (
          <div className="absolute inset-0 w-full h-full bg-[rgba(72,72,72,0.7)] flex flex-col items-center justify-center gap-4 z-50">
            <PulseLoader size={10} color="white" />
            <span className="text-white text-[18px] whitespace-nowrap">
              Đang tải avatar
            </span>
          </div>
        )}
        <div className="relative w-full h-[50px] border-b border-solid border-[#E5E5E5] flex items-center justify-center">
          <div className="text-[#050505] text-[20px] text-center">
            Thay đổi ảnh đại diện
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
        <Avatar setIsLoading={setIsLoading} />
      </div>
    </div>
  );
};

export default EditAvatarModal;
