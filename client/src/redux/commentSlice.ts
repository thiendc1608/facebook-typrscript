import { infoComment } from "@/types";
import { createSlice } from "@reduxjs/toolkit";

export interface commentType {
  valueEmoji: {
    isShowEmojiPost: boolean;
    emoji: string;
    postId: string;
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
    },
    listComment: [],
  } as commentType,
  reducers: {
    addEmojiToCommentPost: (state, action) => {
      state.valueEmoji.isShowEmojiPost = action.payload.isShowEmojiPost;
      state.valueEmoji.emoji = action.payload.emoji;
      state.valueEmoji.postId = action.payload.postId;
    },

    setListComment: (state, action) => {
      const index = state.listComment.findIndex(
        (item) => item.id === action.payload.id
      );

      if (index !== -1) {
        state.listComment[index] = {
          ...state.listComment[index],
          comment_text: action.payload.comment_text,
        };
      } else {
        state.listComment.push(action.payload);
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

export const { addEmojiToCommentPost, setListComment, deleteComment } =
  commentSlice.actions;
const commentReducer = commentSlice.reducer;
export default commentReducer;
