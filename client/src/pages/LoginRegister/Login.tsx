import CustomInputLogin from "@/components/Login/CustomInputLogin";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  return (
    <div className="h-screen w-screen bg-[#f2f4f7]">
      <div className="flex flex-col items-center justify-center h-full">
        <div>
          <img
            src="https://static.xx.fbcdn.net/rsrc.php/y1/r/4lCu2zih0ca.svg"
            alt="facebook"
            className="w-[240px]"
          />
        </div>
        <div className="rounded-lg pb-[14px] w-[396px] h-[400px] border border-solid border-[#dddfe2] shadow-default text-center">
          <div className="pt-6 pb-4">
            <span className="text-[18px] leading-[22px]">
              Đăng nhập Facebook
            </span>
          </div>
          <CustomInputLogin />
          <div>
            <div className="pt-[10px] pb-[2px]">
              <Link
                to={"/forgot-password"}
                className="text-[#1877F2] hover:underline text-[14px]"
              >
                Quên mật khẩu
              </Link>
            </div>
            <div className="flex gap-2 items-center my-[10px] mx-[8px]">
              <div className="flex-1 border-b border-[#d7dade]"></div>
              <span className="text-[12px] text-[#96999e]">hoặc</span>
              <div className="flex-1 border-b border-[#d7dade]"></div>
            </div>
          </div>
          <Button
            className="bg-[#42b72a] hover:bg-[#36A420] my-[6px] h-[48px] text-[17px]"
            onClick={() => navigate("/register")}
          >
            Tạo tài khoản mới
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
