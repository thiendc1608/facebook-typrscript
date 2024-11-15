import { BiSolidLike } from "react-icons/bi";
import { BsEmojiSmile } from "react-icons/bs";
import { CiImageOn } from "react-icons/ci";
import { MdInfo } from "react-icons/md";

const ContentConversation = () => {
  return (
    <>
      <div className="h-[64px] w-full shadow-sm z-[100]">
        <div className="px4 py-3">
          <div className="px-[6px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src="https://scontent.fhan2-4.fna.fbcdn.net/v/t39.30808-1/314818792_101307872811270_6985110685556599242_n.jpg?stp=dst-jpg_s100x100&_nc_cat=110&ccb=1-7&_nc_sid=0ecb9b&_nc_ohc=PmFhy5XGFAYQ7kNvgGLI8vv&_nc_ad=z-m&_nc_cid=0&_nc_zt=24&_nc_ht=scontent.fhan2-4.fna&_nc_gid=AFLYrPnO6biLlfZ1MYoSZPa&oh=00_AYCMXP9zafpvwJ6G1PDfVsfLh0gOIAur1fjG3IH-dHQulQ&oe=673CE376"
                  alt="anh"
                  className="w-[40px] h-[40px] object-cover rounded-full"
                />
                <span className="text-[#080809] text-[16px] font-bold">
                  Hình bóng
                </span>
              </div>
              <div className="w-[36px] h-[36px] rounded-full bg-[#f2f2f2] flex items-center justify-center cursor-pointer">
                <MdInfo size={24} color="#0866ff" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-[calc(100vh-64px-60px-56px)] overflow-y-auto z-0">
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
      <div className="h-[60px] shadow-bgContent flex items-center">
        <div className="py-3 px-1 flex items-center gap-2 w-full">
          <div className="w-[36px] h-[36px] cursor-pointer flex items-center">
            <label htmlFor="choose image" className="cursor-pointer">
              <CiImageOn size={30} title="Đính kèm file" color="#0866ff" />
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
              color="#0866ff"
              title="Chọn biểu tượng cảm xúc"
              className="absolute top-[50%] translate-y-[-50%] right-[10px]"
            />
          </div>
          <div className="w-[36px] h-[36px] cursor-pointer flex items-center">
            <BiSolidLike size={30} title="Gửi like" color="#0866ff" />
          </div>
        </div>
      </div>
    </>
  );
};

export default ContentConversation;
