import { CustomResponse, infoComment } from "@/types";
import axiosClient from "./axiosClient";

interface emotionCommentType {
  id: number;
  comment: {
    id: number;
  };
  userInfo: {
    lastName: string;
    firstName: string;
    avatar: string;
  };
  emotion: {
    emotion_name: string;
    emotion_post: string;
  };
}

export const commentAPI = {
  createComment: (
    data: Pick<
      infoComment,
      "post_id" | "user_id" | "comment_text" | "parent_comment_id"
    >
  ): Promise<CustomResponse & { comment: infoComment }> => {
    const url = "/comment/create-comment";
    return axiosClient.post(url, data);
  },

  updateComment: (
    data: Pick<
      infoComment,
      "id" | "post_id" | "user_id" | "comment_text" | "parent_comment_id"
    >
  ): Promise<CustomResponse & { comment: infoComment }> => {
    const url = "/comment/update-comment";
    return axiosClient.post(url, data);
  },

  deleteComment: (
    id: number
  ): Promise<CustomResponse & { deleteId: number }> => {
    const url = `/comment/delete-comment/${id}`;
    return axiosClient.delete(url);
  },

  reactEmotionComment: (data: {
    user_id: string;
    comment_id: number;
    emotion_id: number;
  }): Promise<CustomResponse & { emotionComment: emotionCommentType }> => {
    const url = "/comment/react-emotion-comment";
    return axiosClient.post(url, data);
  },
};
