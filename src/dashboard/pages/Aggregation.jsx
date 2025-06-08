import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import "./Aggregation.css";

export default function Aggregation() {
  const navigate = useNavigate();
  const [searchId, setSearchId] = useState("");
  const [searchWarehouse, setSearchWarehouse] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const handleTabClick = (tab) => {
    switch (tab) {
      case "clients":
        navigate("/dashboard/clients");
        break;
      case "recipients":
        navigate("/dashboard/recipients");
        break;
      case "aggregation":
        navigate("/dashboard/aggregation");
        break;
      default:
        break;
    }
  };

  const aggregations = [
    {
      id: "AGG001",
      warehouse: "Склад 1",
      totalParcels: 150,
      totalWeight: "750.5 кг",
      status: "В обработке",
      createdDate: "2024-01-28",
      lastUpdated: "2024-01-29",
      assignedTo: "Оператор 1",
      details: "Партия #123-456",
    },
  ];

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-container">
        <div className="clients-header">
          <div className="tabs">
            <button className="tab" onClick={() => handleTabClick("clients")}>
              Клиенты
            </button>
            <button
              className="tab"
              onClick={() => handleTabClick("recipients")}
            >
              Получатели
            </button>
            <button
              className="tab active"
              onClick={() => handleTabClick("aggregation")}
            >
              Агрегация
            </button>
          </div>
        </div>

        <div className="search-filters">
          <div className="search-groups">
            <input
              type="text"
              placeholder="ID агрегации"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
            <input
              type="text"
              placeholder="Склад"
              value={searchWarehouse}
              onChange={(e) => setSearchWarehouse(e.target.value)}
            />
          </div>
          <div className="date-range">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, start: e.target.value }))
              }
            />
            <span>-</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, end: e.target.value }))
              }
            />
          </div>
          <div className="filter-actions">
            <button className="btn-add">
              <span className="add-icon">+</span> Создать агрегацию
            </button>
          </div>
        </div>

        <div className="aggregation-table">
          <table>
            <thead>
              <tr>
                <th>ID агрегации</th>
                <th>Склад</th>
                <th>Кол-во посылок</th>
                <th>Общий вес</th>
                <th>Статус</th>
                <th>Дата создания</th>
                <th>Последнее обновление</th>
                <th>Ответственный</th>
                <th>Детали</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {aggregations.map((agg) => (
                <tr key={agg.id}>
                  <td>{agg.id}</td>
                  <td>{agg.warehouse}</td>
                  <td>{agg.totalParcels}</td>
                  <td>{agg.totalWeight}</td>
                  <td>
                    <span
                      className={`status-badge ${agg.status.toLowerCase()}`}
                    >
                      {agg.status}
                    </span>
                  </td>
                  <td>{agg.createdDate}</td>
                  <td>{agg.lastUpdated}</td>
                  <td>{agg.assignedTo}</td>
                  <td>{agg.details}</td>
                  <td>
                    <button className="btn-view" title="Просмотр">
                      👁️
                    </button>
                    <button className="btn-edit" title="Редактировать">
                      ✎
                    </button>
                    <button className="btn-delete" title="Удалить">
                      🗑️
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
