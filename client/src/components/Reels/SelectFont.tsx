import { fontReel } from "@/utils/path";
import { useDispatch } from "react-redux";
import { setChangeFont } from "@/redux/reelSlice";

interface SelectFontProps {
  setIsChangeFont: React.Dispatch<React.SetStateAction<boolean>>;
}
const SelectFont = ({ setIsChangeFont }: SelectFontProps) => {
  const dispatch = useDispatch();
  return (
    <div className="absolute top-[-126px] left-0 w-full h-auto z-10 bg-white">
      <div className="border-2 border-solid shadow-default rounded-sm p-1">
        {fontReel.map((item) => (
          <div
            key={item.id}
            className="text-[#050505] text-[17px] cursor-pointer hover:bg-[#F2F2F2] rounded-lg p-1 mb-1"
            onClick={() => {
              setIsChangeFont(true);
              dispatch(setChangeFont(item));
            }}
          >
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectFont;
