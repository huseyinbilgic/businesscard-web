import { PrivacyStatus } from "../enums/PrivacyStatus";
import { ContactResponse } from "./ContactResponse";

export interface BusinessCardResponse {
  id: number;
  userId: number;
  bcCode: string;
  fullName: string;
  company: string;
  jobTitle: string;
  aboutIt: string;
  privacy: PrivacyStatus;
  createdAt: string;
  updatedAt: string;
  contacts: ContactResponse[];
}
