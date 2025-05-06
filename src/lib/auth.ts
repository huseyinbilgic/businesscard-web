import { LoginUserRequest } from "@/models/requests/LoginUserRequest";
import { RegisterUserRequest } from "@/models/requests/RegisterUserRequest";
import { RegisterUserResponse } from "@/models/response/RegisterUserResponse";
import axios from "./axiosInstance";

const endpoint = 'auth/'

export const login = async (loginRequest: LoginUserRequest): Promise<string> => {
    try {
        const response = await axios.post<string>(`${endpoint}login`, loginRequest);
        
        if (response.data) {
            localStorage.setItem("jwtToken", response.data);
        }

        return response.data;
    } catch (error) {
        throw error;
    }
};

export const registerUser = async (registerUserRequest: RegisterUserRequest): Promise<RegisterUserResponse> => {
    try {
        const res = await axios.post<RegisterUserResponse>(`${endpoint}signup`, registerUserRequest);
        return res.data;
    } catch (error) {
        throw error;
    }
};

export const logout = async (): Promise<string> => {
    try {
        const res = await axios.post<string>(`${endpoint}logout`);
        localStorage.removeItem("jwtToken");
        return res.data;
    } catch (error) {
        throw error;
    }
};
