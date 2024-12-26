import { postType, setCheckIn, setLocationTag } from "@/redux/postSlice";
import { dataProvinceType, ImageVideoState } from "@/types";
import { FaLocationDot } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { IoMdClose } from "react-icons/io";
import { addImageVideo } from "@/redux/imageVideoSlice";

interface DisplayProvinceProps {
  query: string;
  addToClose: boolean;
}
const DisplayProvince = ({ query, addToClose }: DisplayProvinceProps) => {
  const dispatch = useDispatch();
  const { locationList } = useSelector(
    (state: { post: postType }) => state.post
  );
  const { isAddImageVideo } = useSelector(
    (state: { imageVideo: ImageVideoState }) => state.imageVideo
  );

  return (
    <>
      {locationList
        .filter((item) =>
          item?.full_name?.toLowerCase().includes(query?.toLowerCase())
        )
        .map((item: dataProvinceType, idx) => (
          <div
            key={idx}
            className="p-2 flex items-center justify-between cursor-pointer hover:bg-[#F2F2F2] rounded-lg"
            onClick={() => {
              dispatch(setLocationTag(item));
              dispatch(setCheckIn(false));
              if (!isAddImageVideo) {
                dispatch(addImageVideo(!isAddImageVideo));
              }
            }}
          >
            <div className="flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-[#D8DADF] flex items-center justify-center">
                <FaLocationDot size={20} />
              </div>
              <div className="flex flex-col gap-[2px] p-[6px] ml-[6px]">
                <div className="text-[#050505] text-[15px]">{item.name}</div>
                <span className="text-[12px] text-[#65676b]">
                  {item.full_name}
                </span>
              </div>
            </div>
            {addToClose && (
              <div
                className="w-6 h-6 rounded-full bg-[#D8DADF] flex items-center justify-center"
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(setCheckIn(false));
                  dispatch(setLocationTag(null));
                  dispatch(addImageVideo(!isAddImageVideo));
                }}
              >
                <IoMdClose size={20} />
              </div>
            )}
          </div>
        ))}
    </>
  );
};

export default DisplayProvince;
