import { Link } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import { FiHome } from "react-icons/fi";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { MdOutlineOndemandVideo } from "react-icons/md";
import { RiGroup2Line } from "react-icons/ri";
import RightHeader from "./RightHeader";
import { useDispatch, useSelector } from "react-redux";
import {
  setConfirmCoverPicture,
  setCoverPictureUser,
  UserState,
} from "@/redux/userSlice";
import { Button } from "../ui/button";
import { userAPI } from "@/apis/userApi";
import { toast } from "react-toastify";

const Header = () => {
  const dispatch = useDispatch();
  const { currentUser, isConfirmCoverPicture } = useSelector(
    (state: { user: UserState }) => state.user
  );

  const handleSaveChange = async () => {
    dispatch(setConfirmCoverPicture(false));
    if (currentUser && currentUser.cover_picture) {
      try {
        const response = await userAPI.changeCoverPicture(
          {
            coverPicture: currentUser.cover_picture ?? "",
            coverPicturePos: currentUser.cover_picture_pos ?? 0,
          },
          currentUser!.id
        );
        if (response.success) {
          toast.success(response.message);
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } else {
      console.error("currentUser or cover_picture is null or undefined");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white w-full h-[56px] px-4 shadow-default z-10">
      <div className="flex item-center justify-between leading-[56px]">
        <div className="flex items-center gap-[10px]">
          <Link to="/">
            <svg
              viewBox="0 0 36 36"
              style={{ color: "#0866ff" }}
              fill="currentColor"
              height="40"
              width="40"
            >
              <path d="M20.181 35.87C29.094 34.791 36 27.202 36 18c0-9.941-8.059-18-18-18S0 8.059 0 18c0 8.442 5.811 15.526 13.652 17.471L14 34h5.5l.681 1.87Z"></path>
              <path
                className="fill-[#fff]"
                d="M13.651 35.471v-11.97H9.936V18h3.715v-2.37c0-6.127 2.772-8.964 8.784-8.964 1.138 0 3.103.223 3.91.446v4.983c-.425-.043-1.167-.065-2.081-.065-2.952 0-4.09 1.116-4.09 4.025V18h5.883l-1.008 5.5h-4.867v12.37a18.183 18.183 0 0 1-6.53-.399Z"
              ></path>
            </svg>
          </Link>
          <div className="relative">
            <input
              type="text"
              className="w-[240px] h-[40px] pt-[7px] pr-[8px] pb-[9px] pl-[35px] rounded-[50px] bg-[#F0F2F5] outline-none text-[#050505] text-[15px]"
              placeholder="Tìm kiếm trên Facebook"
            />
            <div className="absolute top-[50%] left-[20px] translate-y-[-50%] translate-x-[-50%]">
              <IoIosSearch size={20} color="#6D6F73" />
            </div>
          </div>
        </div>
        <ul className="flex items-center gap-[10px]">
          <li className="w-[111.59px] h-full flex items-center justify-center">
            <Link to="/">
              <FiHome size={28} />
            </Link>
          </li>
          <li className="w-[111.59px] h-full flex items-center justify-center">
            <LiaUserFriendsSolid size={28} />
          </li>
          <li className="w-[111.59px] h-full flex items-center justify-center">
            <MdOutlineOndemandVideo size={28} />
          </li>
          <li className="w-[111.59px] h-full flex items-center justify-center">
            <RiGroup2Line size={28} />
          </li>
        </ul>
        <div className="h-[56px]">
          <RightHeader />
        </div>
      </div>
      {isConfirmCoverPicture && (
        <div className="relative top-0 z-10 h-[60px] bg-black bg-opacity-40">
          <div className="py-3 px-4 flex items-center justify-between">
            <span className="text-white text-[15px]">
              Ảnh bìa của bạn hiển thị công khai
            </span>
            <div className="flex gap-4">
              <Button
                className="w-[150px] bg-[#ffffff1a] hover:bg-[#ACACAC]"
                onClick={() => {
                  dispatch(setConfirmCoverPicture(false));
                  dispatch(setCoverPictureUser(undefined));
                }}
              >
                Huỷ
              </Button>
              <Button
                className="w-[150px] bg-blue-600 hover:bg-blue-500"
                onClick={handleSaveChange}
              >
                Lưu thay đổi
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
