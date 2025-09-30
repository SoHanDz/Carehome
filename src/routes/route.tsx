import React, { type JSX } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "../pages/Dashboard/Dashboard";
import Family from "../pages/Family/Family";
import Payment from "../pages/Payment/Payment";
import Residents from "../pages/Residents/Residents";
import Rooms from "../pages/Rooms/Rooms";
import Users from "../pages/Users/Users";
import Login from "../pages/Auth/Login";

import AppLayout from "../layouts/AppLayout";
import { isAuthenticated } from "../hooks/Auth/authService";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* ✅ Login độc lập */}
      <Route path="/login" element={<Login />} />

      {/* ✅ Các route khác có layout */}
      <Route path="/dashboard"element={<PrivateRoute><AppLayout><Dashboard /></AppLayout></PrivateRoute>}/>
      <Route path="/residents"element={<PrivateRoute><AppLayout><Residents /></AppLayout></PrivateRoute>}/>
      <Route path="/rooms"element={<PrivateRoute><AppLayout><Rooms/></AppLayout></PrivateRoute>}/>
      <Route path="/family"element={<PrivateRoute><AppLayout><Family/></AppLayout></PrivateRoute>}/>
      <Route path="/payment"element={<PrivateRoute><AppLayout><Payment/></AppLayout></PrivateRoute>}/>
      <Route path="/users"element={<PrivateRoute><AppLayout><Users/></AppLayout></PrivateRoute>}/>

      {/* ✅ Redirect root và 404 về login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
