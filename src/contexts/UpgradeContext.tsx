import React, { createContext, useContext, useState, useCallback } from 'react';

type UpgradeContextValue = {
  showUpgrade: boolean;
  setShowUpgrade: (show: boolean) => void;
  openUpgrade: () => void;
};

const UpgradeContext = createContext<UpgradeContextValue | null>(null);

export const useUpgrade = () => {
  const ctx = useContext(UpgradeContext);
  if (!ctx) throw new Error('useUpgrade must be used within UpgradeProvider');
  return ctx;
};

export const UpgradeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showUpgrade, setShowUpgrade] = useState(false);
  const openUpgrade = useCallback(() => setShowUpgrade(true), []);
  return (
    <UpgradeContext.Provider value={{ showUpgrade, setShowUpgrade, openUpgrade }}>
      {children}
    </UpgradeContext.Provider>
  );
};
