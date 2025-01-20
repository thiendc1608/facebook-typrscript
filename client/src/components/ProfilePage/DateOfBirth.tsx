import { useEffect, useRef, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { IoEarth } from "react-icons/io5";
import { Button } from "../ui/button";
import "./CustomAvatar/CustomAvatar.css";
import { MdOutlineEdit } from "react-icons/md";
import { setEmail, UserState } from "@/redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { userAPI } from "@/apis/userApi";
import { toast } from "react-toastify";
import { BsThreeDots } from "react-icons/bs";
import { RiDeleteBinLine } from "react-icons/ri";
import useEditProfile from "@/hooks/useEditProfile";
import { MdOutlineMailOutline } from "react-icons/md";
import Swal from "sweetalert2";
import CustomSelect from "../Register/CustomSelect";
import { range } from "@/utils/helpers";

const DateOfBirth = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector(
    (state: { user: UserState }) => state.user
  );
  const [isClickEmail, setIsClickEmail] = useState<boolean>(false);
  const [isEditEmail, setIsEditEmail] = useState<boolean>(false);
  const addressRef = useRef<HTMLTextAreaElement>(null);
  const date = new Date().getDate();
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();
  const [contentEmail, setContentEmail] = useState<string>(
    currentUser!.email ?? ""
  );

  useEffect(() => {
    if (+month === 2) {
      if (year % 4 === 0) {
        setListDate(range(1, 30, 1));
      } else {
        setListDate(range(1, 29, 1));
      }
    } else if (+month === 4 || +month === 6 || +month === 9 || +month === 11) {
      setListDate(range(1, 31, 1));
    } else {
      setListDate(range(1, 32, 1));
    }
  }, [month, year]);

  const [listDate, setListDate] = useState<number[]>([]);
  const listMonth = Array.from({ length: 12 }, (_, i) => i + 1);
  const listYear = range(1905, new Date().getFullYear() + 1, 1).reverse();

  const handleSaveEmail = async () => {
    if (!emailRegex.test(contentEmail)) {
      Swal.fire({
        icon: "error",
        text: "Vui liệu nhap dung dinh dang @gmail.com",
        showConfirmButton: true,
        confirmButtonText: "Đã hiểu",
        confirmButtonColor: "#0866FF",
      });
    } else {
      setIsClickEmail(false);
      const response = await userAPI.changeEmail(
        { email: contentEmail },
        currentUser!.id
      );
      if (response.success) {
        toast.success(response.message);
        dispatch(setEmail({ email: contentEmail }));
      } else {
        toast.error(response.message);
      }
    }
  };

  useEditProfile({
    valueEdit: currentUser!.email,
    isExecuteEdit: isClickEmail,
    textAreaRef: addressRef,
  });

  useEffect(() => {
    const handleCloseEditEmail = (e: Event) => {
      const closeNotificationEl = document.getElementById("edit_email");
      if (e.target instanceof Node && !closeNotificationEl?.contains(e.target))
        setIsEditEmail(false);
    };
    document.addEventListener("click", handleCloseEditEmail);
    return () => document.removeEventListener("click", handleCloseEditEmail);
  }, []);

  const handleDeleteEmail = () => {
    Swal.fire({
      title: "Bạn chắc chứ?",
      text: "Bạn có chắc chắn muốn gỡ email này?",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Không",
      confirmButtonText: "Xác nhận",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await userAPI.changeEmail(
            { email: null },
            currentUser!.id
          );
          if (response.success) {
            toast.success(response.message);
            setIsClickEmail(false);
            dispatch(setEmail({ email: null }));
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
      {!isClickEmail ? (
        <>
          {currentUser?.email ? (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-[#080809] text-[15px] self-start flex gap-2 items-center">
                <div className="w-9 h-9 rounded-full flex items-center justify-center bg-[#D6D9DD]">
                  <MdOutlineMailOutline size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[#080809] text-[15px]">
                    {currentUser?.email}
                  </span>
                  <span className="text-[#65686c] text-[12px]">Email</span>
                </div>
              </p>
              <div className="flex items-center gap-4">
                <IoEarth size={20} />
                <div
                  id="edit_email"
                  className="relative w-9 h-9 rounded-full flex items-center justify-center bg-[#e2e5e9] hover:bg-[#D6D9DD] cursor-pointer"
                  onClick={() => setIsEditEmail(!isEditEmail)}
                >
                  <BsThreeDots size={26} />
                  {isEditEmail && (
                    <ul className="absolute top-full right-[50%] w-auto h-auto bg-white rounded-lg shadow-default">
                      <li
                        className="p-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsClickEmail(true);
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
                          onClick={handleDeleteEmail}
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
              onClick={() => setIsClickEmail(true)}
            >
              <CiCirclePlus size={28} color="#0064d1" />
              <h2 className="text-[#0064d1] text-[15px] hover:underline">
                Thêm ngày, tháng và năm sinh
              </h2>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col gap-1 mt-2">
          <div className="flex items-center gap-2">
            <CustomSelect
              name="day"
              time={day}
              setTime={setDay}
              listData={monthList}
            />
            <CustomSelect
              name="month"
              time={month}
              setTime={setMonth}
              listData={monthList}
            />
            <CustomSelect
              name="month"
              time={month}
              setTime={setMonth}
              listData={monthList}
            />
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-solid border-[#d7dade] pt-4">
            <div className="flex items-center gap-2">
              <IoEarth size={20} />
              <span className="text-[#080809] text-[17px]">Công khai</span>
            </div>
            <div className="flex gap-2">
              <Button
                className="bg-[#e2e5e9] hover:bg-[#d6d9dd] text-[#080809] text-[15px]"
                onClick={() => setIsClickEmail(false)}
              >
                Huỷ
              </Button>
              <Button
                className="text-[15px] bg-blue-500 hover:bg-blue-600 text-white hover:text-white"
                onClick={handleSaveEmail}
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

export default DateOfBirth;
