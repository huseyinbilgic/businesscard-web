export function parseValidationErrors(
  err: unknown
): Record<string, string[]> | string {
  const data = (err as { response?: { data?: unknown } })?.response?.data;
  if (data && data !== null) {
    if (typeof data === "string") {
      return data;
    }

    if (typeof data === "object") {
      if ("message" in data && typeof data.message === "string") {
        return data.message;
      }
      return generateRecord(data);
    }
  }
  return "Bilinmeyen bir hata oluştu.";
}

export function generateRecord(data: object): Record<string, string[]> {
  const errors: Record<string, string[]> = {};

  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value)) {
      errors[key] = value;
    }
  }
  return errors;
}
