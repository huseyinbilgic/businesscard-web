import { PrivacyUser } from "@/models/response/PrivacyUser";
import axios from "./axiosInstance";

const endpoint = "user/";

export const searchUser = async (term: string): Promise<PrivacyUser[]> => {
  try {
    const response = await axios.get<PrivacyUser[]>(`${endpoint}search`, {
      params: { keyword: term },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
