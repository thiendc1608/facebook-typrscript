import { cn } from "@/lib/utils";
import { useState } from "react";
import ResidencePlace from "./ResidencePlace";
import PhoneInformation from "./PhoneInformation";
import EmailInformation from "./EmailInformation";
import DateOfBirth from "./DateOfBirth";
import GenderInformation from "./GenderInformation";

const IntroduceTab = () => {
  const [selectTab, setSelectTab] = useState("Nơi sống");

  return (
    <div className="w-full bg-white rounded-md h-auto flex items-center">
      <div className="w-[33%] h-full py-4 px-[6px] border-r-2 border-solid border-[#E5E5E5]">
        <div className="w-full text-[#080809] text-[20px] mt-1 mx-[10px] mb-5">
          Giới thiệu
        </div>
        <ul className="flex flex-col gap-2">
          <li
            className={cn(
              "h-[35px] p-3 rounded-lg cursor-pointer text-[15px] text-[#65686c] select-none",
              selectTab === "Nơi sống"
                ? "text-[#0078DE] bg-[#EBF5FF]"
                : "hover:bg-[#f2f2f2]"
            )}
            onClick={() => setSelectTab("Nơi sống")}
          >
            <span>Nơi sống</span>
          </li>
          <li
            className={cn(
              "h-[35px] p-3 hover:bg-[#f2f2f2] rounded-lg cursor-pointer text-[15px] text-[#65686c] select-none",
              selectTab === "Thông tin liên hệ"
                ? "text-[#0078DE] bg-[#EBF5FF]"
                : "hover:bg-[#f2f2f2]"
            )}
            onClick={() => setSelectTab("Thông tin liên hệ")}
          >
            <span>Thông tin liên hệ</span>
          </li>
        </ul>
      </div>
      <div className="w-[67%] h-full pt-4 pr-8 pb-8 p-4">
        {selectTab === "Nơi sống" && <ResidencePlace />}
        {selectTab === "Thông tin liên hệ" && (
          <div className="flex flex-col gap-4">
            <PhoneInformation />
            <EmailInformation />
            <DateOfBirth />
            <GenderInformation />
          </div>
        )}
      </div>
    </div>
  );
};

export default IntroduceTab;
