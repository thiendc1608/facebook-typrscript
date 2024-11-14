import { Link } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import { FiHome } from "react-icons/fi";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { MdOutlineOndemandVideo } from "react-icons/md";
import { RiGroup2Line } from "react-icons/ri";
import { LuGamepad } from "react-icons/lu";
import { path } from "@/utils/path";
import RightHeader from "./RightHeader";

const Header = () => {
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
            <Link to={`/${path.FRIENDS}`}>
              <LiaUserFriendsSolid size={28} />
            </Link>
          </li>
          <li className="w-[111.59px] h-full flex items-center justify-center">
            <Link to={`${path.WATCH}`}>
              <MdOutlineOndemandVideo size={28} />
            </Link>
          </li>
          <li className="w-[111.59px] h-full flex items-center justify-center">
            <Link to={`/${path.GROUPS}`}>
              <RiGroup2Line size={28} />
            </Link>
          </li>
          <li className="w-[111.59px] h-full flex items-center justify-center">
            <Link to={`/${path.GAMING_PLAY}`}>
              <LuGamepad size={28} />
            </Link>
          </li>
        </ul>
        <div className="h-[56px]">
          <RightHeader />
        </div>
      </div>
    </header>
  );
};

export default Header;
