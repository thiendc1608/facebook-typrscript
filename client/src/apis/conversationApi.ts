import { changNickNameType } from "@/components/Header/Messenger/InformationConservation";
import {
  allMessageType,
  imageCloudinaryType,
  messageType,
  reactMesType,
} from "./../types";
import { conversationType, CustomResponse } from "@/types";
import axiosClient from "./axiosClient";

type messageCreatedType = Omit<allMessageType, "createdAt" | "updatedAt">;
export type messageSearchType = {
  id: string;
  message: string;
  send_at: Date;
  senderInfo: {
    firstName: string;
    lastName: string;
    avatar: string;
  };
};

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

  getAllMessage: (): Promise<
    CustomResponse & {
      messages: allMessageType[];
      countReactMes: (reactMesType & { message_id: string })[] | [];
    }
  > => {
    const url = "conversation/get-all-message";
    return axiosClient.get(url);
  },

  getAllMessageSearch: (
    conversation_id: string
  ): Promise<
    CustomResponse & {
      messages: messageSearchType[];
    }
  > => {
    const url = `conversation/get-all-message-search/${conversation_id}`;
    return axiosClient.get(url);
  },

  createMessage: (
    data: messageType
  ): Promise<CustomResponse & { messageCreated: messageCreatedType }> => {
    const url = "conversation/create-message";
    return axiosClient.post(url, data);
  },

  uploadImageVideos: (
    data: FormData
  ): Promise<
    CustomResponse & {
      imageVideos: imageCloudinaryType[];
    }
  > => {
    const url = "conversation/imageVideos/upload";
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

  getAllNickName: (
    conversation_id: string
  ): Promise<
    CustomResponse & {
      allNickName: changNickNameType[];
    }
  > => {
    const url = `conversation/get-all-nickname/${conversation_id}`;
    return axiosClient.get(url);
  },

  getAllImageConversation: (
    conversation_id: string
  ): Promise<
    CustomResponse & {
      allImage: {
        imageInfo: {
          message_image: string;
        };
      }[];
    }
  > => {
    const url = `conversation/get-all-image/${conversation_id}`;
    return axiosClient.get(url);
  },
};
