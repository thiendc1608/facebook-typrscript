import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { range } from "@/utils/helpers";
import { CustomResponse, RegisterSchema, UserGender } from "@/types";
// import CustomSelect from "@/components/Register/CustomSelect";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { z } from "zod";
import { authAPI } from "@/apis/authApi";

const CustomInput = () => {
  const navigate = useNavigate();
  const date = new Date().getDate();
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    // setError,
  } = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
  });

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

  const onSubmit: SubmitHandler<z.infer<typeof RegisterSchema>> = async (
    data
  ) => {
    const response: CustomResponse = await authAPI.userRegister(data);
    if (response?.success) {
      toast.success(response?.message);
      navigate("/login");
    } else {
      toast.error(response?.message);
    }
  };

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full">
      <div className="flex gap-[10px]">
        <div className="relative mb-4">
          <input
            {...register("lastName", { required: true })}
            type="text"
            placeholder="Họ"
            className="w-[194px] h-[40px] rounded-[6px] text-[17px] p-[11px] outline-none border border-solid"
          />
          {errors?.lastName?.ref?.value === "" ? (
            <span className="absolute top-[100%] left-0 text-red-500">
              This field is required
            </span>
          ) : (
            <span className="absolute top-[100%] left-0 text-red-500">
              {errors?.lastName?.message}
            </span>
          )}
        </div>

        <div className="relative">
          <input
            {...register("firstName", { required: true })}
            type="text"
            placeholder="Tên"
            className="w-[194px] h-[40px] rounded-[6px] text-[17px] p-[11px] outline-none border border-solid"
          />
          {errors?.firstName?.ref?.value === "" ? (
            <span className="absolute top-[75%] left-0 text-red-500">
              This field is required
            </span>
          ) : (
            <span className="absolute top-[75%] left-0 text-red-500">
              {errors?.firstName?.message}
            </span>
          )}
        </div>
      </div>
      <div className="flex gap-2 items-center mb-2">
        <div className="flex-1 flex items-center gap-2">
          <label htmlFor="date" className="text-[15px]">
            Ngày:{" "}
          </label>
          <Controller
            name="date" // Name of the field
            control={control}
            defaultValue={date}
            render={({ field }) => (
              <select
                {...field}
                id="date"
                className="p-2 text-[14px] rounded-lg border border-solid border-gray-600"
              >
                {listDate.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            )}
          />
        </div>
        <div className="flex-1 flex items-center gap-2">
          <label htmlFor="month" className="text-[15px]">
            Tháng:{" "}
          </label>
          <Controller
            name="month" // Another multi-select field
            control={control}
            defaultValue={month}
            render={({ field }) => (
              <select
                id="month"
                {...field}
                className="p-2 text-[14px] rounded-lg border border-solid border-gray-600 outline-none"
              >
                {listMonth.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            )}
          />
        </div>
        <div className="flex-1 flex items-center gap-2">
          <label htmlFor="year" className="text-[15px]">
            Năm:{" "}
          </label>
          <Controller
            name="year"
            control={control}
            defaultValue={year}
            render={({ field }) => (
              <select
                {...field}
                id="year"
                className="p-2 text-[14px] rounded-lg border border-solid border-gray-600 outline-none"
              >
                {listYear.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            )}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 my-2">
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
      </div>

      <div className="relative py-[6px]">
        <input
          {...register("email", { required: true })}
          type="email"
          placeholder="Email"
          className="w-full h-[40px] rounded-[6px] text-[17px] p-[11px] outline-none border border-solid"
          autoComplete="on"
        />
        {errors?.email?.ref?.value === "" ? (
          <span className="absolute top-[90%] left-0 text-red-500">
            This field is required
          </span>
        ) : (
          <>
            <span className="absolute top-[90%] left-0 text-red-500">
              {errors?.email?.message}
            </span>
          </>
        )}
      </div>

      <div className="relative py-[6px] mt-4">
        <input
          {...register("password", { required: true })}
          type="password"
          placeholder="Mật khẩu"
          className="w-full h-[40px] rounded-[6px] text-[17px] px-[14px] py-[16px] outline-none border border-solid"
          autoComplete="on"
        />
        {errors.password && (
          <span className="absolute top-[90%] left-0 text-red-500">
            {errors.password.message}
          </span>
        )}
      </div>
      <div className="flex flex-col items-start text-[#777] text-[13px] gap-[11px] my-[11px]">
        <p className="text-left">
          Những người dùng dịch vụ của chúng tôi có thể đã tải thông tin liên hệ
          của bạn lên Facebook.{" "}
          <a className="text-[#0866FF] hover:underline cursor-pointer">
            Tìm hiểu thêm
          </a>
        </p>
        <p className="text-left">
          Bằng cách nhấp vào Đăng ký, bạn đồng ý với{" "}
          <a className="text-[#0866FF] hover:underline cursor-pointer">
            Điều khoản
          </a>
          ,{" "}
          <a className="text-[#0866FF] hover:underline cursor-pointer">
            Chính sách quyền riêng tư
          </a>{" "}
          và{" "}
          <a className="text-[#0866FF] hover:underline cursor-pointer">
            Chính sách cookie
          </a>{" "}
          của chúng tôi. Bạn có thể nhận được thông báo của chúng tôi qua SMS và
          hủy nhận bất kỳ lúc nào.
        </p>
      </div>
      <Button
        className="bg-[#1877F2] hover:bg-blue-900 my-[6px] h-[48px] text-[17px]"
        type="submit"
      >
        Đăng ký
      </Button>
      <Link
        to={"/login"}
        className="text-[#1877F2] hover:underline text-[17px] my-[10px]"
      >
        Bạn đã có tài khoản ư?
      </Link>
    </form>
  );
};

export default CustomInput;
