import { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { IoImagesOutline } from "react-icons/io5";
import { FaFileAlt } from "react-icons/fa";
import { FaLink } from "react-icons/fa6";

interface MediaFileProps {
  setIsShowMedia: React.Dispatch<
    React.SetStateAction<{
      isShow: boolean;
      option: string;
    }>
  >;
}

const MediaFile = ({ setIsShowMedia }: MediaFileProps) => {
  const [isExpandMedia, setIsExpandMedia] = useState(false);

  return (
    <div className="p-2 cursor-pointer">
      <div className="p-[6px] flex items-center justify-between hover:bg-[#f2f2f2] rounded-lg h-[36px]">
        <div className="w-full">
          <span
            className="text-[15px] text-[#080809] font-semibold select-none"
            onClick={() => setIsExpandMedia(!isExpandMedia)}
          >
            File phương tiện, file, liên kết
          </span>
        </div>
        {isExpandMedia ? (
          <IoIosArrowUp size={20} />
        ) : (
          <IoIosArrowDown size={20} />
        )}
      </div>
      {isExpandMedia && (
        <ul className="w-full h-full">
          <li
            className="h-[40px] w-full flex items-center hover:bg-[#f2f2f2] rounded-lg"
            onClick={() =>
              setIsShowMedia({ isShow: true, option: "mediaImage" })
            }
          >
            <div className="p-[6px] w-[32px] h-[32px]">
              <IoImagesOutline size={20} />
            </div>
            <span className="p-[6px] text-[#080809] text-[15px]">
              File phương tiện
            </span>
          </li>
          <li
            className="h-[40px] w-full flex items-center hover:bg-[#f2f2f2] rounded-lg"
            onClick={() => setIsShowMedia({ isShow: true, option: "file" })}
          >
            <div className="p-[6px] w-[32px] h-[32px]">
              <FaFileAlt size={24} />
            </div>
            <span className="p-[6px] text-[#080809] text-[15px]">File</span>
          </li>
          <li
            className="h-[40px] w-full flex items-center hover:bg-[#f2f2f2] rounded-lg"
            onClick={() => setIsShowMedia({ isShow: true, option: "link" })}
          >
            <div className="p-[6px] w-[32px] h-[32px]">
              <FaLink size={20} />
            </div>
            <span className="p-[6px] text-[#080809] text-[15px]">Liên kết</span>
          </li>
        </ul>
      )}
    </div>
  );
};

export default MediaFile;
