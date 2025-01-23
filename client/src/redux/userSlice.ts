// import { userAPI } from "@/apis/userApi";
import { userAPI } from "@/apis/userApi";
import { UserType } from "@/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface UserState {
  tabProfile: string;
  isConfirmCoverPicture?: boolean;
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
    tabProfile: "Bài viết",
    isConfirmCoverPicture: false,
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

    setTabProfile: (state, action) => {
      state.tabProfile = action.payload;
    },

    setCoverPictureUser: (state, action) => {
      state.currentUser = {
        ...state.currentUser,
        cover_picture: action.payload,
      } as UserType;
    },

    setPosCoverPicture: (state, action) => {
      state.currentUser = {
        ...state.currentUser,
        cover_picture_pos: action.payload,
      } as UserType;
    },

    setAvatar: (state, action) => {
      state.currentUser = {
        ...state.currentUser,
        avatar: action.payload,
      } as UserType;
    },

    setBio: (state, action) => {
      state.currentUser = {
        ...state.currentUser,
        bio: action.payload.bio,
      } as UserType;
    },

    setAddress: (state, action) => {
      state.currentUser = {
        ...state.currentUser,
        address: action.payload.address,
      } as UserType;
    },

    setPhone: (state, action) => {
      state.currentUser = {
        ...state.currentUser,
        phone: action.payload.phone,
      } as UserType;
    },

    setEmail: (state, action) => {
      state.currentUser = {
        ...state.currentUser,
        email: action.payload.email,
      } as UserType;
    },

    setDOB: (state, action) => {
      state.currentUser = {
        ...state.currentUser,
        date_of_birth: action.payload.date_of_birth,
      } as UserType;
    },

    setGender: (state, action) => {
      state.currentUser = {
        ...state.currentUser,
        gender: action.payload.gender,
      } as UserType;
    },

    setConfirmCoverPicture: (state, action) => {
      state.isConfirmCoverPicture = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(getUserCurrent.pending, (state) => {
      // Bật trạng thái loading
      state.isLoading = "loading";
    });
    builder.addCase(getUserCurrent.fulfilled, (state, action) => {
      state.isLoading = "idle";
      state.currentUser = action.payload.user;
    });
    builder.addCase(getUserCurrent.rejected, (state) => {
      state.isLoading = "failed";
      state.currentUser = null;
    });
  },
});

export const {
  forgetPassword,
  login,
  setCoverPictureUser,
  setConfirmCoverPicture,
  setPosCoverPicture,
  setAvatar,
  setBio,
  setAddress,
  setPhone,
  setEmail,
  setDOB,
  setGender,
  setTabProfile,
} = userSlice.actions;
const userReducer = userSlice.reducer;
export default userReducer;

// action (async)
export const getUserCurrent = createAsyncThunk(
  "user/current-user",
  async (userId: string, { rejectWithValue }) => {
    // Gọi lên API backend
    try {
      const response = await userAPI.getCurrentUser(userId);
      return response;
    } catch (err: unknown) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      } else {
        // Handle the case where err is not an instance of Error
        return rejectWithValue("An unknown error occurred");
      }
    }
  }
);
