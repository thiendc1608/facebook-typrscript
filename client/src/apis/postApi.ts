import { CustomResponse, postDataType, postResponseType } from "@/types";
import axiosClient from "./axiosClient";

export interface reactEmotionPostType {
  user_id: string;
  post_id: string;
  emotion_id: number;
}

export const postAPI = {
  createPost: (
    data: postDataType
  ): Promise<CustomResponse & { post: postResponseType }> => {
    const url = "/post/create-post";
    return axiosClient.post(url, data);
  },

  updatePost: (
    data: postDataType & { post_id: string }
  ): Promise<CustomResponse & { post: postResponseType }> => {
    const url = "/post/update-post";
    return axiosClient.put(url, data);
  },

  deletePost: (post_id: string): Promise<CustomResponse> => {
    const url = "/post/delete-post/" + post_id;
    return axiosClient.delete(url);
  },

  getAllPost: ({
    limit,
    offset,
  }: {
    limit: number;
    offset: number;
  }): Promise<CustomResponse & { allPosts: postResponseType[] }> => {
    const url = "/post/get-all-post";
    return axiosClient.get(url, {
      params: {
        limit,
        offset,
      },
    });
  },
};
