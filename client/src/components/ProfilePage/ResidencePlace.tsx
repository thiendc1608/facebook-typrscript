import { useEffect, useRef, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { IoEarth } from "react-icons/io5";
import { Button } from "../ui/button";
import "./CustomAvatar/CustomAvatar.css";
import { FaAddressCard } from "react-icons/fa";
import { MdOutlineEdit } from "react-icons/md";
import { setAddress, UserState } from "@/redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { userAPI } from "@/apis/userApi";
import { toast } from "react-toastify";
import { BsThreeDots } from "react-icons/bs";
import { RiDeleteBinLine } from "react-icons/ri";
import useEditProfile from "@/hooks/useEditProfile";
import Swal from "sweetalert2";

const ResidencePlace = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector(
    (state: { user: UserState }) => state.user
  );
  const [isClickAddress, setIsClickAddress] = useState<boolean>(false);
  const [isEditAddress, setIsEditAddress] = useState<boolean>(false);
  const addressRef = useRef<HTMLTextAreaElement>(null);
  const [contentAddress, setContentAddress] = useState<string>(
    currentUser?.address ?? ""
  );

  const handleSaveAddress = async () => {
    setIsClickAddress(false);
    const response = await userAPI.changeAddress(
      { address: contentAddress },
      currentUser!.id
    );
    if (response.success) {
      toast.success(response.message);
      dispatch(setAddress({ address: contentAddress }));
    } else {
      toast.error(response.message);
    }
  };

  useEditProfile({
    valueEdit: currentUser!.address,
    isExecuteEdit: isClickAddress,
    textAreaRef: addressRef,
  });

  useEffect(() => {
    const handleCloseEditAddress = (e: Event) => {
      const closeNotificationEl = document.getElementById("edit_address");
      if (e.target instanceof Node && !closeNotificationEl?.contains(e.target))
        setIsEditAddress(false);
    };
    document.addEventListener("click", handleCloseEditAddress);
    return () => document.removeEventListener("click", handleCloseEditAddress);
  }, []);

  const handleDeleteAddress = () => {
    Swal.fire({
      title: "Bạn chắc chứ?",
      text: "Bạn có chắc chắn muốn gỡ tỉnh/thành phố này khỏi trang cá nhân của mình không?",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Không",
      confirmButtonText: "Xác nhận",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await userAPI.changeAddress(
            { address: null },
            currentUser!.id
          );
          if (response.success) {
            toast.success(response.message);
            setIsClickAddress(false);
            dispatch(setAddress({ address: null }));
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
        Nơi sống
      </div>
      {!isClickAddress ? (
        <>
          {currentUser?.address ? (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-[#080809] text-[15px] self-start flex gap-2 items-center">
                <div className="w-9 h-9 rounded-full flex items-center justify-center bg-[#D6D9DD]">
                  <FaAddressCard size={20} />
                </div>
                <div className="flex flex-col">
                  {currentUser?.address.split("\n").map((line, index) => (
                    <span key={index}>
                      {line}
                      <br />
                    </span>
                  ))}
                  <span className="text-[#65686c] text-[12px]">
                    Tỉnh/Thành phố hiện tại
                  </span>
                </div>
              </p>
              <div className="flex items-center gap-4">
                <IoEarth size={20} />
                <div
                  id="edit_address"
                  className="relative w-9 h-9 rounded-full flex items-center justify-center bg-[#e2e5e9] hover:bg-[#D6D9DD] cursor-pointer"
                  onClick={() => setIsEditAddress(!isEditAddress)}
                >
                  <BsThreeDots size={26} />
                  {isEditAddress && (
                    <ul className="absolute top-full right-[50%] w-auto h-auto bg-white rounded-lg shadow-default">
                      <li
                        className="p-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsClickAddress(true);
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
                          onClick={handleDeleteAddress}
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
              onClick={() => setIsClickAddress(true)}
            >
              <CiCirclePlus size={28} color="#0064d1" />
              <h2 className="text-[#0064d1] text-[15px] hover:underline">
                Thêm tỉnh/thành phố hiện tại
              </h2>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col gap-1 mt-2">
          <textarea
            ref={addressRef}
            className="w-full h-auto rounded-lg border border-solid border-[#d7dade] outline-none p-3 resize-none focus:border-black text-[15px]"
            name="address"
            id="address"
            autoFocus
            placeholder="Tỉnh/Thành phố hiện tại"
            value={addressRef.current?.value}
            onChange={(e) => {
              setContentAddress(e.target.value);
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
                onClick={() => setIsClickAddress(false)}
              >
                Huỷ
              </Button>
              <Button
                className="text-[15px] bg-blue-500 hover:bg-blue-600 text-white hover:text-white"
                onClick={handleSaveAddress}
              >
                Lưu
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResidencePlace;
