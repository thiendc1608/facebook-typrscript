import { cn } from "@/lib/utils";
import { TfiFaceSmile } from "react-icons/tfi";
import { CiImageOn } from "react-icons/ci";
import { IoCloseOutline } from "react-icons/io5";
import { RiImageAddFill } from "react-icons/ri";
import EmojiPickerComponent from "./EmojiPicker";
import { BiSend } from "react-icons/bi";
import { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { conversationAPI } from "@/apis/conversationApi";
import { useDispatch, useSelector } from "react-redux";
import { UserState } from "@/redux/userSlice";
import { chattingUserType, setReplyMsg } from "@/redux/conversationSlice";
import { imageCloudinaryType, messageType } from "@/types";
import { SocketContext } from "@/context/SocketContext";
import { v4 as uuidv4 } from "uuid";
import "./Messenger.css";

const Form = () => {
  const [emoji, setEmoji] = useState<string>("");
  const [pickerOpen, setPickerOpen] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [optimisticImages, setOptimisticImages] = useState<File[]>([]);
  const [selectImageList, setSelectedImageList] = useState<string[]>([]);
  const [fileNameCloundinaryList, setFileNameCloundinaryList] = useState<
    imageCloudinaryType[]
  >([]);
  const { currentUser } = useSelector(
    (state: { user: UserState }) => state.user
  );
  const { private_chat, reply_message } = useSelector(
    (state: { conversation: chattingUserType }) => state.conversation
  );
  const { socket } = useContext(SocketContext);
  const divRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const defaultMessage = {
    id: uuidv4(),
    conversation_id: private_chat.current_conversation?.id ?? "",
    sender_id: currentUser!.id,
    type_msg: "msg",
    send_at: new Date(),
    file_url: null,
    audio_record_url: null,
    reply_text_id:
      reply_message?.sub_type !== "image" ? reply_message?.id : null,
    reply_image_id: reply_message ? reply_message.image_id : null,
    sub_type: "text",
  };

  const handleChangeMessage = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).innerHTML.trim() === "<br>") {
      (e.target as HTMLElement).innerHTML = ""; // Xóa toàn bộ nội dung, bao gồm cả thẻ <br>
    }
    setInputValue((e.target as HTMLElement).innerText ?? "");
  };

  useEffect(() => {
    if (divRef.current) {
      const editableDiv = divRef.current;
      editableDiv.focus();

      const selection = window.getSelection();
      const range = selection?.getRangeAt(0);

      range?.deleteContents();
      const emojiNode = document.createTextNode(emoji);
      range?.insertNode(emojiNode);

      range?.setStartAfter(emojiNode);
      range?.setEndAfter(emojiNode);

      selection?.removeAllRanges();
      selection?.addRange(range!);
    }
  }, [emoji]);

  useEffect(() => {
    if (divRef.current) {
      const editableDiv = divRef.current;
      editableDiv.focus();
    }
  }, [reply_message]);

  const handleSelectImage = async (files: File[]) => {
    // const imageList: File[] = [];
    setLoading(true);
    const data = new FormData();
    for (const file of files) {
      if (file.type !== "image/png" && file.type !== "image/jpeg") {
        toast.warning("File not support");
        return;
      }
      setOptimisticImages((prev) => [...prev, file]);
      data.append("imageInfo", file);
    }
    try {
      const response = await conversationAPI.uploadImages(data);
      if (response.success) {
        setSelectedImageList((prev) => [
          ...prev,
          ...response.images.map((image) => image.path),
        ]);
        setFileNameCloundinaryList((prev) => [...prev, ...response.images]);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Hide loading spinner after API call
    }
  };

  const handleDeleteImage = async (idx: number, imageList: File) => {
    setOptimisticImages((prev) => prev.filter((_, index) => index !== idx));
    const originalImage = fileNameCloundinaryList?.filter(
      (item) => item.originalname === imageList.name
    );
    const deleteImageList = originalImage?.map((item) => item.filename);
    await conversationAPI.deleteImages(deleteImageList[0]);
  };

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newMessage = [];
    if (inputValue.trim() || selectImageList) {
      if (selectImageList.length > 0) {
        newMessage.push(
          ["imageInfo", { message_image: selectImageList }],
          reply_message ? ["sub_type", "reply"] : ["sub_type", "image"]
        );
        if (inputValue.trim()) {
          newMessage.push(["message", inputValue]);
        }
      } else {
        if (inputValue.trim()) {
          newMessage.push(["message", inputValue]);
          if (reply_message) {
            newMessage.push(["sub_type", "reply"]);
          }
        }
      }
    }

    // Hàm delay trả về một Promise để có thể sử dụng async/await
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    let timeMessage: messageType | null = null;
    if (private_chat.current_messages?.length > 0) {
      const last_message =
        private_chat.current_messages[private_chat.current_messages.length - 1];

      if (
        (new Date().getTime() - new Date(last_message.send_at).getTime()) /
          1000 >
        10 * 60
      ) {
        timeMessage = {
          id: uuidv4(),
          conversation_id: defaultMessage.conversation_id,
          type_msg: "divider",
          sub_type: "text",
          send_at: defaultMessage.send_at,
        };
        await conversationAPI.createMessage(timeMessage);
        delay(1000);
      }
    }
    const message = {
      ...defaultMessage,
      ...Object.fromEntries(newMessage),
    } as messageType;

    const response = await conversationAPI.createMessage(message);
    if (response.success) {
      if (divRef.current) {
        divRef.current.innerHTML = "";
        setInputValue("");
        divRef.current.focus();
      }
      setOptimisticImages([]);
      setSelectedImageList([]);
      setFileNameCloundinaryList([]);
      dispatch(setReplyMsg(null));
    }

    socket?.emit("send_message", {
      receiver_id: private_chat.current_conversation?.members?.user?.id,
      message: response.messageCreated,
      timeMessage,
    });
  };

  const handleClickLike = async () => {
    let timeMessage: messageType | null = null;
    if (private_chat.current_messages?.length > 0) {
      const last_message =
        private_chat.current_messages[private_chat.current_messages.length - 1];

      if (
        (new Date().getTime() - new Date(last_message.send_at).getTime()) /
          1000 >
        10 * 60
      ) {
        timeMessage = {
          id: uuidv4(),
          conversation_id: defaultMessage.conversation_id,
          type_msg: "divider",
          sub_type: "text",
          send_at: defaultMessage.send_at,
        };
        await conversationAPI.createMessage(timeMessage);
      }
    }
    const message = {
      ...defaultMessage,
      message: "👍",
    } as messageType;
    await conversationAPI.createMessage(message);
    socket?.emit("send_message", {
      receiver_id: private_chat.current_conversation?.members?.user?.id,
      message,
      timeMessage,
    });
  };
  return (
    <form
      className={cn(
        "py-3 px-1 flex items-end gap-2 w-full",
        selectImageList.length > 0 && "items-end"
      )}
      onSubmit={(e) => handleSendMessage(e)}
    >
      <>
        <div className="w-[36px] h-[36px] cursor-pointer flex items-center">
          <label htmlFor="choose_image" className="cursor-pointer">
            <CiImageOn size={30} title="Đính kèm file" color="#0866ff" />
          </label>
          <input
            type="file"
            id="choose_image"
            name="imageInfo"
            accept="image/*"
            hidden
            multiple
            onChange={(e) => handleSelectImage([...e.target.files!])}
          />
        </div>
        <div className="w-full bg-[#F0F2F5] rounded-2xl overflow-hidden">
          <div className="flex flex-col min-h-[36px]">
            {optimisticImages.length > 0 && (
              <div className="p-3 rounded-tl-xl rounded-tr-xl bg-[#F0F2F5] w-full overflow-x-auto">
                <ul className="flex gap-3">
                  <li className="min-w-[48px] h-[48px] rounded-lg bg-[#e2e5e9] flex items-center justify-center">
                    <RiImageAddFill size={26} />
                  </li>
                  {optimisticImages.map((imageList, idx) => (
                    <li
                      key={idx}
                      className="relative min-w-[48px] h-[48px] rounded-lg bg-[#e2e5e9]"
                    >
                      {loading && <div className="loader"></div>}
                      {!loading && (
                        <>
                          <img
                            src={URL.createObjectURL(imageList)}
                            alt="anh"
                            className="w-[48px] h-[48px] object-contain"
                          />
                          <div
                            className="absolute top-[-8px] right-[-8px] bg-white rounded-full w-[24px] h-[24px] flex items-center justify-center cursor-pointer shadow-default"
                            onClick={() => handleDeleteImage(idx, imageList)}
                          >
                            <IoCloseOutline size={18} />
                          </div>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="relative flex items-end">
              <div
                ref={divRef}
                contentEditable={true}
                className="relative p-1 bg-[#F0F2F5] min-h-[36px] w-[calc(100%-40px)] outline-none pl-3 break-all text-[15px] flex items-center editable-div leading-5"
                onKeyUp={(e: React.KeyboardEvent<HTMLDivElement>) =>
                  handleChangeMessage(e)
                }
              />
              <div className="absolute bottom-[8px] right-[10px] cursor-pointer shadow-headerContent rounded-full z-[99]">
                <TfiFaceSmile
                  size={20}
                  color="#0866ff"
                  title="Chọn biểu tượng cảm xúc"
                  onClick={() => setPickerOpen((prev) => !prev)}
                />
              </div>
            </div>
          </div>
        </div>
      </>

      {pickerOpen && (
        <EmojiPickerComponent
          setPickerOpen={setPickerOpen}
          setEmoji={setEmoji}
        />
      )}
      {inputValue || optimisticImages.length > 0 ? (
        <button
          className="w-[36px] h-[36px] cursor-pointer flex items-center"
          type="submit"
        >
          <BiSend size={26} title="Gửi" color="#0866ff" />
        </button>
      ) : (
        <div
          className="w-[36px] h-[36px] cursor-pointer flex items-center text-[20px]"
          onClick={handleClickLike}
        >
          👍
        </div>
      )}
    </form>
  );
};

export default Form;
