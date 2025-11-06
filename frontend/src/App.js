import { Route, Routes, useLocation } from "react-router-dom";
import AuthPage from "./pages/authPage/authPage";
import LandingPage from "./pages/landingPage/landingPage";
import HomePage from "./pages/homePage/homePage";
import Navbar from "./components/navbar/navbar";
import Dashboard from "./pages/dashBoard/dashBoard";
import Marketplace from "./pages/dashBoard/marketPlace";
import ProtectedRoute from "./protectRoute";
import SwapRequestsPage from "./pages/reqActivity/swapRequestPage";

function App() {
  const location = useLocation();

  const hideNavbarRoutes = ["/auth"];

  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              {" "}
              <HomePage />{" "}
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/marketplace"
          element={
            <ProtectedRoute>
              <Marketplace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/activity"
          element={
            <ProtectedRoute>
              <SwapRequestsPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </>
  );
}

export default App;
