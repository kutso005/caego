import React, { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import "./Scanning.css";

export default function Outgoing() {
  const [trackNumber, setTrackNumber] = useState("");

  const outgoingItems = [
    {
      trackNumber: "I100183857",
      trackNumber2: "1Z917F070327303328",
      scanDate: "29.01.2025, 14:06:09",
      type: "Исходящие",
      manager: "Каныбек",
      country: "Кыргызстан",
    },
    {
      trackNumber: "ID362836",
      trackNumber2: "",
      scanDate: "29.01.2025, 14:06:06",
      type: "Исходящие",
      manager: "Каныбек",
      country: "Кыргызстан",
    },
    {
      trackNumber: "ID363029",
      trackNumber2: "",
      scanDate: "29.01.2025, 14:06:05",
      type: "Исходящие",
      manager: "Каныбек",
      country: "Кыргызстан",
    },
    {
      trackNumber: "I100183607",
      trackNumber2: "1LSD2IE004FJWSZ",
      scanDate: "29.01.2025, 14:05:41",
      type: "Исходящие",
      manager: "Каныбек",
      country: "Кыргызстан",
    },
    {
      trackNumber: "I100183834",
      trackNumber2: "1LSD2IE004GWKFT",
      scanDate: "29.01.2025, 14:05:40",
      type: "Исходящие",
      manager: "Каныбек",
      country: "Кыргызстан",
    },
  ];

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-container">
        <div className="search-filters">
          <div className="search-group">
            <label>Трек номер</label>
            <input
              type="text"
              placeholder="Введите трек номер"
              value={trackNumber}
              onChange={(e) => setTrackNumber(e.target.value)}
            />
          </div>
        </div>

        <div className="scanning-table">
          <table>
            <thead>
              <tr>
                <th>Трек номер</th>
                <th>Трек номер 2</th>
                <th>Дата сканирования</th>
                <th>Тип</th>
                <th>Менеджер</th>
                <th>Страна</th>
              </tr>
            </thead>
            <tbody>
              {outgoingItems.map((item, index) => (
                <tr key={index}>
                  <td>{item.trackNumber}</td>
                  <td>{item.trackNumber2}</td>
                  <td>{item.scanDate}</td>
                  <td>
                    <span className="status-badge outgoing">{item.type}</span>
                  </td>
                  <td>{item.manager}</td>
                  <td>{item.country}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
