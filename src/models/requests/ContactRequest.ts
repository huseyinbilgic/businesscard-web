import { ContactType } from "../enums/ContactType";

export interface ContactRequest{
  id: number;
  contactType: ContactType;
  label: string;
  contactValue: string;
}