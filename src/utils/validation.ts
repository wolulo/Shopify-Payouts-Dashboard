import { PayoutData } from '../types/payout';

export const validatePayoutData = (data: any[]): string | null => {
  if (!Array.isArray(data) || data.length === 0) {
    return 'CSV file is empty';
  }

  const requiredColumns = ['Payout Date', 'Net', 'Type', 'Card Brand'];
  const headers = Object.keys(data[0]);
  
  const missingColumns = requiredColumns.filter(col => !headers.includes(col));
  if (missingColumns.length > 0) {
    return `Missing required columns: ${missingColumns.join(', ')}`;
  }

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    
    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(row['Payout Date'])) {
      return `Invalid date format in row ${i + 1}. Expected YYYY-MM-DD`;
    }

    // Validate Net amount
    const netAmount = parseFloat(row['Net']);
    if (isNaN(netAmount)) {
      return `Invalid Net amount in row ${i + 1}`;
    }

    // Validate Type and Card Brand are not empty
    if (!row['Type']?.trim()) {
      return `Missing Type in row ${i + 1}`;
    }
    if (!row['Card Brand']?.trim()) {
      return `Missing Card Brand in row ${i + 1}`;
    }
  }

  return null;
};