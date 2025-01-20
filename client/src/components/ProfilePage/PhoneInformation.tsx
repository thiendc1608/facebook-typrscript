import { useEffect, useRef, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { IoEarth } from "react-icons/io5";
import { Button } from "../ui/button";
import "./CustomAvatar/CustomAvatar.css";
import { MdOutlineEdit } from "react-icons/md";
import { setPhone, UserState } from "@/redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { userAPI } from "@/apis/userApi";
import { toast } from "react-toastify";
import { BsThreeDots } from "react-icons/bs";
import { RiDeleteBinLine } from "react-icons/ri";
import useEditProfile from "@/hooks/useEditProfile";
import { FaPhoneAlt } from "react-icons/fa";
import Swal from "sweetalert2";

const PhoneInformation = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector(
    (state: { user: UserState }) => state.user
  );
  const [isClickPhone, setIsClickPhone] = useState<boolean>(false);
  const [isEditPhone, setIsEditPhone] = useState<boolean>(false);
  const addressRef = useRef<HTMLTextAreaElement>(null);
  const [contentPhone, setContentPhone] = useState<string>(
    currentUser!.phone ?? ""
  );

  const handleSavePhone = async () => {
    if (contentPhone.length < 10) {
      Swal.fire({
        icon: "error",
        title: "Vui lòng nhập đủ 10 chữ số",
        showConfirmButton: true,
        confirmButtonText: "Đã hiểu",
        confirmButtonColor: "#0866FF",
      });
    } else {
      setIsClickPhone(false);
      const response = await userAPI.changePhone(
        { phone: contentPhone },
        currentUser!.id
      );
      if (response.success) {
        toast.success(response.message);
        dispatch(setPhone({ phone: contentPhone }));
      } else {
        toast.error(response.message);
      }
    }
  };

  useEditProfile({
    valueEdit: currentUser!.phone,
    isExecuteEdit: isClickPhone,
    textAreaRef: addressRef,
  });

  useEffect(() => {
    const handleCloseEditPhone = (e: Event) => {
      const closeNotificationEl = document.getElementById("edit_phone");
      if (e.target instanceof Node && !closeNotificationEl?.contains(e.target))
        setIsEditPhone(false);
    };
    document.addEventListener("click", handleCloseEditPhone);
    return () => document.removeEventListener("click", handleCloseEditPhone);
  }, []);

  const handleDeletePhone = () => {
    Swal.fire({
      title: "Bạn chắc chứ?",
      text: "Bạn có chắc chắn muốn gỡ số điện thoại này?",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Không",
      confirmButtonText: "Xác nhận",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await userAPI.changePhone(
            { phone: null },
            currentUser!.id
          );
          if (response.success) {
            toast.success(response.message);
            setIsClickPhone(false);
            dispatch(setPhone({ phone: null }));
          } else {
            toast.error(response.message);
          }
        } catch (e) {
          console.log(e);
        }
      }
    });
  };

  return (
    <div className="flex flex-col justify-center">
      <div className="w-full text-[#080809] text-[20px] mt-1 mx-[10px] mb-5">
        Thông tin liên hệ
      </div>
      {!isClickPhone ? (
        <>
          {currentUser?.phone ? (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-[#080809] text-[15px] self-start flex gap-2 items-center">
                <div className="w-9 h-9 rounded-full flex items-center justify-center bg-[#D6D9DD]">
                  <FaPhoneAlt size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[#080809] text-[15px]">
                    {currentUser?.phone}
                  </span>
                  <span className="text-[#65686c] text-[12px]">Di động</span>
                </div>
              </p>
              <div className="flex items-center gap-4">
                <IoEarth size={20} />
                <div
                  id="edit_phone"
                  className="relative w-9 h-9 rounded-full flex items-center justify-center bg-[#e2e5e9] hover:bg-[#D6D9DD] cursor-pointer"
                  onClick={() => setIsEditPhone(!isEditPhone)}
                >
                  <BsThreeDots size={26} />
                  {isEditPhone && (
                    <ul className="absolute top-full right-[50%] w-auto h-auto bg-white rounded-lg shadow-default">
                      <li
                        className="p-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsClickPhone(true);
                        }}
                      >
                        <div className="p-2 flex items-center gap-2 hover:bg-[#f2f2f2] h-9 rounded-lg">
                          <MdOutlineEdit size={20} />
                          <span className="text-[15px] text-[#080809] whitespace-nowrap">
                            Chỉnh sửa
                          </span>
                        </div>
                      </li>
                      <li className="p-1">
                        <div
                          className="p-2 flex items-center gap-2 hover:bg-[#f2f2f2] h-9 rounded-lg"
                          onClick={handleDeletePhone}
                        >
                          <RiDeleteBinLine size={20} />
                          <span className="text-[15px] text-[#080809]">
                            Xoá
                          </span>
                        </div>
                      </li>
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div
              className="h-9 flex items-center gap-3 cursor-pointer w-full"
              onClick={() => setIsClickPhone(true)}
            >
              <CiCirclePlus size={28} color="#0064d1" />
              <h2 className="text-[#0064d1] text-[15px] hover:underline">
                Thêm số điện thoại
              </h2>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col gap-1 mt-2">
          <textarea
            ref={addressRef}
            className="w-full h-auto rounded-lg border border-solid border-[#d7dade] outline-none p-3 resize-none focus:border-black text-[15px]"
            name="phone"
            id="phone"
            autoFocus
            placeholder="Nhập số điện thoại"
            value={addressRef.current?.value}
            onInput={(e) => {
              const cleanedPhone = (
                e.target as HTMLTextAreaElement
              ).value.replace(/\D/g, ""); // Chỉ giữ lại các ký tự số

              // Nếu có ít hơn 10 số, không làm gì cả, chỉ cập nhật giá trị
              if (cleanedPhone.length <= 10) {
                setContentPhone(cleanedPhone); // Cập nhật giá trị nếu chưa đủ 10 số
              }

              // Khi người dùng đã nhập đủ 10 chữ số, kiểm tra định dạng
              if (cleanedPhone.length === 10) {
                if (cleanedPhone.startsWith("0")) {
                  setContentPhone(cleanedPhone); // Cập nhật số điện thoại hợp lệ
                } else {
                  Swal.fire({
                    icon: "error",
                    title: "Số điện thoại bắt đầu từ số 0 mà",
                    showConfirmButton: true,
                    confirmButtonText: "Đã hiểu",
                    confirmButtonColor: "#0866FF",
                  });
                }
              }
            }}
            onKeyDown={(e) => {
              // Kiểm tra nếu ký tự nhập vào không phải là số (mã phím ASCII 48-57)
              if (e.key !== "Backspace" && !/[0-9]/.test(e.key)) {
                e.preventDefault(); // Ngăn chặn nhập ký tự không phải số
              }
            }}
          ></textarea>
          <div className="mt-4 flex items-center justify-between border-t border-solid border-[#d7dade] pt-4">
            <div className="flex items-center gap-2">
              <IoEarth size={20} />
              <span className="text-[#080809] text-[17px]">Công khai</span>
            </div>
            <div className="flex gap-2">
              <Button
                className="bg-[#e2e5e9] hover:bg-[#d6d9dd] text-[#080809] text-[15px]"
                onClick={() => setIsClickPhone(false)}
              >
                Huỷ
              </Button>
              <Button
                className="text-[15px] bg-blue-500 hover:bg-blue-600 text-white hover:text-white"
                onClick={handleSavePhone}
              >
                Xác nhận
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhoneInformation;
