import { NotificationType } from "@/types";
import { createSlice } from "@reduxjs/toolkit";

export interface notificationState {
    isOpenNotifications: boolean
    isOpenMessage: boolean
    notifications: NotificationType[]
}

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    isOpenNotifications: false,
    isOpenMessage: false,
    notifications: []
  } as notificationState,
  reducers: {
    setIsOpenNotifications: (state, action) => {
      state.isOpenNotifications = action.payload
    },
    setIsOpenMessage: (state, action) => {
      state.isOpenMessage = action.payload
    },
    setNotifications: (state, action) => {
      const updatedItem = action.payload;
      // Dùng map để tìm và thay thế object có id giống nhau
      const index = state.notifications.findIndex(item =>
        item.user.id === updatedItem.user.id
      );
      if (index !== -1) {
        // Nếu tìm thấy item có id trùng, cập nhật nó
        state.notifications[index] = updatedItem;
      } else {
        // Nếu không tìm thấy, thêm item mới vào mảng
        state.notifications.push(updatedItem);
      }
    }
  },
});

export const { setIsOpenNotifications, setNotifications, setIsOpenMessage } = notificationSlice.actions;
const notificationReducer = notificationSlice.reducer;
export default notificationReducer;