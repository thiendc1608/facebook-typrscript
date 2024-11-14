import { cn } from "@/lib/utils";
import { useState } from "react";

const MenuNotification = () => {
  const [isActiveNotification, setIsActiveNotification] = useState(true);

  return (
    <div className="pl-4 h-9 flex items-center gap-2">
      <span
        className={cn(
          "px-3 !leading-[36px] rounded-xl text-[#080809] text-[15px] hover:bg-[#F2F2F2] inline-block cursor-pointer",
          isActiveNotification ? "bg-[#DFE9F2] text-[#0861F2]" : ""
        )}
        onClick={() => setIsActiveNotification(true)}
      >
        Tất cả
      </span>
      <span
        className={cn(
          "px-3 !leading-[36px] rounded-3xl text-[#080809] text-[15px] hover:bg-[#F2F2F2] cursor-pointer",
          !isActiveNotification ? "bg-[#DFE9F2] text-[#0861F2]" : ""
        )}
        onClick={() => setIsActiveNotification(false)}
      >
        Chưa đọc
      </span>
    </div>
  );
};

export default MenuNotification;
