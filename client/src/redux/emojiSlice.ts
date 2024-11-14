import { emojiType, showEmojiType } from "@/types";
import { createSlice, Dispatch } from "@reduxjs/toolkit";

const emojiSlice = createSlice({
  name: "emoji",
  initialState: {
    emojiList: [],
    isShowEmoji: false,
  } as showEmojiType,
  reducers: {
    showEmoji: (state, action) => {
      state.isShowEmoji = action.payload.isShowEmoji;
    },
    addEmojiList: (state, action: { payload: emojiType[] }) => {
      state.emojiList.push(...action.payload);
    }
  },
});


export const { showEmoji, addEmojiList } = emojiSlice.actions;
const emojiReducer = emojiSlice.reducer;
export default emojiReducer;

export function getEmojiList () {
  return (dispatch: Dispatch, getState: () => showEmojiType) => {
    const state = getState();
    if (state.emojiList) {
        return state.emojiList; // Dữ liệu đã có, không cần gửi yêu cầu
    }
    fetch(
      `https://emoji-api.com/emojis?access_key=${
        import.meta.env.VITE_EMOJI_API_KEY
      }`
    ).then(async (response) => {
      const data = await response.json();
      dispatch(addEmojiList(data));
    })
  }
}

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
