import { CustomResponse, postDataType } from "@/types";
import axiosClient from "./axiosClient";

export interface postResponseType {
  id: string;
  user_id: string;
  post_content: string;
  post_background: string;
  post_object: string;
  image_id: string | null;
  list_image: string[];
  createdAt: string;
  userOwnPost: {
    lastName: string;
    firstName: string;
    avatar: string;
  };
}

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
