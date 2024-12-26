import WriteStatus from "./WriteStatus";
import CreateReel from "../Reels/CreateReel";
import ShowPostHome from "./ShowPostHome/ShowPostHome";

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
            <ShowPostHome />
          </div>
        </div>
      </div>
    </>
  );
};

export default ContentPost;
