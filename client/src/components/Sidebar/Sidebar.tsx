import { sideBar } from "@/utils/sideBar";
import SidebarItem from "./SidebarItem";
import anonymousAvatar from "@/assets/images/default_avatar.jpg";
import { Link } from "react-router-dom";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import "./Sidebar.css";
import { useState } from "react";
import YourShortcut from "./YourShortcut";
import { UserState } from "@/redux/userSlice";
// import { useAppDispatch } from "@/redux/store";
// import { getUserCurrent, UserState } from "@/redux/userSlice";
import { useSelector } from "react-redux";
// import { useEffect } from "react";

const Sidebar = () => {
  const [isShowMoreItem, setIsShowMoreItem] = useState(false);
  // const dispatch = useAppDispatch();
  const { isLogin, currentUser } = useSelector(
    (state: { user: UserState }) => state.user
  );
  // useEffect(() => {
  //   const setTimeoutId = setTimeout(() => {
  //     dispatch(getUserCurrent());
  //   }, 500);
  //   return () => {
  //     clearTimeout(setTimeoutId);
  //   };
  // }, [dispatch, isLogin]);

  return (
    <>
      {isLogin && currentUser && (
        <>
          <div className="mt-4">
            <ul className="max-h-screen overflow-hidden hover:overflow-y-scroll">
              <li className="mx-2 h-[52px]">
                <Link
                  to="/profile"
                  className="p-2 flex items-center gap-[14px] hover:bg-[#E4E6E9] hover:rounded-lg"
                >
                  <img
                    src={currentUser.avatar || anonymousAvatar}
                    alt="defaultAvatar"
                    className="w-9 h-9 rounded-full cursor-pointer object-cover"
                  />
                  <span className="py-3 text-[#050505] text-[15px] font-medium">
                    {`${currentUser.lastName} ${currentUser.firstName}`}
                  </span>
                </Link>
              </li>
              {sideBar.slice(0, 7).map((item) => (
                <li key={item.id}>
                  <SidebarItem {...item} />
                </li>
              ))}
              {isShowMoreItem && (
                <>
                  {sideBar.slice(7, sideBar.length).map((item) => (
                    <li key={item.id}>
                      <SidebarItem {...item} />
                    </li>
                  ))}
                </>
              )}
              {isShowMoreItem ? (
                <li
                  className="mx-2 h-[52px] cursor-pointer"
                  onClick={() => setIsShowMoreItem(!isShowMoreItem)}
                >
                  <div className="p-2 flex items-center gap-[14px] hover:bg-[#E4E6E9] hover:rounded-lg">
                    <div className="w-9 h-9 rounded-full object-cover flex items-center justify-center bg-[#D8DADF]">
                      <MdKeyboardArrowUp size={26} />
                    </div>
                    <span className="py-3 text-[#050505] text-[15px] font-medium">
                      Ẩn bớt
                    </span>
                  </div>
                </li>
              ) : (
                <>
                  <li
                    className="mx-2 h-[52px] cursor-pointer mb-[9px]"
                    onClick={() => setIsShowMoreItem(!isShowMoreItem)}
                  >
                    <div className="p-2 flex items-center gap-[14px] hover:bg-[#E4E6E9] hover:rounded-lg">
                      <div className="w-9 h-9 rounded-full object-cover flex items-center justify-center bg-[#D8DADF]">
                        <MdKeyboardArrowDown size={26} />
                      </div>
                      <span className="py-3 text-[#050505] text-[15px] font-medium">
                        Xem thêm
                      </span>
                    </div>
                  </li>
                  <div className="divide-y border-b border-solid border-[#CED0D4] mx-2"></div>
                </>
              )}
            </ul>
          </div>
          <YourShortcut />
        </>
      )}
    </>
  );
};

export default Sidebar;
