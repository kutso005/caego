import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Recipients.css";
import { get } from "../../../api/api";

export default function Recipients() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const token = localStorage.getItem("token");
  const [userClient, setUserClient] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await get.getRecipient(config);
        console.log("Алынган маалымат:", response);

        setUserClient(response);
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="recipients-container">
      <div className="recipients-header">
        <h1>Получатели</h1>
      </div>

      <div className="recipients-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Введите имя"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        <button
          className="add-recipient-btn"
          onClick={() => navigate("/dashboardclient/recipients/add")}
        >
          Добавить получателя
        </button>
      </div>

      <div className="recipients-table">
        {userClient.map((recipient) => (
          <div key={recipient.id} className="recipient-card">
            <div className="recipient-header">
              <h3>
                {recipient.first_name} {recipient.last_name}
              </h3>
              <button className="more-options">⋮</button>
            </div>
            <div className="recipient-details">
              <div className="detail-row">
                <span className="detail-label">Номер телефона:</span>
                <span className="detail-value">{recipient.phone_number}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Страна получателя:</span>
                <span className="detail-value">{recipient.country?.name}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Статус:</span>
                <span className="detail-value status-confirmed">
                  {recipient.status_recipient}
                </span>
              </div>
            </div>
            <div className="recipient-footer">
              <label className="default-recipient">
                <input type="checkbox" />
                <span>Получатель по умолчанию</span>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
