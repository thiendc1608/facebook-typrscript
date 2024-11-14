import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
  name: "post",
  initialState: {
    textPost: "",
    isTagName: false,
    isCheckIn: 0,
    isChooseGIF: false,
    locationTag: null,
    locationList: [],
  },
  reducers: {
    setTextPost: (state, action) => {
      state.textPost = action.payload;
    },
    addEmoji: (state, action) => {
      state.textPost += action.payload;
    },
    addTagName: (state, action) => {
      state.isTagName = action.payload;
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
  },
});

export const { setTextPost, addEmoji, addTagName, setCheckIn, setLocationList, setLocationTag, setChooseGIF} = postSlice.actions;
const postReducer = postSlice.reducer;
export default postReducer;
