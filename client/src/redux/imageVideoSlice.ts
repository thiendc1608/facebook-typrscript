import { createSlice } from "@reduxjs/toolkit";

type ListObjectImage = {
  id: number;
  name: File;
}[];
const imageVideoSlice = createSlice({
  name: "imageVideo",
  initialState: {
    isAddImageVideo: false,
    showOrHiddenImageVideo: false, // khi chon background thi disable image/video
    isEditImages: false,
    imageList: [] as File[],
    listObjectImage: [] as ListObjectImage,
  },
  reducers: {
    addImageVideo: (state, action) => {
      state.isAddImageVideo = action.payload;
    }, 
    removeImageVideoTag: (state, action) => {
      state.showOrHiddenImageVideo = action.payload.isDisplay
    },
    editImages: (state, action) => {
      state.isEditImages = action.payload
    },
    addImageToList: (state, action) => {
      state.imageList = action.payload;
      state.listObjectImage = Object.entries(state.imageList).reduce((acc, [key, value]) => {
        acc.push({ id: Number(key), name: value as File });
        return acc;
      }, [] as { id: number; name: File }[]);
    },

    removeImageFromList: (state, action) => {
      state.listObjectImage = state.listObjectImage.filter((item) => item.id !== action.payload.id)
    }
  },
});

export const { addImageVideo, removeImageVideoTag, editImages, addImageToList, removeImageFromList } = imageVideoSlice.actions;
const imageVideoReducer = imageVideoSlice.reducer;
export default imageVideoReducer;
