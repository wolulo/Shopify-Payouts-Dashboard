export interface PayoutData {
  'Payout Date': string;
  'Net': string;
  'Type': string;
  'Card Brand': string;
  'Payout Status': string;
}

export interface ProcessedPayout {
  date: Date;
  net: number;
  type: string;
  cardBrand: string;
  payoutStatus: string;
}