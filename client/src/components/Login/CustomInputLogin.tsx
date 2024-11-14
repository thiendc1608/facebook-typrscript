import { SubmitHandler, useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CustomResponse, FormData, LoginSchema, UserType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { path } from "@/utils/path";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { login } from "@/redux/userSlice";
import { authAPI } from "@/apis/authApi";

const CustomInputLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    // watch,
    formState: { errors },
  } = useForm<Pick<FormData, "email" | "password">>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    }, // Apply the zodResolver
  });
  const onSubmit: SubmitHandler<Pick<FormData, "email" | "password">> = async (
    data
  ) => {
    const response: CustomResponse & { user: UserType; token: string } =
      await authAPI.userLogin(data);
    if (response?.success) {
      toast.success(response?.message);
      dispatch(
        login({
          isLogin: true,
          token: response?.token,
          user: response?.user,
        })
      );
      navigate(`/${path.HOME}`);
    } else {
      toast.error(response?.message);
    }
  };

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col mx-4 gap-2"
    >
      {/* register your input into the hook by invoking the "register" function */}
      <div className="relative py-[6px]">
        <input
          {...register("email", { required: true })}
          type="email"
          placeholder="Email"
          className="w-full h-[40px] rounded-[6px] text-[17px] p-[11px] outline-none border border-solid"
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

      <div className="relative py-[6px]">
        {/* include validation with required or other standard HTML validation rules */}
        <input
          {...register("password", { required: true })}
          type={!showPassword ? "password" : "text"}
          placeholder="Mật khẩu"
          className="w-full h-[52px] rounded-[6px] text-[17px] px-[14px] py-[16px] outline-none border border-solid"
          autoComplete="on"
        />
        {/* errors will return when field validation fails  */}
        {errors?.password?.ref?.value === "" ? (
          <span className="absolute top-[100%] left-0 text-red-500">
            This field is required
          </span>
        ) : (
          <>
            <span className="absolute top-[100%] left-0 text-red-500">
              {errors?.password?.message}
            </span>
          </>
        )}
        <div
          className="absolute right-4 top-[50%] translate-y-[-50%] cursor-pointer"
          onClick={() => setShowPassword(!showPassword)}
        >
          {!showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </div>
      </div>
      <Button className="w-full h-[48px] bg-[#166FE5] text-[16px] hover:bg-[#477cc1] mb-[6px] mt-[10px]">
        Đăng nhập
      </Button>
    </form>
  );
};

export default CustomInputLogin;
