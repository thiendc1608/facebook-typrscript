import { useContext, useEffect } from "react";
import { MdInfo } from "react-icons/md";
import { useSelector } from "react-redux";
import {
  addToMessage,
  chattingUserType,
  fetchAllMessage,
} from "@/redux/conversationSlice";
import { useAppDispatch } from "@/redux/store";
import { SocketContext } from "@/context/SocketContext";
import { messageType } from "@/types";
import Form from "./Form";

const ContentConversation = () => {
  const dispatch = useAppDispatch();
  const { socket } = useContext(SocketContext);

  const { room_id, private_chat } = useSelector(
    (state: { conversation: chattingUserType }) => state.conversation
  );

  useEffect(() => {
    if (room_id != "") {
      dispatch(fetchAllMessage({ conversation_id: room_id }));
    }
  }, [room_id, dispatch]);

  useEffect(() => {
    socket?.on("new_message", (data: { message: messageType }) => {
      console.log(data);

      const message = data.message;
      if (private_chat.current_conversation?.id === message.conversation_id) {
        dispatch(
          addToMessage({
            messages: message,
          })
        );
      }
    });
    return () => {
      socket?.off("new_message");
    };
  }, [socket, dispatch, private_chat]);

  return (
    <div className="absolute top-0 w-[66.67%] flex flex-col justify-start h-full">
      <div className="absolute top-0 w-full h-[64px] shadow-sm z-[100]">
        <div className="px4 py-3">
          <div className="px-[6px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={private_chat.current_conversation?.group_image}
                  alt="anh"
                  className="w-[40px] h-[40px] object-cover rounded-full"
                />
                <span className="text-[#080809] text-[16px] font-bold">
                  {private_chat.current_conversation?.conversation_name}
                </span>
              </div>
              <div className="w-[36px] h-[36px] rounded-full bg-[#f2f2f2] flex items-center justify-center cursor-pointer">
                <MdInfo size={24} color="#0866ff" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute top-[64px] w-full h-[calc(100vh-64px-60px-56px)] overflow-y-auto z-0">
        <div className="h-[20px]"></div>
        <div className="pt-5 px-3 pb-3">
          <div className="flex flex-col items-center justify-center gap-3">
            <img
              src={private_chat.current_conversation?.group_image}
              alt="anh"
              className="w-[60px] h-[60px] rounded-full object-cover"
            />
            <span className="text-[17px] text-[#080809] font-semibold">
              {private_chat.current_conversation?.conversation_name}
            </span>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 min-h-[60px] flex w-full">
        <Form />
      </div>
    </div>
  );
};

export default ContentConversation;
