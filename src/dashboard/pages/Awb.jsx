import React, { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import { FaEdit } from "react-icons/fa";
import { US, TR } from "country-flag-icons/react/3x2";
import "./Awb.css";

export default function Awb() {
  const [searchNumber, setSearchNumber] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [selectedFlight, setSelectedFlight] = useState("");

  // Sample data - replace with actual API data later
  const awbData = [
    {
      id: 123,
      number: "501-14158513",
      warehouse: "США",
      flight: "2024/18",
      places: 72,
      weight: "1967.000",
      date: "02.05.2024",
      creationDate: "06.05.2024, 09:35:21",
    },
    // Add more sample data as needed
  ];

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-container">
        <div className="awb-header">
          <h2>AWB</h2>
          <div className="awb-filters">
            <input
              type="text"
              placeholder="Введите номер"
              value={searchNumber}
              onChange={(e) => setSearchNumber(e.target.value)}
            />
            <select
              value={selectedWarehouse}
              onChange={(e) => setSelectedWarehouse(e.target.value)}
            >
              <option value="">Склад</option>
              <option value="США">США</option>
              <option value="Турция">Турция</option>
            </select>
            <select
              value={selectedFlight}
              onChange={(e) => setSelectedFlight(e.target.value)}
            >
              <option value="">Рейс</option>
              {/* Add flight options */}
            </select>
            <button className="btn-table">⊞</button>
            <button className="btn-clear">✕</button>
          </div>
        </div>

        <div className="awb-table-container">
          <table className="awb-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Номер</th>
                <th>Склад</th>
                <th>Рейс</th>
                <th>Кол-во мест</th>
                <th>Вес</th>
                <th>Дата</th>
                <th>Дата создания</th>
                <th>Изменить</th>
              </tr>
            </thead>
            <tbody>
              {awbData.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.number}</td>
                  <td>
                    {item.warehouse === "США" ? (
                      <>
                        <US className="country-flag" /> США
                      </>
                    ) : (
                      <>
                        <TR className="country-flag" /> Турция
                      </>
                    )}
                  </td>
                  <td>{item.flight}</td>
                  <td>{item.places}</td>
                  <td>{item.weight}</td>
                  <td>{item.date}</td>
                  <td>{item.creationDate}</td>
                  <td>
                    <button className="btn-edit">
                      <FaEdit />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
