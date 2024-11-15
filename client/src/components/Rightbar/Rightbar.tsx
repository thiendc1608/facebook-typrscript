import { useEffect, useState } from "react";
import FriendSuggest from "./FriendSuggest";
import { UserType } from "@/types";
import { userAPI } from "@/apis/userApi";
import { useSelector } from "react-redux";
import { UserState } from "@/redux/userSlice";

const Rightbar = () => {
  const { currentUser } = useSelector(
    (state: { user: UserState }) => state.user
  );
  const [friendSuggestList, setFriendSuggestList] = useState<UserType[]>([]);

  useEffect(() => {
    const fetchOtherUser = async () => {
      try {
        const res = await userAPI.getOtherUsers(currentUser!.id);
        if (res?.success) {
          setFriendSuggestList(res.allUser);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchOtherUser();
  }, [currentUser]);

  return (
    <>
      <FriendSuggest
        friendSuggestList={friendSuggestList}
        setFriendSuggestList={setFriendSuggestList}
      />
    </>
  );
};

export default Rightbar;
