import React, { useState } from 'react';
import { Calendar, DollarSign, RefreshCcw, AlertTriangle } from 'lucide-react';
import { Layout } from './components/Layout';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { MetricCard } from './components/MetricCard';
import { PayoutsList } from './components/PayoutsList';
import { PaymentChart } from './components/PaymentChart';
import { PayoutData, ProcessedPayout } from './types/payout';
import { formatCurrency } from './utils/format';
import {
  processPayoutData,
  calculateReservedFunds,
  calculateChargebacks,
  calculateRefunds,
  calculateCardBrandDistribution,
  getUpcomingPayouts,
} from './utils/processData';

function App() {
  const [payouts, setPayouts] = useState<ProcessedPayout[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPayoutIndex, setSelectedPayoutIndex] = useState(0);

  const handleDataLoaded = (data: PayoutData[]) => {
    try {
      const processed = processPayoutData(data);
      setPayouts(processed);
      setError(null);
    } catch (err) {
      setError('Error processing data. Please check the file format.');
    }
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setPayouts([]);
  };

  const upcomingPayouts = getUpcomingPayouts(payouts);
  const selectedPayout = upcomingPayouts[selectedPayoutIndex] || null;
  const totalUpcomingAmount = upcomingPayouts.reduce((sum, payout) => sum + payout.totalAmount, 0);

  const handleNextPayout = () => {
    if (selectedPayoutIndex < upcomingPayouts.length - 1) {
      setSelectedPayoutIndex(selectedPayoutIndex + 1);
    }
  };

  const handlePreviousPayout = () => {
    if (selectedPayoutIndex > 0) {
      setSelectedPayoutIndex(selectedPayoutIndex - 1);
    }
  };

  return (
    <Layout>
      <Header />
      
      {error && (
        <div className="bg-red-900 bg-opacity-20 border border-red-700 rounded-lg p-4 mb-8 text-red-500">
          {error}
        </div>
      )}

      {payouts.length === 0 ? (
        <FileUpload onDataLoaded={handleDataLoaded} onError={handleError} />
      ) : (
        <div className="space-y-6 lg:space-y-8">
          {upcomingPayouts.length > 0 && (
            <div className="bg-card-dark rounded-xl p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-2">Total Upcoming Payouts</h2>
              <div className="text-3xl font-bold text-emerald-400">
                {formatCurrency(totalUpcomingAmount)}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <MetricCard
              title="Next Payout"
              value={selectedPayout?.date || null}
              icon={Calendar}
              type="date"
              trend={2.5}
              nextPayoutAmount={selectedPayout?.totalAmount || 0}
              onNext={handleNextPayout}
              onPrevious={handlePreviousPayout}
              canNavigateNext={selectedPayoutIndex < upcomingPayouts.length - 1}
              canNavigatePrevious={selectedPayoutIndex > 0}
              payoutIndex={selectedPayoutIndex + 1}
              totalPayouts={upcomingPayouts.length}
            />
            <MetricCard
              title="Reserved Funds"
              value={calculateReservedFunds(payouts)}
              icon={DollarSign}
              type="currency"
              trend={-1.2}
            />
            <MetricCard
              title="Total Chargebacks"
              value={calculateChargebacks(payouts)}
              icon={RefreshCcw}
              type="currency"
              trend={0.8}
            />
            <MetricCard
              title="Total Refunds"
              value={calculateRefunds(payouts)}
              icon={AlertTriangle}
              type="currency"
              trend={-0.5}
            />
          </div>

          <PayoutsList
            payouts={payouts}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />

          <div className="h-[500px] lg:h-[400px]">
            <PaymentChart data={calculateCardBrandDistribution(payouts)} />
          </div>
        </div>
      )}
    </Layout>
  );
}

export default App;