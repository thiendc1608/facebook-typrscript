import { useLocation, useParams } from "react-router-dom";
import StoryViewer from "../components/Reels/Stories/StoryViewer";
import { useEffect, useRef, useState } from "react";
import { storyAPI } from "@/apis/storyApi";
import { FaPlus } from "react-icons/fa6";
import { storyDataType, userListStoryType } from "@/types";
import OtherUser from "../components/Reels/Stories/OtherUser";
import { UserState } from "@/redux/userSlice";
import { formatTimeAgo } from "@/utils/helpers";
// import { path } from "@/utils/path";

const CreateStoriesView = () => {
  const { id } = useParams();
  const location = useLocation();
  const listUserIdStory = location.state.allStories;
  const storyTimeOutRef = useRef<ReturnType<typeof setInterval>>();
  const pauseFlagMouse = useRef(false);
  const [authorStoryIndex, setAuthorStoryIndex] = useState(0); // show author story Index
  const [storyIndex, setStoryIndex] = useState(0); // show author reel Index
  const [followingUserList, setFollowingUserList] = useState<
    userListStoryType[]
  >([]);
  const [storyViewer, setStoryViewer] = useState<storyDataType[]>([]); // story will show inside class right */
  const [authorId, setAuthorId] = useState<string>(); // story will show inside class right */
  const [detailStory, setDetailStory] = useState<userListStoryType[]>([]);
  // const [idReelSelect, setIdReelSelect] = useState("");
  const [myStories, setMyStories] = useState<storyDataType[]>();

  let localStorageData = localStorage.getItem(
    "persist:user"
  ) as UserState | null;
  let currentUser = "";
  if (localStorageData && typeof localStorageData === "string") {
    localStorageData = JSON.parse(localStorageData);
    if (
      localStorageData?.currentUser &&
      typeof localStorageData?.currentUser === "string"
    ) {
      currentUser = localStorageData?.currentUser as string;
    }
  }

  useEffect(() => {
    const fetchDetailStory = async () => {
      if (currentUser) {
        const userId = JSON.parse(currentUser)?.id;
        const response = await storyAPI.getDetailStory(userId);
        if (response.success) {
          setDetailStory(response.storyViewer);
        }
        response.storyViewer.forEach((storyUser) => {
          // display story viewer
          if (Object.keys(storyUser)[0] === id) {
            setStoryViewer(Object.values(storyUser)[0]); // set reel cua author khi click tu homepage
            setAuthorId(Object.values(storyUser)[0][0]?.user_id); // lay id cua author
          }

          // display friendlist
          if (Object.keys(storyUser)[0] !== userId) {
            setFollowingUserList([...followingUserList, storyUser]); // get list following user + reel
          } else {
            setMyStories(storyUser[userId]);
          }
        });
      }
    };
    fetchDetailStory();
  }, [currentUser, id]);

  useEffect(() => {
    let reelLengthOfStory = 0;
    let time = 0;
    if (detailStory.length > 0) {
      for (let i = 0; i < listUserIdStory.length; i++) {
        detailStory.map((item) => {
          if (listUserIdStory[i].user_id === Object.keys(item)[0]) {
            reelLengthOfStory = Object.values(item)[0].length;
          }
        });
        storyTimeOutRef.current = setInterval(() => {
          // 10s
          if (!pauseFlagMouse.current) {
            time++;
            if (reelLengthOfStory === 1) {
              if (time === 20) {
                time = 0;
                changeAuthorIndexHandler(1);
              }
            } else {
              if (time === 20) {
                time = 0;
                changeStoryIndexHandler(1);
                changeAuthorIndexHandler(1);
              }
            }
          }
        }, 500);
      }
    }
    return () => {
      clearInterval(storyTimeOutRef.current);
    };
  });

  const changeStoryIndexHandler = (number: number) => {
    setStoryIndex((prev) => prev + number);
    if (storyIndex > storyViewer.length - 1) {
      setStoryIndex(0);
    }
  };
  const changeAuthorIndexHandler = (number: number) => {
    if (
      (storyIndex === storyViewer.length - 1 &&
        followingUserList.length === 0) ||
      (authorStoryIndex + number >= followingUserList.length &&
        listUserIdStory[listUserIdStory.length - 1] ===
          Object.keys(followingUserList[authorStoryIndex]))
    ) {
      setAuthorStoryIndex(0);
      setStoryIndex(0);

      // window.location.href = `/${path.HOME}`;
    } else {
      const currentIndex = listUserIdStory.findIndex(
        (id: string) => id === authorId
      );
      const tempStoryAuthor = listUserIdStory[currentIndex + number]; // id cua author tiep theo
      setAuthorId(tempStoryAuthor);

      const sViewer = detailStory.filter(
        (storyUser) => Object.keys(storyUser) === tempStoryAuthor
      );
      const storyViewer = sViewer.reduce<storyDataType[]>((acc, storyUser) => {
        if (Object.keys(storyUser)[0] === tempStoryAuthor) {
          return storyUser[tempStoryAuthor];
        }
        return acc;
      }, []);
      setStoryViewer(storyViewer); // list reel cua author tiep theo
      setAuthorStoryIndex(authorStoryIndex + number);
    }
  };

  return (
    <div className="absolute flex top-[57px] left-0 w-full h-[calc(100vh-57px)] overflow-hidden">
      <div className="px-2 absolute left-0 top-0 w-[360px] h-full bg-white shadow-default overflow-auto">
        <div className="px-2 flex flex-col">
          <h1 className="text-[#050505] text-[24px] my-3 font-semibold leading-[32px]">
            Tin
          </h1>
          <div className="flex items-center gap-1 text-[15px] text-[#0866FF] mb-5">
            <span>Kho lưu trữ</span>
            <span>.</span>
            <span>Cài đặt</span>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="px-2 text-[17px] text-[#050505] mb-5">
            Tin của bạn
          </span>
          {myStories ? (
            <div className="px-2 py-2 flex items-center gap-4 cursor-pointer justify-between hover:bg-[#E5E5E5] bg-[#F2F2F2] rounded-lg">
              <div className="flex item-center gap-2">
                <div className="w-[60px] h-[60px] rounded-full border-[3px] border-solid border-[#0861F2]">
                  <div className="w-[55px] h-[55px] border-[3px] border-solid border-white rounded-full flex items-center justify-center overflow-hidden">
                    <img
                      src={myStories[0].user?.avatar || ""}
                      alt={`avatar ${myStories[0].id}`}
                      className="w-[48px] h-[48px] object-cover"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2 justify-center">
                  <span className="text-[15px] text-[#080809]">
                    {`${myStories[0].user?.lastName} ${myStories[0].user?.firstName}`}
                  </span>
                  <div className="text-[14px] text-[#65676b]">
                    {myStories[0]?.createdAt &&
                      formatTimeAgo(myStories[0]?.createdAt)}
                  </div>
                </div>
              </div>
              <div className="w-[60px] h-[60px] rounded-full bg-[#F0F2F5] flex items-center justify-center cursor-pointer">
                <FaPlus size={20} color="#0866FF" />
              </div>
            </div>
          ) : (
            <div className="my-2 flex items-center gap-4 cursor-pointer">
              <div className="w-[60px] h-[60px] rounded-full bg-[#F0F2F5] flex items-center justify-center cursor-pointer">
                <FaPlus size={20} color="#0866FF" />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[15px] text-[#050505]">Tạo tin</span>
                <span className="text-[13px] text-[#65676b]">
                  Bạn có thể chia sẻ ảnh hoặc viết gì đó
                </span>
              </div>
            </div>
          )}
        </div>
        <div>
          <span className="px-2 flex items-center gap-4 text-[17px] text-[#050505] mt-5 leading-[21px] mb-1">
            Tất cả tin
          </span>
          <ul>
            {followingUserList.length > 0 &&
              followingUserList.map((user, idx) => (
                <OtherUser
                  key={idx}
                  followingUser={Object.values(user)[0]}
                  authorId={authorId ?? ""}
                />
              ))}
          </ul>
        </div>
      </div>

      <StoryViewer
        myStories={myStories ?? []}
        storyViewer={storyViewer}
        storyIndex={storyIndex}
        pauseFlagMouse={pauseFlagMouse}
        changeStoryIndexHandler={changeStoryIndexHandler}
        followingUserList={followingUserList}
      />
    </div>
  );
};

export default CreateStoriesView;
