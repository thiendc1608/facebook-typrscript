import { useEffect, useState } from "react";
import { path } from "@/utils/path";
import { useNavigate } from "react-router-dom";
import InputNumber from "@/components/ForgotPassword/InputNumber";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import { forgetPassword } from "@/redux/userSlice";
import { authAPI } from "@/apis/authApi";

const InputOTP = () => {
  const navigate = useNavigate();
  const { email, OTP } = useSelector((state: RootState) => state.user);
  const [OTPinput, setOTPinput] = useState<string[]>(["", "", "", ""]);
  const [disable, setDisable] = useState<boolean>(true);
  const [timerCount, setTimerCount] = useState<number>(60);
  const dispatch = useDispatch();

  const resendOTP = async () => {
    if (disable) return;
    const OTP = Math.floor(Math.random() * 9000 + 1000);
    const response = await authAPI.forgetPassword({
      email,
      OTP,
    });
    if (response.success) {
      dispatch(
        forgetPassword({
          email,
          OTP,
        })
      );
      setDisable(true);
      setTimerCount(60);
    }
  };

  window.onload = async () => {
    const OTP = Math.floor(Math.random() * 9000 + 1000);
    const response = await authAPI.forgetPassword({
      email,
      OTP,
    });
    if (response.success) {
      dispatch(
        forgetPassword({
          email,
          OTP,
        })
      );
      setDisable(true);
      setTimerCount(60);
    }
  };

  const verifyOTP = () => {
    if (parseInt(OTPinput.join("")) === OTP) {
      navigate(`/${path.FORGOT_PASSWORD}/${path.RESET_PASSWORD}`);
      return;
    } else {
      toast.error(
        "The code you have entered is not correct, try again or re-send the link"
      );
      setOTPinput(["", "", "", ""]);
      return;
    }
  };

  useEffect(() => {
    if (disable) {
      const interval = setInterval(() => {
        setTimerCount((lastTimerCount) => {
          if (lastTimerCount <= 1) {
            clearInterval(interval);
            setDisable(false);
          }
          if (lastTimerCount === 0) return lastTimerCount;
          return lastTimerCount - 1;
        });
      }, 1000); //each count lasts for a second
      //cleanup the interval on complete
      return () => clearInterval(interval);
    }
  }, [disable]);

  return (
    <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] m-auto w-[500px] bg-white h-auto border-none rounded-[8px] shadow-default pt-[10px]">
      <h2 className="text-[20px] leading-[24px] text-[#162643] mt-[-15px] py-[18px] pr-4 pl-[18px] border-b border-solid border-[#E5E5E5] font-semibold">
        Xác thực Email
      </h2>
      <div className="p-4 border-b border-solid border-[#E5E5E5]">
        <div className="mb-4">
          <p className="text-center text-[17px] leading-[20px] font-normal text-[#1c1e21]">
            Hệ thống đã gửi mã xác thực thông qua email của bạn
          </p>
          <p className="text-center text-red-500 text-sm ">{email}</p>
        </div>
        <div className="flex flex-col gap-[10px]">
          <div className="flex items-center gap-[20px] mx-auto w-full max-w-[320px]">
            <InputNumber
              OTPinput={OTPinput}
              setOTPinput={setOTPinput}
              indexNumber={0}
            />
            <InputNumber
              OTPinput={OTPinput}
              setOTPinput={setOTPinput}
              indexNumber={1}
            />
            <InputNumber
              OTPinput={OTPinput}
              setOTPinput={setOTPinput}
              indexNumber={2}
            />
            <InputNumber
              OTPinput={OTPinput}
              setOTPinput={setOTPinput}
              indexNumber={3}
            />
          </div>

          <div className="flex flex-col mt-[20px]">
            <Button
              className="hover:bg-[#216FDB] bg-[#1877f2] text-[15px] font-medium"
              onClick={() => verifyOTP()}
            >
              Verify Account
            </Button>
          </div>
        </div>
        <div className="flex justify-center items-center mt-[20px] text-sm leading-5 font-medium ml-1 text-[#6b7280]">
          <p>Didn&apos;t receive code?</p>{" "}
          <a
            className={cn(
              "flex items-center ml-1",
              disable
                ? "text-gray-500 cursor-default no-underline"
                : "text-blue-500 cursor-pointer underline"
            )}
            onClick={() => resendOTP()}
          >
            {disable ? `Resend OTP in ${timerCount}s` : "Resend OTP"}
          </a>
        </div>
      </div>
    </div>
  );
};

export default InputOTP;
