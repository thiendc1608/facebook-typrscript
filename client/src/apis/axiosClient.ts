// api/axiosClient.js
// import { UserState } from "@/redux/userSlice";
import axios, { AxiosInstance, AxiosResponse } from "axios";
// import axios, { AxiosHeaders, AxiosInstance, AxiosResponse } from "axios";
// import { jwtDecode } from "jwt-decode";
// import { authAPI } from "./authApi";

// Set up default config for http requests here

// Please have a look at here `https://github.com/axios/axios#request-config` for the full list of configs

const axiosClient: AxiosInstance = axios.create({
  withCredentials: true,
  baseURL: "http://localhost:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosClient.interceptors.request.use(
  async (config) => {
    // Handle token here ...
    // let localStorageData = localStorage.getItem(
    //   "persist:user"
    // ) as UserState | null;
    // if (localStorageData && typeof localStorageData === "string") {
    //   localStorageData = JSON.parse(localStorageData);
    //   const date = new Date();
    //   const decodedToken = jwtDecode(localStorageData!.token);
    //   if (
    //     decodedToken?.exp !== undefined &&
    //     decodedToken.exp < date.getTime() / 1000
    //   ) {
    //     const data = await authAPI.refreshToken();
    //     const refreshUser = {
    //       ...localStorageData,
    //       currentUser: {
    //         ...localStorageData!.currentUser,
    //       },
    //       token: data.newAccessToken,
    //     };
    //     type UserWithoutPassword = Omit<
    //       typeof refreshUser.currentUser,
    //       "password"
    //     >;
    //     localStorage.setItem(
    //       "persist:user",
    //       JSON.stringify({
    //         isLogin: true,
    //         token: refreshUser.token,
    //         currentUser: {
    //           ...refreshUser.currentUser,
    //           password: undefined,
    //         } as UserWithoutPassword,
    //       })
    //     );
    //   }
    //   const accessToken = localStorageData?.token.replace(/"/g, "");
    //   config.headers = new AxiosHeaders({
    //     ...config.headers,
    //     'Authorization': `Bearer ${accessToken}`,
    //   });
    // }

    return config;
  },
  (error) => {
    // Handle errors
    return error.response.data;
  }
);

axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    // Handle errors
    return error.response?.data;
  }
);

export default axiosClient;
