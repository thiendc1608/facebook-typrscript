import { FaEarthAmericas } from "react-icons/fa6";
import { BsThreeDots } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { GoComment } from "react-icons/go";
import { PiShareFatLight } from "react-icons/pi";
import { AiOutlineLike } from "react-icons/ai";
import { chattingUserType } from "@/redux/conversationSlice";
import { useSelector } from "react-redux";
import { useState } from "react";
import { emotionType } from "@/types";

const ShowPost = () => {
  const [isHoverLike, setIsHoverLike] = useState(false);
  const { emojiList } = useSelector(
    (state: { conversation: chattingUserType }) => state.conversation
  );

  return (
    <div className="rounded-lg bg-white">
      <div className="px-3 pt-3 mb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-[40px] h-[40px]">
              <img
                src="https://scontent.fhan2-5.fna.fbcdn.net/v/t39.30808-1/323131282_545387234169382_376895137142030335_n.jpg?stp=cp0_dst-jpg_s40x40_tt6&_nc_cat=1&ccb=1-7&_nc_sid=f4b9fd&_nc_ohc=PLdrKo85N9QQ7kNvgHYNSfa&_nc_oc=AdgpZG63LuNbHnCHuH2jmwQ4a8K_e4HCPFGkD2HUoAaz5Bj1mWLLnVFfPUUtGpuXSI4&_nc_zt=24&_nc_ht=scontent.fhan2-5.fna&_nc_gid=AQQXidkw7Lv-v3ezfPJaYLm&oh=00_AYCTsMZifEBvio4Zlv7Oksqi29V_K0iYyPCDiJdU8Lp1JA&oe=6766EC41"
                alt="anh"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[15px] text-[#080809]">Nguyen Van A</span>
              <div className="flex items-center gap-1 text-[13px] text-[#65686c] h-4">
                <span>14 phut</span>
                <span>.</span>
                <span>
                  <FaEarthAmericas />
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-9 h-9 flex items-center justify-center cursor-pointer">
              <BsThreeDots size={26} />
            </div>
            <div className="w-9 h-9 flex items-center justify-center cursor-pointer">
              <IoMdClose size={26} />
            </div>
          </div>
        </div>
      </div>
      <div className="pt-1 pb-4 px-3">
        <p className="text-[#080809] text-[15px] leading-5">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi saepe
          quidem, enim magnam exercitationem nemo facere explicabo. Consequatur
          perferendis laboriosam ipsam voluptas, quod neque saepe, maxime eos
          quisquam illo nemo!
        </p>
      </div>
      <div className="w-full h-auto">
        <img
          src="https://scontent.fhan2-4.fna.fbcdn.net/v/t39.30808-6/470200993_1155130029518948_4317342333969470821_n.jpg?stp=dst-jpg_p526x296_tt6&_nc_cat=105&ccb=1-7&_nc_sid=833d8c&_nc_ohc=YC5mWtJskZkQ7kNvgHtKufr&_nc_oc=Adi51dfDBPvl6aJxeSJd4bEMHa6WVkdNGzUOnP60P2Sypq7weQESE60VI1j9yF078Ik&_nc_zt=23&_nc_ht=scontent.fhan2-4.fna&_nc_gid=AM6nPkegTQgHRaeO9xnf8dD&oh=00_AYBiHJjL1gGhmVW9zJlX2Au3QcT9lALeYVl7Izvjpd_xSQ&oe=676718FE"
          alt="anh"
        />
      </div>
      <div className="px-3">
        <div className="flex items-center justify-between h-[37px] border-b border-solid border-[#d9d9d9]">
          <div className="flex items-center">
            <img
              src="data:image/svg+xml,%3Csvg fill='none' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M16.0001 7.9996c0 4.418-3.5815 7.9996-7.9995 7.9996S.001 12.4176.001 7.9996 3.5825 0 8.0006 0C12.4186 0 16 3.5815 16 7.9996Z' fill='url(%23paint0_linear_15251_63610)'/%3E%3Cpath d='M16.0001 7.9996c0 4.418-3.5815 7.9996-7.9995 7.9996S.001 12.4176.001 7.9996 3.5825 0 8.0006 0C12.4186 0 16 3.5815 16 7.9996Z' fill='url(%23paint1_radial_15251_63610)'/%3E%3Cpath d='M16.0001 7.9996c0 4.418-3.5815 7.9996-7.9995 7.9996S.001 12.4176.001 7.9996 3.5825 0 8.0006 0C12.4186 0 16 3.5815 16 7.9996Z' fill='url(%23paint2_radial_15251_63610)' fill-opacity='.5'/%3E%3Cpath d='M7.3014 3.8662a.6974.6974 0 0 1 .6974-.6977c.6742 0 1.2207.5465 1.2207 1.2206v1.7464a.101.101 0 0 0 .101.101h1.7953c.992 0 1.7232.9273 1.4917 1.892l-.4572 1.9047a2.301 2.301 0 0 1-2.2374 1.764H6.9185a.5752.5752 0 0 1-.5752-.5752V7.7384c0-.4168.097-.8278.2834-1.2005l.2856-.5712a3.6878 3.6878 0 0 0 .3893-1.6509l-.0002-.4496ZM4.367 7a.767.767 0 0 0-.7669.767v3.2598a.767.767 0 0 0 .767.767h.767a.3835.3835 0 0 0 .3835-.3835V7.3835A.3835.3835 0 0 0 5.134 7h-.767Z' fill='%23fff'/%3E%3Cdefs%3E%3CradialGradient id='paint1_radial_15251_63610' cx='0' cy='0' r='1' gradientUnits='userSpaceOnUse' gradientTransform='rotate(90 .0005 8) scale(7.99958)'%3E%3Cstop offset='.5618' stop-color='%230866FF' stop-opacity='0'/%3E%3Cstop offset='1' stop-color='%230866FF' stop-opacity='.1'/%3E%3C/radialGradient%3E%3CradialGradient id='paint2_radial_15251_63610' cx='0' cy='0' r='1' gradientUnits='userSpaceOnUse' gradientTransform='rotate(45 -4.5257 10.9237) scale(10.1818)'%3E%3Cstop offset='.3143' stop-color='%2302ADFC'/%3E%3Cstop offset='1' stop-color='%2302ADFC' stop-opacity='0'/%3E%3C/radialGradient%3E%3ClinearGradient id='paint0_linear_15251_63610' x1='2.3989' y1='2.3999' x2='13.5983' y2='13.5993' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%2302ADFC'/%3E%3Cstop offset='.5' stop-color='%230866FF'/%3E%3Cstop offset='1' stop-color='%232B7EFF'/%3E%3C/linearGradient%3E%3C/defs%3E%3C/svg%3E"
              alt="like"
              className="w-[20px] h-[20px]"
            />
            <span className="text-[#65676c] text-[15px] pl-1 cursor-pointer">
              105
            </span>
          </div>
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-[2px] cursor-pointer">
              <span className="text-[#65676c] text-[15px] ">14</span>
              <GoComment size={20} />
            </div>
            <div className="flex items-center gap-[2px] cursor-pointer">
              <span className="text-[#65676c] text-[15px] ">14</span>
              <PiShareFatLight size={20} />
            </div>
          </div>
        </div>
      </div>

      {/*  */}
      <div className="px-2 flex items-center">
        <div className="flex-1 px-2">
          <div
            className="relative my-1 cursor-pointer hover:bg-[#F2F2F2] flex items-center justify-center rounded-lg"
            onMouseEnter={() => setIsHoverLike(true)}
            onMouseLeave={() => setIsHoverLike(false)}
          >
            <div className="py-[6px] px-1">
              <AiOutlineLike size={20} />
            </div>
            <span className="py-[6px] px-1 text-[#65686c] text-[15px]">
              Thích
            </span>
            {isHoverLike && (
              <div className="absolute bottom-8 left-[-4px] py-[6px] h-[49px] bg-white rounded-3xl shadow-bgContent">
                <div className="flex items-center ">
                  {emojiList.map((item: emotionType) => (
                    <div key={item.id} className="px-1">
                      <div
                        className="cursor-pointer w-[35px] h-[35px] hover:scale-125"
                        title={item.emotion_name}
                        // onClick={(e) => handleClickEmoji(e, el, item)}
                      >
                        <img
                          src={item.emotion_icon}
                          alt="emoji"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 px-2">
          <div className="my-1 cursor-pointer hover:bg-[#F2F2F2] flex items-center justify-center rounded-lg">
            <div className="py-[6px] px-1">
              <GoComment size={20} />
            </div>
            <span className="py-[6px] px-1 text-[#65686c] text-[15px]">
              Bình luận
            </span>
          </div>
        </div>
        <div className="flex-1 px-2">
          <div className="my-1 cursor-pointer hover:bg-[#F2F2F2] flex items-center justify-center rounded-lg">
            <div className="py-[6px] px-1">
              <PiShareFatLight size={20} />
            </div>
            <span className="py-[6px] px-1 text-[#65686c] text-[15px]">
              Chia sẻ
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowPost;
