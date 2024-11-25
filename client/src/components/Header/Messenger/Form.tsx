import { cn } from "@/lib/utils";
import { BsEmojiSmile } from "react-icons/bs";
import { CiImageOn } from "react-icons/ci";
import { IoCloseOutline } from "react-icons/io5";
import { RiImageAddFill } from "react-icons/ri";
import EmojiPickerComponent from "./EmojiPicker";
import { BiSend } from "react-icons/bi";
import { useState } from "react";
import { toast } from "react-toastify";
import { conversationAPI } from "@/apis/conversationApi";
import { useSelector } from "react-redux";
import { UserState } from "@/redux/userSlice";
import { chattingUserType } from "@/redux/conversationSlice";
import { imageCloudinaryType, messageType } from "@/types";

const Form = () => {
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
  const { private_chat } = useSelector(
    (state: { conversation: chattingUserType }) => state.conversation
  );

  const handleChangeMessage = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).innerHTML.trim() === "<br>") {
      (e.target as HTMLElement).innerHTML = ""; // Xóa toàn bộ nội dung, bao gồm cả thẻ <br>
    }
    setInputValue((e.target as HTMLElement).innerText ?? "");
  };

  const handleSelectImage = async (files: File[]) => {
    // const imageList: File[] = [];
    const data = new FormData();
    for (const file of files) {
      if (file.type !== "image/png" && file.type !== "image/jpeg") {
        toast.warning("File not support");
        return;
      }
      setOptimisticImages((prev) => [...prev, file]);
      data.append("image_url", file);
    }
    const response = await conversationAPI.createImages(data);
    if (response.success) {
      setSelectedImageList((prev) => [
        ...prev,
        ...response.images.map((image) => image.path),
      ]);
      setFileNameCloundinaryList((prev) => [...prev, ...response.images]);
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
        newMessage.push(["image_url", selectImageList], ["sub_type", "image"]);
        if (inputValue.trim()) {
          newMessage.push(["message", inputValue]);
        }
      } else {
        if (inputValue.trim()) {
          newMessage.push(["message", inputValue, "image_url", []]);
        }
      }
    }

    const defaultMessage = {
      conversation_id: private_chat.current_conversation?.id ?? "",
      user_id: currentUser!.id,
      type_msg: "msg",
      send_at: new Date(),
      file_url: null,
      audio_record_url: null,
      sub_type: "text",
    };
    const message = {
      ...defaultMessage,
      ...Object.fromEntries(newMessage),
    } as messageType;

    const response = await conversationAPI.createMessage(message);
    if (response.success) {
      setInputValue("");
      setOptimisticImages([]);
      setSelectedImageList([]);
      setFileNameCloundinaryList([]);
      await conversationAPI.createConversation({
        conversation_id: message.conversation_id,
        participants: [
          { user_id: currentUser!.id },
          { user_id: private_chat.current_conversation!.user_id },
        ],
        join_at: new Date(),
      });
    }
    // socket?.emit("send_message", {
    //   receiver_id: private_chat.current_conversation?.user_id,
    //   message,
    // });
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
            name="image_url"
            accept="image/*"
            hidden
            multiple
            onChange={(e) => handleSelectImage([...e.target.files!])}
          />
        </div>
        <div className="w-full bg-[#F0F2F5] rounded-2xl overflow-hidden">
          <div className="flex flex-col min-h-[36px]">
            {optimisticImages.length > 0 && (
              <div className="p-3 rounded-tl-xl rounded-tr-xl bg-[#F0F2F5] w-full overflow-x-auto custom-scroll-bar">
                <ul className="flex gap-3">
                  <li className="min-w-[48px] h-[48px] rounded-lg bg-[#e2e5e9] flex items-center justify-center">
                    <RiImageAddFill size={26} />
                  </li>
                  {optimisticImages.map((imageList, idx) => (
                    <li
                      key={idx}
                      className="relative min-w-[48px] h-[48px] rounded-lg bg-[#e2e5e9]"
                    >
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
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="relative flex items-end">
              <div
                defaultValue={inputValue}
                contentEditable={true}
                className="relative p-1 bg-[#F0F2F5] min-h-[36px] w-[calc(100%-40px)] outline-none pl-3 break-all text-wrap break-words whitespace-pre-wrap text-[15px] flex items-center editable-div leading-5"
                onKeyUp={(e: React.KeyboardEvent<HTMLDivElement>) =>
                  handleChangeMessage(e)
                }
              />
              <div className="absolute bottom-[10px] right-[10px] cursor-pointer shadow-default">
                <BsEmojiSmile
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

      {pickerOpen && <EmojiPickerComponent setPickerOpen={setPickerOpen} />}
      {/* {inputValue ? ( */}
      <button
        className="w-[36px] h-[36px] cursor-pointer flex items-center"
        type="submit"
      >
        <BiSend size={26} title="Gửi" color="#0866ff" />
      </button>
      {/* //   ) : (
    //     <div className="w-[36px] h-[36px] cursor-pointer flex items-center">
    //       <BiSolidLike size={26} title="Gửi like" color="#0866ff" />
    //     </div>
    //   )} */}
    </form>
  );
};

export default Form;
