import { emotionCommentType } from "@/apis/commentApi";
import DetailInformation from "@/components/ProfilePage/DetailInformation";
import FriendsTab from "@/components/ProfilePage/FriendsTab";
import ImageVideoProfile from "@/components/ProfilePage/ImageVideoProfile";
import IntroduceTab from "@/components/ProfilePage/IntroduceTab";
import PersonalInfor from "@/components/ProfilePage/PersonalInfor";
import { SocketContext } from "@/context/SocketContext";
import {
  postType,
  setListUserPost,
  setReactEmotionPost,
  updateReactEmotionPost,
} from "@/redux/postSlice";
import { useAppDispatch } from "@/redux/store";
import { getUserCurrent } from "@/redux/userSlice";
import { postResponseType } from "@/types";
import { useCallback, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

const Profile = () => {
  const dispatch = useDispatch();
  const { socket } = useContext(SocketContext)!;
  const [searchParams] = useSearchParams();
  const user_id = searchParams.get("id");
  const getItemTab = searchParams.get("sk");
  const { allPost } = useSelector((state: { post: postType }) => state.post);
  const dispatchGetUser = useAppDispatch();

  const listPostUser = useCallback(() => {
    const filtered = allPost.listAllPost.filter(
      (el) => el.user_id === user_id
    ) as postResponseType[];
    dispatch(setListUserPost(filtered));
  }, [dispatch, allPost, user_id]);

  // Gọi listPostUser khi component mount
  useEffect(() => {
    if (user_id) {
      dispatchGetUser(getUserCurrent(user_id)); // lưu redis
      listPostUser();
    }
  }, [dispatchGetUser, user_id, listPostUser]);

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
      dispatch(
        updateReactEmotionPost({
          post_id: data.data.post_id,
          emotion: data.data.emotion,
          userInfo: data.data.userInfo,
        })
      );
    };

    socket?.off("create_react_post");
    socket?.off("update_react_post");

    socket?.on("create_react_post", handleCreateReactPost);
    socket?.on("update_react_post", handleUpdateReactPost);

    return () => {
      socket?.off("create_react_post");
      socket?.off("update_react_post");
    };
  }, [socket, dispatch]);

  return (
    <>
      <PersonalInfor />
      <div className="w-full bg-[#F2F4F7]">
        <div className="w-[67%] py-4 mx-auto flex gap-4 h-full">
          {getItemTab === null && <DetailInformation />}
          {getItemTab === "about" && <IntroduceTab />}
          {getItemTab === "friends" && <FriendsTab />}
          {getItemTab === "photos" && <ImageVideoProfile />}
        </div>
      </div>
    </>
  );
};

export default Profile;
