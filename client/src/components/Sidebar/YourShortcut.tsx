import { useState } from "react";
import { Button } from "../ui/button";

const YourShortcut = () => {
  const [showButton, setShowButton] = useState(false);
  return (
    <div
      className="flex items-center gap-2 mx-4 pb-[20px] pt-5 max-h-[37px]"
      onMouseEnter={() => setShowButton(true)}
      onMouseLeave={() => setShowButton(false)}
    >
      <div className=" flex-1 text-[#656b67] text-[17px]">Lối tắt của bạn</div>
      {showButton && (
        <Button className="!bg-[#E4E6E9] text-[#1B70CB] underline text-[15px]">
          Chỉnh sửa
        </Button>
      )}
    </div>
  );
};

export default YourShortcut;
