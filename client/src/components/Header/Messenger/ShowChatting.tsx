import { IoIosArrowDown } from "react-icons/io";
import { GoDash } from "react-icons/go";
import { IoCloseOutline } from "react-icons/io5";
import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmile } from "react-icons/bs";
import { BiSolidLike } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { setIsOpenChatting } from "@/redux/notificationSlice";
import { useEffect, useState } from "react";

const ShowChatting = () => {
  const dispatch = useDispatch();
  const [changeColor, setChangeColor] = useState<string>("#0866ff");

  useEffect(() => {
    const inputParentElement = document.getElementById("inputChatParent");
    const inputElement = document.getElementById("inputChat");
    document.addEventListener("click", (event) => {
      // Kiểm tra nếu người dùng click ra ngoài inputElement
      if (
        event.target !== inputParentElement &&
        !inputParentElement?.contains(event.target as Node)
      ) {
        inputElement?.blur(); // Mất focus
        setChangeColor("#b6b9be");
        console.log("Input lost focus");
      } else {
        inputElement?.focus(); // focus
        setChangeColor("#0866ff");
      }
    });
  }, []);

  return (
    <div className="fixed bottom-0 right-[80px]">
      <div
        className="w-[328px] h-[455px] bg-white rounded-lg shadow-default"
        id="inputChatParent"
      >
        <div className="p-2 h-[48px] shadow-default">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 w-auto">
              <img
                src="https://scontent.fhan2-4.fna.fbcdn.net/v/t39.30808-1/314818792_101307872811270_6985110685556599242_n.jpg?stp=dst-jpg_s100x100&_nc_cat=110&ccb=1-7&_nc_sid=0ecb9b&_nc_ohc=PmFhy5XGFAYQ7kNvgGLI8vv&_nc_ad=z-m&_nc_cid=0&_nc_zt=24&_nc_ht=scontent.fhan2-4.fna&_nc_gid=AGcIdjzRS8iPaz7uvSs9HMU&oh=00_AYDA62KxdTBIFUeSbbQVTuac6WLMsiIL29Ki4VleH5-LIA&oe=673C72F6"
                alt="anh"
                className="w-[32px] h-[32px] rounded-full object-cover"
              />
              <span className="text-[15px] text-[#080809] font-semibold">
                Hình bóng
              </span>
              <IoIosArrowDown
                size={20}
                color={changeColor}
                className="cursor-pointer"
              />
            </div>
            <div className="flex items-center gap-2">
              <GoDash size={24} color={changeColor} />
              <IoCloseOutline
                size={24}
                color={changeColor}
                className="cursor-pointer"
                onClick={() => dispatch(setIsOpenChatting(false))}
              />
            </div>
          </div>
        </div>
        <div>
          <div className="w-full h-[347px] overflow-auto">
            <div className="h-[20px]"></div>
            <div className="pt-5 px-3 pb-3">
              <div className="flex flex-col items-center justify-center gap-3">
                <img
                  src="https://scontent.fhan2-4.fna.fbcdn.net/v/t39.30808-1/314818792_101307872811270_6985110685556599242_n.jpg?stp=dst-jpg_s100x100&_nc_cat=110&ccb=1-7&_nc_sid=0ecb9b&_nc_ohc=PmFhy5XGFAYQ7kNvgGLI8vv&_nc_ad=z-m&_nc_cid=0&_nc_zt=24&_nc_ht=scontent.fhan2-4.fna&_nc_gid=AGcIdjzRS8iPaz7uvSs9HMU&oh=00_AYDA62KxdTBIFUeSbbQVTuac6WLMsiIL29Ki4VleH5-LIA&oe=673C72F6"
                  alt="anh"
                  className="w-[60px] h-[60px] rounded-full object-cover"
                />
                <span className="text-[17px] text-[#080809] font-semibold">
                  Hình bóng
                </span>
              </div>
            </div>
          </div>
          <div className="w-full h-[60px] shadow-bgContent flex items-center">
            <div className="py-3 px-1 flex items-center gap-2 w-full">
              <div className="w-[36px] h-[36px] cursor-pointer flex items-center">
                <label htmlFor="choose image" className="cursor-pointer">
                  <CiImageOn
                    size={30}
                    title="Đính kèm file"
                    color={changeColor}
                  />
                </label>
                <input type="file" id="choose image" hidden />
              </div>
              <div className="w-full relative bg-[#F0F2F5] rounded-3xl overflow-hidden">
                <input
                  id="inputChat"
                  type="text"
                  placeholder="Aa"
                  className="p-1 bg-[#F0F2F5] h-[36px] w-full outline-none pl-3 text-[17px]"
                  autoFocus
                />
                <BsEmojiSmile
                  size={20}
                  color={changeColor}
                  title="Chọn biểu tượng cảm xúc"
                  className="absolute top-[50%] translate-y-[-50%] right-[10px]"
                />
              </div>
              <div className="w-[36px] h-[36px] cursor-pointer flex items-center">
                <BiSolidLike size={30} title="Gửi like" color={changeColor} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowChatting;
