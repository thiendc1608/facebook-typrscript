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
import { useContext, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { PostContext } from "@/context/PostContext";
import { useLocation } from "react-router-dom";

const ShowImage = ({
  showImage,
}: {
  showImage: {
    isShowImage?: boolean;
    listImage: string[];
  };
}) => {
  const { idImage } = useSelector(
    (state: { message: messageSliceType }) => state.message
  );
  const { postClickImage } = useContext(PostContext);
  const swiperRef = useRef<SwiperRef>(null);

  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slideTo(idImage || location?.state?.indexImage);
    }
  }, [idImage, location]);

  const handleThumbnailClick = (index: number) => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slideTo(index);
    }
    dispatch(setIdImage(index));
  };

  return (
    <>
      <style>{`.swiper-slide { width: 100% !important } `}</style>
      {!postClickImage && (
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
        </>
      )}
      <Swiper
        slidesPerView={1}
        className="absolute top-[-30px]"
        navigation={true}
        modules={[Navigation]}
        ref={swiperRef}
      >
        {showImage.listImage &&
          showImage.listImage.length > 0 &&
          showImage.listImage.map((img, idx) => (
            <SwiperSlide key={`${img}-${idx}`} className="p-[6px] h-full">
              <div
                className={cn(
                  "m-auto w-full h-full flex items-center justify-center",
                  postClickImage && "h-screen mt-4 w-auto"
                )}
              >
                {img.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                  // Hiển thị ảnh
                  <img
                    loading="lazy"
                    src={img}
                    alt="anh"
                    className={cn(
                      "aspect-[4/3] object-contain",
                      postClickImage && "aspect-[1/1]"
                    )}
                  />
                ) : (
                  // Hiển thị video
                  <video
                    width="100%"
                    controls
                    muted
                    autoPlay
                    className="h-full"
                  >
                    <source src={img} type="video/mp4" />
                  </video>
                )}
              </div>
            </SwiperSlide>
          ))}
      </Swiper>
    </>
  );
};

export default ShowImage;
