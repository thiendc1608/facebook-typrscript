import { allMessageType, UserType } from "@/types";
import MediaMsg from "./MediaMsg";
import ReplyMsg from "./ReplyMsg";
import TextMsg from "./TextMsg";
import Timeline from "./Timeline";
import { chattingUserType } from "@/redux/conversationSlice";
import { useSelector } from "react-redux";
import { useEffect, useRef } from "react";

interface AllMessageTypeProps {
  currentUser?: UserType | null;
  listMsg: allMessageType[];
}
const AllMessageType = ({ currentUser, listMsg }: AllMessageTypeProps) => {
  const { private_chat } = useSelector(
    (state: { conversation: chattingUserType }) => state.conversation
  );
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the bottom of the message list when new messages are added
    const timer = setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [private_chat.current_messages]);

  return (
    <div className="flex flex-col">
      {listMsg?.map((el) => {
        //, index: number
        // const nextMessage = private_chat.current_messages[index + 1];
        // const showAvatar =
        //   nextMessage?.sender_id !== el.sender_id || !nextMessage;
        switch (el.type_msg) {
          case "divider":
            return (
              // Timeline
              <Timeline el={el} />
            );

          case "msg":
            switch (el.sub_type) {
              case "image":
                return (
                  // Media Message
                  <MediaMsg
                    el={el}
                    currentUser={currentUser}
                    // showAvatar={showAvatar}
                  />
                );

              // case "doc":
              //   return (
              //     // Doc Message
              //     <DocMsg el={el} menu={menu} />
              //   );
              // case "Link":
              //   return (
              //     //  Link Message
              //     <LinkMsg el={el} menu={menu} />
              //   );

              case "reply":
                return (
                  //  ReplyMessage
                  <ReplyMsg
                    el={el}
                    currentUser={currentUser}
                    // showAvatar={showAvatar}
                  />
                );

              default:
                return (
                  // Text Message
                  <TextMsg
                    el={el}
                    currentUser={currentUser}
                    // showAvatar={showAvatar}
                    loadingGetAllMsg={private_chat.loadingGetAllMsg}
                  />
                );
            }

          default:
            return <></>;
        }
      })}
      <div ref={messagesEndRef} />{" "}
      {/* Phần tử này giúp chúng ta cuộn đến cuối */}
    </div>
  );
};

export default AllMessageType;
