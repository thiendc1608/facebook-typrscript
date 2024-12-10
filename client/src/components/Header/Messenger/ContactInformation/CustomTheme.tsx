import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { setThemeMessage } from "@/redux/messageSlice";
import { showModal } from "@/redux/modalSlice";
import { themeColorChat } from "@/utils/path";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useDispatch } from "react-redux";

const CustomTheme = () => {
  const dispatch = useDispatch();
  const [themeMsg, setThemeMsg] = useState({
    id: 1,
    color: "#0866ff",
  });

  return (
    <div
      className="w-[300px] h-auto bg-white rounded-lg"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="relative w-full h-[60px] border-b border-solid border-[#E5E5E5] flex items-center justify-center">
        <div className="text-[#050505] text-[20px] text-center">
          Chọn chủ đề
        </div>
        <div
          className="absolute top-2 right-3 w-9 h-9 rounded-full bg-[#D8DADF] text-[#5B626A] flex items-center justify-center cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            dispatch(
              showModal({
                isShowModal: false,
                childrenModal: null,
              })
            );
          }}
        >
          <IoMdClose size={24} />
        </div>
      </div>
      <div className="flex items-center justify-center gap-3 flex-wrap mt-2">
        {themeColorChat.map((item) => (
          <div
            className={cn(
              "p-1  rounded-lg cursor-pointer",
              item.id === themeMsg.id ? "bg-[#bebcbc]" : "hover:bg-[#bebcbc]"
            )}
          >
            <div
              key={item.id}
              style={{ backgroundColor: item.color }}
              className="w-10 h-10 cursor-pointer flex items-center justify-center rounded-full"
              onClick={() =>
                setThemeMsg({
                  ...themeMsg,
                  id: item.id,
                  color: item.color,
                })
              }
            ></div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-end gap-2 my-4 pr-4">
        <Button
          variant={"outline"}
          onClick={() =>
            dispatch(showModal({ isShowModal: false, childrenModal: null }))
          }
        >
          Cancel
        </Button>
        <Button
          className="bg-[#0866ff] hover:bg-blue-800"
          onClick={() => {
            dispatch(setThemeMessage(themeMsg.color));
            dispatch(showModal({ isShowModal: false, childrenModal: null }));
          }}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default CustomTheme;
