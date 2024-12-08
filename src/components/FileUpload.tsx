import React, { useCallback, useState } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import Papa from 'papaparse';
import { PayoutData } from '../types/payout';
import { validatePayoutData } from '../utils/validation';

interface FileUploadProps {
  onDataLoaded: (data: PayoutData[]) => void;
  onError: (error: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onDataLoaded, onError }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = useCallback((file: File) => {
    if (!file.name.endsWith('.csv')) {
      onError('Please upload a CSV file');
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const validationError = validatePayoutData(results.data);
          if (validationError) {
            onError(validationError);
            return;
          }
          onDataLoaded(results.data as PayoutData[]);
        } catch (err) {
          onError('Invalid data format in CSV file');
        }
      },
      error: (error) => {
        onError(`Error parsing CSV: ${error.message}`);
      }
    });
  }, [onDataLoaded, onError]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  }, [handleFileUpload]);

  return (
    <div className="max-w-2xl mx-auto">
      <div
        className={`w-full p-8 border-2 border-dashed rounded-lg text-center transition-colors ${
          isDragging
            ? 'border-accent-purple bg-accent-purple bg-opacity-5'
            : 'border-gray-600 hover:border-accent-purple'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <label className="cursor-pointer block">
          <input
            type="file"
            accept=".csv"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
            className="hidden"
          />
          <Upload className="mx-auto h-12 w-12 text-accent-purple" />
          <p className="mt-4 text-lg font-medium text-text-primary">
            Drop your Shopify payout CSV file here
          </p>
          <p className="mt-2 text-sm text-text-secondary">
            or click to browse your files
          </p>
        </label>
      </div>
      
      <div className="mt-4 p-4 bg-card-dark rounded-lg">
        <h3 className="text-sm font-medium text-text-primary mb-2 flex items-center">
          <AlertCircle className="h-4 w-4 mr-2 text-accent-purple" />
          Required CSV Format
        </h3>
        <p className="text-sm text-text-secondary">
          Your CSV file must include the following columns:
        </p>
        <ul className="mt-2 text-sm text-text-secondary list-disc list-inside">
          <li>Payout Date (YYYY-MM-DD)</li>
          <li>Net (numerical amount)</li>
          <li>Type (transaction type)</li>
          <li>Card Brand (payment method)</li>
        </ul>
      </div>
    </div>
  );
};