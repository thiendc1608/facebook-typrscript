import { FaEarthAmericas, FaLock } from "react-icons/fa6";
import { BsThreeDots } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { GoComment } from "react-icons/go";
import { PiShareFatLight } from "react-icons/pi";
import { formatTimeAgo } from "@/utils/helpers";
import { Link, useLocation } from "react-router-dom";
import parse from "html-react-parser";
import DisplayImages from "../CreatePost/DisplayImages";
import { FaUserFriends } from "react-icons/fa";
import ReactEmotionPost from "./ReactEmotionPost";
import CommentPost from "./CommentPost";
import { postType } from "@/redux/postSlice";
import { useSelector } from "react-redux";
import { commentType } from "@/redux/commentSlice";
import { useContext, useEffect } from "react";
import { SocketContext } from "@/context/SocketContext";
import { PostContext } from "@/context/PostContext";
import { cn } from "@/lib/utils";
import { postResponseType } from "@/types";
import ShowEmotionCountPost from "./ShowEmotionCountPost";

const ShowOnlyPost = ({ item }: { item: postResponseType }) => {
  const location = useLocation();
  const { socket } = useContext(SocketContext)!;
  const { tagUserList, locationTag } = useSelector(
    (state: { post: postType }) => state.post
  );
  const { listComment } = useSelector(
    (state: { comment: commentType }) => state.comment
  );
  const {
    isHoverLike,
    postClickImage,
    setPostClickImage,
    contentRefs,
    handleClickTabComment,
  } = useContext(PostContext);

  useEffect(() => {
    if (location.pathname === "/") {
      setPostClickImage(null);
    }
  }, [setPostClickImage, location]);

  return (
    <div
      className={cn(
        "rounded-lg bg-white border",
        postClickImage && "overflow-y-auto"
      )}
    >
      <div className="px-3 pt-3 mb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link
              to={{
                pathname: "/profile",
                search: `?id=${item?.id}`,
              }}
              className="w-[40px] h-[40px] cursor-pointer"
            >
              <img
                src={item?.userOwnPost.avatar}
                alt="anh"
                className="w-full h-full rounded-full object-cover hover:brightness-90"
              />
            </Link>
            <div className="flex flex-col gap-1">
              <div className="text-[#050505] text-[15px] cursor-pointer break-words">
                <Link
                  to={{
                    pathname: "/profile",
                    search: `?id=${item?.id}`,
                  }}
                  className="text-[15px] text-[#080809] hover:underline cursor-pointer font-semibold"
                >
                  {`${item?.userOwnPost.lastName} ${item?.userOwnPost.firstName}`}
                </Link>
                {locationTag && (
                  <span>
                    đang ở
                    <span
                      className="hover:underline cursor-pointer font-semibold"
                      // onClick={() => {
                      //   dispatch(setCheckIn(1));
                      // }}
                    >
                      {locationTag.name}
                    </span>
                  </span>
                )}
                {tagUserList.listTag?.length > 0 && (
                  <span>
                    {" "}
                    cùng với{" "}
                    {tagUserList.listTag.map((tag, index) => (
                      <span
                        key={index}
                        className="hover:underline cursor-pointer font-semibold mr-2"
                        // onClick={() => {
                        //   dispatch(
                        //     addTagName({
                        //       ...tagUserList,
                        //       isTagName: true,
                        //     })
                        //   );
                        // }}
                      >
                        {tag.lastName + " " + tag.firstName}
                      </span>
                    ))}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-[13px] text-[#65686c] h-4">
                <span>{formatTimeAgo(item?.createdAt, true)}</span>
                <span>.</span>
                <span>
                  {item?.post_object === "Public" ? (
                    <FaEarthAmericas />
                  ) : item?.post_object === "Friend" ? (
                    <FaUserFriends />
                  ) : (
                    <FaLock />
                  )}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-9 h-9 flex items-center justify-center cursor-pointer">
              <BsThreeDots size={26} />
            </div>
            {!postClickImage && (
              <div className="w-9 h-9 flex items-center justify-center cursor-pointer">
                <IoMdClose size={26} />
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Content Post */}
      {item?.post_content && (
        <div className="w-full h-auto">
          <p className="text-[16px] leading-[26px] text-[#080809] py-1 pb-2 px-3">
            {parse(item?.post_content)}
          </p>
        </div>
      )}
      {item?.imageInfo.message_image && (
        <DisplayImages
          selectImageList={JSON.parse(item?.imageInfo.message_image)}
          post={item}
        />
      )}
      <div className="px-3">
        <div
          className={cn(
            "flex items-center h-[37px] border-b",
            !postClickImage && "border-t border-solid border-[#d9d9d9]"
          )}
        >
          <ShowEmotionCountPost postId={item?.id} />
          <div className="flex items-center gap-1 ml-auto">
            {listComment &&
              listComment?.filter((comment) => comment.post_id === item?.id)
                .length > 0 && (
                <div className="flex items-center gap-[2px] cursor-pointer">
                  <span className="text-[#65676c] text-[15px] ">
                    {
                      listComment?.filter(
                        (comment) => comment.post_id === item?.id
                      ).length
                    }
                  </span>
                  <GoComment size={20} />
                </div>
              )}
            <div className="flex items-center gap-[2px] cursor-pointer">
              <span className="text-[#65676c] text-[15px]">14</span>
              <PiShareFatLight size={20} />
            </div>
          </div>
        </div>
      </div>

      {/*  */}
      <div className="px-2 flex items-center">
        <ReactEmotionPost socket={socket} postId={item?.id} />
        <div className="flex-1 px-2">
          <div
            className="my-1 cursor-pointer hover:bg-[#F2F2F2] flex items-center justify-center rounded-lg"
            onClick={(e: React.MouseEvent<HTMLDivElement>) =>
              handleClickTabComment(e, item)
            }
          >
            <div className="py-[6px] px-1">
              <GoComment size={20} />
            </div>
            {!postClickImage && (
              <span className="py-[6px] px-1 text-[#65686c] text-[15px]">
                Bình luận
              </span>
            )}
          </div>
        </div>
        <div className="flex-1 px-2">
          <div className="my-1 cursor-pointer hover:bg-[#F2F2F2] flex items-center justify-center rounded-lg">
            <div className="py-[6px] px-1">
              <PiShareFatLight size={20} />
            </div>
            {!postClickImage && (
              <span className="py-[6px] px-1 text-[#65686c] text-[15px]">
                Chia sẻ
              </span>
            )}
          </div>
        </div>
      </div>

      {isHoverLike.isClickTabComment && isHoverLike.postId === item?.id && (
        <CommentPost
          item={item}
          ref={(el) => {
            if (contentRefs.current) {
              // Add null check here
              contentRefs.current[item?.id] = el;
            }
          }}
          postId={item?.id}
        />
      )}
    </div>
  );
};

export default ShowOnlyPost;
