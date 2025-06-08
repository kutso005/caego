import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import "./Recipients.css";
import { get, path } from "../../api/api";
import axios from "axios";

export default function Recipients() {
  const navigate = useNavigate();
  const [searchId, setSearchId] = useState("");
  const [searchInn, setSearchInn] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [recipients, setRecipients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRecipients();
  }, []);

  const fetchRecipients = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await get.getRecipientd(config);
      console.log("API Response:", response);

      const recipientsData = Array.isArray(response)
        ? response
        : response?.data;
      console.log("Recipients Data:", recipientsData);

      setRecipients(recipientsData || []);
    } catch (error) {
      console.error("Error fetching recipients:", error);
      if (error.response?.status === 401) {
        navigate("/login");
      }
      setRecipients([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (recipientId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        navigate("/login");
        return;
      }

      const data = { status_recipient: newStatus };
      console.log("Updating recipient:", recipientId, "with data:", data);

      const response = await axios.patch(
        `https://moicargo.kg/api/v1/users/recipients/${recipientId}/`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Server response:", response.data);

      setRecipients((prevRecipients) =>
        prevRecipients.map((recipient) =>
          recipient.id === recipientId
            ? { ...recipient, status_recipient: newStatus }
            : recipient
        )
      );

      // Перезагружаем данные с сервера для синхронизации
      await fetchRecipients();
    } catch (error) {
      console.error("Error updating recipient status:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
      }
      if (error.response?.status === 401) {
        navigate("/login");
      }
    }
  };

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
            <button className="tab" onClick={() => handleTabClick("clients")}>
              Клиенты
            </button>
            <button
              className="tab active"
              onClick={() => handleTabClick("recipients")}
            >
              Получатели
            </button>
            <button
              className="tab"
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
              placeholder="Введите ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
            <input
              type="text"
              placeholder="Введите ИНН"
              value={searchInn}
              onChange={(e) => setSearchInn(e.target.value)}
            />
            <input
              type="text"
              placeholder="Введите номер телефона"
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
            />
          </div>
          <div className="filter-actions">
            <button className="btn-table">
              <span className="table-icon">⊞</span>
            </button>
            <button className="btn-close">×</button>
          </div>
        </div>

        <div className="recipients-table">
          <table>
            <thead>
              <tr>
                <th>ФИО</th>
                <th>Статус подтверждения</th>
                <th>ИНН</th>
                <th>Страна</th>
                <th>Номер уд.лич/пасп</th>
                <th>Дата выдачи уд.лич</th>
                <th>Срок действия уд.лич</th>
                <th>Номер телефона</th>
                <th>Клиент</th>
                <th>Паспорт фото 1</th>
                <th>Паспорт фото 2</th>
                <th>Дата создания</th>
                <th>перейти</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="13" style={{ textAlign: "center" }}>
                    Загрузка...
                  </td>
                </tr>
              ) : recipients.length === 0 ? (
                <tr>
                  <td colSpan="13" style={{ textAlign: "center" }}>
                    Нет данных
                  </td>
                </tr>
              ) : (
                recipients.map(
                  (recipient) =>
                    recipient && (
                      <tr key={recipient?.id || "no-id"}>
                        <td>
                          {recipient?.last_name && recipient?.first_name
                            ? `${recipient.last_name} ${recipient.first_name}`
                            : "Н/Д"}
                        </td>
                        <td>
                          <select
                            className="status-select"
                            defaultValue={
                              recipient?.status_recipient || "Проверяется"
                            }
                            value={recipient?.status_recipient || "Проверяется"}
                            onChange={(e) => {
                              const newStatus = e.target.value;
                              setRecipients((prevRecipients) =>
                                prevRecipients.map((r) =>
                                  r.id === recipient.id
                                    ? { ...r, status_recipient: newStatus }
                                    : r
                                )
                              );
                              handleStatusChange(recipient.id, newStatus);
                            }}
                          >
                            <option value="Проверяется">Проверяется</option>
                            <option value="Отклонен">Отклонен</option>
                            <option value="Подтвержден">Подтвержден</option>
                          </select>
                        </td>
                        <td>{recipient?.inn || "Н/Д"}</td>
                        <td>{recipient?.country?.name || "Н/Д"}</td>
                        <td>{recipient?.passport_number || "Н/Д"}</td>
                        <td>{recipient?.passport_date || "Н/Д"}</td>
                        <td>{recipient?.passport_end_date || "Н/Д"}</td>
                        <td>{recipient?.phone_number || "Н/Д"}</td>
                        <td>
                          {recipient?.user
                            ? ` ${recipient.user.last_name} ${recipient.user.first_name}`
                            : "Н/Д"}
                        </td>
                        <td>
                          {recipient?.passport_image_1 ? (
                            <img
                              src={recipient.passport_image_1}
                              alt="Паспорт 1"
                              className="passport-thumbnail"
                            />
                          ) : (
                            "Нет фото"
                          )}
                        </td>
                        <td>
                          {recipient?.passport_image_2 ? (
                            <img
                              src={recipient.passport_image_2}
                              alt="Паспорт 2"
                              className="passport-thumbnail"
                            />
                          ) : (
                            "Нет фото"
                          )}
                        </td>
                        <td>
                          {recipient?.created_at
                            ? new Date(recipient.created_at).toLocaleString()
                            : "Н/Д"}
                        </td>
                        <td>
                          <button className="btn-edit">✎</button>
                        </td>
                      </tr>
                    )
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
