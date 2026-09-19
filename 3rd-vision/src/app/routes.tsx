// src/app/routes.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginConsole from "../features/auth/LoginConsole";
import { useAuthStore } from "../features/auth/auth.store";
import App from "./App"; // Or your main layout component

// Security guard component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginConsole />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);