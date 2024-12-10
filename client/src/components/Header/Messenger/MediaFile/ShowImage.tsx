import { useDispatch, useSelector } from "react-redux";
import { Swiper, SwiperSlide, SwiperRef } from "swiper/react";
import { Navigation } from "swiper/modules";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import {
  messageSliceType,
  setIdImage,
  setShowImage,
} from "@/redux/messageSlice";
import { IoMdClose } from "react-icons/io";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const ShowImage = () => {
  const { showImage, idImage } = useSelector(
    (state: { message: messageSliceType }) => state.message
  );

  const dispatch = useDispatch();
  const swiperRef = useRef<SwiperRef>(null);

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slideTo(idImage);
    }
  }, [idImage]);

  const handleThumbnailClick = (index: number) => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slideTo(index);
    }
    dispatch(setIdImage(index));
  };

  return (
    <>
      <div
        className="absolute top-2 right-6 w-9 h-9 rounded-full bg-[#282828] text-white flex items-center justify-center cursor-pointer z-[999]"
        onClick={(e) => {
          e.stopPropagation();
          dispatch(setShowImage({ ...showImage, isShowImage: false }));
          dispatch(setIdImage(0));
        }}
      >
        <IoMdClose size={24} />
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[52px] w-full flex items-center justify-center gap-3">
        {showImage.listImage?.map((image, idx) => (
          <div
            key={idx}
            className="w-[36px] h-[36px]"
            onClick={() => handleThumbnailClick(idx)}
          >
            <img
              key={idx}
              src={image}
              alt="anh"
              className={cn(
                "w-full h-full rounded-lg object-cover opacity-70 hover:opacity-100 cursor-pointer",
                idx === idImage ? "opacity-100" : "opacity-50"
              )}
            />
          </div>
        ))}
      </div>
      <Swiper
        slidesPerView={1}
        className="mySwiper absolute top-[-30px]"
        navigation={true}
        modules={[Navigation]}
        ref={swiperRef}
      >
        {showImage.listImage.map((img, idx) => (
          <SwiperSlide key={idx} className="p-[6px] h-full">
            <div className="m-auto w-full h-full flex items-center justify-center">
              <img
                src={img}
                alt="anh"
                className="aspect-[4/3] object-contain"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default ShowImage;
