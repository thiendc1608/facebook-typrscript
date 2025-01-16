import { cn } from "@/lib/utils";
import { messageSliceType, removeSelectedImage } from "@/redux/messageSlice";
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";

const EditImages = () => {
  const { selectImageList } = useSelector(
    (state: { message: messageSliceType }) => state.message
  );
  const dispatch = useDispatch();

  return (
    <div>
      {selectImageList.length === 0 ? (
        <div className="w-full h-[200px] flex flex-col items-center justify-center bg-white">
          <svg viewBox="0 0 112 112" width="112" height="112">
            <defs>
              <clipPath id="a">
                <rect
                  width="81.38"
                  height="68.11"
                  x="12.34"
                  y="18.4"
                  fill="none"
                  rx="6.69"
                ></rect>
              </clipPath>
            </defs>
            <rect
              width="81.38"
              height="68.11"
              x="20.91"
              y="27.89"
              fill="#7a7d81"
              rx="6.69"
            ></rect>
            <g clip-path="url(#a)">
              <rect
                width="81.38"
                height="68.11"
                x="12.34"
                y="18.4"
                fill="#a4a7ab"
                rx="6.69"
              ></rect>
              <path
                fill="#fff"
                d="m7.44 89.57 32.5-42.76 13.09 13.04 27.89-31.9 21.42 27.71 1.06 37.49H8.5l-1.06-3.58z"
              ></path>
            </g>
            <circle cx="27.57" cy="35.69" r="6.65" fill="#1876f2"></circle>
          </svg>
          <span className="text-[#65676b] text-[17px]">
            Thêm ảnh/video để bắt đầu
          </span>
        </div>
      ) : (
        <div
          className={cn(
            "flex flex-col max-h-[410px] w-full overflow-y-scroll gap-1",
            selectImageList.length >= 3 && "grid grid-cols-2",
            selectImageList.length >= 5 && "grid grid-cols-2"
          )}
        >
          {selectImageList.map((item, idx) => (
            <div
              key={idx}
              className={cn(
                "h-[200px] w-full relative border border-black",
                selectImageList.length >= 3 && "w-auto p-1 h-[300px]"
              )}
            >
              {item?.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                // Hiển thị ảnh
                <img
                  loading="lazy"
                  src={item}
                  alt="anh"
                  className="w-full h-full rounded-lg object-contain"
                />
              ) : (
                // Hiển thị video
                <video width="100%" controls className="h-full">
                  <source src={item} type="video/mp4" />
                </video>
              )}
              <div className="absolute top-2 right-2">
                <div className="rounded-full bg-white cursor-pointer hover:scale-y-110">
                  <IoMdClose
                    size={24}
                    className="hover:text-red-500"
                    onClick={() => dispatch(removeSelectedImage(item))}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EditImages;
