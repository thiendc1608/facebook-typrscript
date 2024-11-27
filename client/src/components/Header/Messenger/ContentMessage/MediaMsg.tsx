import { cn } from "@/lib/utils";
import { messageType } from "@/types";

interface MediaMsgType {
  el: messageType;
}

const MediaMsg = ({ el }: MediaMsgType) => {
  let parsedMessage: string[] | null | undefined = null;
  if (typeof el.imageInfo?.message_image === "string") {
    parsedMessage = JSON.parse(el.imageInfo.message_image);
  } else {
    parsedMessage = el?.imageInfo?.message_image;
  }

  return (
    <div className="mr-2 mb-2">
      {parsedMessage?.length === 1 && (
        <div
          className={cn(
            "rounded-2xl overflow-hidden max-h-[300px] max-w-[480px] shadow-bgContent",
            el.message &&
              "flex flex-col justify-start gap-2 shadow-default rounded-2xl bg-[#0866FF]"
          )}
        >
          <div className="h-auto overflow-hidden">
            {parsedMessage?.map((item, index) => (
              <img
                alt="anh"
                key={index}
                src={item}
                className="w-full h-full max-h-[300px] object-cover rounded-2xl cursor-pointer hover:opacity-90 duration-300"
              />
            ))}
          </div>
          {el.message && (
            <div className="text-[13px] text-white px-2 pb-2 break-words">
              {el.message}
            </div>
          )}
        </div>
      )}

      {parsedMessage?.length === 2 && (
        <div
          className={cn(
            "rounded-2xl overflow-hidden max-h-[300px] max-w-[384px]",
            el.message &&
              "flex flex-col justify-start gap-2 shadow-default rounded-2xl bg-[#0866FF]"
          )}
        >
          <div className="w-full h-auto grid grid-cols-2 overflow-hidden gap-2">
            {parsedMessage?.map((item, index) => (
              <img
                alt="anh"
                key={index}
                src={item}
                className="flex-1 w-full h-full object-cover rounded-2xl cursor-pointer hover:opacity-90 duration-300"
              />
            ))}
          </div>
          {el.message && (
            <div className="text-[13px] text-white px-2 pb-2 break-words">
              {el.message}
            </div>
          )}
        </div>
      )}
      {parsedMessage && parsedMessage?.length > 2 && (
        <div
          className={cn(
            "rounded-2xl overflow-hidden max-h-[300px] max-w-[384px]",
            el.message &&
              "flex flex-col justify-start gap-2 shadow-default rounded-2xl bg-[#0866FF] "
          )}
        >
          <div
            className={`w-full h-auto grid grid-cols-3 overflow-hidden gap-2 grid-rows-${Math.ceil(
              parsedMessage.length / 3
            )}`}
          >
            {parsedMessage?.map((item, index) => (
              <img
                alt="anh"
                key={index}
                src={item}
                className="flex-1 w-full h-full object-cover rounded-2xl cursor-pointer hover:opacity-90 duration-300"
              />
            ))}
          </div>
          {el.message && (
            <div className="text-[13px] text-white px-2 pb-2 break-words">
              {el.message}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MediaMsg;
