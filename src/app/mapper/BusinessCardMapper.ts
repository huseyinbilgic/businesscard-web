import { BusinessCardRequest } from "@/models/requests/BusinessCardRequest";
import { BusinessCardResponse } from "@/models/response/BusinessCardResponse";
import { BusinessCardFormData } from "../forms/form-data/BusinessCardFormData";

export function mapBusinessCardResponseToFormData(
  card: BusinessCardResponse
): BusinessCardRequest {
  return {
    fullName: card.fullName,
    company: card.company,
    jobTitle: card.jobTitle,
    aboutIt: card.aboutIt,
    privacy: card.privacy,
    contactsRequests: card.contacts.map((c) => ({
      id: c.id,
      contactType: c.contactType,
      label: c.label,
      contactValue: c.contactValue,
    })),
  };
}

export function mapBusinessCardFormDataToBusinessCardRequest(
  params: BusinessCardFormData
): BusinessCardRequest {
  return {
    ...params,
  };
}
