export { calculateReservedFunds } from './calculations/reservedFunds';
export { calculateChargebacks } from './calculations/chargebacks';
export { calculateRefunds } from './calculations/refunds';
export { groupPayoutsByDate, getUpcomingPayouts } from './calculations/payoutGroups';
export { calculateCardBrandDistribution } from './calculations/cardDistribution';

import { PayoutData, ProcessedPayout } from '../types/payout';
import { parse } from 'date-fns';

export const processPayoutData = (data: PayoutData[]): ProcessedPayout[] => {
  return data.map((row) => ({
    date: parse(row['Payout Date'], 'yyyy-MM-dd', new Date()),
    net: parseFloat(row['Net']),
    type: row['Type'].toLowerCase(),
    cardBrand: row['Card Brand'],
    payoutStatus: row['Payout Status']?.toLowerCase() || ''
  })).sort((a, b) => b.date.getTime() - a.date.getTime());
};