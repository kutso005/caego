import React, { useEffect, useState } from "react";
import "./Profile.css";
import { get } from "../../../api/api";

export default function ClientProfile() {
  const token = localStorage.getItem("token");
  const [userClient, setUserClient] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await get.getUserClient(config);
        console.log("Алынган маалымат:", response);

        setUserClient(response);
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      }
    };

    fetchData();
  }, []);

  const [editMode, setEditMode] = useState({
    email: false,
    password: false,
    phone: false,
  });

  const handleEdit = (field) => {
    setEditMode((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  const handleSave = (field) => {
    setEditMode((prev) => ({
      ...prev,
      [field]: false,
    }));
  };

  const handleCancel = (field) => {
    setEditMode((prev) => ({
      ...prev,
      [field]: false,
    }));
  };

  const renderEditButtons = (field) => {
    if (editMode[field]) {
      return (
        <>
          <button
            className="edit-button save"
            onClick={() => handleSave(field)}
          >
            Сохранить
          </button>
          <button
            className="edit-button cancel"
            onClick={() => handleCancel(field)}
          >
            Отмена
          </button>
        </>
      );
    }
  };


  return (
    <div className="client-profile">
      <div className="profile-container">
        <div className="profile-header">
          <h2>Профиль</h2>
        </div>

        <div className="profile-form">
          <div className="form-group">
            <label>Email</label>
            <div  className="form-actions topsd">
              <input
                type="email"
                value={userClient.email || ""}
                disabled={!editMode.email}
              />
              {renderEditButtons("email")}
            </div>
          </div>

          <div className="form-group">
            <label>Пароль</label>
            <div className="form-actions">
              <input
                type="password"
                value="••••••••••••••••"
                disabled={!editMode.password}
              />
              {renderEditButtons("password")}
            </div>
          </div>

          <div className="form-group">
            <label>Телефон</label>
            <div className="form-actions topsd">
              <input
                type="tel"
                value={userClient.phone_number || ""}
                disabled={!editMode.phone_number}
                className="confirmed"
              />
              {renderEditButtons("phone_number")}
              <span className="phone-confirmed">Подтвержден</span>
            </div>
          </div>

          <div className="form-group">
            <label>Фамилия</label>
            <input type="text" value={userClient.last_name || ""} disabled />
          </div>

          <div className="form-group">
            <label>Имя</label>
            <input type="text" value={userClient.first_name || ""} disabled />
          </div>
        </div>
      </div>
    </div>
  );
}
