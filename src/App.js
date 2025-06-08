import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "../src/assets/styles/App.css";
import "../src/assets/styles/media.css";
import "./assets/styles/fonts.css";
import Main from "./components/Main";
import Calculator from "./pages/Calculator";
import Tracking from "./pages/Tracking";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AboutUs from "./pages/AboutUs";
import Services from "./pages/Services";
import Contacts from "./pages/Contacts";
import Login from "./pages/Auth/Login";
import Registration from "./pages/Auth/Registration";
import ScrollToTop from "./ScrollToTop";
import DashboardMain from "./dashboard/dashboardMain/DashboardMain";
import MainClient from "./dashboardClient/Main/MainClient";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import News from "./pages/News";

const MainLayout = ({ children }) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const isManager = localStorage.getItem("isManager") === "true";
  if (!token) {
    return <Navigate to="/login" />;
  }
  if (adminOnly && !isManager && adminOnly && !isAdmin) {
    return <Navigate to="/dashboardclient" />;
  }
  return children;
};

function App() {
  return (
    <div>
      <ScrollToTop />
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout>
              <Main />
            </MainLayout>
          }
        />
        <Route
          path="/calculator"
          element={
            <MainLayout>
              <Calculator />
            </MainLayout>
          }
        />
        <Route
          path="/about-us"
          element={
            <MainLayout>
              <AboutUs />
            </MainLayout>
          }
        />
        <Route
          path="/tracking"
          element={
            <MainLayout>
              <Tracking />
            </MainLayout>
          }
        />
        <Route
          path="/news"
          element={
            <MainLayout>
              <News />
            </MainLayout>
          }
        />
        <Route
          path="/services"
          element={
            <MainLayout>
              <Services />
            </MainLayout>
          }
        />
        <Route
          path="/contacts"
          element={
            <MainLayout>
              <Contacts />
            </MainLayout>
          }
        />
        <Route
          path="/login"
          element={
            <MainLayout>
              <Login />
            </MainLayout>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <MainLayout>
              <ForgotPassword />
            </MainLayout>
          }
        />
        <Route
          path="/register"
          element={
            <MainLayout>
              <Registration />
            </MainLayout>
          }
        />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute adminOnly={true}>
              <DashboardMain />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboardclient/*"
          element={
            <ProtectedRoute adminOnly={false}>
              <MainClient />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
