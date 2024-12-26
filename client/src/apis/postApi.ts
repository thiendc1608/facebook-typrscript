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
    last_name: string;
    first_name: string;
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
};
