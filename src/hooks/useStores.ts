import { createContext, useContext } from 'react';
import { RootStore, rootStore } from '../stores/RootStore';

export const StoreContext = createContext<RootStore>(rootStore);

export const useStores = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStores must be used within StoreProvider');
  }
  return context;
};

