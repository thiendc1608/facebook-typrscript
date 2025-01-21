import { useEffect, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { IoEarth } from "react-icons/io5";
import { Button } from "../ui/button";
import { MdOutlineEdit } from "react-icons/md";
import { setDOB, UserState } from "@/redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { userAPI } from "@/apis/userApi";
import { toast } from "react-toastify";
import { BsThreeDots } from "react-icons/bs";
import { RiDeleteBinLine } from "react-icons/ri";
import Swal from "sweetalert2";
import { range } from "@/utils/helpers";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LuCake } from "react-icons/lu";
import { ProfileDOBSchema } from "@/types";

const DateOfBirth = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector(
    (state: { user: UserState }) => state.user
  );
  const [isClickDOB, setIsClickDOB] = useState<boolean>(false);
  const [isEditDOB, setIsEditDOB] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof ProfileDOBSchema>>({
    resolver: zodResolver(ProfileDOBSchema),
    defaultValues: {
      date: currentUser!.date_of_birth
        ? +currentUser!.date_of_birth.split("-")[2]
        : undefined,
      month: currentUser!.date_of_birth
        ? +currentUser!.date_of_birth.split("-")[1]
        : undefined,
      year: currentUser!.date_of_birth
        ? +currentUser!.date_of_birth.split("-")[0]
        : undefined,
    },
  });

  const [listDate, setListDate] = useState<number[]>([]);
  const listMonth = Array.from({ length: 12 }, (_, i) => i + 1);
  const listYear = range(1905, new Date().getFullYear() + 1, 1).reverse();

  useEffect(() => {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const updateDays = (month: number, year: number) => {
      if (month === 2) {
        if (year % 4 === 0) setListDate(range(1, 30, 1));
        else setListDate(range(1, 29, 1));
      } else if ([4, 6, 9, 11].includes(month)) {
        setListDate(range(1, 31, 1));
      } else {
        setListDate(range(1, 32, 1));
      }
    };

    updateDays(currentMonth, currentYear);
  }, []);

  useEffect(() => {
    const handleCloseEditDOB = (e: Event) => {
      const closeDOBEl = document.getElementById("edit_DOB");
      if (e.target instanceof Node && !closeDOBEl?.contains(e.target))
        setIsEditDOB(false);
    };
    document.addEventListener("click", handleCloseEditDOB);
    return () => document.removeEventListener("click", handleCloseEditDOB);
  }, []);

  const handleDeleteDOB = () => {
    Swal.fire({
      title: "Bạn chắc chứ?",
      text: "Bạn có chắc chắn muốn gỡ không?",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Không",
      confirmButtonText: "Xác nhận",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await userAPI.changeDOB(
            { date_of_birth: null },
            currentUser!.id
          );
          if (response.success) {
            toast.success(response.message);
            setIsClickDOB(false);
            dispatch(setDOB({ date_of_birth: null }));
          } else {
            toast.error(response.message);
          }
        } catch (e) {
          console.log(e);
        }
      }
    });
  };

  type ProfileDOB = z.infer<typeof ProfileDOBSchema>;
  const onSubmit: SubmitHandler<ProfileDOB> = async (data) => {
    setIsClickDOB(false);
    const response = await userAPI.changeDOB(
      { date_of_birth: `${data.year}-${data.month}-${data.date}` },
      currentUser!.id
    );
    if (response.success) {
      toast.success(response.message);
      dispatch(
        setDOB({ date_of_birth: `${data.year}-${data.month}-${data.date}` })
      );
    } else {
      toast.error(response.message);
    }
    // Process submission here
  };

  return (
    <div className="flex flex-col justify-center">
      {!isClickDOB ? (
        <>
          {currentUser?.date_of_birth ? (
            <div className="mt-4 flex items-center justify-between">
              <div className="text-[#080809] text-[15px] self-start flex gap-2 items-center">
                <div className="w-9 h-9 rounded-full flex items-center justify-center bg-[#D6D9DD]">
                  <LuCake size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[#080809] text-[15px]">
                    {`${+currentUser?.date_of_birth.split(
                      "-"
                    )[2]} tháng ${+currentUser?.date_of_birth.split(
                      "-"
                    )[1]}, ${+currentUser?.date_of_birth.split("-")[0]}`}
                  </span>
                  <span className="text-[#65686c] text-[12px]">
                    Ngày, tháng năm sinh
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <IoEarth size={20} />
                <div
                  id="edit_DOB"
                  className="relative w-9 h-9 rounded-full flex items-center justify-center bg-[#e2e5e9] hover:bg-[#D6D9DD] cursor-pointer"
                  onClick={() => setIsEditDOB(!isEditDOB)}
                >
                  <BsThreeDots size={26} />
                  {isEditDOB && (
                    <ul className="absolute top-full right-[50%] w-auto h-auto bg-white rounded-lg shadow-default">
                      <li
                        className="p-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsClickDOB(true);
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
                          onClick={handleDeleteDOB}
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
              onClick={() => setIsClickDOB(true)}
            >
              <CiCirclePlus size={28} color="#0064d1" />
              <h2 className="text-[#0064d1] text-[15px] hover:underline">
                Thêm ngày, tháng và năm sinh
              </h2>
            </div>
          )}
        </>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col w-full mt-4"
        >
          <span className="text-[#080809] text-[15px] mb-4">
            Chỉnh sửa ngày, tháng và năm sinh
          </span>
          <div className="flex items-center justify-between mb-2">
            <div className="flex-1 flex items-center gap-2 justify-center">
              <label htmlFor="date" className="text-[15px]">
                Ngày:{" "}
              </label>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    id="date"
                    className="p-2 text-[14px] rounded-lg border border-solid border-gray-600"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  >
                    {listDate.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                )}
              />
              {errors.date && (
                <span className="text-red-500 text-sm">
                  {" "}
                  {errors.date.message}{" "}
                </span>
              )}
            </div>

            <div className="flex-1 flex items-center gap-2 justify-center">
              <label htmlFor="month" className="text-[15px]">
                Tháng:{" "}
              </label>
              <Controller
                name="month"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    id="month"
                    className="p-2 text-[14px] rounded-lg border border-solid border-gray-600 outline-none"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  >
                    {listMonth.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                )}
              />
              {errors.date && (
                <span className="text-red-500 text-sm">
                  {" "}
                  {errors.date.message}{" "}
                </span>
              )}
            </div>

            <div className="flex-1 flex items-center gap-2 justify-center">
              <label htmlFor="year" className="text-[15px]">
                Năm:{" "}
              </label>
              <Controller
                name="year"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    id="year"
                    className="p-2 text-[14px] rounded-lg border border-solid border-gray-600 outline-none"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  >
                    {listYear.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                )}
              />
              {errors.date && (
                <span className="text-red-500 text-sm">
                  {" "}
                  {errors.date.message}{" "}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-solid border-[#d7dade] pt-4">
            <div className="flex items-center gap-2">
              <IoEarth size={20} />
              <span className="text-[#080809] text-[17px]">Công khai</span>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                className="bg-[#e2e5e9] hover:bg-[#d6d9dd] text-[#080809] text-[15px]"
                onClick={() => setIsClickDOB(false)}
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

export default DateOfBirth;
