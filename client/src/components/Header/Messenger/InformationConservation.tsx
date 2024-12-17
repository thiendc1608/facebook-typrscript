import { PiUserCircleFill } from "react-icons/pi";
import { IoMdSearch } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import {
  chattingUserType,
  updateCurrentConversation,
  updateToConversations,
} from "@/redux/conversationSlice";
import { useContext, useEffect, useMemo, useState } from "react";
import { conversationAPI, messageSearchType } from "@/apis/conversationApi";
import SearchMessage from "./SearchMessage";
import CustomChat from "./ContactInformation/CustomChat";
import { SocketContext } from "@/context/SocketContext";
import MediaFile from "@/components/Header/Messenger/MediaFile/MediaFile";
import { FaArrowLeft } from "react-icons/fa6";
import { cn } from "@/lib/utils";
import StoreMediaFile from "./MediaFile/StoreMediaFile";

const listOptionFile = [
  {
    id: 1,
    name: "File phương tiện",
    option: "mediaImage",
  },
  {
    id: 2,
    name: "File",
    option: "file",
  },
  {
    id: 3,
    name: "Liên kết",
    option: "link",
  },
];
export interface changNickNameType {
  id: string;
  conversation_id: string;
  user_id: string;
  nickname: string;
  user: {
    avatar: string;
  };
}
const InformationConservation = () => {
  const { socket } = useContext(SocketContext)!;
  const dispatch = useDispatch();
  const { private_chat, isShowContact } = useSelector(
    (state: { conversation: chattingUserType }) => state.conversation
  );
  const [isSearchMessage, setIsSearchMessage] = useState(false);
  const [queryMessage, setQueryMessage] = useState("");
  const [listFilterMessage, setListFilterMessage] = useState<
    messageSearchType[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEnter, setIsEnter] = useState(false);
  const [isShowMedia, setIsShowMedia] = useState({
    isShow: false,
    option: "",
  });

  useEffect(() => {
    if (queryMessage.length === 0) setListFilterMessage([]);
  }, [queryMessage]);

  const handleEnterSearch = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setIsLoading(true);
      setIsEnter(false);
      conversationAPI
        .getAllMessageSearch(private_chat.current_conversation!.id)
        .then((response) => {
          setListFilterMessage(
            response.messages.filter((msg) =>
              `${msg.message}`
                .toLowerCase()
                .includes(queryMessage.toLowerCase())
            )
          );
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const msgQueryList = useMemo(() => {
    return listFilterMessage.map((message) => {
      const index = message.message.indexOf(queryMessage);
      return index === -1
        ? message
        : {
            ...message,
            message:
              message.message.slice(0, index) +
              `<b style="color: black">${queryMessage}</b>` +
              message.message.slice(index + queryMessage.length),
          };
    });
  }, [queryMessage, listFilterMessage]);

  useEffect(() => {
    socket?.off("update_nickname");
    if (socket) {
      socket.on(
        "update_nickname",
        (data: { new_nickName: changNickNameType }) => {
          const { new_nickName } = data;
          dispatch(updateToConversations(new_nickName));
          dispatch(updateCurrentConversation(new_nickName));
        }
      );
    }
    return () => {
      socket?.off("update_nickname");
    };
  }, [socket, dispatch]);

  return (
    <>
      {isShowContact && (
        <div className="absolute top-0 right-0 w-[33.33%] pt-4 pb-3 border-l-2 border-solid border-[#E5E5E5] h-[calc(100vh-56px)] z-0 overflow-y-auto">
          <SearchMessage
            isLoading={isLoading}
            isSearchMessage={isSearchMessage}
            setIsSearchMessage={setIsSearchMessage}
            queryMessage={queryMessage}
            setQueryMessage={setQueryMessage}
            msgQueryList={msgQueryList}
            handleEnterSearch={handleEnterSearch}
            isEnter={isEnter}
            setIsEnter={setIsEnter}
          />
          <div className="flex flex-col items-center justify-between">
            <div className="flex flex-col items-center gap-3">
              <img
                src={private_chat.current_conversation?.members.user.avatar}
                alt="anh"
                className="w-[72px] h-[72px] rounded-full object-cover"
              />
              <span className="text-[#080809] text-[17px]">{`${private_chat.current_conversation?.members?.nickname}`}</span>
            </div>
            <div className="pt-4 px-3">
              <div className="text-center flex items-center justify-between">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-[36px] h-[36px] bg-[#d6d9dd] rounded-full cursor-pointer flex items-center justify-center">
                    <PiUserCircleFill size={24} />
                  </div>
                  <span className="text-[#080809] text-[13px]">
                    Trang cá nhân
                  </span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="w-[36px] h-[36px] bg-[#d6d9dd] rounded-full cursor-pointer flex items-center justify-center"
                    onClick={() => setIsSearchMessage(true)}
                  >
                    <IoMdSearch size={24} />
                  </div>
                  <span className="text-[#080809] text-[13px]">Tìm kiếm</span>
                </div>
              </div>
            </div>
          </div>
          {isShowMedia.isShow ? (
            <div className="absolute top-0 left-0 w-full bg-white z-10 h-full">
              <div className="absolute top-0 left-0 w-full bg-white">
                <div className="px-3 py-[10px] h-[64px] flex items-center">
                  <div className="py-[6px] px-1">
                    <div
                      className="w-[32px] h-[32px] flex items-center justify-center cursor-pointer rounded-full hover:bg-[#f2f2f2]"
                      onClick={() =>
                        setIsShowMedia({
                          ...isShowMedia,
                          isShow: false,
                          option: "",
                        })
                      }
                    >
                      <FaArrowLeft size={20} />
                    </div>
                  </div>
                  <div className="py-[6px] px-1">
                    <span className="text-[#080809] text-[17px]">
                      File phương tiện, file và liên kết
                    </span>
                  </div>
                </div>
                <div className="my-[6px] w-full px-4">
                  <ul className="h-[60px] w-full flex items-center justify-center">
                    {listOptionFile.map((item) => (
                      <li
                        key={item.id}
                        className={cn(
                          "relative px-4 h-full leading-[60px] cursor-pointer",
                          item.option !== isShowMedia.option &&
                            "hover:bg-[#f2f2f2] rounded-lg"
                        )}
                        onClick={() =>
                          setIsShowMedia({
                            ...isShowMedia,
                            option: item.option,
                          })
                        }
                      >
                        <div
                          className={cn(
                            item.option === isShowMedia.option &&
                              "absolute bottom-0 left-0 right-0 border-b-[2px] border-[#0866ff] border-solid"
                          )}
                        ></div>
                        <span
                          className={cn(
                            "text-[#65686C] text-[16px]",
                            item.option === isShowMedia.option
                              ? "text-[#0866ff]"
                              : "text-[#65686C]"
                          )}
                        >
                          {item.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                {listOptionFile.map(
                  (item) => item.option === "mediaImage" && <StoreMediaFile />
                )}
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <CustomChat />
              <MediaFile setIsShowMedia={setIsShowMedia} />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default InformationConservation;
