import { BiWorld } from "react-icons/bi";
// import { FaPlay } from "react-icons/fa6";
import ProgressTimeout from "./ProgressTimeout";
import { storyDataType, userListStoryType } from "@/types";
import { formatTimeAgo } from "@/utils/helpers";
import ImageReel from "./ImageReel";
import ChangeStateAction from "./ChangeStateAction";
import { useEffect, useRef, useState } from "react";
import { MdKeyboardArrowUp } from "react-icons/md";
import ShowViewerStory from "./ShowViewerStory";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

interface StoryViewerProps {
  myStories: storyDataType[];
  storyViewer: storyDataType[];
  pauseFlagMouse: React.MutableRefObject<boolean>;
  followingUserList: userListStoryType[];
  storyIndex: number;
  changeStoryIndexHandler: (number: number) => void;
}

const StoryViewer = ({
  myStories,
  storyViewer,
  pauseFlagMouse,
  storyIndex,
  followingUserList,
  changeStoryIndexHandler,
}: StoryViewerProps) => {
  const [isShowViewer, setIsShowViewer] = useState(false);
  const [firstReel, setFirstReel] = useState<storyDataType>();
  const [lastReel, setLastReel] = useState<storyDataType>();

  const pauseFlagBtn = useRef(false);
  const mouseMoveHandler = () => {
    if (pauseFlagBtn.current) return;
    pauseFlagMouse.current = false;
  };
  const mouseOutHandler = () => {
    if (pauseFlagBtn.current) return;
    pauseFlagMouse.current = true;
  };

  useEffect(() => {
    if (myStories.length > 0 && Object.keys(followingUserList).length === 0) {
      setFirstReel(myStories[0]);
      setLastReel(myStories[myStories.length - 1]);
    } else {
      setFirstReel(storyViewer[0]);
      const lastData = followingUserList?.at(-1);
      if (lastData) setLastReel(Object.values(lastData!)[0].at(-1));
    }
  }, [myStories, storyViewer]);

  const handleClickNext = () => {
    changeStoryIndexHandler(1);
  };

  const handleClickBack = () => {
    changeStoryIndexHandler(-1);
  };
  return (
    <>
      <div
        className="absolute left-[360px] top-0 w-[calc(100vw-360px)] h-[calc(100vh-125px)] bg-black"
        onMouseMove={mouseMoveHandler}
        onMouseOut={mouseOutHandler}
      >
        {firstReel !== storyViewer[storyIndex] && (
          <div
            className="absolute top-[45%] left-[30%] w-[48px] h-[48px] rounded-full flex items-center justify-center cursor-pointer bg-[#6a6a6a] hover:bg-white hover:translate-x-[-8px]"
            onClick={handleClickBack}
          >
            <IoIosArrowBack size={30} color="#2a2b2d" />
          </div>
        )}
        {lastReel !== storyViewer[storyIndex] && (
          <div
            className="absolute top-[45%] right-[30%] w-[48px] h-[48px] rounded-full flex items-center justify-center cursor-pointer bg-[#6a6a6a] hover:bg-white hover:translate-x-2"
            onClick={handleClickNext}
          >
            <IoIosArrowForward size={30} color="#2a2b2d" />
          </div>
        )}

        <div className="absolute w-[265px] h-[calc(100vh-150px)] top-3 bottom-[68px] left-[50%] translate-x-[-50%] rounded-lg flex items-center justify-center cursor-pointer bg-[#242526] overflow-hidden">
          <div className="absolute flex item-center justify-between gap-1 top-3 ml-3 mr-3 w-[calc(100%-24px)] h-1">
            {Array.from({ length: storyViewer.length }, (_, i) => (
              <ProgressTimeout
                key={i}
                idReel={i}
                storyIndex={storyIndex}
                pauseFlagMouse={pauseFlagMouse}
              />
            ))}
          </div>
          <div className="absolute top-0 left-0 w-full h-full">
            {Array.from({ length: storyViewer.length }, (_, i) => (
              <ImageReel
                key={i}
                idReel={i}
                storyIndex={storyIndex}
                pauseFlagMouse={pauseFlagMouse}
                storyViewer={storyViewer}
              />
            ))}
          </div>
          <div className="absolute top-[28px] left-3 w-[calc(100%-24px)] h-10 flex items-center justify-between z-20">
            <div className="flex items-center gap-3 ">
              <div className="w-10 h-10">
                <img
                  src={storyViewer[0]?.user?.avatar || ""}
                  alt="logo"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div className="flex items-center h-5">
                <div className="text-[13px] text-white line-clamp-1 w-[52px] text-ellipsis font-semibold">
                  {`${storyViewer[0]?.user?.lastName} ${storyViewer[0]?.user?.firstName}`}
                </div>
                <div className="flex items-center text-[12px] text-white gap-[2px]">
                  <div className="inline-block whitespace-nowrap">
                    {formatTimeAgo(`${storyViewer[0]?.createdAt}`)?.replace(
                      " trước",
                      ""
                    )}
                  </div>
                  <BiWorld size={12} />
                </div>
              </div>
            </div>
            <ChangeStateAction
              pauseFlagMouse={pauseFlagMouse}
              pauseFlagBtn={pauseFlagBtn}
            />
          </div>
          {isShowViewer && (
            <ShowViewerStory setIsShowViewer={setIsShowViewer} />
          )}
        </div>
      </div>
      {!isShowViewer && (
        <div className="absolute left-[360px] top-[87.5%] h-[70px] w-[calc(100vw-360px)] text-white bg-black">
          <div
            className="flex flex-col items-start absolute left-[45%] top-[30%] translate-x-[-50%] translate-y-[-50%] cursor-pointer"
            onClick={() => setIsShowViewer(true)}
          >
            <MdKeyboardArrowUp size={24} color="white" />
            <span className="text-white text-[16px]">Chưa có người xem</span>
          </div>
        </div>
      )}
    </>
  );
};

export default StoryViewer;
