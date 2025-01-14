import { postType } from "@/redux/postSlice";
import { postResponseType } from "@/types";
import { useState, useRef, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";

interface ShowEmotionCountProps {
  postId: string;
}

const ShowEmotionCount = ({ postId }: ShowEmotionCountProps) => {
  const { listPost } = useSelector((state: { post: postType }) => state.post);
  const [isHoverShowUserReact, setIsHoverShowUserReact] = useState(false);
  // Dùng ref để lưu timeout
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const filterListEmotion = useCallback(
    () =>
      listPost.find((el) => el.id === postId) as postResponseType | undefined,
    [listPost, postId]
  );

  const allUserEmotion =
    filterListEmotion()?.listReactEmotionPost &&
    filterListEmotion()?.listReactEmotionPost.reduce(
      (
        acc: {
          id: string;
          firstName: string;
          lastName: string;
          avatar: string;
        }[],
        cur
      ) => {
        return acc.concat(Object.values(cur)[0].listUser);
      },
      []
    );

  // Hàm xử lý hover vào
  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current); // Clear timeout nếu đang chờ ẩn
    }
    setIsHoverShowUserReact(true); // Hiển thị ngay lập tức khi hover vào
  };

  // Hàm xử lý hover ra
  const handleMouseLeave = () => {
    // Set timeout để ẩn sau 200ms khi chuột rời đi
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHoverShowUserReact(false); // Ẩn sau khi hover ra
    }, 200); // Delay 200ms trước khi ẩn
  };

  // Dọn dẹp khi component unmount để tránh memory leak
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current); // Dọn dẹp timeout khi component bị unmount
      }
    };
  }, []);

  return (
    <div
      className="relative flex items-center cursor-pointer"
      onMouseEnter={handleMouseEnter} // Khi hover vào khu vực này
      onMouseLeave={handleMouseLeave} // Khi hover ra khu vực này
    >
      {filterListEmotion()!.listReactEmotionPost.map((el, idx) => (
        <div key={idx} className="flex items-center">
          <img
            src={Object.values(el)[0].emoji_post}
            alt="emoji_post"
            className="w-[17px] h-[17px]"
          />
        </div>
      ))}
      <div className="text-[#65676c] text-[15px] pl-1 cursor-pointer hover:underline">
        {filterListEmotion()!.listReactEmotionPost.length > 0 &&
          filterListEmotion()!.listReactEmotionPost.reduce(
            (acc, cur) => acc + Object.values(cur)[0].listUser.length,
            0
          )}
      </div>
      {isHoverShowUserReact && (
        <div className="absolute top-[-45px] right-[-40px] my-[2px] w-auto rounded-xl overflow-hidden z-[100]">
          <div className="p-3 bg-[#303030] text-white w-full h-auto">
            {allUserEmotion &&
              allUserEmotion.map((user, idx) => (
                <div
                  key={idx}
                  className="text-[12px] whitespace-nowrap cursor-pointer"
                >
                  {`${user.lastName} ${user.firstName}`}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowEmotionCount;
