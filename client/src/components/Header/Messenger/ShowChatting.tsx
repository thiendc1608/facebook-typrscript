import { IoIosArrowDown } from "react-icons/io";
import { GoDash } from "react-icons/go";
import { IoCloseOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { setIsOpenChatting } from "@/redux/notificationSlice";
import { useEffect, useRef, useState } from "react";
// import { SocketContext } from "@/context/SocketContext";
import { cn } from "@/lib/utils";
import "./Messenger.css";
import SendMessage from "./SendMessage";

const ShowChatting = () => {
  // const socket = useContext(SocketContext);
  const dispatch = useDispatch();
  const [changeColor, setChangeColor] = useState<string>("#0866ff");
  const [selectImageList, setSelectedImageList] = useState<File[]>([]);
  const divRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const inputElement = document.getElementById("inputChat");
    if (divRef.current) {
      divRef.current.focus();
      inputElement?.focus();
    }
    document.addEventListener("click", (event) => {
      event.stopPropagation();
      // Kiểm tra nếu người dùng click ra ngoài inputElement
      if (
        event.target !== divRef.current &&
        !divRef.current?.contains(event.target as Node)
      ) {
        inputElement?.blur(); // Mất focus
        setChangeColor("#b6b9be");
      } else {
        inputElement?.focus(); // focus
        setChangeColor("#0866ff");
      }
    });
  }, []);

  useEffect(() => {
    if (contentRef.current)
      if (selectImageList.length === 0) {
        if (inputRef.current!.clientHeight === 36) {
          contentRef.current.style.height = `${
            347 + 36 - inputRef.current!.clientHeight
          }px`;
        } else {
          const match = contentRef.current.style.height.match(/\d+/);
          if (match) {
            contentRef.current.style.height = `${Number(match[0]) - 16}px`;
          }
        }
      } else {
        if (inputRef.current!.clientHeight === 36) {
          contentRef.current.style.height = `${
            347 - 72 + 36 - inputRef.current!.clientHeight
          }px`;
        } else {
          const match = contentRef.current.style.height.match(/\d+/);
          if (match) {
            contentRef.current.style.height = `${Number(match[0]) - 20}px`;
            contentRef.current.style.maxHeight =
              contentRef.current.style.height;
          }
        }
      }
  }, [selectImageList, inputRef.current?.clientHeight]);

  useEffect(() => {
    inputRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, []);

  return (
    <div className="fixed bottom-0 right-[80px]">
      <div
        className="w-[328px] h-[455px] bg-white rounded-lg shadow-default"
        tabIndex={0}
        ref={divRef}
      >
        <div className="p-2 h-[48px] shadow-default">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 w-auto">
              <img
                src="https://scontent.fhan2-4.fna.fbcdn.net/v/t39.30808-1/314818792_101307872811270_6985110685556599242_n.jpg?stp=dst-jpg_s100x100&_nc_cat=110&ccb=1-7&_nc_sid=0ecb9b&_nc_ohc=PmFhy5XGFAYQ7kNvgGLI8vv&_nc_ad=z-m&_nc_cid=0&_nc_zt=24&_nc_ht=scontent.fhan2-4.fna&_nc_gid=AGcIdjzRS8iPaz7uvSs9HMU&oh=00_AYDA62KxdTBIFUeSbbQVTuac6WLMsiIL29Ki4VleH5-LIA&oe=673C72F6"
                alt="anh"
                className="w-[32px] h-[32px] rounded-full object-cover"
              />
              <span className="text-[15px] text-[#080809] font-semibold">
                Hình bóng
              </span>
              <IoIosArrowDown
                size={20}
                color={changeColor}
                className="cursor-pointer"
              />
            </div>
            <div className="flex items-center gap-2">
              <GoDash size={24} color={changeColor} />
              <IoCloseOutline
                size={24}
                color={changeColor}
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(setIsOpenChatting(false));
                }}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col h-full">
          <div
            ref={contentRef}
            className={cn(
              "flex-1 max-h-[347px] w-full overflow-auto",
              selectImageList.length > 0 && "max-h-[calc(347px-72px)]"
            )}
          >
            <div className="h-[20px]"></div>
            <div className="pt-5 px-3 pb-3">
              <div className="flex flex-col items-center justify-center gap-3">
                <img
                  src="https://scontent.fhan2-4.fna.fbcdn.net/v/t39.30808-1/314818792_101307872811270_6985110685556599242_n.jpg?stp=dst-jpg_s100x100&_nc_cat=110&ccb=1-7&_nc_sid=0ecb9b&_nc_ohc=PmFhy5XGFAYQ7kNvgGLI8vv&_nc_ad=z-m&_nc_cid=0&_nc_zt=24&_nc_ht=scontent.fhan2-4.fna&_nc_gid=AGcIdjzRS8iPaz7uvSs9HMU&oh=00_AYDA62KxdTBIFUeSbbQVTuac6WLMsiIL29Ki4VleH5-LIA&oe=673C72F6"
                  alt="anh"
                  className="w-[60px] h-[60px] rounded-full object-cover"
                />
                <span className="text-[17px] text-[#080809] font-semibold">
                  Hình bóng
                </span>
              </div>
            </div>
          </div>
          <SendMessage
            setSelectedImageList={setSelectedImageList}
            selectImageList={selectImageList}
            changeColor={changeColor}
            ref={inputRef}
          />
        </div>
      </div>
    </div>
  );
};

export default ShowChatting;
