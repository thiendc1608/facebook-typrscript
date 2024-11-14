import WriteStatus from "./WriteStatus";
import CreateReel from "../Reels/CreateReel";

const ContentPost = () => {
  return (
    <>
      <div className="px-8 flex flex-col items-center justify-center mt-4">
        <div className="mx-auto">
          <div className="shadow-default w-[590px] rounded-lg">
            <WriteStatus />
          </div>
          <div className="py-4 w-full">
            <CreateReel />
          </div>
        </div>
      </div>
    </>
  );
};

export default ContentPost;
