import { useEffect, useRef, useState } from "react";

interface ProgressTimeoutProps {
  storyIndex: number;
  idReel: number;
  pauseFlagMouse: React.MutableRefObject<boolean>;
}
const ProgressTimeout = ({
  storyIndex,
  idReel,
  pauseFlagMouse,
}: ProgressTimeoutProps) => {
  const [value, setValue] = useState(0);
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setValue(0);
    interval.current = setInterval(() => {
      let newValue = 0;
      if (!pauseFlagMouse.current) {
        setValue((prevValue) => {
          newValue = prevValue + 1;

          if (newValue >= 100) {
            clearInterval(interval.current!);
            newValue = 100;
          }

          return newValue;
        });
      }
    }, 100);
    return () => {
      if (interval.current) {
        clearInterval(interval.current);
      }
    };
  }, [storyIndex, pauseFlagMouse]);

  return (
    <>
      <div className="flex-1 relative top-0 ml-0 mr-0 w-[50%] h-full rounded-lg bg-[rgba(255,255,255,0.6)] z-20">
        <div
          style={{
            width:
              idReel === storyIndex
                ? `${value}%`
                : idReel > storyIndex
                ? `0%`
                : "100%",
          }}
          className="relative h-full rounded-lg bg-[rgba(255,255,255,0.9)]"
        ></div>
      </div>
    </>
  );
};

export default ProgressTimeout;
