import { Socket } from "socket.io-client";
import { MdOutlineZoomOutMap } from "react-icons/md";
import { BiSolidEdit } from "react-icons/bi";
import { IoIosSearch } from "react-icons/io";
import ShowUserMessage from "./ShowUserMessage";

interface ShowMessageProps {
  socket: Socket;
}
const ShowMessage = ({ socket }: ShowMessageProps) => {
  return (
    <div
      className="absolute top-0 right-4 bg-white rounded-lg w-[360px] h-[535px] overflow-y-auto shadow-default z-50"
      id="notification"
    >
      <div className="flex flex-col">
        <div className="flex items-center justify-between mt-5 mx-4 mb-3 leading-[17px]">
          <span className="text-[#080809] text-[24px] leading-[21px]">
            Đoạn chat
          </span>
          <div className="flex gap-4">
            <span className="cursor-pointer">
              <MdOutlineZoomOutMap size={20} />
            </span>
            <span className="cursor-pointer">
              <BiSolidEdit size={20} />
            </span>
          </div>
        </div>
        <div className="my-2 px-4 h-[36px]">
          <div className="flex items-center rounded-xl bg-[#F0F2F5] overflow-hidden">
            <label htmlFor="search" className="pl-2">
              <IoIosSearch size={20} />
            </label>
            <input
              type="text"
              id="search"
              placeholder="Tìm kiếm trên Messenger"
              className="w-full pt-[7px] px-[6px] pb-[9px] bg-[#F0F2F5] outline-none text-[16px]"
            />
          </div>
        </div>
        <div className="py-2 px-4">
          <span className="px-3 !leading-[36px] rounded-xl text-[15px] inline-block cursor-pointer bg-[#DFE9F2] text-[#0861F2] font-semibold">
            Hộp thư
          </span>
        </div>
        <ShowUserMessage />
      </div>
    </div>
  );
};

export default ShowMessage;
