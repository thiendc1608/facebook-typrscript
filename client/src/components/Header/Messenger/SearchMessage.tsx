import { messageSearchType } from "@/apis/conversationApi";
import { formatTimeAgo } from "@/utils/helpers";
import { IoIosSearch, IoMdClose } from "react-icons/io";
import parse from "html-react-parser";
import { useDispatch, useSelector } from "react-redux";
import { chattingUserType, setSearchMessage } from "@/redux/conversationSlice";
import { cn } from "@/lib/utils";

interface SearchMessageType {
  isLoading: boolean;
  isSearchMessage: boolean;
  setIsSearchMessage: (value: boolean) => void;
  queryMessage: string;
  setQueryMessage: (value: string) => void;
  msgQueryList: messageSearchType[];
  handleEnterSearch: (e: React.KeyboardEvent) => void;
  isEnter: boolean;
  setIsEnter: (value: boolean) => void;
}

const SearchMessage = ({
  isLoading,
  isSearchMessage,
  setIsSearchMessage,
  queryMessage,
  setQueryMessage,
  msgQueryList,
  handleEnterSearch,
  isEnter,
  setIsEnter,
}: SearchMessageType) => {
  const dispatch = useDispatch();
  const { searchMessage } = useSelector(
    (state: { conversation: chattingUserType }) => state.conversation
  );

  return (
    <>
      {isSearchMessage && (
        <div className="absolute top-0 left-0 w-full bg-white z-10 h-full">
          <div className="absolute top-0 left-0 w-full h-[100px] bg-white shadow-forgetPw">
            <div className="px-3 pt-3 h-[48px] flex items-center">
              <div className="py-[6px] px-1">
                <div
                  className="w-[32px] h-[32px] flex items-center justify-center cursor-pointer rounded-full hover:bg-[#f2f2f2]"
                  onClick={() => setIsSearchMessage(false)}
                >
                  <IoMdClose size={20} />
                </div>
              </div>
              <div className="py-[6px] px-1">
                <span className="text-[#080809] text-[17px]">Tìm kiếm</span>
              </div>
            </div>
            <div className="pt-[6px] pb-[2px] px-3">
              <div className="relative">
                <input
                  type="text"
                  className="w-full h-[40px] pt-[7px] pr-[8px] pb-[9px] pl-[35px] rounded-[50px] bg-[#F0F2F5] outline-none text-[#050505] text-[16px]"
                  placeholder="Tìm kiếm trong cuộc trò chuyện"
                  value={queryMessage}
                  onChange={(e) => {
                    setIsEnter(true);
                    setQueryMessage(e.target.value);
                  }}
                  onKeyDown={(e) => handleEnterSearch(e)}
                />
                <div className="absolute top-[50%] left-[20px] translate-y-[-50%] translate-x-[-50%]">
                  <IoIosSearch size={26} color="#65686c" />
                </div>
                {queryMessage.length > 0 &&
                  msgQueryList.length > 0 &&
                  !isEnter && (
                    <div className="absolute top-[50%] right-[40px] translate-y-[-50%]">
                      <span className="text-[#65686c] text-[15px]">
                        {`${msgQueryList.length} kết quả`}
                      </span>
                    </div>
                  )}
                {queryMessage.length > 0 && (
                  <div className="absolute top-[50%] right-0 translate-y-[-50%] cursor-pointer">
                    <div
                      className="w-[36px] h-[36px] flex items-center justify-center cursor-pointer rounded-full bg-[#d6d9dd]"
                      onClick={() => {
                        setQueryMessage("");
                        dispatch(setSearchMessage(null));
                      }}
                    >
                      <IoMdClose size={26} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {isLoading && (
            <span className="text-[#080809] text-[17px] mt-2">Loading...</span>
          )}
          {!isLoading && (
            <>
              {queryMessage && isEnter && (
                <div className="py-6 px-8 absolute top-[100px] w-full h-[calc(100vh-56px-100px)]">
                  <div className="py-3 text-center">
                    <span className="text-[#65686c] text-[15px]">
                      Nhấn <b>"Enter"</b> để tìm kiếm
                    </span>
                  </div>
                </div>
              )}
              <div className="absolute top-[100px] w-full h-[calc(100vh-56px-100px)] overflow-y-auto">
                {msgQueryList.length > 0 && !isEnter
                  ? msgQueryList.map((msg, idx) => (
                      <div
                        key={idx}
                        className="px-2 h-[60px] mt-2 overflow-auto"
                      >
                        <div
                          className={cn(
                            "flex items-center gap-2 h-full  cursor-pointer rounded-lg",
                            searchMessage?.id === msg.id
                              ? "bg-[#ebf5ff]"
                              : "hover:bg-[#f2f2f2]"
                          )}
                          onClick={() => dispatch(setSearchMessage(msg))}
                        >
                          <div className="p-[6px] w-[44px] h-[44px]">
                            <img
                              src={msg.senderInfo.avatar}
                              alt="anh"
                              className="w-[32px] h-[32px] rounded-full object-cover"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-[#080809] text-[15px] font-semibold">{`${msg.senderInfo.lastName} ${msg.senderInfo.firstName}`}</span>
                            <div className="flex items-center text-[#65686c] text-[13px] whitespace-nowrap">
                              <span className="line-clamp-1 text-ellipsis">
                                {parse(msg.message)}
                              </span>
                              <div className="pr-2 pl-1">
                                <span>.</span>
                                <span>{formatTimeAgo(msg.send_at, true)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  : queryMessage.length > 0 &&
                    !isEnter && (
                      <div className="py-6 px-8 absolute top-[100px] w-full h-[calc(100vh-56px-100px)]">
                        <div className="py-3 text-center">
                          <span className="text-[#080809] text-[15px]">
                            Không tìm thấy kết quả nào
                          </span>
                        </div>
                      </div>
                    )}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default SearchMessage;
