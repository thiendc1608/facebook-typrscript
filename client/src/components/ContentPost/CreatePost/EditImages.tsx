import { cn } from "@/lib/utils";
import { removeImageFromList } from "@/redux/imageVideoSlice";
import { ImageVideoState } from "@/types";
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";

const EditImages = () => {
  const { listObjectImage } = useSelector(
    (state: { imageVideo: ImageVideoState }) => state.imageVideo
  );
  const dispatch = useDispatch();

  return (
    <div>
      {listObjectImage.length === 0 ? (
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
            listObjectImage.length >= 3 && "w-[900px] flex-row flex-wrap",
            listObjectImage.length >= 5 && "w-[1100px]"
          )}
        >
          {listObjectImage.map((item) => (
            <div
              key={item.id}
              className={cn(
                "h-[200px] w-full relative",
                listObjectImage.length >= 3 && "w-[438px] p-1 h-[300px]"
              )}
            >
              <img
                src={URL.createObjectURL(item.name)}
                alt={`image${item.id}`}
                className="w-full h-full rounded-lg object-cover"
              />
              <div className="absolute top-2 right-2">
                <div className="rounded-full bg-white cursor-pointer hover:scale-y-110">
                  <IoMdClose
                    size={24}
                    className="hover:text-red-500"
                    onClick={() =>
                      dispatch(removeImageFromList({ id: item.id }))
                    }
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
