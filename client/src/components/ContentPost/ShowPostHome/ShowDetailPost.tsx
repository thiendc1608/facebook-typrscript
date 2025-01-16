import { useContext, useEffect } from "react";
import ShowOnlyPost from "./ShowOnlyPost";
import { IoMdClose } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { PostContext } from "@/context/PostContext";
import RightHeader from "@/components/Header/RightHeader";
import ShowImage from "@/components/Header/Messenger/MediaFile/ShowImage";
import { useDispatch } from "react-redux";
import { SocketContext } from "@/context/SocketContext";
import { updateReactEmotionPost } from "@/redux/postSlice";
import { emotionCommentType } from "@/apis/commentApi";

const ShowDetailPost = () => {
  const { postClickImage, setPostClickImage } = useContext(PostContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { socket } = useContext(SocketContext)!;

  useEffect(() => {
    if (!socket) {
      console.log("Socket is undefined or not connected");
      return;
    }

    const handleUpdateReactPost = (data: { data: emotionCommentType }) => {
      dispatch(
        updateReactEmotionPost({
          post_id: data.data.post_id,
          emotion: data.data.emotion,
          userInfo: data.data.userInfo,
        })
      );
    };

    socket?.off("update_react_post", handleUpdateReactPost);
    socket?.on("update_react_post", handleUpdateReactPost);

    return () => {
      socket?.off("update_react_post", handleUpdateReactPost);
    };
  }, [socket, dispatch]);

  return (
    <div className="flex h-screen w-screen">
      <div className="flex-[2.8] h-full bg-black relative">
        {/* Left */}
        <div className="absolute left-4 h-[56px] flex items-center gap-2 z-[100]">
          <div
            className="h-10 w-10 flex items-center justify-center cursor-pointer rounded-full bg-[#7E7577]"
            onClick={() => {
              setPostClickImage(null);
              navigate(-1);
            }}
          >
            <IoMdClose size={30} color="white" />
          </div>
          <Link to="/">
            <svg
              viewBox="0 0 36 36"
              style={{ color: "#0866ff" }}
              fill="currentColor"
              height="40"
              width="40"
            >
              <path d="M20.181 35.87C29.094 34.791 36 27.202 36 18c0-9.941-8.059-18-18-18S0 8.059 0 18c0 8.442 5.811 15.526 13.652 17.471L14 34h5.5l.681 1.87Z"></path>
              <path
                className="fill-[#fff]"
                d="M13.651 35.471v-11.97H9.936V18h3.715v-2.37c0-6.127 2.772-8.964 8.784-8.964 1.138 0 3.103.223 3.91.446v4.983c-.425-.043-1.167-.065-2.081-.065-2.952 0-4.09 1.116-4.09 4.025V18h5.883l-1.008 5.5h-4.867v12.37a18.183 18.183 0 0 1-6.53-.399Z"
              ></path>
            </svg>
          </Link>
        </div>

        <ShowImage
          showImage={{
            listImage:
              postClickImage?.imageInfo.message_image &&
              JSON.parse(postClickImage?.imageInfo.message_image as string),
          }}
        />
      </div>
      <div className="flex-1 relative">
        <RightHeader />
        <div
          className="h-[calc(100vh-56px)] overflow-y-scroll bg-white border-t border-solid border-[#f2f2f2]"
          onClick={(e) => e.stopPropagation()}
        >
          <ShowOnlyPost item={postClickImage!} />
        </div>
      </div>
    </div>
  );
};

export default ShowDetailPost;
