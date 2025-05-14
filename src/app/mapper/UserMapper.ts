import { RegisterUserRequest } from "@/models/requests/RegisterUserRequest";
import { RegisterFormData } from "../forms/form-data/RegisterFormData";

export function mapRegisterFormDataToRegisterUserRequest(
  params: RegisterFormData
): RegisterUserRequest {
  return {
    email: params.email,
    username: params.username,
    password: params.password,
  };
}
