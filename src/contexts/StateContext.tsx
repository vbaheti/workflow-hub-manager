
import React, { createContext, useContext, useState, ReactNode } from "react";

interface StateContextType {
  selectedStates: string[];
  setSelectedStates: (states: string[]) => void;
  states: string[];
}

const defaultStates = [
  "Delhi",
  "Maharashtra",
  "West Bengal",
  "Uttar Pradesh",
  "Karnataka",
  "Tamil Nadu",
  "Gujarat",
  "Telangana",
  "Kerala",
  "Rajasthan"
];

const StateContext = createContext<StateContextType | undefined>(undefined);

export const StateProvider = ({ children }: { children: ReactNode }) => {
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const value = {
    selectedStates,
    setSelectedStates,
    states: defaultStates
  };
  return <StateContext.Provider value={value}>{children}</StateContext.Provider>;
};

export const useStateContext = () => {
  const ctx = useContext(StateContext);
  if (!ctx) throw new Error("useStateContext must be used within a StateProvider");
  return ctx;
};
