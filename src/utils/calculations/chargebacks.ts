import { ProcessedPayout } from '../../types/payout';

export const calculateChargebacks = (payouts: ProcessedPayout[]): number => {
  return payouts
    .filter(payout => payout.type.includes('chargeback'))
    .reduce((sum, payout) => sum + payout.net, 0);
};