export interface LoveMilestone {
  id: string;
  year: string;
  date: string;
  title: string;
  description: string;
  category: string;
  iconName: string;
}

export interface MemoryPhoto {
  id: string;
  title: string;
  date: string;
  location: string;
  note: string;
  imageUrl?: string;
  svgPreset?: string;
  rotation?: number;
}

export interface LoveCoupon {
  id: string;
  title: string;
  description: string;
  condition: string;
  code: string;
  isRedeemed: boolean;
  redeemedAt?: string;
  badge: string;
}

export interface LoveLetterData {
  recipient: string;
  sender: string;
  salutation: string;
  title: string;
  paragraphs: string[];
  quote: string;
  closing: string;
  signatureDate: string;
}

export interface CoupleSettings {
  startDate: string; // ISO or YYYY-MM-DD
  herName: string;
  hisName: string;
  herNickname: string;
  hisNickname: string;
  anniversaryMessage: string;
}
