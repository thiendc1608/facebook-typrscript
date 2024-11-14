import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ChangePasswordType,
  CustomResponse,
  ResetPasswordSchema,
} from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { path } from "@/utils/path";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { authAPI } from "@/apis/authApi";

const CustomInputPassword = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { email } = useSelector((state: RootState) => state.user);
  const {
    register,
    handleSubmit,
    // watch,
    formState: { errors },
  } = useForm<ChangePasswordType>({
    resolver: zodResolver(ResetPasswordSchema),
  });
  const onSubmit = async (data: ChangePasswordType) => {
    const dataToChangePW = { ...data, email };
    delete dataToChangePW["confirmPassword"];

    const response: CustomResponse = await authAPI.changePassword(
      dataToChangePW
    );

    if (response.success) {
      toast.success(response.message);
      navigate(`/${path.HOME}`);
    } else {
      toast.error(response.message);
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
        {/* include validation with required or other standard HTML validation rules */}
        <input
          {...register("password")}
          type={!showPassword ? "password" : "text"}
          placeholder="Mật khẩu"
          className="w-full h-[46px] rounded-[6px] text-[17px] px-[14px] py-[16px] outline-none border border-solid"
        />
        {/* errors will return when field validation fails  */}
        {errors?.password?.ref?.value === "" ? (
          <span className="absolute top-[100%] left-0 text-red-500">
            This field is required
          </span>
        ) : (
          <span className="absolute top-[100%] left-0 text-red-500">
            {errors?.password?.message}
          </span>
        )}
        <div
          className="absolute right-4 top-[50%] translate-y-[-50%] cursor-pointer"
          onClick={() => setShowPassword(!showPassword)}
        >
          {!showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </div>
      </div>

      <div className="relative py-[6px]">
        {/* include validation with required or other standard HTML validation rules */}
        <input
          {...register("confirmPassword")}
          type={!showConfirmPassword ? "password" : "text"}
          placeholder="Nhập lại mật khẩu"
          className="w-full h-[46px] rounded-[6px] text-[17px] px-[14px] py-[16px] outline-none border border-solid"
        />
        {errors?.confirmPassword?.ref?.value === "" ? (
          <span className="absolute top-[100%] left-0 text-red-500">
            This field is required
          </span>
        ) : (
          <span className="absolute top-[100%] left-0 text-red-500">
            {errors?.confirmPassword?.message}
          </span>
        )}
        <div
          className="absolute right-4 top-[50%] translate-y-[-50%] cursor-pointer"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          {!showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </div>
        {/* errors will return when field validation fails  */}
        {errors?.confirm && (
          <span className="absolute top-[100%] left-0 text-red-500">
            {errors?.confirm?.message?.toString()}
          </span>
        )}
      </div>
      <Button
        className="w-full h-[48px] bg-[#166FE5] text-[16px] hover:bg-[#477cc1] mb-[6px] mt-[10px]"
        type="submit"
      >
        Cập nhật mật khẩu
      </Button>
    </form>
  );
};

export default CustomInputPassword;
