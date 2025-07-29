'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface StatsContextType {
  totalDeposit: number;
  totalBorrow: number;
  setTotalDeposit: (value: number) => void;
  setTotalBorrow: (value: number) => void;
}

const StatsContext = createContext<StatsContextType | undefined>(undefined);

export const useStats = () => {
  const context = useContext(StatsContext);
  if (context === undefined) {
    throw new Error('useStats must be used within a StatsProvider');
  }
  return context;
};

interface StatsProviderProps {
  children: ReactNode;
}

export const StatsProvider: React.FC<StatsProviderProps> = ({ children }) => {
  const [totalDeposit, setTotalDeposit] = useState(0);
  const [totalBorrow, setTotalBorrow] = useState(0);

  return (
    <StatsContext.Provider
      value={{
        totalDeposit,
        totalBorrow,
        setTotalDeposit,
        setTotalBorrow,
      }}
    >
      {children}
    </StatsContext.Provider>
  );
};
