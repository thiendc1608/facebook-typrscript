import ChatUserList from "@/components/Header/Messenger/ChatUserList";
import ContentConversation from "@/components/Header/Messenger/ContentConversation";
import InformationConservation from "@/components/Header/Messenger/InformationConservation";
const Messenger = () => {
  return (
    <div className="w-full h-[calc(100vh-56px)] items-center bg-white flex">
      <div className="sticky left-0 w-[360px] h-full border-r-2 border-solid border-[#E5E5E5]">
        <ChatUserList />
      </div>
      <div className="relative w-[calc(100vw-360px)] h-full flex items-start">
        <ContentConversation />
        <InformationConservation />
      </div>
    </div>
  );
};

export default Messenger;
