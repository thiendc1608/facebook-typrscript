import { PostContext } from "@/context/PostContext";
import { cn } from "@/lib/utils";
import { postResponseType } from "@/types";
import React, { useState, useEffect, useRef, useContext } from "react";
import { Link } from "react-router-dom";

interface VideoPostProps {
  post: postResponseType;
  media: string[];
}
const VideoPost = ({ post, media }: VideoPostProps) => {
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState<number | null>(
    media.findIndex((item) => item.includes("video")) // Tìm video đầu tiên trong bài post sẽ phát ngay
  );
  const { isHoverLike, setIsHoverLike, setPostClickImage } =
    useContext(PostContext);
  const mediaRefs = useRef(
    media.map(() => React.createRef<HTMLVideoElement>())
  ); // Tạo ref cho mỗi media

  useEffect(() => {
    if (
      currentPlayingIndex !== null &&
      mediaRefs.current[currentPlayingIndex]?.current
    ) {
      mediaRefs.current[currentPlayingIndex]?.current.play();
    }

    // Dừng video khác khi video đầu tiên đã phát
    if (currentPlayingIndex !== null) {
      mediaRefs.current.forEach((ref, index) => {
        if (
          index !== currentPlayingIndex &&
          ref.current &&
          !ref.current.paused
        ) {
          ref.current.pause();
        }
      });
    }
  }, [currentPlayingIndex]);

  const handlePlayPause = (index: number) => {
    if (currentPlayingIndex === index) {
      // Nếu video đã được phát, bấm lại để dừng
      mediaRefs.current[index]!.current!.pause();
      setCurrentPlayingIndex(null);
    } else {
      // Nếu không, phát video này và dừng video khác
      if (mediaRefs.current[index].current) {
        mediaRefs.current[index].current.play();
        setCurrentPlayingIndex(index);
      }
    }
  };

  const handleMouseEnter = (index: number) => {
    if (currentPlayingIndex !== index && mediaRefs.current[index].current) {
      // Nếu hover vào video khác thì dừng video trước và phát video mới
      if (currentPlayingIndex !== null) {
        mediaRefs.current[currentPlayingIndex].current!.pause();
      }
      mediaRefs.current[index].current.play();
      setCurrentPlayingIndex(index);
    }
  };

  const handleMouseLeave = () => {
    // Không làm gì khi hover ra ngoài post
  };

  return (
    <div
      className={cn(
        media.length === 2 && "flex flex-col h-[500px] gap-[4px]",
        (media.length === 3 || media.length >= 5) &&
          "grid grid-cols-2 gap-[4px] h-[500px]",
        media.length === 4 && "grid grid-cols-2 grid-rows-2 h-full gap-[4px]"
      )}
    >
      {media.length !== 3 &&
        media.length < 5 &&
        media.map((item, index) => {
          return (
            <React.Fragment key={index}>
              {item?.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                <Link
                  to={`/post/${post?.id}`}
                  className={cn(
                    "w-full h-auto hover:cursor-pointer",
                    media.length === 4 && "col-span-1"
                  )}
                  onClick={() => {
                    setIsHoverLike({
                      ...isHoverLike,
                      isClickTabComment: true,
                      postId: post.id,
                    });
                    setPostClickImage(post);
                  }}
                >
                  <img
                    loading="lazy"
                    src={item}
                    alt="anh"
                    className="w-full h-[250px] object-cover border border-solid border-[#f2f2f2]"
                  />
                </Link>
              ) : (
                <div className="w-full h-auto">
                  {/* Hiển thị video */}
                  <video
                    ref={
                      mediaRefs.current[0] as React.RefObject<HTMLVideoElement>
                    }
                    controls
                    muted
                    style={{ width: "100%", height: "100%" }}
                    onClick={() => handlePlayPause(0)} // Nhấn để phát/dừng video
                    onMouseEnter={() => handleMouseEnter(0)} // Khi di chuột vào video
                    onMouseLeave={handleMouseLeave} // Khi rời chuột khỏi video
                  >
                    <source src={media[0]} type="video/mp4" />
                  </video>
                </div>
              )}
            </React.Fragment>
          );
        })}
      {media.length === 3 && (
        <>
          {media[0]?.match(/\.(jpeg|jpg|png|gif)$/i) ? (
            <Link
              to={`/post/${post?.id}`}
              className="w-full h-auto overflow-y-hidden"
              onClick={() => {
                setIsHoverLike({
                  ...isHoverLike,
                  isClickTabComment: true,
                  postId: post.id,
                });
                setPostClickImage(post);
              }}
            >
              <img
                loading="lazy"
                src={media[0]}
                alt="anh"
                className="w-full h-full rounded-lg object-cover"
              />
            </Link>
          ) : (
            <div className="w-full h-auto">
              {/* Hiển thị video */}
              <video
                ref={mediaRefs.current[0] as React.RefObject<HTMLVideoElement>}
                controls
                muted
                style={{ width: "100%", height: "100%" }}
                onClick={() => handlePlayPause(0)} // Nhấn để phát/dừng video
                onMouseEnter={() => handleMouseEnter(0)} // Khi di chuột vào video
                onMouseLeave={handleMouseLeave} // Khi rời chuột khỏi video
              >
                <source src={media[0]} type="video/mp4" />
              </video>
            </div>
          )}
          <div className="flex gap-[2px] w-full h-auto">
            {media.slice(1, 3).map((item, index) => (
              <>
                {item?.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                  <Link
                    to={`/post/${post?.id}`}
                    className="w-full max-h-[210px] overflow-y-hidden"
                  >
                    <img
                      loading="lazy"
                      src={item}
                      alt="anh"
                      className="w-full h-full rounded-lg object-cover"
                    />
                  </Link>
                ) : (
                  <div className="w-full h-auto">
                    {/* Hiển thị video */}
                    <video
                      ref={
                        mediaRefs.current[
                          index
                        ] as React.RefObject<HTMLVideoElement>
                      }
                      controls
                      muted
                      style={{ width: "100%", height: "100%" }}
                      onClick={() => handlePlayPause(index)} // Nhấn để phát/dừng video
                      onMouseEnter={() => handleMouseEnter(index)} // Khi di chuột vào video
                      onMouseLeave={handleMouseLeave} // Khi rời chuột khỏi video
                      data-index={index}
                    >
                      <source src={item} type="video/mp4" />
                    </video>
                  </div>
                )}
              </>
            ))}
          </div>
        </>
      )}
      {media.length >= 5 && (
        <>
          <div className="grid grid-rows-2 gap-1 h-[500px]">
            {media.slice(0, 2).map((item, index) => (
              <>
                {item?.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                  <Link
                    to={`/post/${post?.id}`}
                    className="w-full max-h-[210px] border border-solid border-[#f2f2f2]"
                    onClick={() => {
                      setIsHoverLike({
                        ...isHoverLike,
                        isClickTabComment: true,
                        postId: post.id,
                      });
                      setPostClickImage(post);
                    }}
                  >
                    <img
                      loading="lazy"
                      src={item}
                      alt="anh"
                      className="w-full h-full object-cover"
                    />
                  </Link>
                ) : (
                  <div className="w-full h-auto">
                    {/* Hiển thị video */}
                    <video
                      ref={
                        mediaRefs.current[
                          index
                        ] as React.RefObject<HTMLVideoElement>
                      }
                      controls
                      muted
                      style={{ width: "100%", height: "100%" }}
                      onClick={() => handlePlayPause(index)} // Nhấn để phát/dừng video
                      onMouseEnter={() => handleMouseEnter(index)} // Khi di chuột vào video
                      onMouseLeave={handleMouseLeave} // Khi rời chuột khỏi video
                    >
                      <source src={item} type="video/mp4" />
                    </video>
                  </div>
                )}
              </>
            ))}
          </div>
          <div className="grid grid-rows-3 gap-1 h-[500px]">
            {media.slice(2, media.length).map((item, idx) => (
              <>
                <div
                  key={idx}
                  className={` ${idx === 2 ? "relative bg-[#83828C]" : ""} ${
                    idx > 2 && "hidden"
                  }`}
                >
                  {item?.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                    <Link
                      to={`/post/${post?.id}`}
                      className="hover:cursor-pointer w-full max-h-[210px] border border-solid border-[#f2f2f2]"
                      onClick={() => {
                        setIsHoverLike({
                          ...isHoverLike,
                          isClickTabComment: true,
                          postId: post.id,
                        });
                        setPostClickImage(post);
                      }}
                    >
                      <img
                        loading="lazy"
                        src={item}
                        alt="anh"
                        className="w-full h-full object-cover"
                      />
                    </Link>
                  ) : (
                    // Hiển thị video
                    <video width="100%" controls className="h-full">
                      <source src={item} type="video/mp4" />
                    </video>
                  )}
                  {media.length > 5 && idx === 2 && (
                    <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                      <span className="text-white text-[40px]">
                        +{media.length - 4}
                      </span>
                    </div>
                  )}
                </div>
              </>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default VideoPost;
