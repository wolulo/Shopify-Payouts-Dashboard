import { ProcessedPayout } from '../../types/payout';

export const calculateCardBrandDistribution = (payouts: ProcessedPayout[]): { name: string; value: number }[] => {
  const distribution = payouts.reduce((acc, payout) => {
    if (!acc[payout.cardBrand]) {
      acc[payout.cardBrand] = 0;
    }
    acc[payout.cardBrand]++;
    return acc;
  }, {} as Record<string, number>);

  const total = Object.values(distribution).reduce((sum, count) => sum + count, 0);

  return Object.entries(distribution)
    .map(([name, count]) => ({
      name,
      value: (count / total) * 100
    }))
    .sort((a, b) => b.value - a.value);
};