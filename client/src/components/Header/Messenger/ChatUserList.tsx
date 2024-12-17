import { MdOutlineZoomOutMap } from "react-icons/md";
import { BiSolidEdit } from "react-icons/bi";
import { IoIosSearch } from "react-icons/io";
import { useContext, useEffect, useState, useTransition } from "react";
import { conversationType, UserType } from "@/types";
import useDebounce from "@/hooks/useDebounce";
import { userAPI } from "@/apis/userApi";
import ShowSearchUser from "./ShowSearchUser";
import { FaArrowLeft } from "react-icons/fa6";
import { BsThreeDots } from "react-icons/bs";
import { MdOutlineDeleteForever } from "react-icons/md";
import {
  addToConventions,
  chattingUserType,
  deleteConversation,
  fetchAllMessage,
  fetchDirectConversations,
  selectRoom,
  setCurrentConversation,
  setShowContact,
  // setCurrentConversation,
} from "@/redux/conversationSlice";
import { useDispatch, useSelector } from "react-redux";
import { useAppDispatch } from "@/redux/store";
import { SocketContext } from "@/context/SocketContext";
import { cn } from "@/lib/utils";
import { conversationAPI } from "@/apis/conversationApi";
import { toast } from "react-toastify";
import { UserState } from "@/redux/userSlice";
import { useNavigate, useParams } from "react-router-dom";
import { formatTimeAgo } from "@/utils/helpers";
import ConversationSkeleton from "@/components/Skeleton/ConversationSkeleton";
import {
  notificationState,
  setIsOpenChatting,
  setIsOpenMessage,
} from "@/redux/notificationSlice";

const ChatUserList = () => {
  const { socket } = useContext(SocketContext)!;
  const [searchList, setSearchList] = useState<UserType[]>([]);
  const [query, setQuery] = useState<string>("");
  const userQuery = useDebounce(query, 0);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [, startTransaction] = useTransition();
  const [optionConversation, setOptionConversation] = useState<boolean>(false);
  const [isFocusSearch, setIsFocusSearch] = useState<boolean>(false);
  const params = useParams();

  const { isOpenMessage } = useSelector(
    (state: { notification: notificationState }) => state.notification
  );
  const { currentUser } = useSelector(
    (state: { user: UserState }) => state.user
  );
  const {
    conversations,
    current_messages,
    current_conversation,
    loadingGetAllConversation,
  } = useSelector(
    (state: { conversation: chattingUserType }) =>
      state.conversation.private_chat
  );
  const { private_chat, room_id, isShowContact } = useSelector(
    (state: { conversation: chattingUserType }) => state.conversation
  );
  const dispatchConversation = useAppDispatch();

  const addLastMsgToConversation = conversations?.map((conv) => {
    const lastMsg = current_messages
      ?.filter((msg) => msg.conversation_id === conv.id)
      ?.at(-1);
    return {
      ...conv,
      last_message: lastMsg,
    };
  });

  useEffect(() => {
    if (!isShowContact) dispatch(setShowContact(true));
    dispatchConversation(fetchAllMessage());
  }, [dispatch]);

  useEffect(() => {
    if (currentUser?.id) {
      dispatchConversation(fetchDirectConversations(currentUser.id));
    }
  }, [dispatchConversation, currentUser]);

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

  useEffect(() => {
    if (socket) {
      socket.off("start_chat");
      socket.on(
        "start_chat",
        (data: { new_conversation: conversationType }) => {
          const { new_conversation } = data;
          dispatch(addToConventions({ conversation: new_conversation }));
          dispatch(selectRoom({ room_id: new_conversation.id }));
          dispatch(setCurrentConversation(new_conversation));
        }
      );
    }
    return () => {
      socket?.off("start_chat");
    };
  }, [socket, dispatch]);

  // useEffect(() => {
  //   if (
  //     private_chat.current_conversation !== null &&
  //     !location.pathname.indexOf("/messenger/t")
  //   ) {
  //     dispatch(
  //       setIsOpenChatting({
  //         isTinyChat: false,
  //         isOpenChatting: true,
  //         conversation: private_chat.current_conversation,
  //       })
  //     );
  //   }
  // }, [private_chat.current_conversation, dispatch]);

  const handleDeleteConversation = async (conversation_id: string) => {
    setOptionConversation(false);
    const response = await conversationAPI.deleteConversation(conversation_id);
    if (response.success) {
      dispatch(deleteConversation({ conversation_id }));
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
  };

  const handleOnClickConversation = (
    e: React.MouseEvent<HTMLDivElement>,
    conversation: conversationType
  ) => {
    e.stopPropagation();
    const convertConversation = private_chat.conversations.find(
      (conv) => conv.id === conversation.id
    );
    if (
      conversation.id !== private_chat.current_conversation?.id &&
      !isOpenMessage
    ) {
      dispatch(selectRoom({ room_id: conversation.id }));
      if (!isShowContact) {
        dispatch(setShowContact(true));
      }
      navigate(`/messenger/t/${current_conversation?.id}`);
    }
    if (isOpenMessage) {
      dispatch(
        setIsOpenChatting({
          isTinyChat: false,
          isOpenChatting: true,
          conversation,
        })
      );
      dispatch(setIsOpenMessage(!isOpenMessage));
    }
    dispatch(setCurrentConversation(convertConversation));

    // socket?.emit("start_conversation", {
    //   sender_id: currentUser?.id,
    //   receiver_id: conversation.members.user_id,
    //   conversation_name:
    //     conversation.conversation_name !== null
    //       ? conversation.conversation_name
    //       : null,
    //   type_conversation:
    //     conversation.conversation_name !== null ? "group" : "private",
    //   group_image:
    //     conversation.conversation_name !== null
    //       ? conversation.group_image
    //       : null,
    // });
  };

  return (
    <>
      <div className="flex flex-col">
        <div className="absolute flex items-center gap-[150px] mt-5 mx-4 mb-3 leading-[17px]">
          {isFocusSearch &&
            (query.length > 0 ? (
              <ShowSearchUser
                searchList={searchList}
                query={query}
                setIsFocusSearch={setIsFocusSearch}
                setQuery={setQuery}
              />
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
            <div className="px-2 h-full">
              {loadingGetAllConversation && (
                <div className="flex flex-col gap-4">
                  <ConversationSkeleton count_message={4} />
                </div>
              )}
              {!loadingGetAllConversation &&
              addLastMsgToConversation?.length > 0 ? (
                addLastMsgToConversation.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={cn(
                      "relative w-full h-[68px] rounded-lg flex items-center gap-3 cursor-pointer z-0",
                      conversation.id === room_id ||
                        conversation.members.user_id === params.id
                        ? "bg-[#EBF5FF]"
                        : "hover:bg-[#F2F2F2]"
                    )}
                    onClick={(e) => handleOnClickConversation(e, conversation)}
                  >
                    <div className="p-[6px]">
                      <img
                        src={
                          conversation?.group_image ||
                          conversation?.members?.user?.avatar
                        }
                        alt="anh"
                        className="w-[56px] h-[56px] object-cover rounded-full"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[#080809] text-[15px] font-bold">
                        {`${
                          conversation?.conversation_name ||
                          conversation?.members?.nickname
                        }`.trim()}
                      </span>
                      <div className="flex items-baseline text-[#65686c] text-[13px] gap-1">
                        <span>
                          {conversation?.last_message?.image_id
                            ? `${
                                conversation?.last_message?.sender_id ===
                                currentUser?.id
                                  ? "Bạn"
                                  : conversation?.last_message?.senderInfo
                                      .lastName +
                                    " " +
                                    conversation?.last_message?.senderInfo
                                      .firstName
                              } đã gửi một hình ảnh`
                            : conversation?.last_message?.message}
                        </span>
                        <span>.</span>
                        <span>
                          {current_messages?.at(-1)?.send_at &&
                            formatTimeAgo(
                              conversation?.last_message?.send_at ?? ""
                            )?.replace(" trước", "")}
                        </span>
                      </div>
                    </div>
                    <div
                      className="absolute top-[50%] translate-y-[-50%] right-4 rounded-full bg-white hover:bg-gray-400 w-[36px] h-[36px] flex items-center justify-center cursor-pointer shadow-default"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOptionConversation(!optionConversation);
                      }}
                    >
                      <BsThreeDots size={20} />
                      {optionConversation && (
                        <div className="absolute top-[calc(100%+10px)] rounded-lg w-[200px] right-0 h-auto shadow-optionConversation z-50">
                          <ul className="py-2 overflow-hidden">
                            <li
                              className="mx-2 flex items-center rounded-lg gap-3 hover:bg-[#F2F2F2] cursor-pointer h-[36px]"
                              onClick={() =>
                                handleDeleteConversation(conversation.id)
                              }
                            >
                              <MdOutlineDeleteForever size={24} />
                              <span className="text-[#080809] text-[15px]">
                                Xoá đoạn chat
                              </span>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-[30px] mt-5 text-[14px] text-[#65686c] px-4 text-center">
                  <span>Hiện tại đang không có cuộc trò chuyện.</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ChatUserList;
