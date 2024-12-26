import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
// import { persistStore, persistReducer } from 'redux-persist'
// import { persistStore } from 'redux-persist'
// import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import modalReducer from "./modalSlice";
import emojiReducer from "./emojiSlice";
import imageVideoReducer from "./imageVideoSlice";
import postReducer from "./postSlice";
import reelReducer from "./reelSlice";
import { useDispatch } from "react-redux";
import notificationReducer from "./notificationSlice";
import conversationReducer from "./conversationSlice";
import messageReducer from "./messageSlice";
import commentReducer from "./commentSlice";

// const userPersistConfig = {
//     key: 'user',
//     storage,
//     whitelist: ['email', 'isLogin', 'token', 'currentUser'],
// }
// const persistedReducer = persistReducer(userPersistConfig, userReducer)
const store = configureStore({
  reducer: {
    user: userReducer,
    modal: modalReducer,
    imageVideo: imageVideoReducer,
    post: postReducer,
    emoji: emojiReducer,
    reel: reelReducer,
    notification: notificationReducer,
    conversation: conversationReducer,
    message: messageReducer,
    comment: commentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
// const persistor = persistStore(store)
// export { store, persistor }
export { store };

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
// dung cho khi su dung voi asyncthunk
export const useAppDispatch = () => useDispatch<AppDispatch>();
