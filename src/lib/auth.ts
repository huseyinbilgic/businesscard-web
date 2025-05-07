import { LoginUserRequest } from "@/models/requests/LoginUserRequest";
import { RegisterUserRequest } from "@/models/requests/RegisterUserRequest";
import axios from "./axiosInstance";
import { store } from "@/store";
import { setLoggedIn } from "@/store/authSlice";
import { parseValidationErrors } from "./parseValidationErrors";

const endpoint = "auth/";

export const login = async (
  loginRequest: LoginUserRequest
): Promise<Record<string, string[]> | string> => {
  try {
    const response = await axios.post<string>(`${endpoint}login`, loginRequest);

    if (response.data) {
      localStorage.setItem("jwtToken", response.data);
      store.dispatch(setLoggedIn(true));
    }

    return response.data;
  } catch (error) {
    throw parseValidationErrors(error);
  }
};

export const registerUser = async (
  registerUserRequest: RegisterUserRequest
): Promise<Record<string, string[]> | string> => {
  try {
    const res = await axios.post<Record<string, string[]> | string>(
      `${endpoint}signup`,
      registerUserRequest
    );
    return res.data;
  } catch (error) {
    throw parseValidationErrors(error);
  }
};

export const logout = async (): Promise<string> => {
  try {
    const res = await axios.post<string>(`${endpoint}logout`);
    localStorage.removeItem("jwtToken");
    store.dispatch(setLoggedIn(false));
    return res.data;
  } catch (error) {
    throw parseValidationErrors(error);
  }
};
