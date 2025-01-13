import { postResponseType } from "@/apis/postApi";
import { useRef, useState } from "react";
import { createContext } from "react";

type PostContextType = {
  isHoverLike: {
    isClickTabComment: boolean;
    isHover: boolean;
    postId: string | null;
  };
  setIsHoverLike: React.Dispatch<
    React.SetStateAction<{
      isClickTabComment: boolean;
      isHover: boolean;
      postId: string | null;
    }>
  >;
  contentRefs: React.RefObject<Record<string, HTMLDivElement | null>>;
  handleClickTabComment: (
    e: React.MouseEvent<HTMLDivElement>,
    post: postResponseType
  ) => void;
  postClickImage: postResponseType | null;
  setPostClickImage: (post: postResponseType | null) => void;
};

// Định nghĩa context với kiểu rõ ràng
export const PostContext = createContext<PostContextType>({
  isHoverLike: { isClickTabComment: false, isHover: false, postId: null },
  setIsHoverLike: () => {},
  contentRefs: { current: {} },
  handleClickTabComment: () => {},
  postClickImage: null,
  setPostClickImage: () => {},
});

export const PostProvider = ({ children }: { children: React.ReactNode }) => {
  const contentRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [isHoverLike, setIsHoverLike] = useState<{
    isClickTabComment: boolean;
    isHover: boolean;
    postId: string | null;
  }>({
    isClickTabComment: false,
    isHover: false,
    postId: null,
  });
  const [postClickImage, setPostClickImage] = useState<postResponseType | null>(
    null
  );
  // Hàm xử lý click vào tab comment
  const handleClickTabComment = (
    e: React.MouseEvent<HTMLDivElement>,
    post: postResponseType
  ) => {
    e.stopPropagation();
    setIsHoverLike({
      ...isHoverLike,
      isClickTabComment: true,
      postId: post.id,
    });

    // Focus vào input sau khi cập nhật trạng thái
    setTimeout(() => {
      const inputElement = contentRefs.current[post.id];
      if (inputElement) {
        inputElement.focus();
      }
    }, 50);
  };

  return (
    <PostContext.Provider
      value={{
        isHoverLike,
        setIsHoverLike,
        contentRefs,
        handleClickTabComment,
        postClickImage,
        setPostClickImage,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};
