import { createSlice } from "@reduxjs/toolkit";

export interface showEmojiType {
  isShowEmoji: boolean;
  emoji: string;
}

const emojiSlice = createSlice({
  name: "emoji",
  initialState: {
    isShowEmoji: false,
    emoji: "",
  } as showEmojiType,
  reducers: {
    showEmoji: (state, action) => {
      state.isShowEmoji = action.payload.isShowEmoji;
    },

    addEmojiToPost: (state, action) => {
      state.emoji = action.payload;
    },
  },
});

export const { showEmoji, addEmojiToPost } = emojiSlice.actions;
const emojiReducer = emojiSlice.reducer;
export default emojiReducer;

// export function getEmojiList(): (dispatch: Dispatch, getState: () => showEmojiType) => emojiType[] | undefined {
//   return (dispatch, getState) => {
//     const state = getState();
//     if (state.emojiList) {
//         return state.emojiList; // Dữ liệu đã có, không cần gửi yêu cầu
//     }
//     fetch(
//       "https://cdn.jsdelivr.net/npm/@emoji-mart/data"
//     ).then(async (response) => {
//       const data = await response.json();
//       dispatch(addEmojiList(data));
//     })
//   }
// }

// export const fetchData = createAsyncThunk<showEmojiType, void, { state: { data: showEmojiType } }>(
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
