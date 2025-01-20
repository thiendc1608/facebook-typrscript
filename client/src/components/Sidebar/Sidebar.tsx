import { sideBar } from "@/utils/sideBar";
import SidebarItem from "./SidebarItem";
import anonymousAvatar from "@/assets/images/default_avatar.jpg";
import { Link } from "react-router-dom";
import "./Sidebar.css";
import { UserState } from "@/redux/userSlice";
// import { useAppDispatch } from "@/redux/store";
// import { getUserCurrent, UserState } from "@/redux/userSlice";
import { useSelector } from "react-redux";
// import { useEffect } from "react";

const Sidebar = () => {
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
                  to={{
                    pathname: "/profile",
                    search: `?id=${currentUser?.id}`,
                  }}
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
              {sideBar.map((item) => (
                <li key={item.id}>
                  <SidebarItem {...item} />
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </>
  );
};

export default Sidebar;
