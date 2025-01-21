import { useEffect, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { IoEarth } from "react-icons/io5";
import { Button } from "../ui/button";
import "./CustomAvatar/CustomAvatar.css";
import { MdOutlineEdit } from "react-icons/md";
import { setGender, UserState } from "@/redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { userAPI } from "@/apis/userApi";
import { toast } from "react-toastify";
import { BsThreeDots } from "react-icons/bs";
import { RiDeleteBinLine } from "react-icons/ri";
import Swal from "sweetalert2";
import { SlUser, SlUserFemale } from "react-icons/sl";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GenderSchame, UserGender } from "@/types";
import { z } from "zod";

const GenderInformation = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector(
    (state: { user: UserState }) => state.user
  );
  const [isClickGender, setIsClickGender] = useState<boolean>(false);
  const [isEditGender, setIsEditGender] = useState<boolean>(false);
  const {
    control,
    handleSubmit,
    // setError,
  } = useForm<z.infer<typeof GenderSchame>>({
    resolver: zodResolver(GenderSchame),
  });

  const onSubmit: SubmitHandler<z.infer<typeof GenderSchame>> = async (
    data
  ) => {
    setIsClickGender(false);
    const response = await userAPI.changeGender(
      { gender: data.gender },
      currentUser!.id
    );
    if (response.success) {
      toast.success(response.message);
      dispatch(setGender({ gender: data.gender }));
    } else {
      toast.error(response.message);
    }
  };

  useEffect(() => {
    const handleCloseEditGender = (e: Event) => {
      const closeGenderEl = document.getElementById("edit_gender");
      if (e.target instanceof Node && !closeGenderEl?.contains(e.target))
        setIsEditGender(false);
    };
    document.addEventListener("click", handleCloseEditGender);
    return () => document.removeEventListener("click", handleCloseEditGender);
  }, []);

  const handleDeleteGender = () => {
    Swal.fire({
      title: "Bạn chắc chứ?",
      text: "Bạn có chắc chắn muốn gỡ mục này không?",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Không",
      confirmButtonText: "Xác nhận",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await userAPI.changeGender(
            { gender: null },
            currentUser!.id
          );
          if (response.success) {
            toast.success(response.message);
            setIsClickGender(false);
            dispatch(setGender({ gender: null }));
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
      {!isClickGender ? (
        <>
          {currentUser?.gender ? (
            <div className="mt-4 flex items-center justify-between">
              <div className="text-[#080809] text-[15px] self-start flex gap-2 items-center">
                <div className="w-9 h-9 rounded-full flex items-center justify-center bg-[#D6D9DD]">
                  {currentUser?.gender === "male" ? (
                    <SlUser size={20} />
                  ) : (
                    <SlUserFemale size={20} />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-[#080809] text-[15px]">
                    {currentUser?.gender === "male" ? "Nam" : "Nữ"}
                  </span>
                  <span className="text-[#65686c] text-[12px]">Giới tính</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <IoEarth size={20} />
                <div
                  id="edit_gender"
                  className="relative w-9 h-9 rounded-full flex items-center justify-center bg-[#e2e5e9] hover:bg-[#D6D9DD] cursor-pointer"
                  onClick={() => setIsEditGender(!isEditGender)}
                >
                  <BsThreeDots size={26} />
                  {isEditGender && (
                    <ul className="absolute top-full right-[50%] w-auto h-auto bg-white rounded-lg shadow-default">
                      <li
                        className="p-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsClickGender(true);
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
                          onClick={handleDeleteGender}
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
              onClick={() => setIsClickGender(true)}
            >
              <CiCirclePlus size={28} color="#0064d1" />
              <h2 className="text-[#0064d1] text-[15px] hover:underline">
                Thêm giới tính của bạn
              </h2>
            </div>
          )}
        </>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-1 mt-2"
        >
          <label htmlFor="gender" className="text-[15px]">
            Giới tính:
          </label>
          <Controller
            name="gender"
            control={control}
            defaultValue={UserGender.Male}
            render={({ field }) => (
              <select
                {...field}
                id="gender"
                className="p-2 text-[14px] rounded-lg border border-solid border-gray-600 outline-none"
              >
                <option value={UserGender.Male}>Nam</option>
                <option value={UserGender.Female}>Nữ</option>
              </select>
            )}
          />
          <div className="mt-4 flex items-center justify-between border-t border-solid border-[#d7dade] pt-4">
            <div className="flex items-center gap-2">
              <IoEarth size={20} />
              <span className="text-[#080809] text-[17px]">Công khai</span>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                className="bg-[#e2e5e9] hover:bg-[#d6d9dd] text-[#080809] text-[15px]"
                onClick={() => setIsClickGender(false)}
              >
                Huỷ
              </Button>
              <Button
                type="submit"
                className="text-[15px] bg-blue-500 hover:bg-blue-600 text-white hover:text-white"
              >
                Xác nhận
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default GenderInformation;
