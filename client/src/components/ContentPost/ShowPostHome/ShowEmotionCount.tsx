import { postResponseType } from "@/apis/postApi";
import { showModal } from "@/redux/modalSlice";
import { postType } from "@/redux/postSlice";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ShowEmojiDetail from "./ShowEmojiDetail";

export interface EmotionPostData {
  [emotion_name: string]: {
    emoji_post: string;
    listUser: {
      firstName: string;
      lastName: string;
      avatar: string;
    }[];
  };
}

interface ShowEmotionCountProps {
  item: postResponseType;
}

const ShowEmotionCount = ({ item }: ShowEmotionCountProps) => {
  const dispatch = useDispatch();
  const { listReactEmotionPost } = useSelector(
    (state: { post: postType }) => state.post
  );
  const filterListEmotion = listReactEmotionPost.filter(
    (el) => el.post_id === item.id
  );
  const [isHoverShowUserReact, setIsHoverShowUserReact] = useState(false);

  const emotionPostData: EmotionPostData = {};
  filterListEmotion.forEach((el) => {
    const emotionName = el.emotion.emotion_name;

    // Nếu chưa có message_id này trong groupedData, tạo một nhóm mới
    if (!emotionPostData[emotionName]) {
      emotionPostData[emotionName] = {
        emoji_post: el.emotion.emotion_post,
        listUser: [],
      };
    }
    // Thêm emoji_dropper_id vào mảng list của nhóm tương ứng
    emotionPostData[emotionName].listUser.push(el.userInfo);
  });

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
                filterListEmotion={filterListEmotion}
              />
            ),
          })
        );
      }}
    >
      {Object.values(emotionPostData).map((el, idx) => (
        <div key={idx} className="flex items-center">
          <img
            src={el.emoji_post}
            alt="emoji_post"
            className="w-[20px] h-[20px]"
          />
        </div>
      ))}
      <span className="text-[#65676c] text-[15px] pl-1 cursor-pointer hover:underline">
        {filterListEmotion.length > 0 && filterListEmotion.length}
      </span>
      {isHoverShowUserReact && (
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
      )}
    </div>
  );
};

export default ShowEmotionCount;
