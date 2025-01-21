import DetailInformation from "@/components/ProfilePage/DetailInformation";
import FriendsTab from "@/components/ProfilePage/FriendsTab";
import ImageVideoProfile from "@/components/ProfilePage/ImageVideoProfile";
import IntroduceTab from "@/components/ProfilePage/IntroduceTab";
import PersonalInfor from "@/components/ProfilePage/PersonalInfor";
import { postType, setListUserPost } from "@/redux/postSlice";
import { useAppDispatch } from "@/redux/store";
import { getUserCurrent } from "@/redux/userSlice";
import { postResponseType } from "@/types";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

const Profile = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const user_id = searchParams.get("id");
  const getItemTab = searchParams.get("sk");
  const { listAllPost } = useSelector(
    (state: { post: postType }) => state.post
  );
  const dispatchGetUser = useAppDispatch();

  const listPostUser = useCallback(() => {
    dispatchGetUser(getUserCurrent(user_id!));
    const filtered = listAllPost.filter(
      (el) => el.user_id === user_id
    ) as postResponseType[];
    dispatch(setListUserPost(filtered));
  }, [dispatch, listAllPost, user_id, dispatchGetUser]);

  // Gọi listPostUser khi component mount
  useEffect(() => {
    listPostUser();
  }, [listPostUser]);

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
