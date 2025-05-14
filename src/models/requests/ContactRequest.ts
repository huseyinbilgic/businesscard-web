import { ContactType } from "../enums/ContactType";

export interface ContactRequest{
  id?: number | null;
  contactType: ContactType;
  label: string;
  contactValue: string;
}