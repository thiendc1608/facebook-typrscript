import { cn } from "@/lib/utils";
import "./Reel.css";
import { useState } from "react";
import { useSelector } from "react-redux";
import { reelType } from "@/types";
interface PreviewReelProps {
  imagePostReel?: File;
  isCreateText?: boolean;
}

const PreviewReel = ({ imagePostReel, isCreateText }: PreviewReelProps) => {
  const { selectBg, changeFont, typeTextReel } = useSelector(
    (state: { reel: reelType }) => state.reel
  );
  // const [isClickImage, setIsClickImage] = useState(false);
  const [isMouseMove, setIsMouseMove] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);

  const [initMouseX, setInitMouseX] = useState(0);
  const [initMouseY, setInitMouseY] = useState(0);

  const [initImageX, setInitImageX] = useState(0);
  const [initImageY, setInitImageY] = useState(0);
  const imageReel = document.getElementById("image_reel");
  const containerReel = document.getElementById("container_reel");
  // const rangeReel = document.getElementById("range") as HTMLInputElement;

  // const originalImageWidth = imageReel?.clientWidth ?? 0;
  // const originalImageHeight = imageReel?.clientHeight ?? 0;

  // const resize_image = () => {
  //   if (imageReel && rangeReel) {
  //     const w = imageReel.clientWidth;
  //     const h = imageReel.clientHeight;

  //     imageReel.style.width =
  //       (Number(rangeReel.value) / 10) * originalImageWidth + "px";
  //     imageReel.style.height =
  //       (Number(rangeReel.value) / 10) * originalImageHeight + "px";

  //     const w2 = imageReel.clientWidth;
  //     const h2 = imageReel.clientHeight;

  //     if (w - w2 != 0) {
  //       const diff = (w - w2) / 2;
  //       const diff2 = (h - h2) / 2;

  //       let x = imageReel.offsetLeft - containerReel!.offsetLeft + diff;
  //       let y = imageReel.offsetTop - containerReel!.offsetTop + diff2;
  //       if (x > 50) x = 50;
  //       if (y > 50) y = 50;
  //       const xlimit = containerReel!.clientWidth - imageReel!.clientWidth - 50;
  //       if (x < xlimit) x = xlimit;

  //       const ylimit =
  //         containerReel!.clientHeight - imageReel!.clientHeight - 50;
  //       if (y < ylimit) y = ylimit;
  //       imageReel.style.left = x + "px";

  //       imageReel.style.top = y + "px";
  //     }
  //   }
  // };
  // const resetImage = () => {
  //   let ratio;
  //   if (imageReel && containerReel) {
  //     if (
  //       (imageReel as HTMLImageElement).naturalWidth >
  //       (imageReel as HTMLImageElement).naturalHeight
  //     ) {
  //       ratio =
  //         (imageReel as HTMLImageElement).naturalWidth /
  //         (imageReel as HTMLImageElement).naturalHeight;
  //       imageReel!.style.height = `${containerReel?.clientHeight - 100}px`;
  //       imageReel!.style.width =
  //         `${(containerReel?.clientWidth - 100) * ratio}` + "px";
  //       imageReel!.style.top = 50 + "px";
  //       const extra = (imageReel.clientWidth - containerReel.clientWidth) / 2;
  //       imageReel!.style.left = extra * -1 + "px";
  //     } else {
  //       ratio =
  //         (imageReel as HTMLImageElement).naturalHeight /
  //         (imageReel as HTMLImageElement).naturalWidth;
  //       imageReel!.style.width = `${containerReel?.clientWidth - 100}px`;
  //       imageReel!.style.height =
  //         `${(containerReel?.clientHeight - 100) * ratio}` + "px";
  //       imageReel!.style.left = 50 + "px";
  //       const extra = (imageReel.clientHeight - containerReel.clientHeight) / 2;
  //       imageReel!.style.top = extra * -1 + "px";
  //     }
  //   }
  //   if (rangeReel) rangeReel.value = "10";
  // };

  // resetImage();

  const handleMouseMove = (event: React.MouseEvent) => {
    setIsMouseMove(true);
    if (isMouseMove && isMouseDown) {
      let x = event.clientX - initMouseX;
      let y = event.clientY - initMouseY;

      x = initImageX + x;
      y = initImageY + y;
      if (x > 50) x = 50;
      if (y > 50) y = 50;
      const xlimit = containerReel!.clientWidth - imageReel!.clientWidth - 50;
      if (x < xlimit) x = xlimit;

      const ylimit = containerReel!.clientHeight - imageReel!.clientHeight - 50;
      if (y < ylimit) y = ylimit;
      imageReel!.style.left = `${x}px`;
      imageReel!.style.top = `${y}px`;
    }
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    setIsMouseDown(true);
    setInitMouseX(event.clientX);
    setInitMouseY(event.clientY);
    console.log(imageReel!.offsetLeft);
    console.log({ containerReel });

    setInitImageX(imageReel!.offsetLeft - containerReel!.offsetLeft);
    setInitImageY(imageReel!.offsetTop - containerReel!.offsetTop);
  };

  return (
    <div className="absolute top-[56px] left-[24px] right-[24px] bottom-[32px] shadow-default">
      <div className="w-full h-full rounded-lg bg-white">
        <div className="pt-5 pb-1 px-4 text-[#050505] text-[15px] font-semibold">
          Xem trước
        </div>
        <div className="absolute top-[50px] left-[16px] right-[16px] bottom-[16px] rounded-lg bg-[#18191a]">
          {imagePostReel && (
            <>
              <div
                id="container_reel"
                className={cn(
                  "absolute w-[400px] top-4 left-[50%] translate-x-[-50%] h-[calc(100%-68px)] rounded-lg flex items-center justify-center cursor-pointer bg-[rgba(0,0,0,0.5)]"
                  // !isClickImage && "overflow-hidden"
                )}
                onMouseMove={(e: React.MouseEvent) => handleMouseMove(e)}
                onMouseOut={() => setIsMouseMove(false)}
                onMouseDown={(e: React.MouseEvent) => handleMouseDown(e)}
                onMouseUp={() => setIsMouseDown(false)}
              >
                <img
                  id="image_reel"
                  src={URL.createObjectURL(imagePostReel)}
                  alt="img_reel"
                  className="absolute w-full h-full object-cover"
                />
                <div id="cropper"></div>
              </div>

              {/* <div className="absolute left-[50%] bottom-0 translate-x-[-50%] w-full text-white text-[20px] text-center leading-[52px] flex justify-center">
            Chọn ảnh để cắt và xoay
          </div> */}
              <div className="absolute left-[50%] bottom-0 translate-x-[-50%] w-full text-white text-[20px] leading-[52px]">
                <input
                  type="range"
                  min={10}
                  max={40}
                  id="range"
                  value={15}
                  // onChange={resize_image}
                />
              </div>
            </>
          )}
          {isCreateText && (
            <div
              className={cn(
                "absolute w-[237.938px] top-3 bottom-3 left-[50%] translate-x-[-50%] rounded-lg flex items-center justify-center cursor-pointer overflow-hidden"
              )}
            >
              <img
                src={selectBg.srcImg}
                alt={`bgImage${selectBg.id}`}
                className="w-full h-full"
              />
              <div
                className={`absolute px-7 h-auto leading-[28px] text-[24px] text-white outline-none text-center font-semibold select-none whitespace-pre-wrap ${changeFont.font}`}
              >
                {typeTextReel ? typeTextReel : "Bắt đầu nhập"}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewReel;
