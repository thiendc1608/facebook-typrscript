import { cn } from "@/lib/utils";
import { setSelectBg } from "@/redux/reelSlice";
import { reelType } from "@/types";
import { backgroundImageReel } from "@/utils/path";
import { useDispatch, useSelector } from "react-redux";

const BackGroundImageReel = () => {
  const dispatch = useDispatch();
  const { selectBg } = useSelector((state: { reel: reelType }) => state.reel);
  return (
    <div className="border border-solid rounded-lg border-[#CED0D4] pl-4">
      <div className="pt-3 pb-2 ">
        <span className="text-[15px] text-[#65676b]">Phông nền</span>
      </div>
      <div className="flex flex-wrap">
        {backgroundImageReel.map((image) => (
          <div
            key={image.id}
            className="p-1 cursor-pointer"
            onClick={() => dispatch(setSelectBg(image))}
          >
            <img
              src={image.srcImg}
              alt={`image${image.id}`}
              className={cn(
                "w-[30px] h-[30px] rounded-full",
                selectBg.id === image.id &&
                  "border-[3px] border-solid border-[#0866ff] scale-[1.3]"
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BackGroundImageReel;
