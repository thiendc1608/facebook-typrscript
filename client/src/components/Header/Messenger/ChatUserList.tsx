import { MdOutlineZoomOutMap } from "react-icons/md";
import { BiSolidEdit } from "react-icons/bi";
import { IoIosSearch } from "react-icons/io";
import { useEffect, useState, useTransition } from "react";
import { UserType } from "@/types";
import useDebounce from "@/hooks/useDebounce";
import { userAPI } from "@/apis/userApi";
import ShowSearchUser from "./ShowSearchUser";
import { FaArrowLeft } from "react-icons/fa6";

const ChatUserList = () => {
  const [searchList, setSearchList] = useState<UserType[]>([]);
  const [query, setQuery] = useState<string>("");
  const userQuery = useDebounce(query, 0);
  const [, startTransaction] = useTransition();
  const [isFocusSearch, setIsFocusSearch] = useState<boolean>(false);
  useEffect(() => {
    const fetchData = async () => {
      if (userQuery) {
        setQuery(userQuery);
        startTransaction(() => {
          userAPI
            .getAllUsers()
            .then((response) =>
              setSearchList(
                response.userList.filter((user) =>
                  `${user.lastName} ${user.firstName}`
                    .toLowerCase()
                    .includes(query.toLowerCase())
                )
              )
            )
            .catch((err) => {
              console.log(err);
            });
        });
      }
    };
    fetchData();
  }, [userQuery]);

  return (
    <>
      <div className="flex flex-col">
        <div className="absolute flex items-center gap-[150px] mt-5 mx-4 mb-3 leading-[17px]">
          {isFocusSearch &&
            (query.length > 0 ? (
              <ShowSearchUser searchList={searchList} query={query} />
            ) : (
              <div className="absolute top-[90px] h-auto right-2 left-2 bg-white rounded-lg py-[6px]"></div>
            ))}
          <span className="text-[#080809] text-[24px] leading-[21px]">
            Đoạn chat
          </span>
          <div className="flex gap-4">
            <span className="cursor-pointer">
              <MdOutlineZoomOutMap size={24} />
            </span>
            <span className="cursor-pointer">
              <BiSolidEdit size={24} />
            </span>
          </div>
        </div>
        <div className="my-2 px-4 h-[36px] flex items-center gap-2 mt-[70px]">
          {isFocusSearch && (
            <div
              className="min-w-[36px] h-[36px] rounded-full hover:bg-[#f2f2f2] flex items-center justify-center cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setIsFocusSearch(false);
              }}
            >
              <FaArrowLeft size={18} />
            </div>
          )}
          <div className="w-full flex items-center rounded-xl bg-[#F0F2F5] overflow-hidden">
            <label htmlFor="search" className="pl-2">
              <IoIosSearch size={20} />
            </label>
            <input
              type="text"
              id="search"
              placeholder="Tìm kiếm trên Messenger"
              className="w-full pt-[7px] px-[6px] pb-[9px] bg-[#F0F2F5] outline-none text-[16px]"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocusSearch(true)}
            />
          </div>
        </div>
        {!isFocusSearch && (
          <>
            <div className="py-2 px-4">
              <span className="px-3 !leading-[36px] rounded-xl text-[15px] inline-block cursor-pointer bg-[#DFE9F2] text-[#0861F2] font-semibold">
                Hộp thư
              </span>
            </div>
            <div className="flex flex-col items-center justify-center h-[30px] mt-5 text-[14px] text-[#65686c] px-4 text-center">
              <span>Hiện tại đang không có cuộc trò chuyện.</span>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ChatUserList;
