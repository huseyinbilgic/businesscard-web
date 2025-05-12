import { PrivacyStatus } from "../enums/PrivacyStatus";
import { ContactRequest } from "./ContactRequest";

export interface BusinessCardRequest {
  fullName: string;
  company: string;
  jobTitle: string;
  aboutIt: string;
  privacy: PrivacyStatus;
  contactsRequests: ContactRequest[];
}
