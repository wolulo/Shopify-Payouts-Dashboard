import React from 'react';
import { Home } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <div className="flex items-center mb-8">
      <button className="flex items-center space-x-2 px-4 py-2 bg-card-dark rounded-lg hover:bg-opacity-80">
        <Home className="h-5 w-5 text-accent-purple" />
        <span className="text-text-primary">Dashboard</span>
      </button>
    </div>
  );
};