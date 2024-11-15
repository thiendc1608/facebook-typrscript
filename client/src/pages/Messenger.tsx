import ChatUserList from "@/components/Header/Messenger/ChatUserList";
import ContentConversation from "@/components/Header/Messenger/ContentConversation";
import InformationConservation from "@/components/Header/Messenger/InformationConservation";
const Messenger = () => {
  return (
    <div className="w-full h-[calc(100vh-56px)] items-center bg-white flex">
      <div className="w-[360px] h-full border-r-2 border-solid border-[#E5E5E5]">
        <ChatUserList />
      </div>
      <div className="w-[calc(100vw-360px)] h-full flex items-start">
        <div className="w-[66.67%]">
          <ContentConversation />
        </div>
        <div className="w-[33.33%]">
          <InformationConservation />
        </div>
      </div>
    </div>
  );
};

export default Messenger;
