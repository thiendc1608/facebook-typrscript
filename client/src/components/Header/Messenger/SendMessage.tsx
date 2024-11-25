import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmile } from "react-icons/bs";
import { BiSend, BiSolidLike } from "react-icons/bi";
import EmojiPickerComponent from "./EmojiPicker";
import { cn } from "@/lib/utils";
import { RiImageAddFill } from "react-icons/ri";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { IoCloseOutline } from "react-icons/io5";

interface SendMessageProps {
  changeColor?: string;
  selectImageList: File[];
  setSelectedImageList: React.Dispatch<React.SetStateAction<File[]>>;
}
const SendMessage = React.forwardRef<HTMLDivElement, SendMessageProps>(
  (props, ref) => {
    const [pickerOpen, setPickerOpen] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>("");

    const handleChangeMessage = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if ((e.target as HTMLElement).innerHTML.trim() === "<br>") {
        (e.target as HTMLElement).innerHTML = ""; // Xóa toàn bộ nội dung, bao gồm cả thẻ <br>
      }
      setInputValue((e.target as HTMLElement).innerText ?? "");
    };

    const handleSelectImage = async (files: File[]) => {
      const imagePreview: File[] = [];
      for (const file of files) {
        if (file.type !== "image/png" && file.type !== "image/jpeg") {
          toast.warning("File not support");
          return;
        }
        imagePreview.push(file);
      }
      props.setSelectedImageList((prev) => [...prev, ...imagePreview]);
    };

    const handleDeleteImage = (idx: number) => {
      props.setSelectedImageList((prev) =>
        prev.filter((_, index) => index !== idx)
      );
    };

    return (
      <>
        <div
          className={cn(
            "flex-1 min-h-[60px] w-full flex items-center absolute bottom-0",
            props.selectImageList.length > 0 && "min-h-[132px] items-end"
          )}
        >
          <div
            className={cn(
              "py-3 px-1 flex items-end gap-2 w-full",
              props.selectImageList.length > 0 && "items-end"
            )}
          >
            <div className="w-[36px] h-[36px] cursor-pointer flex items-center">
              <label htmlFor="choose image" className="cursor-pointer">
                <CiImageOn
                  size={30}
                  title="Đính kèm file"
                  color={props.changeColor}
                />
              </label>
              <input
                type="file"
                id="choose image"
                accept="image/*"
                hidden
                multiple
                onChange={(e) => handleSelectImage([...e.target.files!])}
              />
            </div>
            <div className="w-full bg-[#F0F2F5] rounded-2xl overflow-hidden">
              <div className="flex flex-col min-h-[36px]">
                {props.selectImageList.length > 0 && (
                  <div className="p-3 rounded-tl-xl rounded-tr-xl bg-[#F0F2F5] w-full overflow-x-auto custom-scroll-bar">
                    <ul className="flex gap-3">
                      <li className="min-w-[48px] h-[48px] rounded-lg bg-[#e2e5e9] flex items-center justify-center">
                        <RiImageAddFill size={26} />
                      </li>
                      {props.selectImageList.map((imageList, idx) => (
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
                            onClick={() => handleDeleteImage(idx)}
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
                    contentEditable="true"
                    ref={ref}
                    id="inputChat"
                    className="relative p-1 bg-[#F0F2F5] min-h-[36px] w-[calc(100%-40px)] outline-none pl-3 break-all text-wrap break-words whitespace-pre-wrap text-[15px] flex items-center editable-div leading-5"
                    onKeyUp={(e: React.KeyboardEvent<HTMLDivElement>) =>
                      handleChangeMessage(e)
                    }
                  ></div>
                  <div className="absolute bottom-[10px] right-[10px] cursor-pointer shadow-default">
                    <BsEmojiSmile
                      size={20}
                      color={props.changeColor}
                      title="Chọn biểu tượng cảm xúc"
                      onClick={() => setPickerOpen((prev) => !prev)}
                    />
                  </div>
                </div>
              </div>
            </div>
            {pickerOpen && (
              <EmojiPickerComponent setPickerOpen={setPickerOpen} />
            )}
            {inputValue ? (
              <div className="w-[36px] h-[36px] cursor-pointer flex items-center">
                <BiSend
                  size={26}
                  title="Gửi"
                  color={props.changeColor}
                  // onClick={handleSendMessage}
                />
              </div>
            ) : (
              <div className="w-[36px] h-[36px] cursor-pointer flex items-center">
                <BiSolidLike
                  size={26}
                  title="Gửi like"
                  color={props.changeColor}
                />
              </div>
            )}
          </div>
        </div>
      </>
    );
  }
);

export default SendMessage;
