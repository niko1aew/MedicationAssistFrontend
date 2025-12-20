import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { StoreContext } from "./hooks/useStores";
import { rootStore } from "./stores/RootStore";
import { ToastContainer } from "./components/common/Toast";
import { UpdateNotification } from "./components/common/UpdateNotification";
import { useVersionCheck } from "./hooks/useVersionCheck";
import "./styles/global.css";

function App() {
  useEffect(() => {
    // Применяем тему при загрузке приложения
    document.documentElement.setAttribute(
      "data-theme",
      rootStore.uiStore.theme
    );
  }, []);

  // Автоматическая проверка версии приложения
  useVersionCheck({
    checkInterval: 300000, // 5 минут
    checkOnFocus: true,
  });

  return (
    <StoreContext.Provider value={rootStore}>
      <RouterProvider router={router} />
      <ToastContainer />
      <UpdateNotification />
    </StoreContext.Provider>
  );
}

export default App;
