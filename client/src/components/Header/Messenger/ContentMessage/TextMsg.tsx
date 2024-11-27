import { messageType } from "@/types";

interface TextMsgType {
  el: messageType;
}

const TextMsg = ({ el }: TextMsgType) => {
  return (
    <span className="bg-[#0866FF] rounded-2xl h-auto px-3 mx-2">
      <span className="text-[13px] text-white py-1 inline-block">
        {el.message}
      </span>
    </span>
  );
};

export default TextMsg;
