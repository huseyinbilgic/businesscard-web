import { ContactType } from "@/models/enums/ContactType";
import { PrivacyStatus } from "@/models/enums/PrivacyStatus";

export interface OptionModel {
  label: PrivacyStatus | ContactType;
  value: string;
}
