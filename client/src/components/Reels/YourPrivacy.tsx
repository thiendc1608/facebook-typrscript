import { ViewModeList } from "@/utils/path";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { showModal } from "@/redux/modalSlice";
import publicImage from "@/assets/images/public.png";
import { useEffect, useRef, useState } from "react";
import { IoIosSearch } from "react-icons/io";

const YourPrivacy = () => {
  const dispatch = useDispatch();

  const [selectNewsPrivacy, setSelectNewsPrivacy] = useState({
    icon: publicImage,
    name: "Công khai",
  });
  const [isChoosePeople, setIsChoosePeople] = useState(false);
  const yourPrivacyRef = useRef<HTMLDivElement>(null);
  const choosePeopleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isChoosePeople) {
      yourPrivacyRef.current!.style.transform = "translateX(-100%)";
      yourPrivacyRef.current!.style.visibility = "hidden";
      choosePeopleRef.current!.style.transform = "translateX(-100%)";
      choosePeopleRef.current!.style.visibility = "visible";
    } else {
      if (yourPrivacyRef.current) {
        yourPrivacyRef.current.style.transform = "translateX(0)";
        yourPrivacyRef.current.style.visibility = "visible";
      }
      if (choosePeopleRef.current) {
        choosePeopleRef.current.style.transform = "translateX(0)";
        choosePeopleRef.current.style.visibility = "hidden";
      }
    }
  }, [isChoosePeople]);

  return (
    <div
      className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
      onClick={(e) => e.stopPropagation()}
    >
      <div
        ref={yourPrivacyRef}
        className="w-[550px] bg-white rounded-lg shadow-default"
        style={{ transition: "transform 0.2s" }}
      >
        <div className="w-full h-[60px] border-b border-solid border-[#E5E5E5] flex items-center justify-center">
          <div className="text-[#050505] text-[20px] text-center">
            Quyền riêng tư của tin
          </div>
        </div>
        <div className="h-[280px] overflow-y-scroll">
          <div className="py-5 px-4">
            <p className="text-[17px] text-[#050505] leading-[21px]">
              Ai có thể xem tin của bạn?
            </p>
            <span className="mt-1 text-[#65676b] text-[15px]">
              Tin của bạn sẽ hiển thị trên Facebook và Messenger trong 24 giờ.
            </span>
          </div>
          <div>
            {ViewModeList.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="px-4 flex items-center hover:bg-[#F2F2F2] cursor-pointer"
              >
                <label
                  htmlFor={`${item.name}`}
                  className="flex items-center cursor-pointer flex-1"
                >
                  <div className="w-[60px] h-[60px] rounded-full bg-[#D8DADF] my-2 mr-3 flex items-center justify-center">
                    <img src={item.icon} alt={item.icon} className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[#050505] text-[17px] leading-5">
                      {item.name}
                    </span>
                    <span className="text-[#65676b] text-[15px] leading-5">
                      {item?.description}
                    </span>
                  </div>
                </label>
                <input
                  id={`${item.name}`}
                  type="radio"
                  name="viewMode"
                  className="w-5 h-5"
                  checked={item.name === selectNewsPrivacy.name}
                  onClick={() => {
                    if (item.name === "Bạn bè ngoại trừ")
                      setIsChoosePeople(true);
                    setSelectNewsPrivacy({
                      icon: item.icon,
                      name: item.name,
                    });
                  }}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="py-5 px-2 flex items-center justify-end border-t border-solid border-[#DEDEDE]">
          <Button
            variant="ghost"
            className="text-blue-500 text-[15px] hover:text-blue-500 mr-2"
            onClick={() =>
              dispatch(
                showModal({
                  isShowModal: false,
                  childrenModal: null,
                })
              )
            }
          >
            Huỷ
          </Button>
          <Button
            className="bg-blue-500 hover:bg-blue-700 text-white text-[15px] min-w-[115px]"
            onClick={() =>
              dispatch(showModal({ isShowModal: false, childrenModal: null }))
            }
          >
            Lưu
          </Button>
        </div>
      </div>
      <div
        ref={choosePeopleRef}
        style={{ transition: "transform 0.2s" }}
        className="absolute top-0 left-[100%] bg-white rounded-lg shadow-default w-[548px] h-[372.5px]"
      >
        <div className="w-full h-[60px] flex items-center">
          <div className="mx-auto">
            <span className="text-[#050505] text-[20px]">Chọn người</span>
          </div>
        </div>
        <div className="w-full px-4 h-[52px] flex flex-col justify-center border-t border-solid border-[#DFE1E6]">
          <div className="h-[36px] bg-[#F0F2F5] rounded-[100px]">
            <div className="flex items-center justify-center h-full">
              <label htmlFor="choose_people" className="pl-[10px]">
                <IoIosSearch size={20} />
              </label>
              <input
                type="text"
                placeholder="Tìm kiếm"
                id="choose_people"
                className="w-full h-full bg-[#F0F2F5] outline-none rounded-[100px] pl-[6px]"
              />
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 py-5 px-2 flex items-center justify-end border-t border-solid border-[#DEDEDE]">
          <Button
            variant="ghost"
            className="text-blue-500 text-[15px] hover:text-blue-500 mr-2"
            onClick={() => setIsChoosePeople(false)}
          >
            Huỷ
          </Button>
          <Button
            className="bg-blue-500 hover:bg-blue-700 text-white text-[15px] min-w-[115px]"
            onClick={() =>
              dispatch(showModal({ isShowModal: false, childrenModal: null }))
            }
          >
            Lưu
          </Button>
        </div>
      </div>
    </div>
  );
};

export default YourPrivacy;
