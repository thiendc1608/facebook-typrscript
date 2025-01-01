import { infoComment } from "@/types";
import { createSlice } from "@reduxjs/toolkit";

export interface commentType {
  valueEmoji: {
    isShowEmojiPost: boolean;
    emoji: string;
    postId: string;
    parentCommentId?: number | null;
  };
  listComment: infoComment[];
}

const commentSlice = createSlice({
  name: "comment",
  initialState: {
    valueEmoji: {
      isShowEmojiPost: false,
      emoji: "",
      postId: "",
      parentCommentId: null,
    },
    listComment: [],
  } as commentType,
  reducers: {
    addEmojiToCommentPost: (state, action) => {
      state.valueEmoji.isShowEmojiPost = action.payload.isShowEmojiPost;
      state.valueEmoji.emoji = action.payload.emoji;
      state.valueEmoji.postId = action.payload.postId;
      state.valueEmoji.parentCommentId = action.payload.parentCommentId;
    },

    setListComment: (state, action) => {
      const index = state.listComment.findIndex(
        (item) => item.id === +action.payload.parent_comment_id
      );
      if (index !== -1) {
        state.listComment.splice(index + 1, 0, action.payload);
      } else {
        state.listComment.push(action.payload);
      }
    },

    setEmotionComment: (state, action) => {
      const emotionName = action.payload.emotion.emotion_name;
      const listCommentCopy = JSON.parse(JSON.stringify(state.listComment));
      const findComment = listCommentCopy.find((comment: infoComment) => {
        return +comment.id === +action.payload.comment.id;
      });
      if (!findComment.emotion_comment) {
        findComment.emotion_comment = {}; // Nếu emotion_comment chưa tồn tại, tạo nó
      }

      if (!findComment.emotion_comment[emotionName]) {
        findComment.emotion_comment[emotionName] = {
          emoji_post: action.payload.emotion.emotion_post,
          listUser: [],
        };
      }
      findComment.emotion_comment[emotionName].listUser.push(
        action.payload.userInfo
      );
      state.listComment = listCommentCopy;
    },

    updateComment: (state, action) => {
      const index = state.listComment.findIndex(
        (item) => item.id === action.payload.id
      );

      if (index !== -1) {
        state.listComment[index] = {
          ...state.listComment[index],
          comment_text: action.payload.comment_text,
        };
      }
    },

    deleteComment: (state, action) => {
      console.log(action.payload);

      state.listComment = state.listComment.filter(
        (item) => +item.id !== +action.payload
      );
    },
  },
});

export const {
  addEmojiToCommentPost,
  setListComment,
  updateComment,
  deleteComment,
  setEmotionComment,
} = commentSlice.actions;
const commentReducer = commentSlice.reducer;
export default commentReducer;
