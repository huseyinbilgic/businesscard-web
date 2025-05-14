import * as yup from "yup";
import { OptionModel } from "../models/OptionModel";
import { PrivacyStatus } from "@/models/enums/PrivacyStatus";
import { ContactType } from "@/models/enums/ContactType";

export const privacyOptions: OptionModel[] = [
  { label: PrivacyStatus.PUBLIC, value: PrivacyStatus.PUBLIC },
  { label: PrivacyStatus.PRIVATE, value: PrivacyStatus.PRIVATE },
  { label: PrivacyStatus.RESTRICTED, value: PrivacyStatus.RESTRICTED },
];

export const contactTypeOptions: OptionModel[] = [
  { label: ContactType.PHONE, value: ContactType.PHONE },
  { label: ContactType.EMAIL, value: ContactType.EMAIL },
  { label: ContactType.WEBSITE, value: ContactType.WEBSITE },
  { label: ContactType.ADDRESS, value: ContactType.ADDRESS },
  { label: ContactType.SOCIAL, value: ContactType.SOCIAL },
];

export const contactSchema = yup.object({
  id: yup.number().notRequired(),
  contactType: yup
    .mixed<ContactType>()
    .oneOf(contactTypeOptions.map((p) => p.label as ContactType))
    .required("ContactType is required"),
  label: yup.string().required("Label is required").max(255),
  contactValue: yup.string().required("Value is required").max(255),
});

export const businessCardSchema = yup.object({
  fullName: yup.string().required("Fullname is required").max(255),
  company: yup.string().max(255).notRequired().default(""),
  jobTitle: yup.string().max(255).notRequired().default(""),
  aboutIt: yup.string().notRequired().default(""),
  privacy: yup
    .mixed<PrivacyStatus>()
    .oneOf(privacyOptions.map((p) => p.label as PrivacyStatus))
    .required("Privacy is required"),
  contactsRequests: yup.array().of(contactSchema).required(),
});

export type BusinessCardFormData = yup.InferType<typeof businessCardSchema>;
