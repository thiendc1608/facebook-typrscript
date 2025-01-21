import WriteStatus from "../ContentPost/WriteStatus";
import ShowOnlyPost from "../ContentPost/ShowPostHome/ShowOnlyPost";
import { useSelector } from "react-redux";
import { postType } from "@/redux/postSlice";

const ArticleProfile = () => {
  const { listUserPost } = useSelector(
    (state: { post: postType }) => state.post
  );

  return (
    <div className="w-[60%] flex flex-col gap-4">
      <div className="shadow-default w-full rounded-lg">
        <WriteStatus />
      </div>
      <div className="w-full mt-2">
        <div className="flex flex-col gap-4">
          {listUserPost.length > 0 ? (
            listUserPost.map((item, idx) => (
              <ShowOnlyPost key={idx} item={item} />
            ))
          ) : (
            <span>Chưa có bài viết nào</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleProfile;
