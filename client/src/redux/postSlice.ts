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
  endOfDataPost: boolean;
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
    endOfDataPost: false,
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

      // Tìm bài viết với post_id tương ứng
      const findPost = listPostCopy.find(
        (post: postResponseType) => post.id === action.payload.post_id
      ) as postResponseType;

      // Duyệt qua các cảm xúc đã có trong bài viết
      let emotionExist = false; // Để kiểm tra xem cảm xúc có tồn tại hay không

      // Duyệt qua các cảm xúc có trong bài viết
      findPost.listReactEmotionPost.forEach((post: EmotionPostData) => {
        // Kiểm tra tất cả các cảm xúc trong bài viết
        Object.keys(post).forEach((key) => {
          const listUser = post[key].listUser;

          // Nếu cảm xúc cũ có người dùng và họ thay đổi cảm xúc, cần xoá người dùng khỏi cảm xúc cũ
          if (key !== emotionName) {
            const userIndex = listUser.findIndex(
              (user) => user.id === action.payload.userInfo.id
            );
            if (userIndex !== -1) {
              listUser.splice(userIndex, 1); // Xoá người dùng khỏi cảm xúc cũ
            }
          }

          // Nếu cảm xúc này là cảm xúc mới (emotionName), thêm người dùng vào
          if (key === emotionName) {
            emotionExist = true; // Cảm xúc đã tồn tại trong bài viết
            const userIndex = listUser.findIndex(
              (user) => user.id === action.payload.userInfo.id
            );
            if (userIndex === -1) {
              listUser.push({
                id: action.payload.userInfo.id,
                firstName: action.payload.userInfo.firstName,
                lastName: action.payload.userInfo.lastName,
                avatar: action.payload.userInfo.avatar,
              });
            }
          }

          // Nếu listUser của cảm xúc nào rỗng thì xoá luôn cảm xúc đó
          if (post[key].listUser.length === 0) {
            delete post[key];
          }
        });
      });

      // Nếu cảm xúc mới không có trong bài viết, tạo mới
      if (!emotionExist) {
        // Thêm cảm xúc mới vào mảng listReactEmotionPost
        const newEmotion = {
          [emotionName]: {
            emoji_post: action.payload.emotion.emotion_post,
            listUser: [
              {
                id: action.payload.userInfo.id,
                firstName: action.payload.userInfo.firstName,
                lastName: action.payload.userInfo.lastName,
                avatar: action.payload.userInfo.avatar,
              },
            ],
          },
        };

        (findPost.listReactEmotionPost as EmotionPostData[]).push(newEmotion); // Thêm vào mảng cảm xúc
      }

      // Loại bỏ phần tử trống ({}) nếu có trong listReactEmotionPost
      findPost.listReactEmotionPost = findPost.listReactEmotionPost.filter(
        (post) => Object.keys(post).length > 0
      );
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
        state.endOfDataPost = true; // Đánh dấu đã hết dữ liệu nếu trả về ít hơn `limit`
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
