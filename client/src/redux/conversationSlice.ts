import { conversationAPI } from "@/apis/conversationApi";
import { conversationType, messageType } from "@/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface chattingUserType {
  private_chat: {
    conversations: conversationType[];
    current_conversation: conversationType | null;
    current_messages: messageType[];
  };
  room_id: string;
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
    // group_chat: {},
  } as chattingUserType,
  reducers: {
    setCurrentConversation: (state, action) => {
      state.private_chat.current_conversation = action.payload;
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
      state.private_chat.current_messages = action.payload.messages;
    });
  },
});

export const {
  setCurrentConversation,
  addToConventions,
  selectRoom,
  deleteConversation,
  addToMessage,
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
