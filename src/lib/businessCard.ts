import { BusinessCardResponse } from "@/models/response/BusinessCardResponse";
import axios from "./axiosInstance";

const endPoint = 'business-cards/';

export const fetchAllBusinesCardsByUsername = async (): Promise<BusinessCardResponse[]> => {
    try {
        const response = await axios.get<BusinessCardResponse[]>(endPoint);
        return response.data;
    } catch (error) {
        throw error;
    }
}