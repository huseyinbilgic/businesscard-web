import { BusinessCardResponse } from "@/models/response/BusinessCardResponse";
import axios from "./axiosInstance";
import { BusinessCardRequest } from "@/models/requests/BusinessCardRequest";
import { parseValidationErrors } from "./parseValidationErrors";

const endPoint = "business-cards/";

export const fetchAllBusinesCards = async (): Promise<
  BusinessCardResponse[]
> => {
  try {
    const response = await axios.get<BusinessCardResponse[]>(endPoint);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchBusinessCardById = async (
  id: number
): Promise<BusinessCardResponse> => {
  try {
    const response = await axios.get<BusinessCardResponse>(`${endPoint}${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const saveNewBusinessCardByUsername = async (
  body: BusinessCardRequest
): Promise<Record<string, string[]> | BusinessCardResponse | string> => {
  try {
    const response = await axios.post<BusinessCardResponse>(endPoint, body);
    return response.data;
  } catch (error) {
    throw parseValidationErrors(error);
  }
};

export const updateBusinessCardById = async (
  id: number,
  body: BusinessCardRequest
): Promise<Record<string, string[]> | BusinessCardResponse | string> => {
  try {
    const response = await axios.patch<BusinessCardResponse>(
      `${endPoint}${id}`,
      body
    );
    return response.data;
  } catch (error) {
    throw parseValidationErrors(error);
  }
};

export const deleteBusinessCardById = async (
  id: number
): Promise<string> => {
  try {
    const response = await axios.delete<string>(
      `${endPoint}${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
