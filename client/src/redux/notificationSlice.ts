import { conversationType, NotificationType } from "@/types";
import { createSlice } from "@reduxjs/toolkit";

export interface tinyChattingType {
  isOpenChatting: boolean;
  isTinyChat: boolean;
  conversation: conversationType | null;
}
export interface notificationState {
  isOpenNotifications: boolean;
  isOpenMessage: boolean;
  tinyChatting: tinyChattingType[];
  notifications: NotificationType[];
}

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    isOpenNotifications: false,
    isOpenMessage: false,
    tinyChatting: [] as tinyChattingType[],
    notifications: [],
  } as notificationState,
  reducers: {
    setIsOpenNotifications: (state, action) => {
      state.isOpenNotifications = action.payload;
    },

    setIsOpenMessage: (state, action) => {
      state.isOpenMessage = action.payload;
    },

    setIsOpenChatting: (state, action) => {
      const findChatting = state.tinyChatting.some(
        (chat) => chat.conversation?.id === action.payload.conversation?.id
      );
      if (!findChatting) state.tinyChatting.push(action.payload);
      else {
        const updatedChatting = state.tinyChatting.map((el) => {
          if (el.conversation?.id === action.payload.conversation?.id) {
            return { ...el, ...action.payload };
          }
          return el;
        });
        state.tinyChatting = updatedChatting;
      }
    },

    removeChatting: (state, action) => {
      state.tinyChatting = state.tinyChatting.filter(
        (chatting) =>
          chatting.conversation?.id !== action.payload.conversation?.id
      );
    },

    setNotifications: (state, action) => {
      const updatedItem = action.payload;
      // Dùng map để tìm và thay thế object có id giống nhau
      const index = state.notifications.findIndex(
        (item) => item.user.id === updatedItem.user.id
      );
      if (index !== -1) {
        // Nếu tìm thấy item có id trùng, cập nhật nó
        state.notifications[index] = updatedItem;
      } else {
        // Nếu không tìm thấy, thêm item mới vào mảng
        state.notifications.push(updatedItem);
      }
    },
  },
});

export const {
  setIsOpenNotifications,
  setNotifications,
  setIsOpenMessage,
  setIsOpenChatting,
  removeChatting,
} = notificationSlice.actions;

const notificationReducer = notificationSlice.reducer;
export default notificationReducer;
