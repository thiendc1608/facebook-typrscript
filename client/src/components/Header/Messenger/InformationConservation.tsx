import { PiUserCircleFill } from "react-icons/pi";
import { IoMdSearch } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";

const InformationConservation = () => {
  return (
    <div className="absolute top-0 right-0 w-[33.33%] pt-4 pb-3 border-l-2 border-solid border-[#E5E5E5] h-[calc(100vh-56px)]">
      <div className="flex flex-col items-center justify-between">
        <div className="flex flex-col items-center gap-3">
          <img
            src="https://scontent.fhan14-1.fna.fbcdn.net/v/t39.30808-1/453222454_2480450772345120_2678174364504531963_n.jpg?stp=c128.0.1024.1024a_dst-jpg_s100x100&_nc_cat=105&ccb=1-7&_nc_sid=0ecb9b&_nc_ohc=gmmOnBNeoe8Q7kNvgHTNxMB&_nc_ad=z-m&_nc_cid=0&_nc_zt=24&_nc_ht=scontent.fhan14-1.fna&_nc_gid=A7SPXUeHbEwHlVlFQxsCAOC&oh=00_AYBEkvQbh9g8tlM4zSGk9koztBjnELEpwilq0war6C8s1A&oe=673D293B"
            alt="anh"
            className="w-[72px] h-[72px] rounded-full object-cover"
          />
          <span className="text-[#080809] text-[17px]">abcxyz</span>
        </div>
        <div className="pt-4 px-3">
          <div className="text-center flex items-center justify-between">
            <div className="flex flex-col items-center gap-2">
              <div className="w-[36px] h-[36px] bg-[#d6d9dd] rounded-full cursor-pointer flex items-center justify-center">
                <PiUserCircleFill size={24} />
              </div>
              <span className="text-[#080809] text-[13px]">Trang cá nhân</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-[36px] h-[36px] bg-[#d6d9dd] rounded-full cursor-pointer flex items-center justify-center">
                <IoMdSearch size={24} />
              </div>
              <span className="text-[#080809] text-[13px]">Tìm kiếm</span>
            </div>
          </div>
        </div>
      </div>
      <div className="relative mt-4 p-2 cursor-pointer">
        <div className="p-[6px] flex items-center justify-between hover:bg-[#f2f2f2] rounded-lg h-[36px]">
          <div className="w-full">
            <span className="text-[15px] text-[#080809]">File phương tiện</span>
          </div>
          <IoIosArrowDown size={20} />
        </div>
      </div>
    </div>
  );
};

export default InformationConservation;
