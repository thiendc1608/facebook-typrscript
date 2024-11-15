import { setIsOpenChatting, setIsOpenMessage } from "@/redux/notificationSlice";
import { UserType } from "@/types";
import { useDispatch } from "react-redux";

interface ShowSearchUserProps {
  searchList: UserType[];
  query: string;
}

const ShowSearchUser = ({ searchList, query }: ShowSearchUserProps) => {
  const dispatch = useDispatch();
  return (
    <>
      {searchList.length > 0 ? (
        searchList.map((user) => (
          <div
            key={user.id}
            className="absolute top-[90px] h-[calc(100vh-80px-110px)] right-[-6px] left-0 rounded-lg overflow-y-auto py-[6px] bg-white"
          >
            <div
              className="flex items-center gap-2 hover:bg-[#F2F2F2] rounded-lg cursor-pointer py-2 px-2"
              onClick={() => {
                dispatch(setIsOpenMessage(false));
                dispatch(setIsOpenChatting(true));
              }}
            >
              <img
                src={user.avatar || ""}
                alt="anh"
                className="w-[36px] h-[36px] object-cover rounded-full"
              />
              <span className="text-[#080809] text-[15px]">{`${user.lastName} ${user.firstName}`}</span>
            </div>
          </div>
        ))
      ) : (
        <div className="absolute top-[100px] right-2 left-2 bg-white rounded-lg overflow-y-auto py-[6px]">
          <div className="p-3 text-center flex flex-col gap-2">
            <span className="text-[#080809] text-[17px]">
              Không tìm thấy kết quả
            </span>
            <span className="text-[#65686c] text-[15px]">
              {`Chúng tôi không tìm được kết quả nào cho "${query}"`}.
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default ShowSearchUser;
