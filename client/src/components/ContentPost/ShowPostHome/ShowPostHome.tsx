import { FaEarthAmericas, FaLock } from "react-icons/fa6";
import { BsThreeDots } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { GoComment } from "react-icons/go";
import { PiShareFatLight } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { useContext, useEffect, useRef, useState } from "react";
import { reactEmotionPostType } from "@/types";
import {
  postType,
  removeReactEmotionPost,
  setListReactEmotionPost,
} from "@/redux/postSlice";
import { formatTimeAgo } from "@/utils/helpers";
import { Link } from "react-router-dom";
import parse from "html-react-parser";
import DisplayImages from "../CreatePost/DisplayImages";
import { FaUserFriends } from "react-icons/fa";
import { SocketContext } from "@/context/SocketContext";
import { postResponseType } from "@/apis/postApi";
import ReactEmotionPost from "./ReactEmotionPost";
import ShowEmotionCount from "./ShowEmotionCount";
import CommentPost from "./CommentPost";
import { commentType } from "@/redux/commentSlice";

const ShowPostHome = () => {
  const dispatch = useDispatch();
  const { socket } = useContext(SocketContext)!;
  const contentRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [isHoverLike, setIsHoverLike] = useState<{
    isClickTabComment: boolean;
    isHover: boolean;
    post: postResponseType | null;
  }>({
    isClickTabComment: false,
    isHover: false,
    post: null,
  });

  const { tagUserList, listPost, locationTag } = useSelector(
    (state: { post: postType }) => state.post
  );

  const { listComment } = useSelector(
    (state: { comment: commentType }) => state.comment
  );

  useEffect(() => {
    socket?.off("create_react_post");
    socket?.off("update_react_post");

    socket?.on("create_react_post", (data: { data: reactEmotionPostType }) => {
      dispatch(
        setListReactEmotionPost({
          id: data.data.id,
          user_id: data.data.user_id,
          post_id: data.data.post_id,
          emotion_id: data.data.emotion_id,
          emotion: {
            emotion_name: data.data.emotion.emotion_name,
            emotion_post: data.data.emotion.emotion_post,
          },
          userInfo: {
            firstName: data.data.userInfo.firstName,
            lastName: data.data.userInfo.lastName,
            avatar: data.data.userInfo.avatar,
          },
        })
      );
    });

    socket?.on("update_react_post", (data: { data: reactEmotionPostType }) => {
      console.log(data);

      dispatch(
        setListReactEmotionPost({
          id: data.data.id,
          user_id: data.data.user_id,
          post_id: data.data.post_id,
          emotion_id: data.data.emotion_id,
          emotion: {
            emotion_name: data.data.emotion.emotion_name,
            emotion_post: data.data.emotion.emotion_post,
          },
          userInfo: {
            firstName: data.data.userInfo.firstName,
            lastName: data.data.userInfo.lastName,
            avatar: data.data.userInfo.avatar,
          },
        })
      );
    });

    socket?.on(
      "remove_react",
      async (data: { user_id: string; post_id: string }) => {
        dispatch(
          removeReactEmotionPost({
            user_id: data.user_id,
            post_id: data.post_id,
          })
        );
      }
    );
    return () => {
      socket?.off("create_react_post");
      socket?.off("update_react_post");
    };
  }, [socket, dispatch]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>, postId: string) => {
    e.stopPropagation();
    // Focus vào input khi click vào div cha
    const inputElement = contentRefs.current[postId];
    if (inputElement) {
      inputElement.focus();
    }
    setIsHoverLike({ ...isHoverLike, isClickTabComment: true, post: null });
  };

  return (
    <div className="flex flex-col gap-5">
      {listPost.length > 0 &&
        listPost.map((item) => (
          <div key={item.id} className="rounded-lg bg-white border">
            <div className="px-3 pt-3 mb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Link
                    to={`/profile/${item.user_id}`}
                    className="w-[40px] h-[40px] cursor-pointer"
                  >
                    <img
                      src={item.userOwnPost.avatar}
                      alt="anh"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </Link>
                  <div className="flex flex-col gap-1">
                    <div className="text-[#050505] text-[15px] cursor-pointer">
                      <Link
                        to={`/profile/${item.user_id}`}
                        className="text-[15px] text-[#080809] hover:underline cursor-pointer"
                      >
                        {item.userOwnPost.last_name +
                          " " +
                          item.userOwnPost.first_name}
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
                          {tagUserList.listTag.map((item, index) => (
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
                              {item.lastName + " " + item.firstName}
                            </span>
                          ))}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-[13px] text-[#65686c] h-4">
                      <span>
                        {formatTimeAgo(item.createdAt)?.replace(" trước", "")}
                      </span>
                      <span>.</span>
                      <span>
                        {item.post_object === "Public" ? (
                          <FaEarthAmericas />
                        ) : item.post_object === "Friend" ? (
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
                  <div className="w-9 h-9 flex items-center justify-center cursor-pointer">
                    <IoMdClose size={26} />
                  </div>
                </div>
              </div>
            </div>
            {/* Content Post */}
            {item.post_content && (
              <div className="w-full h-auto">
                <p className="text-[16px] leading-[26px] text-[#080809] py-1 pb-2 px-3">
                  {parse(item.post_content)}
                </p>
              </div>
            )}
            {item.list_image && (
              <div className="w-full h-auto">
                <DisplayImages selectImageList={item.list_image} />
              </div>
            )}
            <div className="px-3">
              <div className="flex items-center h-[37px] border-b border-solid border-[#d9d9d9]">
                <ShowEmotionCount item={item} />
                <div className="flex items-center gap-1 ml-auto">
                  {listComment.length > 0 && (
                    <div className="flex items-center gap-[2px] cursor-pointer">
                      <span className="text-[#65676c] text-[15px] ">
                        {listComment.length}
                      </span>
                      <GoComment size={20} />
                    </div>
                  )}
                  <div className="flex items-center gap-[2px] cursor-pointer">
                    <span className="text-[#65676c] text-[15px] ">14</span>
                    <PiShareFatLight size={20} />
                  </div>
                </div>
              </div>
            </div>

            {/*  */}
            <div className="px-2 flex items-center">
              <ReactEmotionPost
                socket={socket}
                isHoverLike={isHoverLike}
                setIsHoverLike={setIsHoverLike}
                item={item}
              />
              <div className="flex-1 px-2">
                <div
                  className="my-1 cursor-pointer hover:bg-[#F2F2F2] flex items-center justify-center rounded-lg"
                  onClick={(e: React.MouseEvent<HTMLDivElement>) =>
                    handleClick(e, item.id)
                  }
                >
                  <div className="py-[6px] px-1">
                    <GoComment size={20} />
                  </div>
                  <span className="py-[6px] px-1 text-[#65686c] text-[15px]">
                    Bình luận
                  </span>
                </div>
              </div>
              <div className="flex-1 px-2">
                <div className="my-1 cursor-pointer hover:bg-[#F2F2F2] flex items-center justify-center rounded-lg">
                  <div className="py-[6px] px-1">
                    <PiShareFatLight size={20} />
                  </div>
                  <span className="py-[6px] px-1 text-[#65686c] text-[15px]">
                    Chia sẻ
                  </span>
                </div>
              </div>
            </div>
            <CommentPost
              ref={(el) => {
                contentRefs.current[item.id] = el; // Gán ref cho phần tử div trong CommentPost
              }}
              postId={item.id}
              isClickTabComment={isHoverLike.isClickTabComment}
            />
          </div>
        ))}
    </div>
  );
};

export default ShowPostHome;
