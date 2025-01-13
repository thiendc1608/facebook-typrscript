import { showModal } from "@/redux/modalSlice";
import { postType } from "@/redux/postSlice";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ShowEmojiDetail from "./ShowEmojiDetail";
import { EmotionPostData } from "@/types";

interface ShowEmotionCountProps {
  postId: string;
}

const ShowEmotionCount = ({ postId }: ShowEmotionCountProps) => {
  const dispatch = useDispatch();
  const { listPost } = useSelector((state: { post: postType }) => state.post);
  const filterListEmotion = listPost.find((el) => el.id === postId);
  const [isHoverShowUserReact, setIsHoverShowUserReact] = useState(false);

  const emotionPostData: EmotionPostData = {};

  return (
    <div
      className="relative flex items-center cursor-pointer"
      onMouseLeave={() => setIsHoverShowUserReact(false)}
      onMouseEnter={() => setIsHoverShowUserReact(true)}
      onClick={(e) => {
        e.stopPropagation();
        dispatch(
          showModal({
            isShowModal: true,
            childrenModal: (
              <ShowEmojiDetail
                data={emotionPostData}
                filterListEmotion={filterListEmotion!.listReactEmotionPost}
              />
            ),
          })
        );
      }}
    >
      {filterListEmotion!.listReactEmotionPost.map((el, idx) => (
        <div key={idx} className="flex items-center">
          <img
            src={Object.values(el)[0].emoji_post}
            alt="emoji_post"
            className="w-[17px] h-[17px]"
          />
        </div>
      ))}
      <span className="text-[#65676c] text-[15px] pl-1 cursor-pointer hover:underline">
        {filterListEmotion!.listReactEmotionPost.length > 0 &&
          filterListEmotion!.listReactEmotionPost.length}
      </span>
      {/* {isHoverShowUserReact && (
        <div className="absolute top-[-45px] right-[-40px] my-[2px] w-auto rounded-xl overflow-hidden z-[100]">
          <div className="p-3 bg-[#303030] text-white w-full h-auto">
            {filterListEmotion.map((user, idx) => (
              <div
                key={idx}
                className="text-[12px] whitespace-nowrap cursor-pointer"
              >
                {`${user.userInfo.lastName} ${user.userInfo.firstName}`}
              </div>
            ))}
          </div>
        </div>
      )} */}
    </div>
  );
};

export default ShowEmotionCount;
