// StateContext.js
import { createContext, useContext, useState } from 'react';

const StateContext = createContext();

const StateProvider = ({ children }) => {
  const [state, setState] = useState({});
  const [customers, setCustomers] = useState([]);
  const [drinksDict, setDrinksDict] = useState({}); // Hack, dont want to refactor rn

  return (
    <StateContext.Provider 
      value={{ 
        state, setState, 
        customers, setCustomers,
        drinksDict, setDrinksDict
      }}>
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

export { StateProvider, useAppState, StateContext };
