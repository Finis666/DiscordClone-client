import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./AuthRoute/ProtectedRoute";
import AppHome from "./components/AppHome";
import Login from "./components/Login";
import Register from "./components/Register";
import ProtectDefault from "./AuthRoute/ProtectDefault";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import PageNotFound from "./components/PageNotFound";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route element={<ProtectDefault />}>
            <Route path="/register" element={<Register />} />
          </Route>
          <Route element={<ProtectDefault />}>
            <Route path="/login" element={<Login />} />
          </Route>
          <Route element={<ProtectDefault />}>
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Route>
          <Route element={<ProtectDefault />}>
            <Route
              path="/reset-password/:id/:token"
              element={<ResetPassword />}
            />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/app" element={<AppHome />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/app/admin" element={<AppHome />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/app/settings" element={<AppHome />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/app/chat/:conversationId" element={<AppHome />} />
          </Route>
          <Route>
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
