import { postAPI } from "@/apis/postApi";
import {
  dataProvinceType,
  EmotionPostData,
  postResponseType,
  UserType,
} from "@/types";
import icons from "@/utils/icons";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IconType } from "react-icons/lib";

const { FaEarthAmericas } = icons;
export interface postType {
  textPost: string;
  tagUserList: {
    isTagName: boolean;
    listTag: UserType[];
  };
  isCheckIn: number;
  isChooseGIF: boolean;
  locationTag: dataProvinceType | null;
  locationList: dataProvinceType[];
  selectObjectPost: {
    id: number;
    name: string;
    icon: IconType;
  };
  listPost: postResponseType[];
  isLoadingPost: boolean;
  endOfData: boolean;
}

const postSlice = createSlice({
  name: "post",
  initialState: {
    textPost: "",
    tagUserList: {
      isTagName: false,
      listTag: [],
    },
    isCheckIn: 0,
    isChooseGIF: false,
    locationTag: null,
    locationList: [],
    selectObjectPost: {
      id: 1,
      name: "Public",
      icon: FaEarthAmericas,
    },
    listPost: [],
    isLoadingPost: false,
    endOfData: false,
  } as postType,

  reducers: {
    setInputTextPost: (state, action) => {
      state.textPost = action.payload;
    },

    resetTextPost: (state) => {
      state.textPost = "";
    },

    addTagName: (state, action) => {
      state.tagUserList.isTagName = action.payload.isTagName;
      state.tagUserList.listTag = action.payload.listTag;
    },

    setCheckIn: (state, action) => {
      state.isCheckIn = action.payload;
    },

    setLocationList: (state, action) => {
      state.locationList = action.payload;
    },

    setLocationTag: (state, action) => {
      state.locationTag = action.payload;
    },

    setChooseGIF: (state, action) => {
      state.isChooseGIF = action.payload;
    },

    setSelectObjectPost: (state, action) => {
      state.selectObjectPost = action.payload;
    },

    setListPost: (state, action) => {
      state.listPost.unshift(action.payload);
    },

    setReactEmotionPost: (state, action) => {
      const emotionName = action.payload.emotion.emotion_name;
      const listPostCopy = JSON.parse(JSON.stringify(state.listPost));

      // Tìm bai post có id tương ứng
      const findPost = listPostCopy.find(
        (post: postResponseType) => post.id === action.payload.post_id
      ) as postResponseType;

      if (findPost) {
        // Tìm emotion đã tồn tại trong bình luận
        let existingEmotion = findPost.listReactEmotionPost.find(
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
          findPost.listReactEmotionPost = [
            ...findPost.listReactEmotionPost,
            existingEmotion,
          ];
        }

        // Thêm user vào listUser của emotion
        existingEmotion[emotionName].listUser.push(action.payload.userInfo);
      }
      state.listPost = listPostCopy;
    },

    updateReactEmotionPost: (state, action) => {
      const emotionName = action.payload.emotion.emotion_name;
      const listPostCopy = JSON.parse(JSON.stringify(state.listPost));

      // Tìm bình luận có id tương ứng
      const findPost = listPostCopy.find(
        (post: postResponseType) => post.id === action.payload.post_id
      ) as postResponseType;

      // remove user_id trong emotion
      findPost.listReactEmotionPost.forEach((post: EmotionPostData) => {
        Object.keys(post).forEach((key) => {
          const listUser = post[key].listUser;
          // Tìm và xoá user có id trùng với userId trong listUser
          const userIndex = listUser.findIndex(
            (user) => user.id === action.payload.userInfo.id
          );
          if (userIndex !== -1) {
            // Xoá user khỏi listUser
            listUser.splice(userIndex, 1);
          }
          if (key === emotionName) {
            post[key].listUser.push({
              id: action.payload.userInfo.id,
              firstName: action.payload.userInfo.firstName, // Bạn có thể cập nhật các giá trị khác
              lastName: action.payload.userInfo.lastName,
              avatar: action.payload.userInfo.avatar,
            });
          } else if (!(emotionName in post)) {
            // Nếu không có newKey, tạo mới và thêm user vào
            post[emotionName] = {
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
          if (post[key].listUser.length === 0) {
            delete post[key];
          }
        });
      });
      state.listPost = listPostCopy;
    },

    removeReactEmotionPost: (state, action) => {
      const listPostCopy = JSON.parse(JSON.stringify(state.listPost));
      const filterPost = listPostCopy.find(
        (post: postResponseType) => post.id === action.payload.post_id
      ) as postResponseType;

      const finalReactEmotion = filterPost.listReactEmotionPost.find(
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
      // Kiểm tra nếu danh sách người dùng rỗng, xóa đối tượng cảm xúc khỏi listReactEmotionPost
      if (Object.values(finalReactEmotion)[0].listUser.length === 0) {
        filterPost.listReactEmotionPost =
          filterPost.listReactEmotionPost.filter(
            (emotion: EmotionPostData) =>
              Object.keys(emotion)[0] !== action.payload.nameEmotion
          );
      }
      state.listPost = listPostCopy;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllPost.pending, (state) => {
      state.isLoadingPost = true;
    });
    builder.addCase(getAllPost.fulfilled, (state, action) => {
      state.isLoadingPost = false;
      if (action.payload.allPosts.length < 3) {
        state.endOfData = true; // Đánh dấu đã hết dữ liệu nếu trả về ít hơn `limit`
      }
      state.listPost = [...state.listPost, ...action.payload.allPosts];
    });
  },
});

export const {
  resetTextPost,
  setListPost,
  setInputTextPost,
  addTagName,
  setCheckIn,
  setLocationList,
  setLocationTag,
  setChooseGIF,
  setSelectObjectPost,
  setReactEmotionPost,
  updateReactEmotionPost,
  removeReactEmotionPost,
} = postSlice.actions;
const postReducer = postSlice.reducer;
export default postReducer;

export const getAllPost = createAsyncThunk(
  "post/getAllPost",
  async (
    { limit, offset }: { limit: number; offset: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await postAPI.getAllPost({ limit, offset });
      return response;
    } catch (err: unknown) {
      return rejectWithValue(err);
    }
  }
);
