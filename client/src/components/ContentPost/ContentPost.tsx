import WriteStatus from "./WriteStatus";
import CreateReel from "../Reels/CreateReel";
import ShowPost from "./ShowPost";

const ContentPost = () => {
  return (
    <>
      <div className="px-8 flex flex-col items-center justify-center mt-4">
        <div className="mx-auto w-[500px]">
          <div className="shadow-default w-full rounded-lg">
            <WriteStatus />
          </div>
          <div className="py-4 w-full">
            <CreateReel />
          </div>
          <div className="w-full">
            <ShowPost />
          </div>
        </div>
      </div>
    </>
  );
};

export default ContentPost;
