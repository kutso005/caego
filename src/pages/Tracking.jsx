import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/Tracking.css";
import smartexLogo from "../assets/image/logo.png";
import pinduoduoLogo from "../assets/image/logo.png";

export default function Tracking() {
  const navigate = useNavigate();
  const [trackingNumber, setTrackingNumber] = useState("");
  const [selectedCarrier, setSelectedCarrier] = useState("smartex");

  const handleTracking = (e) => {
    e.preventDefault();
    console.log(
      `Tracking number: ${trackingNumber} for carrier: ${selectedCarrier}`
    );
  };

  return (
    <div className="tracking-container">
      <div className="tracking-content">
        <button className="tracking-button" onClick={() => navigate("/")}>
          НА ГЛАВНУЮ
        </button>
        <h1 className="tracking-title">Отслеживание</h1>
        <p className="tracking-subtitle">
          Узнайте где на данный момент находится Ваш груз или посылка
        </p>

       

        <form onSubmit={handleTracking} className="tracking-form">
          <div className="input-group">
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Введите номер отслеживания"
              className="tracking-input"
              required
            />
            <button type="submit" className="tracking-button">
              ОТСЛЕДИТЬ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
