import { Link, useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import { path } from "@/utils/path";
import { useEffect, useState } from "react";
import { storyAPI } from "@/apis/storyApi";
import { storyDataType } from "@/types";

const CreateReel = () => {
  const navigate = useNavigate();
  const [allStories, setAllStories] = useState<storyDataType[]>([]);

  useEffect(() => {
    const fetchAllStories = async () => {
      const response = await storyAPI.getAllStories();
      if (response.success) {
        setAllStories(response.allStories);
      }
    };
    fetchAllStories();
  }, []);

  return (
    <div className="flex justify-start gap-2">
      <div className="w-[112.5px] h-[200px] rounded-lg overflow-hidden">
        <Link
          to={`/${path.STORIES}`}
          className="flex flex-col relative group hover:opacity-80"
        >
          <div
            className="w-full h-[150px] object-cover group-hover:scale-105 duration-300"
            style={{
              backgroundImage: `url(https://scontent.fhan2-4.fna.fbcdn.net/v/t39.30808-1/314818792_101307872811270_6985110685556599242_n.jpg?stp=dst-jpg_s160x160&_nc_cat=110&ccb=1-7&_nc_sid=0ecb9b&_nc_ohc=rYGvFdcG2TsQ7kNvgG0_8nR&_nc_zt=24&_nc_ht=scontent.fhan2-4.fna&_nc_gid=A-ony4Z6JLNVQeucV6kpoe3&oh=00_AYChuBeBrgjXYmu7PSxg5ejelSPmZHMH0XKL6oaQEIF7Xw&oe=672F43F6)`,
              backgroundSize: "100% 100%",
            }}
          />
          <div className="absolute top-[65%] left-[35%] ">
            <div className="w-10 h-10 bg-white rounded-full"></div>
            <div className="absolute top-[10%] left-[10%] ">
              <div className="w-8 h-8 bg-[#075CE5] rounded-full flex items-center justify-center">
                <FaPlus size={20} color="white" />
              </div>
            </div>
          </div>
          <div className="pt-[28px] px-[16px] pb-[12px] w-full bg-white h-[50px]">
            <div className="text-[12px] text-black text-center">Tập tin</div>
          </div>
        </Link>
      </div>
      {allStories?.length > 0 &&
        allStories.map((story) => (
          <div
            key={story.id}
            className="flex-none w-[112.5px] h-[200px] rounded-lg overflow-hidden group"
            onClick={() =>
              navigate(`/stories/${story.user_id}`, {
                replace: true,
                state: { allStories },
              })
            }
          >
            <Link
              to={`/stories/${story.user_id}`}
              className="relative hover:opacity-90"
            >
              <img
                src={story.thumbnail_url}
                alt={`image ${story.id}`}
                className="w-full h-full object-cover group-hover:scale-110 duration-300"
              />
              <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] whitespace-pre-wrap text-[10px] text-white group-hover:scale-110">
                {story.caption}
              </div>
              <div className="absolute top-[16px] left-[13px] ">
                <div className="w-10 h-10 bg-[#075CE5] rounded-full"></div>
                <div className="absolute top-[10%] left-[10%] ">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center">
                    <img
                      src={story?.user?.avatar}
                      alt={`avatar ${story.id}`}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
    </div>
  );
};

export default CreateReel;
