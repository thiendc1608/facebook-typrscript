import CustomInputPassword from "@/components/ResetPassword/CustomInputPassword";

const ResetPassword = () => {
  return (
    <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] m-auto w-[500px] bg-white h-auto border-none rounded-[8px] shadow-default p-[10px]">
      <div className="m-4 text-center">
        <span className="text-[18px] leading-[22px]">Thay đổi mật khẩu</span>
      </div>
      <CustomInputPassword />
    </div>
  );
};

export default ResetPassword;
