import { LoginUserRequest } from "../models/requests/LoginUserRequest";
import { RegisterUserRequest } from "../models/requests/RegisterUserRequest";
import { RegisterUserResponse } from "../models/response/RegisterUserResponse";
import axios from "./axiosInstance";

export const login = async (loginRequest: LoginUserRequest): Promise<string> => {
    try {
        const response = await axios.post<string>("auth/login", loginRequest);

        if (response.data) {
            localStorage.setItem("token", response.data);
        }

        return response.data;
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
};

export const registerUser = async (registerUserRequest: RegisterUserRequest): Promise<RegisterUserResponse> => {
    try {
        const res = await axios.post<RegisterUserResponse>("user/signup", registerUserRequest);
        return res.data;
    } catch (error) {
        console.error("Register failed:", error);
        throw error;
    }
};

export const logout = async (): Promise<string> => {
    try {
        const res = await axios.post<string>("auth/logout");
        localStorage.removeItem("token");
        return res.data;
    } catch (error) {
        console.error("Logout failed:", error);
        throw error;
    }
};
