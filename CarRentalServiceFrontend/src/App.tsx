import { BrowserRouter, Routes, Route } from "react-router-dom";
import Nav from "./assets/components/Nav";
import Home from "./assets/pages/Home";
import Login from "./assets/pages/Login";
import Register from "./assets/pages/Register";
import Browse from "./assets/pages/Browse";
import Details from "./assets/pages/Details";
import Booking from "./assets/pages/Booking";
import Payment from "./assets/pages/Payment";
import Confirmation from "./assets/pages/Confirmation";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./assets/components/ProtectedRoute";
import "./App.css";

import HomeTest from "./assets/pages/HomeTest";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app">
          <Nav />
          <main className="main-content">
            <Routes>
              <Route path="/hometest" element={<HomeTest />} />

              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cars" element={<Browse />} />

              <Route path="/booking/:carId" element={<Booking />} />
              <Route
                path="/payment"
                element={
                  <ProtectedRoute>
                    <Payment />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/confirmation"
                element={
                  <ProtectedRoute>
                    <Confirmation />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

