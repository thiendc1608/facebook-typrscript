import { CustomResponse, storyDataType} from "@/types"
import axiosClient from "./axiosClient"

export const storyAPI = {
    createStory: (data: storyDataType): Promise<CustomResponse & { story: storyDataType }> => {
        const url = 'story/create-story'
        return axiosClient.post(url, data)
    },

    getAllStories: (): Promise<CustomResponse & { allStories: storyDataType[]}> => {
        const url = 'story/get-stories'
        return axiosClient.get(url)
    },

    getDetailStory: (user_id: string): Promise<CustomResponse & { storyViewer: {[user_id: string]: storyDataType[]}[]}> => {
        const url = `story/detail-story/${user_id}`
        return axiosClient.get(url)
    }
}