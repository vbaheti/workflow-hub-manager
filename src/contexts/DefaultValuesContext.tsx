
import React, { createContext, useContext, ReactNode } from 'react';

interface DefaultValuesContextType {
  defaultProject: string;
  defaultState: string;
  defaultRole: string;
}

const DefaultValuesContext = createContext<DefaultValuesContextType | undefined>(undefined);

export const DefaultValuesProvider = ({ children }: { children: ReactNode }) => {
  const value = {
    defaultProject: 'mumbai-financial', // Default project
    defaultState: 'Maharashtra', // Default state
    defaultRole: 'manager' // Default role
  };

  return (
    <DefaultValuesContext.Provider value={value}>
      {children}
    </DefaultValuesContext.Provider>
  );
};

export const useDefaultValues = () => {
  const context = useContext(DefaultValuesContext);
  if (context === undefined) {
    throw new Error('useDefaultValues must be used within a DefaultValuesProvider');
  }
  return context;
};
