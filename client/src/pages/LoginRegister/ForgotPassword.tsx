import { useNavigate } from "react-router-dom";
import { path } from "@/utils/path";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { forgetPassword } from "@/redux/userSlice";
import { authAPI } from "@/apis/authApi";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [valueEmail, setValueEmail] = useState<string>("");
  const [errorValue, setErrorValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleOnChange = (value: string) => {
    const regex = new RegExp(
      /^([a-zA-Z0-9]+)([.{1}])?([a-zA-Z0-9]+)@gmail([.])com$/
    );
    if (regex.test(value.trim().toLowerCase())) {
      setValueEmail(value);
      setErrorValue("");
    } else {
      return setErrorValue("Please enter a valid email");
    }
  };

  const handleOnClick = async (valueEmail: string) => {
    setIsLoading(true);
    if (valueEmail === "") return setErrorValue("This field is required");
    const OTP = Math.floor(Math.random() * 9000 + 1000);
    dispatch(
      forgetPassword({
        email: valueEmail,
        OTP,
      })
    );
    const response = await authAPI.forgetPassword({
      email: valueEmail,
      OTP,
    });
    if (response.success) {
      setIsLoading(false);
      navigate(`${path.OTP}`);
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "User not found!. Please try again",
      });
    }
  };

  return (
    <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] m-auto w-[500px] bg-white h-auto border-none rounded-[8px] shadow-default pt-[10px]">
      <h2 className="text-[20px] leading-[24px] text-[#162643] mt-[-15px] py-[18px] pr-4 pl-[18px] border-b border-solid border-[#E5E5E5] font-semibold">
        Tìm tài khoản của bạn
      </h2>
      <div className="p-4 border-b border-solid border-[#E5E5E5]">
        <div className="text-[17px] leading-[20px] mb-4 font-normal text-[#1c1e21]">
          Vui lòng nhập email để tìm kiếm tài khoản của bạn.
        </div>
        <div className="relative">
          <input
            name="email"
            type="email"
            className="h-[52px] p-4 border border-solid outline-none text-[16px] w-full rounded-lg"
            onChange={(e) => handleOnChange(e.target.value)}
            placeholder="Email"
          />
          <p className="text-red-500 text-[12x] absolute top-[calc(100% + 6px)]">
            {errorValue}
          </p>
        </div>
      </div>
      <div className="p-4 flex justify-end gap-4">
        {isLoading ? (
          <Button className="bg-blue-500 w-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 100"
              preserveAspectRatio="xMidYMid"
              width="200"
              height="200"
              style={{
                shapeRendering: "auto",
                display: "block",
              }}
              xmlnsXlink="http://www.w3.org/1999/xlink"
            >
              <g>
                <circle
                  strokeDasharray="164.93361431346415 56.97787143782138"
                  r="35"
                  strokeWidth="10"
                  stroke="#fff"
                  fill="none"
                  cy="50"
                  cx="50"
                >
                  <animateTransform
                    keyTimes="0;1"
                    values="0 50 50;360 50 50"
                    dur="1s"
                    repeatCount="indefinite"
                    type="rotate"
                    attributeName="transform"
                  ></animateTransform>
                </circle>
                <g></g>
              </g>
            </svg>
            Đang xử lý
          </Button>
        ) : (
          <>
            <Button
              className="bg-[#E4E6EB] text-[#4B4F56] font-semibold hover:bg-[#E4E6EB]"
              onClick={() => navigate(`/${path.LOGIN}`)}
            >
              Huỷ
            </Button>
            <Button
              className="hover:bg-[#216FDB] bg-[#1877f2] text-[15px] font-medium"
              onClick={() => handleOnClick(valueEmail)}
              disabled={valueEmail ? false : true}
            >
              Tìm kiếm
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
