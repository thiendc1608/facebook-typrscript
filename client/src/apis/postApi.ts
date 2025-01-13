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
