import { setIsOpenChatting, setIsOpenMessage } from "@/redux/notificationSlice";
import { useDispatch } from "react-redux";

const ShowUserMessage = () => {
  const dispatch = useDispatch();

  return (
    <div className="p-2">
      <div
        className="flex items-center justify-start gap-2 hover:bg-[#F2F2F2] rounded-lg cursor-pointer"
        onClick={() => {
          dispatch(setIsOpenChatting(true));
          dispatch(setIsOpenMessage(false));
        }}
      >
        <div className="w-[68px] h-[68px] p-[6px]">
          <img
            src="https://scontent.fhan2-4.fna.fbcdn.net/v/t39.30808-1/314818792_101307872811270_6985110685556599242_n.jpg?stp=dst-jpg_s100x100&_nc_cat=110&ccb=1-7&_nc_sid=0ecb9b&_nc_ohc=PmFhy5XGFAYQ7kNvgGLI8vv&_nc_ad=z-m&_nc_cid=0&_nc_zt=24&_nc_ht=scontent.fhan2-4.fna&_nc_gid=AFNHaUwiL-P0DEA2Ij2Mp6n&oh=00_AYDn5_XDyom6m8BEp-ihcg6uGxeBmKb4ag2p148gtV6fQw&oe=673C0276"
            alt="anh"
            className="w-[56px] h-[56px] object-cover rounded-full"
          />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-[#080809] text-[16px]">
            <strong>Hình bóng</strong>
          </span>
          <div className="flex items-center text-[#65686c] text-[14px] gap-3">
            <span>Bạn đã gửi một file</span>
            <span>11 giờ</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowUserMessage;
