import { ContactType } from "../enums/ContactType";

export interface ContactResponse {
  id: number;
  businessCardId: number;
  contactType: ContactType;
  label: string;
  contactValue: string;
}
