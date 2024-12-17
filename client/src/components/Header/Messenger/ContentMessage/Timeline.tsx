import { chattingUserType } from "@/redux/conversationSlice";
import { allMessageType } from "@/types";
import { formatDate } from "@/utils/helpers";
import { useSelector } from "react-redux";

interface TimelineProps {
  el: allMessageType;
}
const Timeline = ({ el }: TimelineProps) => {
  const { updateMessage } = useSelector(
    (state: { conversation: chattingUserType }) => state.conversation
  );

  return (
    <div className="relative z-0">
      <div className="w-full h-auto px-5 text-center">
        <span className="text-[#65686c] text-[14px]">
          {formatDate(el.send_at)}
        </span>
      </div>
      {updateMessage.messageValue?.conversation_id === el.conversation_id && (
        <>
          <div className="absolute inset-0 bg-[rgba(72,72,72,0.7)] z-10"></div>
        </>
      )}
    </div>
  );
};

export default Timeline;
