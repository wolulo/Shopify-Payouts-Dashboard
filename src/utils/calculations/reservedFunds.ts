import { ProcessedPayout } from '../../types/payout';

export const calculateReservedFunds = (payouts: ProcessedPayout[]): number => {
  return payouts
    .filter(payout => 
      payout.type.includes('reserved_funds') && 
      payout.net > 0
    )
    .reduce((sum, payout) => sum + payout.net, 0);
};