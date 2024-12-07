import { conversationAPI } from "@/apis/conversationApi";
import emojiAPI from "@/apis/emojiApi";
import {
  conversationType,
  allMessageType,
  emotionType,
  reactMesType,
} from "@/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type GroupedItem = {
  [message_id: string]: { emoji_icon: string; count: number }[];
};

export interface chattingUserType {
  private_chat: {
    conversations: conversationType[];
    current_conversation: conversationType | null;
    current_messages: allMessageType[];
  };
  room_id: string;
  emojiList: emotionType[];
  reply_message: allMessageType | null;
  updateMessage: {
    isUpdateMsg: boolean;
    messageValue: allMessageType | null;
  };
  // group_chat: any;
}

const conversationSlice = createSlice({
  name: "conversation",
  initialState: {
    private_chat: {
      conversations: [],
      current_conversation: null,
      current_messages: [],
    },
    room_id: "",
    emojiList: [],
    reply_message: null,
    updateMessage: {
      isUpdateMsg: false,
      messageValue: null,
    },
    // group_chat: {},
  } as chattingUserType,
  reducers: {
    setReplyMsg: (state, action) => {
      state.reply_message = action.payload;
    },

    setEmojiList: (state, action) => {
      state.emojiList = action.payload;
    },

    setCurrentConversation: (state, action) => {
      state.private_chat.current_conversation = action.payload;
    },

    addToReactMessage: (state, action) => {
      state.private_chat.current_messages =
        state.private_chat.current_messages.map((el) => {
          if (el.id === action.payload.message_id) {
            return {
              ...el,
              messageReact: [...el.messageReact, action.payload],
              countReactMes: {
                ...el.countReactMes,
                [el.id]: [{ emoji_icon: action.payload.emoji_icon, count: 1 }],
              },
            };
          }
          return el;
        });
    },

    addToConventions: (state, action) => {
      state.private_chat.conversations =
        state.private_chat.conversations.filter(
          (el) => el?.id !== action.payload.conversation.id
        );
      state.private_chat.conversations.push(action.payload.conversation);
    },

    addToMessage: (state, action) => {
      if (action.payload.timeMessage) {
        state.private_chat.current_messages.push(action.payload.timeMessage);
      }
      state.private_chat.current_messages.push(action.payload.messages);
    },

    setUpdateMessage: (state, action) => {
      state.updateMessage = action.payload;
    },

    removeTempMessage: (state, action) => {
      state.private_chat.current_messages =
        state.private_chat.current_messages.map((el) => {
          const updatedItem = action.payload.messages.find(
            (updatedEl: allMessageType) => updatedEl.id === el.id
          );
          return updatedItem ? { ...el, ...updatedItem } : el;
        });
    },

    removeMessage: (state, action) => {
      state.private_chat.current_messages =
        state.private_chat.current_messages.filter(
          (el) => !action.payload.messages.includes(el.id)
        );
    },

    deleteConversation: (state, action) => {
      state.private_chat.conversations =
        state.private_chat.conversations.filter(
          (el) => el?.id !== action.payload.conversation_id
        );
    },

    selectRoom: (state, action) => {
      state.room_id = action.payload.room_id;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchDirectConversations.fulfilled, (state, action) => {
      state.private_chat.conversations = action.payload.conversations;
    });

    builder.addCase(fetchAllMessage.fulfilled, (state, action) => {
      if (action.payload.countReactMes) {
        const result: GroupedItem = action.payload.countReactMes.reduce(
          (acc: GroupedItem, item) => {
            const key = item.message_id;

            // Nếu chưa có key trong accumulator, tạo mới mảng
            if (!acc[key]) {
              acc[key] = [];
            }

            // Thêm icon và count vào mảng tương ứng với message_id
            acc[key].push({ emoji_icon: item.emoji_icon, count: item.count });

            return acc;
          },
          {}
        );

        let list_current: allMessageType[] = [];
        list_current = action.payload.messages.map(
          (message: allMessageType) => {
            const listReact: reactMesType[] = [];
            if (message.id === Object.keys(result)[0]) {
              listReact.push(...result[message.id]);
            }
            return { ...message, countReactMes: { [message.id]: listReact } };
          }
        );
        state.private_chat.current_messages = list_current;
      } else {
        state.private_chat.current_messages = action.payload.messages;
      }
    });

    builder.addCase(getAllUserReactMessage.fulfilled, (state, action) => {
      const list_current = state.private_chat.current_messages.map(
        (message: allMessageType) => {
          if (
            message.id ===
            Object.keys(action.payload.reactMessageList.countReactMes)[0]
          ) {
            return { ...message, ...action.payload.reactMessageList };
          }
          return message;
        }
      );
      state.private_chat.current_messages = list_current;
    });
  },
});

export const {
  setCurrentConversation,
  addToConventions,
  selectRoom,
  deleteConversation,
  addToMessage,
  setEmojiList,
  addToReactMessage,
  setReplyMsg,
  removeMessage,
  removeTempMessage,
  setUpdateMessage,
} = conversationSlice.actions;
const conversationReducer = conversationSlice.reducer;
export default conversationReducer;

export const fetchDirectConversations = createAsyncThunk(
  "conversation/fetchAllConversation",
  async (current_id: string, { rejectWithValue }) => {
    try {
      const response = await conversationAPI.getAllConversation(current_id);
      return response;
    } catch (err: unknown) {
      return rejectWithValue(err);
    }
  }
);

export const fetchAllMessage = createAsyncThunk(
  "conversation/fetchAllMessage",
  async (
    { conversation_id }: { conversation_id: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await conversationAPI.getAllMessage(conversation_id);
      return response;
    } catch (err: unknown) {
      return rejectWithValue(err);
    }
  }
);

export const getAllUserReactMessage = createAsyncThunk(
  "conversation/getAllUserReactMessage",
  async (message_id: string, { rejectWithValue }) => {
    try {
      const response = await emojiAPI.getAllUserReactMessage(message_id);
      return response;
    } catch (err: unknown) {
      return rejectWithValue(err);
    }
  }
);
