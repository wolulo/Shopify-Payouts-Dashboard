import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-dashboard-dark text-text-primary">
      <div className="max-w-7xl mx-auto p-4 lg:p-8">
        {children}
      </div>
    </div>
  );
};