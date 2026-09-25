// Helper to extract date from photo filename if present; otherwise returns empty strings
export function extractDateFromFilename(filename: string): { dateStr: string; year: string } {
  // Check patterns like YYYYMMDD: e.g. beauty_20210413190847.jpg -> 13.04.2021
  const ymdMatch = filename.match(/(20\d{2})([01]\d)([0-3]\d)/);
  if (ymdMatch) {
    const year = ymdMatch[1];
    const month = ymdMatch[2];
    const day = ymdMatch[3];
    const m = parseInt(month, 10);
    const d = parseInt(day, 10);
    if (m >= 1 && m <= 12 && d >= 1 && d <= 31) {
      return { dateStr: `${day}.${month}.${year}`, year };
    }
  }

  // Check patterns like YYYY-MM-DD or YYYY_MM_DD or YYYY.MM.DD
  const sepMatch = filename.match(/(20\d{2})[-_./](0[1-9]|1[0-2])[-_./](0[1-9]|[12]\d|3[01])/);
  if (sepMatch) {
    const year = sepMatch[1];
    const month = sepMatch[2];
    const day = sepMatch[3];
    return { dateStr: `${day}.${month}.${year}`, year };
  }

  // Check patterns like DD-MM-YYYY or DD_MM_YYYY or DD.MM.YYYY
  const dmyMatch = filename.match(/(0[1-9]|[12]\d|3[01])[-_./](0[1-9]|1[0-2])[-_./](20\d{2})/);
  if (dmyMatch) {
    const day = dmyMatch[1];
    const month = dmyMatch[2];
    const year = dmyMatch[3];
    return { dateStr: `${day}.${month}.${year}`, year };
  }

  // No date found in photo filename
  return { dateStr: '', year: '' };
}
