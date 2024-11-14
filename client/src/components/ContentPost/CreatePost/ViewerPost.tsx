import { Button } from "@/components/ui/button";
import { SelectModeType } from "@/types";
import { ViewModeList } from "@/utils/path";
import React from "react";
import { FaArrowLeft } from "react-icons/fa6";

interface ViewerPostProps {
  selectMode: SelectModeType;
  setIsSelectMode: (value: boolean) => void;
  setSelectPostObject: (value: SelectModeType) => void;
}

const ViewerPost = React.forwardRef<unknown, ViewerPostProps>((props, ref) => {
  return (
    <div
      className="absolute left-[100%] top-0"
      onClick={(e) => e.stopPropagation()}
      ref={ref as React.Ref<HTMLDivElement>}
      style={{ transition: "transform 0.5s" }}
    >
      <div className="w-[500px] bg-white rounded-lg shadow-default">
        <div className="relative w-full h-[60px] border-b border-solid border-[#E5E5E5] flex items-center justify-center">
          <div className="text-[#050505] text-[20px] text-center">
            Đối tượng của bài viết
          </div>
          <div
            className="absolute top-3 left-4 w-9 h-9 rounded-full bg-[#D8DADF] text-[#5B626A] flex items-center justify-center cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              props.setIsSelectMode(false);
            }}
          >
            <FaArrowLeft size={24} />
          </div>
        </div>
        <div className="h-[280px] overflow-y-scroll">
          <div className="py-5 px-4">
            <p className="text-[17px] text-[#050505] leading-[21px]">
              Ai có thể xem bài viết của bạn?
            </p>
            <p className="mt-1 text-[#65676b] text-[15px]">
              Bài viết của bạn sẽ hiển thị trên Bảng feed, trang cá nhân và
              trong kết quả tìm kiếm.
            </p>
            <p className="mt-4 text-[#65676b] text-[15px] mb-3">
              Tuy đối tượng mặc định là <strong>Chỉ mình tôi</strong>, nhưng bạn
              có thể thay đổi đối tượng của riêng bài viết này.
            </p>
          </div>
          <div>
            {ViewModeList.map((item) => (
              <div
                key={item.id}
                className="px-4 flex items-center justify-between"
              >
                <div className="flex items-center">
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
                </div>
                <input
                  type="radio"
                  name="viewMode"
                  className="w-5 h-5"
                  checked={item.name === props.selectMode.name}
                  onClick={() => {
                    props.setSelectPostObject({
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
            className="text-blue-500 text-[15px] hover:text-blue-500"
            onClick={(e) => {
              e.stopPropagation();
              props.setIsSelectMode(false);
            }}
          >
            Huỷ
          </Button>
          <Button
            className="bg-blue-500 hover:bg-blue-700 text-white text-[15px] min-w-[115px]"
            onClick={(e) => {
              e.stopPropagation();
              props.setIsSelectMode(false);
            }}
          >
            Xong
          </Button>
        </div>
      </div>
    </div>
  );
});

export default ViewerPost;
