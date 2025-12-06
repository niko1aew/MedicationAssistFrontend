import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { StoreContext } from './hooks/useStores';
import { rootStore } from './stores/RootStore';
import { ToastContainer } from './components/common/Toast';
import './styles/global.css';

function App() {
  return (
    <StoreContext.Provider value={rootStore}>
      <RouterProvider router={router} />
      <ToastContainer />
    </StoreContext.Provider>
  );
}

export default App;

