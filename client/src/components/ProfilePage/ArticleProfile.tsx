import { useParams } from "react-router-dom";
import WriteStatus from "../ContentPost/WriteStatus";
import { useSelector } from "react-redux";
import { postType } from "@/redux/postSlice";
import ShowOnlyPost from "../ContentPost/ShowPostHome/ShowOnlyPost";

const ArticleProfile = () => {
  const { user_id } = useParams();
  const { listPost } = useSelector((state: { post: postType }) => state.post);

  return (
    <div className="w-[60%] flex flex-col gap-4">
      <div className="shadow-default w-full rounded-lg">
        <WriteStatus />
      </div>
      <div className="w-full mt-2">
        <div className="flex flex-col gap-4">
          {listPost.length > 0 ? (
            listPost
              .filter((post) => post.user_id === user_id)
              .map((item, idx) => <ShowOnlyPost key={idx} item={item} />)
          ) : (
            <span>Chưa có bài viết nào</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleProfile;
