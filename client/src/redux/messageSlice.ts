import { createSlice } from "@reduxjs/toolkit";

export interface messageSliceType {
  themeMessage: string;
  changeEmojiMessage: {
    isChangeEmoji: boolean;
    emojiValue: string;
  };
  showImage: {
    isShowImage: boolean;
    listImage: string[];
  };
  idImage: number;
}

const messageSlice = createSlice({
  name: "message",
  initialState: {
    themeMessage: "#0866ff",
    changeEmojiMessage: {
      isChangeEmoji: false,
      emojiValue: "",
    },
    showImage: {
      isShowImage: false,
      listImage: [],
    },
    idImage: 0,
  } as messageSliceType,

  reducers: {
    setThemeMessage: (state, action) => {
      state.themeMessage = action.payload;
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
  },
});

export const {
  setThemeMessage,
  setChangeEmojiMessage,
  setShowImage,
  setIdImage,
} = messageSlice.actions;
const messageReducer = messageSlice.reducer;
export default messageReducer;
