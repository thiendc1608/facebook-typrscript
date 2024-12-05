import { CustomResponse, emotionType, messageReactType } from "@/types";
import axiosClient from "./axiosClient";

export interface IReactMessage {
  message_id: string;
  emoji_dropper_id: string;
  emoji_icon: string;
}

const emojiAPI = {
  getEmoji: (): Promise<
    CustomResponse & {
      emojiList: emotionType[];
    }
  > => {
    const url = "emoji/get-emoji";
    return axiosClient.get(url);
  },

  getAllUserReactMessage: (
    message_id: string
  ): Promise<
    CustomResponse & {
      reactMessageList: messageReactType;
    }
  > => {
    const url = `emoji/get-all-react-message/${message_id}`;
    return axiosClient.get(url);
  },
};

export default emojiAPI;
