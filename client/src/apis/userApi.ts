import { CustomResponse, UserType } from "@/types";
import axiosClient from "./axiosClient";

export const userAPI = {
  getCurrentUser: (
    userId: string
  ): Promise<CustomResponse & { user: UserType }> => {
    const url: string = "user/current-user";
    return axiosClient.get(url, { params: userId });
  },

  getOtherUsers: (
    userId: string
  ): Promise<
    CustomResponse & { allUser: UserType[]; allMadeFriend: UserType[] }
  > => {
    const url: string = `user/other-users/${userId}`;
    return axiosClient.get(url);
  },

  addAndRemoveFriend: (
    data: { friend: UserType },
    userId: string
  ): Promise<CustomResponse> => {
    const url: string = `user/add-remove-friend/${userId}`;
    return axiosClient.post(url, data);
  },

  confirmFriend: (
    data: { friend: UserType },
    userId: string
  ): Promise<CustomResponse> => {
    const url: string = `user/confirm-friend/${userId}`;
    return axiosClient.post(url, data);
  },

  getAllUsers: (): Promise<CustomResponse & { userList: UserType[] }> => {
    const url: string = "user/all-users";
    return axiosClient.get(url);
  },

  updateStatusUser: (
    status: string,
    userId: string
  ): Promise<CustomResponse> => {
    const url: string = `user/update-status/${userId}`;
    return axiosClient.put(url, { status });
  },
};
