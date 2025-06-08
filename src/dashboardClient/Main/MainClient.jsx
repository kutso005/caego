import React from "react";
import { Routes, Route } from "react-router-dom";
import NavbarClient from "../components/NavbarClient";
import ClientProfile from "../Pages/Profile/Profile";
import Tariff from "../Pages/Tariff/Tariff";
import Warehouses from "../Pages/Warehouses/Warehouses";
import Parcels from "../Pages/Parcels/Parcels";
import Recipients from "../Pages/Recipients/Recipients";
import AddRecipient from "../Pages/Recipients/AddRecipient";
import AddParcel from "../Pages/AddParcel/AddParcel";
import "./MainClient.css";

export default function MainClient() {
  return (
    <div className="dashboard-client-layout">
      <NavbarClient />
      <div className="dashboard-client-content">
        <Routes>
          <Route path="/" element={<ClientProfile />} />
          <Route path="/profile" element={<ClientProfile />} />
          <Route path="/tariff" element={<Tariff />} />
          <Route path="/warehouses" element={<Warehouses />} />
          <Route path="/parcels" element={<Parcels />} />
          <Route path="/recipients" element={<Recipients />} />
          <Route path="/recipients/add" element={<AddRecipient />} />
          <Route path="/add-parcel" element={<AddParcel />} />
        </Routes>
      </div>
    </div>
  );
}
