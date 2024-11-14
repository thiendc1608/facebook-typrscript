
import { createSlice } from "@reduxjs/toolkit";

const reelSlice = createSlice({
  name: "reel",
  initialState: {
    isCreateText: false,
    selectBg: {
      id: 1,
      srcImg: "https://scontent.fhan18-1.fna.fbcdn.net/v/t39.16376-6/55349832_403803457088017_170167072418955264_n.jpg?_nc_cat=1&ccb=1-7&_nc_sid=427b5c&_nc_ohc=zQOrjDdZ34EQ7kNvgGJV6kQ&_nc_zt=14&_nc_ht=scontent.fhan18-1.fna&_nc_gid=AgpsYqWTtXDkxBwVI9TgL0R&oh=00_AYC_k2wvbMPaPT27wAVHZYYb9FlR6WyqsbFWbPvg0JQOnw&oe=672B3F2E"
    },
    changeFont: {
      id: 4,
      name: "Tiêu đề",
      font: "font-title",
    },
    typeTextReel: "",
  },
  reducers: {
    clickCreateText: (state, action) => {
      state.isCreateText = action.payload
    },
    setSelectBg: (state, action) => {
      state.selectBg = action.payload
    },
    setChangeFont: (state, action) => {
      state.changeFont = action.payload
    },
    typeText: (state, action) => {
      state.typeTextReel = action.payload
    },
  },
});


export const { clickCreateText, setSelectBg, setChangeFont, typeText } = reelSlice.actions;
const reelReducer = reelSlice.reducer;
export default reelReducer;

//   'emoji/fetchEmojiList',
//   async (_, { getState }) => {
//     const state = getState().data;
//     if (state.emojiList) {
//       return state; // Return the current state when emojiList is already fetched
//     }
//     const response = await fetch(
//       `https://emoji-api.com/emojis?access_key=${
//         import.meta.env.VITE_EMOJI_API_KEY
//       }`
//     );
//     const data = await response.json();
//     return {
//       ...state,
//       emojiList: data,
//     };
//   }
// );
