import { createContext, useContext, useEffect, useState } from "react";

export type CurrentIA = '' | 'gemini' | 'grok' | 'deepseek' | 'chat-gpt';

type CurrentIAContextType = {
  currentIA: CurrentIA;
  setCurrentIA: (value: CurrentIA) => void;
};

const STORAGE_KEY = 'currentIA';

const CurrentIAContext = createContext<CurrentIAContextType>({
  currentIA: '',
  setCurrentIA: () => {},
});

export function CurrentIAProvider({ children }: { children: React.ReactNode }) {
  const [currentIA, setCurrentIAState] = useState<CurrentIA>(() => {
    if (typeof window === 'undefined') return '';
    return (localStorage.getItem(STORAGE_KEY) as CurrentIA) || '';
  });

  useEffect(() => {
    if (currentIA) {
      localStorage.setItem(STORAGE_KEY, currentIA);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [currentIA]);

  return (
    <CurrentIAContext.Provider value={{ currentIA, setCurrentIA: setCurrentIAState }}>
      {children}
    </CurrentIAContext.Provider>
  );
}

export const useCurrentIA = () => useContext(CurrentIAContext);
