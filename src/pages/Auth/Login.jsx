import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "email":
        if (!value) error = "Email обязателен";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          error = "Неверный формат email";
        break;
      case "password":
        if (!value) error = "Пароль обязателен";
        else if (value.length < 8) error = "Минимум 8 символов";
        break;
    }
    return error;
  };

  const handleInputChange = (e, field) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate all fields before submission
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setError("Пожалуйста, исправьте ошибки в форме");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("https://moicargo.kg/api/v1/login/", {
        username: formData.email,
        password: formData.password,
      });

      if (response.data.access) {
        localStorage.setItem("token", response.data.access);
        localStorage.setItem("isAdmin", response.data.is_admin);
        localStorage.setItem("isManager", response.data.is_manager);
        console.log("Login Response:", {
          isAdmin: response.data.is_admin,
          isManager: response.data.is_manager,
        });

        if (response.data.is_admin || response.data.is_manager) {
          console.log("Navigating to /dashboard");
          navigate("/dashboard");
        } else {
          console.log("Navigating to /dashboardclient/parcels");
          navigate("/dashboardclient/parcels");
        }
      }
    } catch (error) {
      if (error.response) {
        const serverError = error.response.data;
        if (serverError.errors) {
          const newErrors = {};
          Object.keys(serverError.errors).forEach((key) => {
            newErrors[key] = serverError.errors[key][0];
          });
          setErrors(newErrors);
          setError("Пожалуйста, исправьте ошибки в форме");
        } else {
          setError(serverError.detail || "Неверный email или пароль");
        }
      } else if (error.request) {
        setError("Ошибка сети. Пожалуйста, проверьте подключение к интернету");
      } else {
        setError("Произошла ошибка при входе");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">ВХОД В ЛИЧНЫЙ КАБИНЕТ</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="calculator__input-group">
            <input
              type="text"
              value={formData.email}
              onChange={(e) => handleInputChange(e, "email")}
              placeholder="Email"
              className={errors.email ? "error" : ""}
            />
            <label>Email</label>
            {errors.email && (
              <div className="error-message">{errors.email}</div>
            )}
          </div>

          <div className="calculator__input-group">
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange(e, "password")}
              placeholder="Пароль"
              className={errors.password ? "error" : ""}
            />
            <label>Пароль</label>
            {errors.password && (
              <div className="error-message">{errors.password}</div>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="register-button" disabled={loading}>
            {loading ? "ЗАГРУЗКА..." : "ВОЙТИ"}
          </button>
          <Link to="/forgot-password">Забыли пароль?</Link>
        </form>
      </div>
    </div>
  );
}
