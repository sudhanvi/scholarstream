
"use client";

import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { createContext, useContext, useState } from 'react';

interface ReaderModeContextType {
  isReaderMode: boolean;
  setIsReaderMode: Dispatch<SetStateAction<boolean>>;
}

const ReaderModeContext = createContext<ReaderModeContextType | undefined>(undefined);

export function ReaderModeProvider({ children }: { children: ReactNode }) {
  const [isReaderMode, setIsReaderMode] = useState(false);
  return (
    <ReaderModeContext.Provider value={{ isReaderMode, setIsReaderMode }}>
      {children}
    </ReaderModeContext.Provider>
  );
}

export function useReaderMode() {
  const context = useContext(ReaderModeContext);
  if (context === undefined) {
    throw new Error('useReaderMode must be used within a ReaderModeProvider');
  }
  return context;
}
