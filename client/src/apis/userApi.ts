import { CustomResponse, UserType } from "@/types";
import axiosClient from "./axiosClient";

export const userAPI = {
  getCurrentUser: (
    id: string
  ): Promise<CustomResponse & { user: UserType }> => {
    const url: string = "user/current-user";
    return axiosClient.get(url, { params: { id } });
  },

  getOtherUsers: (
    userId: string
  ): Promise<
    CustomResponse & { allUserNotFriend: UserType[]; allUserFriend: UserType[] }
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

  getAllUsers: (
    id: string
  ): Promise<CustomResponse & { userList: UserType[] }> => {
    const url: string = `user/all-users/${id}`;
    return axiosClient.get(url);
  },

  updateStatusUser: (
    status: string,
    userId: string
  ): Promise<CustomResponse> => {
    const url: string = `user/update-status/${userId}`;
    return axiosClient.put(url, { status });
  },

  changeCoverPicture: (
    data: {
      coverPicture: string;
      coverPicturePos: number;
    },
    userId: string
  ): Promise<CustomResponse> => {
    const url: string = `user/change-cover-picture/${userId}`;
    return axiosClient.put(url, data);
  },

  changeAvatar: (
    data: {
      avatar: string;
    },
    userId: string
  ): Promise<CustomResponse> => {
    const url: string = `user/change-avatar/${userId}`;
    return axiosClient.put(url, data);
  },

  changeBio: (
    data: { bio: string },
    userId: string
  ): Promise<CustomResponse> => {
    const url: string = `user/change-bio/${userId}`;
    return axiosClient.put(url, data);
  },

  changeAddress: (
    data: { address: string | null },
    userId: string
  ): Promise<CustomResponse> => {
    const url: string = `user/change-address/${userId}`;
    return axiosClient.put(url, data);
  },

  changePhone: (
    data: { phone: string | null },
    userId: string
  ): Promise<CustomResponse> => {
    const url: string = `user/change-phone/${userId}`;
    return axiosClient.put(url, data);
  },

  changeEmail: (
    data: { email: string | null },
    userId: string
  ): Promise<CustomResponse> => {
    const url: string = `user/change-email/${userId}`;
    return axiosClient.put(url, data);
  },

  changeDOB: (
    data: { date_of_birth: string | null },
    userId: string
  ): Promise<CustomResponse> => {
    const url: string = `user/change-DOB/${userId}`;
    return axiosClient.put(url, data);
  },

  changeGender: (
    data: { gender: string | null },
    userId: string
  ): Promise<CustomResponse> => {
    const url: string = `user/change-gender/${userId}`;
    return axiosClient.put(url, data);
  },
};
