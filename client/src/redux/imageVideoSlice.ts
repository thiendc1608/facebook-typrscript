import { createSlice } from "@reduxjs/toolkit";

export interface ImageVideoState {
  isAddImageVideo: boolean;
  showOrHiddenImageVideo: boolean;
  isEditImages: boolean;
}

const imageVideoSlice = createSlice({
  name: "imageVideo",

  initialState: {
    isAddImageVideo: false,
    showOrHiddenImageVideo: false, // khi chon background thi disable image/video
    isEditImages: false,
  },

  reducers: {
    addImageVideo: (state, action) => {
      state.isAddImageVideo = action.payload;
    },

    removeImageVideoTag: (state, action) => {
      state.showOrHiddenImageVideo = action.payload.isDisplay;
    },

    editImages: (state, action) => {
      state.isEditImages = action.payload;
    },
  },
});

export const { addImageVideo, removeImageVideoTag, editImages } =
  imageVideoSlice.actions;
const imageVideoReducer = imageVideoSlice.reducer;
export default imageVideoReducer;
