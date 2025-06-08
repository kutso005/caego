import React from "react";
import Navbar from "../components/Navbar/Navbar";

export default function Registry() {
  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-container">
        <h2>Реестр</h2>
        {/* Здесь будет контент страницы реестра */}
      </div>
    </div>
  );
}
