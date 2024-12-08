import React, { useState } from 'react';
import { ProcessedPayout } from '../types/payout';
import { formatCurrency } from '../utils/format';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { groupPayoutsByDate } from '../utils/processData';
import { isAfter } from 'date-fns';
import { ReservedFundsTag } from './ReservedFundsTag';

interface PayoutsListProps {
  payouts: ProcessedPayout[];
  currentPage: number;
  onPageChange: (page: number) => void;
}

export const PayoutsList: React.FC<PayoutsListProps> = ({ payouts, currentPage, onPageChange }) => {
  const ITEMS_PER_PAGE = 10;
  const [selectedPayouts, setSelectedPayouts] = useState<Set<string>>(new Set());
  
  const groupedPayouts = groupPayoutsByDate(payouts);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const upcomingPayouts = groupedPayouts.filter(payout => {
    const payoutDate = new Date(payout.date);
    payoutDate.setHours(0, 0, 0, 0);
    return isAfter(payoutDate, today);
  });

  const totalPages = Math.ceil(groupedPayouts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedPayouts = groupedPayouts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSelectAll = () => {
    if (selectedPayouts.size === upcomingPayouts.length) {
      setSelectedPayouts(new Set());
    } else {
      setSelectedPayouts(new Set(upcomingPayouts.map(p => p.date.toISOString())));
    }
  };

  const togglePayout = (date: string) => {
    const newSelected = new Set(selectedPayouts);
    if (newSelected.has(date)) {
      newSelected.delete(date);
    } else {
      newSelected.add(date);
    }
    setSelectedPayouts(newSelected);
  };

  const selectedTotal = upcomingPayouts
    .filter(p => selectedPayouts.has(p.date.toISOString()))
    .reduce((sum, p) => sum + p.totalAmount, 0);

  const hasPositiveReservedFunds = (date: Date) => {
    const payoutDate = new Date(date);
    payoutDate.setHours(0, 0, 0, 0);
    
    // Check if it's an upcoming payout
    if (!isAfter(payoutDate, today)) {
      return false;
    }

    return payouts.some(p => {
      const currentDate = new Date(p.date);
      currentDate.setHours(0, 0, 0, 0);
      return currentDate.getTime() === payoutDate.getTime() && 
             p.type.includes('reserved_funds') && 
             p.net > 0 &&
             !p.payoutStatus?.includes('in_transit');
    });
  };

  return (
    <div className="bg-card-dark rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 lg:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-text-primary">Recent Payouts</h2>
          {upcomingPayouts.length > 0 && (
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSelectAll}
                className="text-sm text-accent-purple hover:text-accent-purple/80"
              >
                {selectedPayouts.size === upcomingPayouts.length ? 'Unselect All' : 'Select All Upcoming'}
              </button>
              {selectedPayouts.size > 0 && (
                <div className="text-emerald-400 font-bold">
                  Selected Total: {formatCurrency(selectedTotal)}
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-text-secondary font-medium">Date</th>
                <th className="text-right py-3 px-4 text-text-secondary font-medium">Total Amount</th>
                <th className="w-24 text-center text-text-secondary font-medium">Status</th>
                <th className="w-16"></th>
              </tr>
            </thead>
            <tbody>
              {displayedPayouts.map((payout, index) => {
                const payoutDate = new Date(payout.date);
                payoutDate.setHours(0, 0, 0, 0);
                const isNextPayout = isAfter(payoutDate, today);
                const isSelected = selectedPayouts.has(payout.date.toISOString());
                const hasReserved = hasPositiveReservedFunds(payout.date);
                
                return (
                  <tr 
                    key={index} 
                    className={`border-b border-gray-700/50 hover:bg-gray-800/30 ${
                      isNextPayout ? 'bg-emerald-400/5' : ''
                    }`}
                  >
                    <td className={`py-3 px-4 whitespace-nowrap ${
                      isNextPayout ? 'text-emerald-400 font-bold text-lg' : 'text-text-primary'
                    }`}>
                      {payout.date.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className={`text-right py-3 px-4 ${
                      isNextPayout ? 'text-emerald-400 font-bold text-lg' : 'text-text-primary'
                    }`}>
                      {formatCurrency(payout.totalAmount)}
                    </td>
                    <td className="text-center py-3 px-4">
                      {hasReserved && <ReservedFundsTag />}
                    </td>
                    <td className="w-16 text-center">
                      {isNextPayout && (
                        <button
                          onClick={() => togglePayout(payout.date.toISOString())}
                          className={`p-2 rounded-lg transition-colors ${
                            isSelected ? 'bg-accent-purple text-white' : 'bg-gray-700/50 text-gray-400'
                          }`}
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center px-4 py-2 text-sm text-text-secondary disabled:opacity-50 disabled:cursor-not-allowed hover:text-text-primary"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Previous</span>
          </button>
          <span className="text-sm text-text-secondary">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center px-4 py-2 text-sm text-text-secondary disabled:opacity-50 disabled:cursor-not-allowed hover:text-text-primary"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};