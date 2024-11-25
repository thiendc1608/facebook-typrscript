import { imageCloudinaryType, messageType } from "./../types";
import { conversationType, CustomResponse, participantsType } from "@/types";
import axiosClient from "./axiosClient";

interface participantType {
  conversation_id: string;
  participants: { user_id: string }[];
  join_at: Date;
}
export const conversationAPI = {
  createConversation: (data: participantType): Promise<CustomResponse> => {
    const url = "conversation/create-conversation";
    return axiosClient.post(url, data);
  },

  getAllConversation: (): Promise<
    CustomResponse & { conversations: conversationType[] }
  > => {
    const url = "conversation/get-all-conversation";
    return axiosClient.get(url);
  },

  addParticipant: (data: participantsType): Promise<CustomResponse> => {
    const url = "conversation/add-participant";
    return axiosClient.post(url, data);
  },

  deleteConversation: (conversation_id: string): Promise<CustomResponse> => {
    const url = `conversation/delete-conversation/${conversation_id}`;
    return axiosClient.delete(url);
  },

  getAllMessage: (
    conversation_id: string
  ): Promise<CustomResponse & { messages: messageType[] }> => {
    const url = `conversation/get-all-message/${conversation_id}`;
    return axiosClient.get(url);
  },

  createMessage: (data: messageType): Promise<CustomResponse> => {
    const url = "conversation/create-message";
    return axiosClient.post(url, data);
  },

  createImages: (
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
};
