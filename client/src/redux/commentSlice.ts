import { commentAPI } from "@/apis/commentApi";
import { EmotionPostData, infoComment } from "@/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface commentType {
  valueEmoji: {
    isShowEmojiPost: boolean;
    emoji: string;
    postId: string;
    parentCommentId?: number | null;
  };
  listComment: infoComment[];
  isLoadingComment: boolean;
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
    isLoadingComment: false,
  } as commentType,
  reducers: {
    addEmojiToCommentPost: (state, action) => {
      state.valueEmoji.isShowEmojiPost = action.payload.isShowEmojiPost;
      state.valueEmoji.emoji = action.payload.emoji;
      state.valueEmoji.postId = action.payload.postId;
      state.valueEmoji.parentCommentId = action.payload.parentCommentId;
    },

    setListComment: (state, action: { payload: infoComment }) => {
      const index = state.listComment.findIndex(
        (item) => item.id === +action.payload.parent_comment_id!
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

      // Tìm bình luận có id tương ứng
      const findComment = listCommentCopy.find(
        (comment: infoComment) => +comment.id === +action.payload.comment.id
      );

      if (findComment) {
        // Tìm emotion đã tồn tại trong bình luận
        let existingEmotion = findComment.emotion_comment.find(
          (emotion: EmotionPostData) => emotion[emotionName] !== undefined
        );

        if (!existingEmotion) {
          // Nếu emotionName chưa có, thêm emotion vào
          existingEmotion = {
            [emotionName]: {
              emoji_post: action.payload.emotion.emotion_post,
              listUser: [],
            },
          };
          // Thêm emotion vào danh sách emotion_comment
          findComment.emotion_comment.push(existingEmotion);
        }

        // Thêm user vào listUser của emotion
        existingEmotion[emotionName].listUser.push(action.payload.userInfo);
      }
      state.listComment = listCommentCopy;
    },

    updateEmotionComment: (state, action) => {
      const emotionName = action.payload.emotion.emotion_name;
      const listCommentCopy = JSON.parse(JSON.stringify(state.listComment));

      // Tìm bình luận có id tương ứng
      const findComment = listCommentCopy.find(
        (comment: infoComment) => +comment.id === +action.payload.comment.id
      ) as infoComment;
      // remove user_id trong emotion
      findComment.emotion_comment.forEach((comment: EmotionPostData) => {
        Object.keys(comment).forEach((key) => {
          const listUser = comment[key].listUser;
          // Tìm và xoá user có id trùng với userId trong listUser
          const userIndex = listUser.findIndex(
            (user) => user.id === action.payload.userInfo.id
          );
          if (userIndex !== -1) {
            // Xoá user khỏi listUser
            listUser.splice(userIndex, 1);
          }
          if (key === emotionName) {
            comment[key].listUser.push({
              id: action.payload.userInfo.id,
              firstName: action.payload.userInfo.firstName, // Bạn có thể cập nhật các giá trị khác
              lastName: action.payload.userInfo.lastName,
              avatar: action.payload.userInfo.avatar,
            });
          } else if (!(emotionName in comment)) {
            // Nếu không có newKey, tạo mới và thêm user vào
            comment[emotionName] = {
              emoji_post: action.payload.emotion.emotion_post,
              listUser: [
                ...listUser,
                {
                  id: action.payload.userInfo.id,
                  firstName: action.payload.userInfo.firstName, // Bạn có thể cập nhật các giá trị khác
                  lastName: action.payload.userInfo.lastName,
                  avatar: action.payload.userInfo.avatar,
                },
              ],
            };
          }
          // Kiểm tra nếu listUser của key là rỗng thì xoá luôn key đó
          if (comment[key].listUser.length === 0) {
            delete comment[key];
          }
        });
      });
      state.listComment = listCommentCopy;
    },

    deleteEmotionComment: (state, action) => {
      const listCommentCopy = JSON.parse(JSON.stringify(state.listComment));
      const filterComment = listCommentCopy.find(
        (comment: infoComment) => +comment.id === +action.payload.comment_id
      );

      const finalReactEmotion = filterComment.emotion_comment.find(
        (emotion: EmotionPostData) =>
          Object.keys(emotion)[0] === action.payload.nameEmotion
      ) as EmotionPostData;
      const deleteEmotion = Object.values(finalReactEmotion)[0].listUser.filter(
        (item: {
          id: string;
          firstName: string;
          lastName: string;
          avatar: string;
        }) => item.id !== action.payload.user_id
      );

      Object.values(finalReactEmotion)[0].listUser = deleteEmotion;
      // Kiểm tra nếu danh sách người dùng rỗng, xóa đối tượng cảm xúc khỏi emotion_comment
      if (Object.values(finalReactEmotion)[0].listUser.length === 0) {
        filterComment.emotion_comment = filterComment.emotion_comment.filter(
          (emotion: EmotionPostData) =>
            Object.keys(emotion)[0] !== action.payload.nameEmotion
        );
      }
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
      state.listComment = state.listComment.filter(
        (item) =>
          +item.id !== +action.payload &&
          +item.parent_comment_id! !== +action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllComment.pending, (state) => {
      state.isLoadingComment = true;
    });

    builder.addCase(getAllComment.fulfilled, (state, action) => {
      state.isLoadingComment = false;
      state.listComment = action.payload.listComment;
    });
  },
});

export const {
  addEmojiToCommentPost,
  setListComment,
  updateComment,
  deleteComment,
  setEmotionComment,
  updateEmotionComment,
  deleteEmotionComment,
} = commentSlice.actions;
const commentReducer = commentSlice.reducer;
export default commentReducer;

export const getAllComment = createAsyncThunk(
  "comment/getAllComment",
  async (_, { rejectWithValue }) => {
    try {
      const response = await commentAPI.getAllComment();
      return response;
    } catch (err: unknown) {
      return rejectWithValue(err);
    }
  }
);
