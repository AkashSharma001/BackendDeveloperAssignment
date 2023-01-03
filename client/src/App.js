import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Navigate,
  Routes,
} from "react-router-dom";
import "./App.css";
import { AuthContext } from "./context/AuthContext";
import { useAuth } from "./hooks/auth-hooks";
import MainNavigation from "./header/MainNavigation";

function App() {
  const { token, login, logout, userId } = useAuth();

  const Auth = React.lazy(() => import("./pages/auth/Auth"));
  const Gallery = React.lazy(() => import("./pages/gallery/Gallery"));
  const Profile = React.lazy(() => import("./pages/profile/Profile"));

  let routes;
  if (token) {
    routes = (
      <React.Fragment>
        <Route path='/' exact element={<Gallery />} />
        <Route path='/profile' exact element={<Profile />} />
        <Route path='*' exact element={<Navigate to='/' />} />
      </React.Fragment>
    );
  } else {
    routes = (
      <React.Fragment>
        <Route path='/auth' exact element={<Auth />} />
        <Route path='*' exact element={<Navigate to='/auth' />} />
      </React.Fragment>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}>
      <Router>
        <MainNavigation />

        <main>
          <Suspense
            fallback={
              <div className='center'>
                <h1 style={{ textAlign: "center" }}>Loading...</h1>
              </div>
            }>
            <Routes>{routes}</Routes>
          </Suspense>
        </main>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
