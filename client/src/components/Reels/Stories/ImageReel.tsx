import { storyDataType } from "@/types";
import { useEffect, useRef } from "react";

interface ProgressTimeoutProps {
  storyIndex: number;
  idReel: number;
  pauseFlagMouse: React.MutableRefObject<boolean>;
  storyViewer: storyDataType[];
}
const ImageReel = ({
  storyIndex,
  idReel,
  pauseFlagMouse,
  storyViewer,
}: ProgressTimeoutProps) => {
  const intervalImage = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalImage.current = setInterval(() => {
      let newValue = 0;
      if (!pauseFlagMouse.current) {
        newValue++;
        if (newValue >= 100) {
          clearInterval(intervalImage.current!);
          newValue = 100;
        }

        return newValue;
      }
    }, 100);
    return () => {
      if (intervalImage.current) {
        clearInterval(intervalImage.current);
      }
    };
  }, [storyIndex, pauseFlagMouse]);

  return (
    <>
      <div
        className="absolute inset-0"
        style={{
          display: idReel === storyIndex ? "block" : "none",
        }}
      >
        <img
          src={storyViewer[idReel]?.thumbnail_url || ""}
          alt="anhquadep"
          className="w-full h-full"
        />
      </div>
    </>
  );
};

export default ImageReel;
