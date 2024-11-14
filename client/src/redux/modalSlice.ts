import { createSlice } from "@reduxjs/toolkit";

export interface ModalState {
  isShowModal: boolean;
  childrenModal: React.ReactNode;
}

const modalSlice = createSlice({
  name: "modal",
  initialState: {
    isShowModal: false,
    childrenModal: null,
  } as ModalState,
  reducers: {
    // action creators function (type: "modal/forgetPassword", payload: {email, OTP})
    showModal: (state, action) => {
      state.isShowModal = action.payload.isShowModal;
      state.childrenModal = action.payload.childrenModal;
    },
  },
});

export const { showModal } = modalSlice.actions;
const modalReducer = modalSlice.reducer;
export default modalReducer;
