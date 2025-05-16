import { PrivacyUser } from "@/models/response/PrivacyUser";
import axios from "./axiosInstance";

const endPoint = "business-cards-privacy/";

export const fetchPrivacyUsersByBusinessCardId = async (
  id: number
): Promise<PrivacyUser[]> => {
  try {
    const response = await axios.get<PrivacyUser[]>(
      `${endPoint}business-card/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
