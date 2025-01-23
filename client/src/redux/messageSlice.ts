import { imageCloudinaryType } from "@/types";
import { createSlice } from "@reduxjs/toolkit";

export interface messageSliceType {
  settingTheme: {
    themeMessage: string;
    conversation_id: string;
  }[];
  themeDefault: string;
  changeEmojiMessage: {
    isChangeEmoji: boolean;
    emojiValue: string;
  };
  showImage: {
    isShowImage: boolean;
    listImage: string[];
  };
  idImage: number;
  selectImageList: string[];
}

const messageSlice = createSlice({
  name: "message",
  initialState: {
    settingTheme: [
      {
        themeMessage: "",
        conversation_id: "",
      },
    ] as messageSliceType["settingTheme"],
    themeDefault: "#0866ff",
    changeEmojiMessage: {
      isChangeEmoji: false,
      emojiValue: "",
    },
    showImage: {
      isShowImage: false,
      listImage: [],
    },
    idImage: 0,
    selectImageList: [],
  } as messageSliceType,

  reducers: {
    setThemeMessage: (state, action) => {
      state.settingTheme = state.settingTheme.map((item) => {
        if (item.conversation_id === action.payload.conversation_id) {
          return {
            ...item,
            themeMessage: action.payload.themeMessage,
          };
        }
        return item;
      });
    },

    setChangeEmojiMessage: (state, action) => {
      state.changeEmojiMessage.isChangeEmoji = action.payload.isChangeEmoji;
      state.changeEmojiMessage.emojiValue = action.payload.emojiValue;
    },

    setShowImage: (state, action) => {
      state.showImage.isShowImage = action.payload.isShowImage;
      state.showImage.listImage = action.payload.listImage;
    },

    setIdImage: (state, action) => {
      state.idImage = action.payload;
    },

    setSelectedImageList: (state, action) => {
      const listImageSelect: string[] = action.payload.map(
        (item: imageCloudinaryType) => item.path
      );
      state.selectImageList = listImageSelect;
    },

    setPostImageList: (state, action) => {
      let listImageSelect: string[] = [];
      if (typeof action.payload[0] === "string") {
        listImageSelect = action.payload;
      } else {
        listImageSelect = action.payload.map(
          (item: imageCloudinaryType) => item.path
        );
      }
      state.selectImageList = [...state.selectImageList, ...listImageSelect];
    },

    removeSelectedImage: (state, action) => {
      state.selectImageList = state.selectImageList.filter(
        (item) => item !== action.payload
      );
    },
  },
});

export const {
  setThemeMessage,
  setChangeEmojiMessage,
  setShowImage,
  setIdImage,
  setSelectedImageList,
  removeSelectedImage,
  setPostImageList,
} = messageSlice.actions;
const messageReducer = messageSlice.reducer;
export default messageReducer;
