// avatarMsgComponent.tsx
import { allMessageType, UserType } from "@/types";

interface AvatarMsgComponentProps {
  el: allMessageType;
  currentUser?: UserType | null;
}

const AvatarMsg: React.FC<AvatarMsgComponentProps> = ({ el, currentUser }) => {
  return (
    <div className={currentUser?.id === el.sender_id ? "pl-2" : "pr-2"}>
      <div className="w-7 h-7 rounded-full overflow-hidden">
        <img
          src={el?.senderInfo?.avatar}
          alt="anh"
          className="w-full h-full rounded-full object-cover"
        />
      </div>
    </div>
  );
};

export default AvatarMsg;
