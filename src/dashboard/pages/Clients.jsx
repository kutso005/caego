import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import "./Clients.css";
import { FaPlus } from "react-icons/fa";
import { get } from "../../api/api";

export default function Clients() {
  const navigate = useNavigate();
  const [searchId, setSearchId] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [selectedRecipient, setSelectedRecipient] = useState("");
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add filtered clients computation
  const filteredClients = clients.filter((client) => {
    const matchId =
      !searchId ||
      client.id.toString().toLowerCase().includes(searchId.toLowerCase());
    const matchEmail =
      !searchEmail ||
      client.email.toLowerCase().includes(searchEmail.toLowerCase());
    const matchPhone =
      !searchPhone ||
      client.phone_number.toLowerCase().includes(searchPhone.toLowerCase());
    return matchId && matchEmail && matchPhone;
  });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found, redirecting to login");
          navigate("/login");
          return;
        }

        console.log("Fetching clients with token:", token);
        const response = await get.getUsers({
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("API Response:", response);
        setClients(response);
        setError(null);
      } catch (err) {
        console.error("Detailed error:", {
          message: err.message,
          response: err.response,
          stack: err.stack,
        });

        setError(
          "Ошибка при загрузке данных: " + (err.message || "Неизвестная ошибка")
        );

        if (err.response?.status === 401) {
          console.log("Unauthorized access, redirecting to login");
          localStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [navigate]);

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

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-container">
        <div className="clients-header">
          <div className="tabs">
            <button
              className="tab active"
              onClick={() => handleTabClick("clients")}
            >
              Клиенты
            </button>
            <button
              className="tab"
              onClick={() => handleTabClick("recipients")}
            >
              Получатели
            </button>
            {/* <button
              className="tab"
              onClick={() => handleTabClick("aggregation")}
            >
              Агрегация
            </button> */}
          </div>
        </div>

        <div className="search-filters">
          <div className="search-groups">
            <input
              type="text"
              placeholder="Введите ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
            <input
              type="text"
              placeholder="Введите email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
            />
            <input
              type="text"
              placeholder="Введите номер телефона"
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
            />
          </div>
          <div className="filter-actions">
            <select
              value={selectedRecipient}
              onChange={(e) => setSelectedRecipient(e.target.value)}
              placeholder="Получатель"
            >
              <option value="">Получатель</option>
            </select>
            <button className="btn-table">
              <span className="table-icon">⊞</span>
            </button>
            <button className="btn-close">×</button>
          </div>
        </div>

        <div className="clients-table">
          {loading ? (
            <div className="loading">Загрузка...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ФИО</th>
                  <th>ID</th>
                  <th>Email</th>
                  <th>Клиентский ID</th>
                  <th>Имя</th>
                  <th>Фамилия</th>
                  <th>Телефон</th>
                  <th>Страна</th>
                  <th>Тарифы</th>
                  <th>Получатели</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => (
                  <tr key={client.id}>
                    <td>{`${client.first_name} ${client.last_name}`}</td>
                    <td>{client.id}</td>
                    <td>{client.email}</td>
                    <td>{client.client_id}</td>
                    <td>{client.first_name}</td>
                    <td>{client.last_name}</td>
                    <td>{client.phone_number}</td>
                    <td>{client.country?.name}</td>
                    <td className="tariffs-cell">
                      <button className="btn-info">i</button>
                      <div className="tariffs-tooltip">
                        <div className="tariff-item">
                          <span>США:</span>
                          <span className="tariff-value">
                            {client.tarif_usa} {client.tarif_usa_value}
                          </span>
                        </div>
                        <div className="tariff-item">
                          <span>Турция:</span>
                          <span className="tariff-value">
                            {client.tarif_turkey} {client.tarif_turkey_value}
                          </span>
                        </div>
                        <div className="tariff-item">
                          <span>Китай:</span>
                          <span className="tariff-value">
                            {client.tarif_china} {client.tarif_china_value}
                          </span>
                        </div>
                        <div className="tariff-item">
                          <span>Япония:</span>
                          <span className="tariff-value">
                            {client.tarif_japan} {client.tarif_japan_value}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>{client.recipients?.length || 0} получателей</td>
                    <td>
                      <button
                        className="btn-edit"
                        onClick={() =>
                          navigate(`/dashboard/clients/add/${client.id}`)
                        }
                      >
                        ✎
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
