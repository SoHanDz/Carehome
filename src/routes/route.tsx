import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Import các page components
import Dashboard from "../pages/Dashboard/Dashboard";
import Family from "../pages/Family/Family";
import Payment from "../pages/Payment/Payment";
import Residents from "../pages/Residents/Residents";
import Rooms from "../pages/Rooms/Rooms";
import Users from "../pages/Users/Users";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Default redirect từ root về dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* Dashboard route */}
      <Route path="/dashboard" element={<Dashboard />} />
      
      {/* Management routes */}
      <Route path="/residents" element={<Residents />} />
      <Route path="/rooms" element={<Rooms />} />
      <Route path="/family" element={<Family />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/users" element={<Users />} />
      
      {/* Catch all - redirect về dashboard nếu route không tồn tại */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;