import { PrivacyStatus } from "../enums/PrivacyStatus";
import { ContactRequest } from "./ContactRequest";

export interface BusinessCardRequest {
  fullName: string;
  company?: string | null;
  jobTitle?: string | null;
  aboutIt?: string | null;
  privacy: PrivacyStatus;
  contactsRequests: ContactRequest[];
}
