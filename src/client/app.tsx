import React, { ReactElement } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { LoginPage, RegisterPage, UserPage } from "./pages/index";

import { AuthProvider, AuthConsumer, IAuthState } from "./contexts/authContext";

const ProtectedRoute = ({
  isAllowed,
  children,
}: {
  isAllowed: boolean;
  children?: ReactElement;
}) => {
  if (!isAllowed) {
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            element={
              <AuthConsumer>
                {({ auth }: { auth: IAuthState }) => (
                  <ProtectedRoute isAllowed={!!auth?.user} />
                )}
              </AuthConsumer>
            }
          >
            <Route path="user" element={<UserPage />} />
          </Route>
          <Route path="*" element={<p>There's nothing here: 404!</p>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
