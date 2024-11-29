import { allMessageType, imageCloudinaryType, messageType } from "./../types";
import { conversationType, CustomResponse } from "@/types";
import axiosClient from "./axiosClient";

export const conversationAPI = {
  getAllConversation: (
    current_id: string
  ): Promise<CustomResponse & { conversations: conversationType[] }> => {
    const url = `conversation/get-all-conversation/${current_id}`;
    return axiosClient.get(url);
  },

  deleteConversation: (conversation_id: string): Promise<CustomResponse> => {
    const url = `conversation/delete-conversation/${conversation_id}`;
    return axiosClient.delete(url);
  },

  getAllMessage: (
    conversation_id: string
  ): Promise<CustomResponse & { messages: allMessageType[] }> => {
    const url = `conversation/get-all-message/${conversation_id}`;
    return axiosClient.get(url);
  },

  createMessage: (data: messageType): Promise<CustomResponse> => {
    const url = "conversation/create-message";
    return axiosClient.post(url, data);
  },

  uploadImages: (
    data: FormData
  ): Promise<
    CustomResponse & {
      images: imageCloudinaryType[];
    }
  > => {
    const url = "conversation/images/upload";
    return axiosClient.post(url, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  deleteImages: (data: string): Promise<CustomResponse> => {
    const url = `conversation/delete-image/${data}`;
    return axiosClient.delete(url);
  },

  getOtherUserInConversation: (
    conversation_id: string
  ): Promise<
    CustomResponse & {
      listUserConversation: {
        user_id: string;
      }[];
    }
  > => {
    const url = `conversation/get-other-user-conversation/${conversation_id}`;
    return axiosClient.get(url);
  },
};
