import { postResponseType } from "@/apis/postApi";
import { PostContext } from "@/context/PostContext";
import { memo, useContext } from "react";
import { Link } from "react-router-dom";

const DisplayImages = ({
  post,
  selectImageList,
}: {
  selectImageList: string[];
  post: postResponseType;
}) => {
  const { isHoverLike, setIsHoverLike, postClickImage, setPostClickImage } =
    useContext(PostContext);

  return (
    <>
      {!postClickImage && (
        <div className="w-full h-auto">
          {selectImageList.length === 1 && (
            <Link
              to={`/post/${post?.id}`}
              className="w-auto h-auto cursor-pointer"
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
                src={selectImageList[0]}
                alt="anh"
                className="w-full h-full rounded-lg object-cover"
              />
            </Link>
          )}
          {selectImageList.length === 2 && (
            <Link
              to={`/post/${post?.id}`}
              className="grid grid-cols-2 h-full gap-[2px]"
            >
              {selectImageList.map((item, idx) => (
                <div
                  key={idx}
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
                    src={item}
                    alt={`image${idx}`}
                    className="border border-[#e0e0e0] h-full object-contain cursor-pointer"
                  />
                </div>
              ))}
            </Link>
          )}
          {selectImageList.length === 3 && (
            <Link
              to={`/post/${post?.id}`}
              className="grid grid-cols-2 gap-[2px] h-[466px]"
            >
              <div
                className="w-full col-span-2 h-auto overflow-y-hidden"
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
                  src={selectImageList[0]}
                  alt="anh"
                  className="border border-[#e0e0e0] w-full object-cover cursor-pointer"
                />
              </div>
              {selectImageList.slice(1, 3).map((item, idx) => (
                <div
                  key={idx}
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
                    src={item}
                    alt="anh"
                    className="border border-[#f1f1f1] h-auto object-contain cursor-pointer"
                  />
                </div>
              ))}
            </Link>
          )}
          {selectImageList.length === 4 && (
            <Link
              to={`/post/${post?.id}`}
              className="grid grid-cols-2 grid-rows-2 h-[388.333px]"
              onClick={() => {
                setIsHoverLike({
                  ...isHoverLike,
                  isClickTabComment: true,
                  postId: post.id,
                });
                setPostClickImage(post);
              }}
            >
              {selectImageList.map((item, idx) => (
                <div key={idx} className="col-span-1 h-auto">
                  <img
                    src={item}
                    alt={`image${idx}`}
                    className="w-full h-full rounded-lg object-cover"
                  />
                </div>
              ))}
            </Link>
          )}
          {selectImageList.length >= 5 && (
            <Link
              to={`/post/${post?.id}`}
              className="grid grid-rows-2 h-[388.333px]"
              onClick={() => {
                setIsHoverLike({
                  ...isHoverLike,
                  isClickTabComment: true,
                  postId: post.id,
                });
                setPostClickImage(post);
              }}
            >
              <div className="grid grid-cols-2">
                {selectImageList.slice(0, 2)?.map((item, idx) => (
                  <div key={idx}>
                    <img
                      src={item}
                      alt={`image${idx}`}
                      className="col-span-1 rounded-lg h-full object-cover w-full"
                    />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3">
                {selectImageList
                  .slice(2, selectImageList.length)
                  .map((item, idx) => (
                    <>
                      <div
                        key={idx}
                        className={`${
                          idx === 2 ? "relative bg-[#83828C]" : ""
                        } ${idx > 2 && "hidden"}`}
                      >
                        <img
                          src={item}
                          alt={`image${idx}`}
                          className="col-span-1 rounded-lg h-full w-full object-cover"
                        />
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
            </Link>
          )}
        </div>
      )}
    </>
  );
};

export default memo(DisplayImages);
