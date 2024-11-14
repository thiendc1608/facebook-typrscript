import { CustomResponse, FormData, UserType } from "@/types"
import axiosClient from "./axiosClient"

export const authAPI = {
    userRegister: (data:FormData): Promise<CustomResponse> => {
        const url:string = "auth/register"
        return axiosClient.post(url, data)
    },

    userLogin: (data: Pick<FormData, "email" | "password">): Promise<CustomResponse & {user: UserType, token:string}> => {
        const url:string = "auth/login"
        return axiosClient.post(url, data)
    },

    forgetPassword: (data: Pick<FormData, "email" | "OTP">): Promise<CustomResponse> => {
        const url:string = "auth/forget-password"
        return axiosClient.post(url, data)
    },

    changePassword: (data: Pick<FormData, "email" | "password">): Promise<CustomResponse> => {
        const url:string = "auth/change-password"
        return axiosClient.post(url, data)
    },

    refreshToken: (): Promise<CustomResponse & {newAccessToken: string}> => {
        const url:string = "auth/refresh-token"
        return axiosClient.post(url)
    }
}