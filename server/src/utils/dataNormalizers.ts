export const normalizeDate = (dateStr: string): string => {
  if (!dateStr || dateStr.trim() === "") return "";

  // Handle different date formats
  const formats = [
    /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
    /^\d{2}\/\d{2}\/\d{4}$/, // DD/MM/YYYY
    /^\d{4}\/\d{2}\/\d{2}$/, // YYYY/MM/DD
  ];

  let normalizedDate = dateStr.trim();

  // Convert DD/MM/YYYY to YYYY-MM-DD
  if (formats[1].test(normalizedDate)) {
    const [day, month, year] = normalizedDate.split("/");
    normalizedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(
      2,
      "0"
    )}`;
  }
  // Convert YYYY/MM/DD to YYYY-MM-DD
  else if (formats[2].test(normalizedDate)) {
    normalizedDate = normalizedDate.replace(/\//g, "-");
  }

  return normalizedDate;
};

export const normalizeBoolean = (value: string): boolean => {
  if (!value) return false;
  const normalized = value.toLowerCase().trim();
  return normalized === "true" || normalized === "1" || normalized === "yes";
};

export const normalizeNumber = (value: string): number | null => {
  if (!value || value.trim() === "" || value.toLowerCase() === "n/a") {
    return null;
  }

  const num = parseFloat(value);
  return isNaN(num) ? null : num;
};
