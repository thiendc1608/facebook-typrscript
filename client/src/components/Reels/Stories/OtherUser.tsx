import { cn } from "@/lib/utils";
import { storyDataType } from "@/types";
import { formatTimeAgo } from "@/utils/helpers";

interface OtherUserProps {
  followingUser: storyDataType[];
  authorId: string;
}

const OtherUser = ({ followingUser, authorId }: OtherUserProps) => {
  return (
    <div
      className={cn(
        "px-2 py-2 bg-white hover:bg-[#F2F2F2] rounded-lg flex items-center gap-4 cursor-pointer",
        authorId === followingUser[0].user_id && "bg-[#D9D9D9]"
      )}
      // onClick={() => setIdReelSelect(user_id)}
    >
      <div className="w-[60px] h-[60px] rounded-full border-[3px] border-solid border-[#0861F2]">
        <div className="w-[55px] h-[55px] border-[3px] border-solid border-white rounded-full flex items-center justify-center overflow-hidden">
          <img
            src={followingUser[0].user?.avatar || ""}
            alt={`avatar ${followingUser[0].user_id}`}
            className="w-[48px] h-[48px] object-cover"
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-[15px] text-[#050505]">
          {`${followingUser[0].user?.lastName} ${followingUser[0].user?.firstName}`}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[15px] text-[#0866FF]">
            {`${followingUser.length} thẻ mới`}
          </span>
          <span>.</span>
          <div className="text-[15px] text-[#65676b]">
            {followingUser[0]?.createdAt &&
              formatTimeAgo(followingUser[0]?.createdAt)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtherUser;
