import { addTagName, postType } from "@/redux/postSlice";
import { FaArrowLeft } from "react-icons/fa6";
import { IoIosSearch, IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { userAPI } from "@/apis/userApi";
import useDebounce from "@/hooks/useDebounce";
import { UserType } from "@/types";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { UserState } from "@/redux/userSlice";

const TagOtherUser = () => {
  const dispatch = useDispatch();
  const [searchList, setSearchList] = useState<UserType[]>([]);
  const [query, setQuery] = useState<string>("");
  const userQuery = useDebounce(query, 500);
  const { currentUser } = useSelector(
    (state: { user: UserState }) => state.user
  );
  const { tagUserList } = useSelector(
    (state: { post: postType }) => state.post
  );

  useEffect(() => {
    // Chỉ gọi API khi userQuery có giá trị và thay đổi
    if (userQuery.trim() === "") {
      setSearchList([]); // Nếu query trống, reset danh sách
      return;
    }

    const fetchData = async () => {
      try {
        const response = await userAPI.getAllUsers(currentUser!.id);
        const filteredUsers = response.userList.filter((user) =>
          `${user.lastName} ${user.firstName}`
            .toLowerCase()
            .includes(userQuery.toLowerCase())
        );
        if (tagUserList.listTag.length > 0) {
          setSearchList(
            filteredUsers.filter(
              (user) =>
                !tagUserList.listTag.some((tagUser) => tagUser.id === user.id)
            )
          );
        } else setSearchList(filteredUsers);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [userQuery, tagUserList.listTag, currentUser]); // Chỉ trigger khi userQuery thay đổi

  const handleOnClickUser = (
    e: React.MouseEvent<HTMLDivElement>,
    user: UserType
  ) => {
    e.stopPropagation();
    setQuery("");
    dispatch(
      addTagName({
        ...tagUserList,
        isTagName: true,
        listTag: [...tagUserList.listTag, user],
      })
    );
  };

  const handleRemoveTagUser = (user: UserType) => {
    dispatch(
      addTagName({
        ...tagUserList,
        listTag: tagUserList.listTag.filter((item) => item.id !== user.id),
      })
    );
  };

  const handleCompleteTagUser = () => {
    dispatch(addTagName({ ...tagUserList, isTagName: false }));
  };

  return (
    <div
      className="absolute w-[500px] rounded-lg flex flex-col items-center justify-center bg-white z-[200]"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="w-[500px] h-[60px] flex items-center">
        <div
          className="absolute top-3 left-2 cursor-pointer w-9 h-9 rounded-full bg-[#e4e6eb] hover:bg-[#D8DADF] flex items-center justify-center"
          onClick={() => {
            dispatch(addTagName({ ...tagUserList, isTagName: false }));
          }}
        >
          <FaArrowLeft size={20} />
        </div>
        <div className="mx-auto">
          <span className="text-[#050505] text-[20px]">Gắn thẻ người khác</span>
        </div>
      </div>
      <div className="w-[500px] px-4 h-[52px] flex items-center border-t border-solid border-[#DFE1E6]">
        <div className="flex-1 h-[36px] flex items-center justify-center bg-[#F0F2F5] rounded-[100px]">
          <label htmlFor="tagName" className="pl-[10px]">
            <IoIosSearch size={20} />
          </label>
          <input
            autoFocus
            type="text"
            placeholder="Tìm kiếm"
            id="tagName"
            className="w-full h-full bg-[#F0F2F5] outline-none rounded-[100px] pl-[6px]"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <span
          className="pl-[20px] pr-[8px] text-blue-500 cursor-pointer hover:text-blue-700 text-[15px]"
          onClick={handleCompleteTagUser}
        >
          Xong
        </span>
      </div>

      {/*  */}
      {tagUserList.listTag.length > 0 && (
        <div className="w-full pt-4 pb-2">
          <span className="text-[#65686c] text-[13px] pl-4 pb-2">
            ĐÃ GẮN THẺ
          </span>
          <div className="pt-2 px-4">
            <div className="border border-solid rounded-lg border-[#CED0D4] w-full h-auto">
              <div className="p-2 h-auto">
                <div className="p-1 h-[40px] flex items-center gap-2 flex-wrap">
                  {tagUserList.listTag.map((user, index) => (
                    <span
                      key={index}
                      className="p-2 h-full w-auto inline-block rounded-lg bg-[#E7F1FB]"
                    >
                      <div className="flex items-center gap-2 text-[#0866ff]">
                        <span className="text-[15px]">{`${user.lastName} ${user.firstName}`}</span>
                        <div
                          className="flex items-center justify-center cursor-pointer hover:text-blue-950"
                          onClick={() => handleRemoveTagUser(user)}
                        >
                          <IoMdClose size={20} />
                        </div>
                      </div>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="w-full p-2">
        {searchList.length > 0 ? (
          searchList.map((user) => (
            <div
              key={user.id}
              className={cn("w-full rounded-lg overflow-y-auto bg-white")}
            >
              <div onClick={(e) => handleOnClickUser(e, user)}>
                <div className="px-2 py-2 flex items-center gap-2 hover:bg-[#F2F2F2] rounded-lg cursor-pointer">
                  <img
                    src={user.avatar || ""}
                    alt="anh"
                    className="w-[36px] h-[36px] object-cover rounded-full"
                  />
                  <span className="text-[#080809] text-[15px]">{`${user.lastName} ${user.firstName}`}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-2 text-center">
            <span className="text-[#65676b] text-[15px]">
              Không có kết quả nào
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TagOtherUser;
