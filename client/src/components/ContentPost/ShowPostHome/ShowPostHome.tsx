import { useDispatch, useSelector } from "react-redux";
import { useContext, useEffect, useState } from "react";
import {
  postType,
  setReactEmotionPost,
  updateReactEmotionPost,
} from "@/redux/postSlice";
import { SocketContext } from "@/context/SocketContext";
import { getAllComment } from "@/redux/commentSlice";
import ShowPostSkeleton from "@/components/Skeleton/ShowPostSkeleton";
import { useAppDispatch } from "@/redux/store";
import { getAllPost } from "@/redux/postSlice";
import ShowOnlyPost from "./ShowOnlyPost";
import { v4 as uuidv4 } from "uuid";
import { emotionCommentType } from "@/apis/commentApi";

const ShowPostHome = () => {
  const dispatch = useDispatch();
  const dispatchGetData = useAppDispatch();
  const { socket } = useContext(SocketContext)!;
  const [start, setStart] = useState(0); // Điểm bắt đầu
  const limit = 3; // Mỗi lần lấy 3 bài đăng

  const { listPost, isLoadingPost, endOfDataPost } = useSelector(
    (state: { post: postType }) => state.post
  );

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight; // Vị trí cuộn hiện tại
      const bottomPosition = document.documentElement.scrollHeight; // Vị trí cuối trang

      // Nếu cuộn gần đến cuối trang, gọi loadPosts
      if (scrollPosition >= bottomPosition - 100 && !endOfDataPost) {
        setStart((prev) => prev + 1);
      }
    };

    // Gắn sự kiện cuộn khi component được mount
    window.addEventListener("scroll", handleScroll);

    // Cleanup khi component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [endOfDataPost]);

  useEffect(() => {
    // Gọi action getAllPost khi `start` thay đổi
    if (!endOfDataPost) {
      dispatchGetData(getAllPost({ offset: start * limit, limit }));
      dispatchGetData(getAllComment());
    }
  }, [dispatchGetData, start, endOfDataPost]);

  useEffect(() => {
    if (!socket) {
      console.log("Socket is undefined or not connected");
      return;
    }

    const handleCreateReactPost = (data: { data: emotionCommentType }) => {
      dispatch(
        setReactEmotionPost({
          post_id: data.data.post_id,
          emotion: data.data.emotion,
          userInfo: data.data.userInfo,
        })
      );
    };

    const handleUpdateReactPost = (data: { data: emotionCommentType }) => {
      console.log(data);
      dispatch(
        updateReactEmotionPost({
          post_id: data.data.post_id,
          emotion: data.data.emotion,
          userInfo: data.data.userInfo,
        })
      );
    };
    socket?.off("create_react_post", handleCreateReactPost);
    socket?.off("update_react_post", handleUpdateReactPost);

    socket?.on("create_react_post", handleCreateReactPost);
    socket?.on("update_react_post", handleUpdateReactPost);

    return () => {
      socket?.off("create_react_post", handleCreateReactPost);
      socket?.off("update_react_post", handleUpdateReactPost);
    };
  }, [socket, dispatch]);

  return (
    <div className="flex flex-col gap-5">
      {isLoadingPost && (
        <div className="flex flex-col gap-3">
          <ShowPostSkeleton count_post={3} />
        </div>
      )}
      {listPost &&
        listPost.length > 0 &&
        listPost.map((item) => (
          <div key={uuidv4()}>
            <ShowOnlyPost item={item} />
          </div>
        ))}
    </div>
  );
};

export default ShowPostHome;
