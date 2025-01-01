import { postAPI, postResponseType } from "@/apis/postApi";
import { dataProvinceType, reactEmotionPostType, UserType } from "@/types";
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
  listReactEmotionPost: reactEmotionPostType[];
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
    listReactEmotionPost: [],
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

    setListReactEmotionPost: (state, action) => {
      const findExistEmotion = state.listReactEmotionPost.find(
        (item) => item.id === action.payload.id
      );

      if (findExistEmotion) {
        if (
          action.payload.emotion.emotion_name !==
          findExistEmotion.emotion.emotion_name
        ) {
          state.listReactEmotionPost = [
            ...state.listReactEmotionPost.filter(
              (item) => item.id !== action.payload.id
            ),
            action.payload,
          ];
        }
      } else state.listReactEmotionPost.push(action.payload);
    },

    removeReactEmotionPost: (state, action) => {
      const listReactEmotionPostCopy = JSON.parse(
        JSON.stringify(state.listReactEmotionPost)
      );
      const filteredEmotionPosts = listReactEmotionPostCopy.filter(
        (item: reactEmotionPostType) => {
          return !(
            item.user_id === action.payload.user_id &&
            item.post_id === action.payload.post_id
          );
        }
      );
      state.listReactEmotionPost = filteredEmotionPosts;
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
  setListReactEmotionPost,
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
