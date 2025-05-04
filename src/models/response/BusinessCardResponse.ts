import { PrivacyStatus } from "../enums/PrivacyStatus";

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
  //private List<ContactResponse> contacts;
}
