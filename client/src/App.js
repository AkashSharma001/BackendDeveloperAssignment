import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Navigate,
  Routes,
} from "react-router-dom";
import "./App.css";
import Auth from "./pages/auth/Auth";
import { useRoutes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/auth-hooks";

function App() {
  const { token } = useAuth();

  const Auth = React.lazy(() => import("./pages/auth/Auth"));

  let routes;

  if (token) {
    routes = (
      <React.Fragment>
        <Route path='/' exact element={<Auth />} />
        <Route path='*' exact element={<Navigate to='/' />} />
      </React.Fragment>
    );
  } else {
    routes = (
      <React.Fragment>
        <Route path='/' exact element={<Auth />} />
        <Route path='*' exact element={<Navigate to='/' />} />
      </React.Fragment>
    );
  }

  return (
    <AuthProvider>
      <Router>
        <main>
          <Suspense>
            <Routes>{routes}</Routes>
          </Suspense>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;
