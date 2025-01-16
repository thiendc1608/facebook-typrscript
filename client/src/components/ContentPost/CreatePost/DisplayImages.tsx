import { PostContext } from "@/context/PostContext";
import { postResponseType } from "@/types";
import { useContext } from "react";
import VideoPost from "./VideoPost";

const DisplayImages = ({
  post,
  selectImageList,
}: {
  selectImageList: string[];
  post?: postResponseType;
}) => {
  const { postClickImage } = useContext(PostContext);

  return (
    <>
      {!postClickImage && (
        <div className="w-full h-[500px] border-t border-solid border-[#dddfe2]">
          {selectImageList.length === 1 &&
            (post ? (
              <VideoPost post={post} media={selectImageList} />
            ) : (
              <div className="w-auto h-auto hover:cursor-pointer brightness-75">
                {selectImageList[0]?.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                  // Hiển thị ảnh
                  <img
                    loading="lazy"
                    src={selectImageList[0]}
                    alt="anh"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  // Hiển thị video
                  <video width="100%" height="100%" controls>
                    <source src={selectImageList[0]} type="video/mp4" />
                  </video>
                )}
              </div>
            ))}
          {selectImageList.length === 2 &&
            (post ? (
              <VideoPost post={post} media={selectImageList} />
            ) : (
              <div className="flex flex-col h-full gap-[2px]">
                {selectImageList.map((item, idx) => (
                  <div
                    key={idx}
                    className="w-full h-full hover:cursor-pointer brightness-75"
                  >
                    {item?.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                      // Hiển thị ảnh
                      <img
                        loading="lazy"
                        src={item}
                        alt="anh"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      // Hiển thị video
                      <video width="100%" height="100%" controls>
                        <source src={item} type="video/mp4" />
                      </video>
                    )}
                  </div>
                ))}
              </div>
            ))}
          {selectImageList.length === 3 &&
            (post ? (
              <VideoPost post={post} media={selectImageList} />
            ) : (
              <div className="grid grid-rows-2 gap-[2px] h-full">
                <div className="w-full row-auto hover:cursor-pointer brightness-75">
                  {selectImageList[0]?.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                    // Hiển thị ảnh
                    <img
                      loading="lazy"
                      src={selectImageList[0]}
                      alt="anh"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    // Hiển thị video
                    <video width="100%" controls className="h-full">
                      <source src={selectImageList[0]} type="video/mp4" />
                    </video>
                  )}
                </div>
                <div className="flex gap-[2px] w-full h-full">
                  {selectImageList.slice(1, 3).map((item, idx) => (
                    <div
                      key={idx}
                      className="w-full h-full overflow-y-hidden hover:cursor-pointer brightness-75"
                    >
                      {item?.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                        // Hiển thị ảnh
                        <img
                          loading="lazy"
                          src={item}
                          alt="anh"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        // Hiển thị video
                        <video width="100%" controls className="h-full">
                          <source src={item} type="video/mp4" />
                        </video>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          {selectImageList.length === 4 &&
            (post ? (
              <VideoPost post={post} media={selectImageList} />
            ) : (
              <div className="grid grid-cols-2 grid-rows-2 h-full gap-[2px]">
                {selectImageList.map((item, idx) => (
                  <div
                    key={idx}
                    className="col-span-1 h-full hover:cursor-pointer brightness-75"
                  >
                    {item?.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                      // Hiển thị ảnh
                      <img
                        loading="lazy"
                        src={item}
                        alt="anh"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      // Hiển thị video
                      <video width="100%" controls className="h-full">
                        <source src={item} type="video/mp4" />
                      </video>
                    )}
                  </div>
                ))}
              </div>
            ))}
          {selectImageList.length >= 5 &&
            (post ? (
              <VideoPost post={post} media={selectImageList} />
            ) : (
              <div className="grid grid-cols-2 gap-1 h-full">
                <div className="grid grid-rows-2 gap-1">
                  {selectImageList.slice(0, 2)?.map((item, idx) => (
                    <div
                      key={idx}
                      className="hover:cursor-pointer brightness-75"
                    >
                      {item?.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                        // Hiển thị ảnh
                        <img
                          loading="lazy"
                          src={item}
                          alt="anh"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        // Hiển thị video
                        <video width="100%" controls className="h-full">
                          <source src={item} type="video/mp4" />
                        </video>
                      )}
                    </div>
                  ))}
                </div>
                <div className="grid grid-rows-3 gap-1">
                  {selectImageList
                    .slice(2, selectImageList.length)
                    .map((item, idx) => (
                      <>
                        <div
                          key={idx}
                          className={`hover:cursor-pointer brightness-75 ${
                            idx === 2 ? "relative bg-[#83828C]" : ""
                          } ${idx > 2 ? "hidden" : ""} h-full`}
                        >
                          {item?.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                            // Hiển thị ảnh
                            <img
                              loading="lazy"
                              src={item}
                              alt="anh"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            // Hiển thị video
                            <video width="100%" controls className="h-full">
                              <source src={item} type="video/mp4" />
                            </video>
                          )}
                          {selectImageList.length > 5 && idx === 2 && (
                            <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                              <span className="text-white text-[40px]">
                                +{selectImageList.length - 4}
                              </span>
                            </div>
                          )}
                        </div>
                      </>
                    ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </>
  );
};

export default DisplayImages;
