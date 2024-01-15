// StateContext.js
import { createContext, useContext, useState } from 'react';

const StateContext = createContext();

const StateProvider = ({ children }) => {
  const [state, setState] = useState({});

  return (
    <StateContext.Provider value={{ state, setState }}>
      {children}
    </StateContext.Provider>
  );
};

const useAppState = () => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error('useAppState must be used within a StateProvider');
  }
  return context;
};

export { StateProvider, useAppState };
