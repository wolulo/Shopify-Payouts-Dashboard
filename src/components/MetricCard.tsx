import React from 'react';
import { LucideIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatCurrency } from '../utils/format';

interface MetricCardProps {
  title: string;
  value: number | string | Date | null;
  icon: LucideIcon;
  type?: 'currency' | 'date' | 'text';
  trend?: number;
  nextPayoutAmount?: number;
  onNext?: () => void;
  onPrevious?: () => void;
  canNavigateNext?: boolean;
  canNavigatePrevious?: boolean;
  payoutIndex?: number;
  totalPayouts?: number;
}

export const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  type = 'text',
  trend,
  nextPayoutAmount,
  onNext,
  onPrevious,
  canNavigateNext,
  canNavigatePrevious,
  payoutIndex,
  totalPayouts
}) => {
  const formattedValue = () => {
    if (value === null) return 'N/A';
    if (type === 'currency') return formatCurrency(value as number);
    if (type === 'date' && nextPayoutAmount !== undefined) {
      const date = value as Date;
      const formattedDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      return (
        <div>
          <div className="text-3xl font-bold text-emerald-400 mb-2">
            {formatCurrency(nextPayoutAmount)}
          </div>
          <div className="text-xl font-bold text-white">
            {formattedDate}
          </div>
          {payoutIndex && totalPayouts && (
            <div className="text-sm text-text-secondary mt-1">
              Payout {payoutIndex} of {totalPayouts}
            </div>
          )}
        </div>
      );
    }
    return value;
  };

  return (
    <div className="bg-card-dark rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-text-secondary text-sm">{title}</p>
        <div className="p-3 bg-accent-purple bg-opacity-20 rounded-lg">
          <Icon className="h-6 w-6 text-accent-purple" />
        </div>
      </div>
      
      <div className={`font-bold ${type === 'date' ? '' : 'text-2xl'}`}>
        {formattedValue()}
      </div>
      
      {type === 'date' && onPrevious && onNext && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={onPrevious}
            disabled={!canNavigatePrevious}
            className="p-2 rounded-lg hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={onNext}
            disabled={!canNavigateNext}
            className="p-2 rounded-lg hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
      
      {trend !== undefined && type !== 'date' && (
        <div className={`flex items-center mt-2 text-sm ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          <span>{trend >= 0 ? '+' : ''}{trend}%</span>
        </div>
      )}
    </div>
  );
};