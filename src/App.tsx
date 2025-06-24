import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Finance from "./pages/Finance";
import Messaging from "./pages/Messaging";
import Documents from "./pages/Documents";
import Subscriptions from "./pages/Subscriptions";
import Settings from "./pages/Settings";
import SignIn from "./pages/SignIn";
import "./App.css";
import ProtectedRoute from "./components/protectedRoute";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/finance" element={<Finance />} />
                    <Route path="/messaging" element={<Messaging />} />
                    <Route path="/documents" element={<Documents />} />
                    <Route path="/subscriptions" element={<Subscriptions />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
