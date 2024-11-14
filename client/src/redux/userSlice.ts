// import { userAPI } from "@/apis/userApi";
import { UserType } from "@/types";
import { createSlice } from "@reduxjs/toolkit";
// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface UserState {
  isLoading: "loading" | "idle" | "failed";
  isLogin: boolean;
  token: string;
  currentUser: UserType | null;
  email: string;
  OTP?: number;
}

const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoading: "idle",
    isLogin: false,
    token: "",
    currentUser: null,
    email: "",
    OTP: 0,
  } as UserState,
  reducers: {
    // action creators function (type: "user/forgetPassword", payload: {email, OTP})
    forgetPassword: (state, action) => {
      state.email = action.payload.email;
      state.OTP = action.payload.OTP;
    },
    login: (state, action) => {
      state.isLogin = action.payload.isLogin;
      state.token = action.payload.token;
      state.currentUser = action.payload.user;
    },
  },
  // extraReducers: (builder) => {
  //   builder.addCase(getUserCurrent.pending, (state) => {
  //     // Bật trạng thái loading
  //     state.isLoading = "loading";
  //   });
  //   builder.addCase(getUserCurrent.fulfilled, (state, action) => {
  //     state.isLoading = "idle";
  //     state.currentUser = action.payload.user;
  //   });
  //   builder.addCase(getUserCurrent.rejected, (state) => {
  //     state.isLoading = "failed";
  //     state.currentUser = null;
  //   });
  // },
});

export const { forgetPassword, login } = userSlice.actions;
const userReducer = userSlice.reducer;
export default userReducer;

// action (async)
// export const getUserCurrent = createAsyncThunk(
//   "user/current-user",
//   async (_, { rejectWithValue }) => {
//     // Gọi lên API backend
//     try {
//       const response = await userAPI.getCurrentUser();
//       return response;
//     } catch (err: unknown) {
//       if (err instanceof Error) {
//         return rejectWithValue(err.message);
//       } else {
//         // Handle the case where err is not an instance of Error
//         return rejectWithValue("An unknown error occurred");
//       }
//     }
//   }
// );
