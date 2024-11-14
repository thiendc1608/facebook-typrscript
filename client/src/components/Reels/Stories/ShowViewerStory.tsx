import { Button } from "@/components/ui/button";
import { IoMdEye } from "react-icons/io";
import { IoMdClose } from "react-icons/io";

interface ShowViewerStoryProps {
  setIsShowViewer: (isShowViewer: boolean) => void;
}
const ShowViewerStory = ({ setIsShowViewer }: ShowViewerStoryProps) => {
  return (
    <div className="absolute bottom-0 left-0 w-full top-[80px] bg-white rounded-lg overflow-y-scroll">
      <div className="px-1 py-[18px]">
        <div className="relative leading-5 mx-[18px] mb-[18px] text-center">
          <span className="text-[#080809] text-[17px]">Chi tiết về tin</span>
          <span className="absolute right-[-4px] top-[-4px] w-[30px] h-[30px] rounded-full bg-red-600 flex items-center justify-center">
            <IoMdClose
              size={20}
              color="white"
              onClick={() => setIsShowViewer(false)}
            />
          </span>
        </div>
        <div className="px-3 flex flex-col gap-4">
          <div className="flex item-center gap-2">
            <IoMdEye size={22} />
            <div className="text-black text-[17px]">0 người xem</div>
          </div>
          <div className="flex item-center justify-between gap-2 w-full">
            <Button className="bg-blue-600">Người xem</Button>
            <Button variant={"destructive"}>Comment</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowViewerStory;
