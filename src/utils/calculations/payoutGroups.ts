import { ProcessedPayout } from '../../types/payout';
import { parse, isAfter, format, compareDesc } from 'date-fns';

export const groupPayoutsByDate = (payouts: ProcessedPayout[]): { date: Date; totalAmount: number }[] => {
  const groupedMap = payouts.reduce((acc, payout) => {
    const dateKey = format(payout.date, 'yyyy-MM-dd');
    if (!acc[dateKey]) {
      acc[dateKey] = {
        date: payout.date,
        totalAmount: 0
      };
    }
    acc[dateKey].totalAmount += payout.net;
    return acc;
  }, {} as Record<string, { date: Date; totalAmount: number }>);

  return Object.values(groupedMap).sort((a, b) => compareDesc(a.date, b.date));
};

export const getUpcomingPayouts = (payouts: ProcessedPayout[]): { date: Date; totalAmount: number }[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const groupedPayouts = groupPayoutsByDate(payouts);
  return groupedPayouts
    .filter(payout => {
      const payoutDate = new Date(payout.date);
      payoutDate.setHours(0, 0, 0, 0);
      return isAfter(payoutDate, today);
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime());
};