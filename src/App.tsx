import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Provider } from "./provider";
import { AppRoutes } from "./routes/AppRoutes";

export const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <Provider>
        <AppRoutes />
      </Provider>
    </AuthProvider>
  </BrowserRouter>
);
