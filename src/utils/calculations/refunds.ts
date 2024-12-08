import { ProcessedPayout } from '../../types/payout';

export const calculateRefunds = (payouts: ProcessedPayout[]): number => {
  return payouts
    .filter(payout => payout.type.includes('refund'))
    .reduce((sum, payout) => sum + payout.net, 0);
};