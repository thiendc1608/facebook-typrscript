import CustomInputRegister from "@/components/Register/CustomInputRegister";

const Register = () => {
  return (
    <div className="h-full w-full bg-[#f2f4f7] shadow-default">
      <div className="py-[20px]">
        <div className="flex flex-col items-center justify-center h-full">
          <div>
            <img
              src="https://static.xx.fbcdn.net/rsrc.php/y1/r/4lCu2zih0ca.svg"
              alt="facebook"
              className="w-[240px]"
            />
          </div>
          <div className="rounded-lg pb-[14px] w-[432px] h-auto border border-solid border-[#dddfe2] shadow-default text-center">
            <div className="py-[10px] px-4 flex flex-col w-full">
              <span className="text-[25px] leading-[32px] text-[#1c1e21]">
                Tạo tài khoản mới
              </span>
              <span className="text-[#606770] text-[15px] leading-6">
                Nhanh chóng và dễ dàng.
              </span>
            </div>
            <div className="p-4">
              <CustomInputRegister />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
