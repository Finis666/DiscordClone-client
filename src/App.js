import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./AuthRoute/ProtectedRoute";
import AppHome from "./components/AppHome";
import Login from "./components/Login";
import Register from "./components/Register";
import ProtectDefault from "./AuthRoute/ProtectDefault";

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
          <Route element={<ProtectedRoute />}>
            <Route path="/app" element={<AppHome />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
