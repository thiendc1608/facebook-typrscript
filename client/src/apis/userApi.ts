import { CustomResponse, UserType } from "@/types"
import axiosClient from "./axiosClient"

export const userAPI = {
    getCurrentUser: (userId: string): Promise<CustomResponse & {user: UserType}> => {
        const url:string = "user/current-user"
        return axiosClient.get(url, {params: userId})
    },

    getAllUser: (userId: string): Promise<CustomResponse & {allUser: UserType[], allMadeFriend: UserType[]}> => {
        const url:string = `user/all-user/${userId}`
        return axiosClient.get(url)
    },

    addAndRemoveFriend: (data: {friend: UserType}, userId: string): Promise<CustomResponse> => {
        const url:string = `user/add-remove-friend/${userId}`
        return axiosClient.post(url, data)
    },

    confirmFriend: (data: {friend: UserType}, userId: string): Promise<CustomResponse> => {
        const url:string = `user/confirm-friend/${userId}`
        return axiosClient.post(url, data)
    },
}