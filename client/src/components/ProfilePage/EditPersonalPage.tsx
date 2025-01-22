import { showModal } from "@/redux/modalSlice";
import { UserState } from "@/redux/userSlice";
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import { FaHouseUser } from "react-icons/fa";
import { PhoneCall } from "lucide-react";
import { MdEmail } from "react-icons/md";
import { LuCake, LuUsers } from "react-icons/lu";

const EditPersonalPage = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector(
    (state: { user: UserState }) => state.user
  );

  return (
    <div
      className="w-[700px] bg-white rounded-lg overflow-auto h-screen"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {/* {isLoading && (
          <div className="absolute inset-0 w-full h-full bg-[rgba(72,72,72,0.7)] flex flex-col items-center justify-center gap-4 z-50">
            <PulseLoader size={10} color="white" />
            <span className="text-white text-[18px] whitespace-nowrap">
              Đang tải avatar
            </span>
          </div>
        )} */}
      <div className="relative w-full h-[50px] border-b border-solid border-[#E5E5E5] flex items-center justify-center">
        <div className="text-[#050505] text-[20px] text-center">
          Chỉnh sửa trang cá nhân
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
      <div className="pt-5 px-4 pb-4">
        {/* Ảnh cá nhân */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="w-full text-[#080809] text-[20px] mx-[10px]">
              Ảnh đại diện
            </div>
            <Button
              variant="ghost"
              className="hover:bg-[#F2F2F2] text-[#1D71CC] hover:text-[#1D71CC]"
            >
              Chỉnh sửa
            </Button>
          </div>
          <div className="p-[6px] w-[168px] h-[168px] rounded-full self-center border border-solid border-[#afaeae]">
            <img
              src={currentUser!.avatar}
              alt="avatar"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        </div>

        {/* Ảnh bìa */}
        <div className="flex flex-col gap-2 mt-4">
          <div className="flex items-center justify-between">
            <div className="w-full text-[#080809] text-[20px] mx-[10px]">
              Ảnh bìa
            </div>
            <Button
              variant="ghost"
              className="hover:bg-[#F2F2F2] text-[#1D71CC] hover:text-[#1D71CC]"
            >
              Thêm
            </Button>
          </div>
          <div className="p-[6px] w-[500px] h-[185px] self-center">
            <img
              src={currentUser!.cover_picture}
              alt="cover-picture"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Tiểu sử */}
        <div className="flex flex-col gap-2 mt-4">
          <div className="flex items-center justify-between">
            <div className="w-full text-[#080809] text-[20px] mx-[10px]">
              Tiểu sử
            </div>
            <Button
              variant="ghost"
              className="hover:bg-[#F2F2F2] text-[#1D71CC] hover:text-[#1D71CC]"
            >
              Thêm
            </Button>
          </div>
          <div className="p-[6px] self-center">
            <span className="text-[#65686c] text-[17px]">
              Mô tả bản thân...
            </span>
          </div>
        </div>

        {/* Chỉnh sửa phần giới thiệu */}
        <div className="flex flex-col gap-2 mt-4">
          <div className="flex items-center justify-between">
            <div className="w-full text-[#080809] text-[20px] mx-[10px]">
              Chỉnh sửa phần giới thiệu
            </div>
            <Button
              variant="ghost"
              className="hover:bg-[#F2F2F2] text-[#1D71CC] hover:text-[#1D71CC]"
            >
              Thêm
            </Button>
          </div>
          <ul>
            <li className="flex items-center">
              <div className="p-[6px]">
                <FaHouseUser size={20} color="#8C939D" />
              </div>
              <span className="p-[6px] text-[#080809] text-[15px]">
                Tỉnh/Thành phố hiện tại
              </span>
            </li>
            <li className="flex items-center">
              <div className="p-[6px]">
                <PhoneCall size={20} color="#8C939D" />
              </div>
              <span className="p-[6px] text-[#080809] text-[15px]">
                Số điện thoại
              </span>
            </li>
            <li className="flex items-center">
              <div className="p-[6px]">
                <MdEmail size={20} color="#8C939D" />
              </div>
              <span className="p-[6px] text-[#080809] text-[15px]">
                Địa chỉ Email
              </span>
            </li>
            <li className="flex items-center">
              <div className="p-[6px]">
                <LuCake size={20} color="#8C939D" />
              </div>
              <span className="p-[6px] text-[#080809] text-[15px]">
                Ngày, tháng, năm sinh
              </span>
            </li>
            <li className="flex items-center">
              <div className="p-[6px]">
                <LuUsers size={20} color="#8C939D" />
              </div>
              <span className="p-[6px] text-[#080809] text-[15px]">
                Giới tính
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EditPersonalPage;
