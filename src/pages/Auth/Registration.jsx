import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Registration.css";
import { api } from "../../api";
import { FaFlag } from "react-icons/fa";
import {
  RiFlag2Fill as KGFlag,
  RiFlag2Fill as RUFlag,
  RiFlag2Fill as KZFlag,
  RiFlag2Fill as UZFlag,
} from "react-icons/ri";

const countryIcons = {
  KG: KGFlag,
  RU: RUFlag,
  KZ: KZFlag,
  UZ: UZFlag,
};

export default function Registration() {
  const navigate = useNavigate();
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showConfirmationInput, setShowConfirmationInput] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    idCardFront: null,
    idCardBack: null,
    inn: "",
    pickupPoint: "",
    address: {
      city: "",
      street: "",
      house: "",
    },
    passportNumber: "",
    passportDate: "",
    passportPlace: "",
    country_id: null,
  });

  const [errors, setErrors] = useState({
    lastName: "",
    firstName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    idCardFront: "",
    idCardBack: "",
    address: {
      city: "",
      street: "",
      house: "",
    },
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const data = await api.getCountries();
        setCountries(data);
        if (data.length > 0) {
          setSelectedCountry(data[0]);
          setFormData((prev) => ({ ...prev, country_id: data[0].id }));
        }
      } catch (error) {
        console.error("Failed to fetch countries:", error);
      }
    };

    fetchCountries();
  }, []);

  const handleSendConfirmationEmail = async () => {
    try {
      setEmailError("");
      await axios.post("https://moicargo.kg/api/v1/users/confirm-email/", {
        email: formData.email,
      });
      setIsEmailSent(true);
      setShowConfirmationInput(true);
    } catch (error) {
      setEmailError(
        error.response?.data?.message ||
          "Ошибка при отправке кода подтверждения"
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate all fields before submission
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (key === "address") {
        Object.keys(formData.address).forEach((addrKey) => {
          const error = validateField(
            `address.${addrKey}`,
            formData.address[addrKey]
          );
          if (error) {
            newErrors.address = { ...newErrors.address, [addrKey]: error };
          }
        });
      } else {
        const error = validateField(key, formData[key]);
        if (error) {
          newErrors[key] = error;
        }
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setError("Пожалуйста, исправьте ошибки в форме");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Пароли не совпадают");
      setLoading(false);
      return;
    }

    if (!isEmailSent || !confirmationCode) {
      setError("Пожалуйста, подтвердите email");
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("last_name", formData.lastName);
      formDataToSend.append("first_name", formData.firstName);
      formDataToSend.append("phone_number", formData.phone);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("country_id", formData.country_id);
      formDataToSend.append("code", confirmationCode);
      formDataToSend.append(
        "address",
        `${formData.address.city}, ${formData.address.street}, ${formData.address.house}`
      );
      formDataToSend.append("inn", formData.inn);
      formDataToSend.append("passport_number", formData.passportNumber);
      formDataToSend.append("passport_date", formData.passportDate);
      formDataToSend.append("passport_place", formData.passportPlace);

      if (formData.idCardFront) {
        formDataToSend.append("passport_image_1", formData.idCardFront);
      }
      if (formData.idCardBack) {
        formDataToSend.append("passport_image_2", formData.idCardBack);
      }

      const response = await axios.post(
        "https://moicargo.kg/api/v1/users/create/",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data) {
        try {
          const loginResponse = await axios.post(
            "https://moicargo.kg/api/v1/login/",
            {
              username: formData.email,
              password: formData.password,
            }
          );

          if (loginResponse.data.access) {
            localStorage.setItem("token", loginResponse.data.access);
            localStorage.setItem("isAdmin", loginResponse.data.is_admin);
            localStorage.setItem("isManager", loginResponse.data.is_manager);

            setError("Регистрация успешно завершена! Перенаправление...");

            setTimeout(() => {
              if (
                loginResponse.data.is_admin ||
                loginResponse.data.is_manager
              ) {
                navigate("/dashboard");
              } else {
                navigate("/dashboardclient/parcels");
              }
            }, 1500);
          }
        } catch (loginError) {
          setError(
            loginError.response?.data?.message ||
              "Ошибка при автоматическом входе. Пожалуйста, войдите вручную."
          );
        }
      }
    } catch (error) {
      if (error.response) {
        const serverError = error.response.data;

        if (serverError.errors) {
          const newErrors = {};
          Object.keys(serverError.errors).forEach((key) => {
            if (key.includes(".")) {
              const [parent, child] = key.split(".");
              newErrors[parent] = {
                ...newErrors[parent],
                [child]: serverError.errors[key][0],
              };
            } else {
              newErrors[key] = serverError.errors[key][0];
            }
          });
          setErrors(newErrors);
          setError("Пожалуйста, исправьте ошибки в форме");
        } else {
          setError(serverError.message || "Произошла ошибка при регистрации");
        }
      } else if (error.request) {
        setError("Ошибка сети. Пожалуйста, проверьте подключение к интернету");
      } else {
        setError("Произошла ошибка при регистрации");
      }
    } finally {
      setLoading(false);
    }
  };

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "lastName":
        if (!value) error = "Фамилия обязательна";
        else if (!/^[a-zA-Z]+$/.test(value))
          error = "";
        break;
      case "firstName":
        if (!value) error = "Имя обязательно";
        else if (!/^[a-zA-Z]+$/.test(value))
          error = "";
        break;
      case "email":
        if (!value) error = "Email обязателен";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          error = "Неверный формат email";
        break;
      case "phone":
        if (!value) error = "Телефон обязателен";
        else if (!/^\+?[0-9]{10,15}$/.test(value.replace(/\D/g, "")))
          error = "Неверный формат телефона";
        break;
      case "password":
        if (!value) error = "Пароль обязателен";
        else if (value.length < 8) error = "Минимум 8 символов";
        break;
      case "confirmPassword":
        if (!value) error = "Подтвердите пароль";
        else if (value !== formData.password) error = "Пароли не совпадают";
        break;
      case "address.city":
        if (!value) error = "Город обязателен";
        break;
      case "address.street":
        if (!value) error = "Улица обязательна";
        break;
      case "address.house":
        if (!value) error = "Номер дома обязателен";
        break;
    }
    return error;
  };

  const handleInputChange = (e, field) => {
    const value = e.target.value;
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
      setErrors((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: validateField(field, value) },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
    }
  };

  return (
    <div className="registration-container">
      <h1>РЕГИСТРАЦИЯ</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-content">
          <p className="form-note">Все поля формы, являются обязательными!</p>

          <div className="form-grid">
            <div className="form-group">
              <label>Страна получения посылок:</label>
              <div className="country-select">
                <div
                  className="select-header"
                  onClick={() => setIsSelectOpen(!isSelectOpen)}
                >
                  {selectedCountry ? (
                    <span>
                      <span className="country-flag">
                        {React.createElement(
                          countryIcons[selectedCountry.code] || FaFlag
                        )}
                      </span>
                      {selectedCountry.name}
                    </span>
                  ) : (
                    <span>Выберите страну</span>
                  )}
                  <span className={`arrow ${isSelectOpen ? "open" : ""}`}>
                    ▼
                  </span>
                </div>
                <div className={`select-options ${isSelectOpen ? "open" : ""}`}>
                  {countries.map((country) => (
                    <div
                      key={country.id}
                      className={`country-option ${
                        country.disabled ? "disabled" : ""
                      }`}
                      onClick={() => {
                        if (!country.disabled) {
                          setSelectedCountry(country);
                          setFormData({ ...formData, country: country.id });
                          setIsSelectOpen(false);
                        }
                      }}
                      title={country.disabled ? "Скоро будет доступно" : ""}
                    >
                      <span className="country-flag">
                        {React.createElement(
                          countryIcons[country.code] || FaFlag
                        )}
                      </span>
                      {country.name}
                    </div>
                  ))}
                </div>
              </div>
              {!selectedCountry && (
                <div className="error-message">Выберите страну</div>
              )}
            </div>

            <div className="form-group">
              <label>Фамилия:</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange(e, "lastName")}
                placeholder="Фамилия"
                required
              />
              <small>Используйте только латинские буквы</small>
              {errors.lastName && (
                <div className="error-message">{errors.lastName}</div>
              )}
            </div>

            <div className="form-group">
              <label>Имя:</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange(e, "firstName")}
                placeholder="Имя"
                required
              />
              <small>Используйте только латинские буквы</small>
              {errors.firstName && (
                <div className="error-message">{errors.firstName}</div>
              )}
            </div>

          
            <div className="form-group">
              <label>Телефон:</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange(e, "phone")}
                placeholder="Телефон"
                required
              />
              {errors.phone && (
                <div className="error-message">{errors.phone}</div>
              )}
            </div>

            <div className="form-group">
              <label>Пароль:</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange(e, "password")}
                placeholder="Пароль"
                required
                minLength={8}
              />
              <small>Минимум 8 символов</small>
              {errors.password && (
                <div className="error-message">{errors.password}</div>
              )}
            </div>

            <div className="form-group">
              <label>Повторите пароль:</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange(e, "confirmPassword")}
                placeholder="Повторите пароль"
                required
              />
              {errors.confirmPassword && (
                <div className="error-message">{errors.confirmPassword}</div>
              )}
            </div>
          </div>

          <div className="document-upload">
            <div className="form-group">
              <label>Скан ID карты лицевая сторона:</label>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  id="idCardFront"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setFormData({ ...formData, idCardFront: file });
                    if (!file) {
                      setErrors((prev) => ({
                        ...prev,
                        idCardFront: "Выберите файл",
                      }));
                    } else if (file.size > 2 * 1024 * 1024) {
                      setErrors((prev) => ({
                        ...prev,
                      }));
                    } else {
                      setErrors((prev) => ({ ...prev, idCardFront: "" }));
                    }
                  }}
                  accept="image/*"
                  required
                  style={{ display: "none" }}
                />
                <button
                  type="button"
                  className="file-select-button"
                  onClick={() => document.getElementById("idCardFront").click()}
                >
                  Выбрать файл
                </button>
                <small>
                  {formData.idCardFront
                    ? `Выбран файл: ${formData.idCardFront.name}`
                    : "Файл не выбран"}
                </small>
              </div>
              {errors.idCardFront && (
                <div className="error-message">{errors.idCardFront}</div>
              )}
            </div>

            <div className="form-group">
              <label>Скан ID карты обратная сторона:</label>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  id="idCardBack"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setFormData({ ...formData, idCardBack: file });
                    if (!file) {
                      setErrors((prev) => ({
                        ...prev,
                        idCardBack: "Выберите файл",
                      }));
                    } else if (file.size > 2 * 1024 * 1024) {
                      setErrors((prev) => ({
                        ...prev,
                      }));
                    } else {
                      setErrors((prev) => ({ ...prev, idCardBack: "" }));
                    }
                  }}
                  accept="image/*"
                  required
                  style={{ display: "none" }}
                />
                <button
                  type="button"
                  className="file-select-button"
                  onClick={() => document.getElementById("idCardBack").click()}
                >
                  Выбрать файл
                </button>
                <small>
                  {formData.idCardBack
                    ? `Выбран файл: ${formData.idCardBack.name}`
                    : "Файл не выбран"}
                </small>
              </div>
              {errors.idCardBack && (
                <div className="error-message">{errors.idCardBack}</div>
              )}
            </div>
          </div>
          <div className="address-section">
            <h3>Адрес фактического проживания:</h3>
            <div className="address-grid">
              <div className="form-group">
                <label>Город/село:</label>
                <input
                  type="text"
                  value={formData.address.city}
                  onChange={(e) => handleInputChange(e, "address.city")}
                  placeholder="Город/село"
                  required
                />
                {errors.address.city && (
                  <div className="error-message">{errors.address.city}</div>
                )}
              </div>

              <div className="form-group">
                <label>Улица/мкр./жм и тд.:</label>
                <input
                  type="text"
                  value={formData.address.street}
                  onChange={(e) => handleInputChange(e, "address.street")}
                  placeholder="Улица/мкр./жм и тд."
                  required
                />
                {errors.address.street && (
                  <div className="error-message">{errors.address.street}</div>
                )}
              </div>

              <div className="form-group">
                <label>Дом/квартира:</label>
                <input
                  type="text"
                  value={formData.address.house}
                  onChange={(e) => handleInputChange(e, "address.house")}
                  placeholder="Дом/квартира"
                  required
                />
                {errors.address.house && (
                  <div className="error-message">{errors.address.house}</div>
                )}
              </div>
            </div>
          </div>
          <div className="form-group">
              <label>Почта:</label>
              <div className="email-input-group">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange(e, "email")}
                  placeholder="E-mail адрес"
                  required
                />
                {!isEmailSent && (
                  <button
                    type="button"
                    className="confirm-email-button"
                    onClick={handleSendConfirmationEmail}
                  >
                    Подтвердить email
                  </button>
                )}
              </div>
              {errors.email && (
                <div className="error-message">{errors.email}</div>
              )}
              {emailError && <div className="error-message">{emailError}</div>}
            </div>

            {showConfirmationInput && (
              <div className="form-group">
                <label>Код подтверждения:</label>
                <input
                  type="text"
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value)}
                  placeholder="Введите код из письма"
                  required
                />
                {isEmailSent && (
                  <small>Код подтверждения отправлен на ваш email</small>
                )}
                {!confirmationCode && (
                  <div className="error-message">Введите код подтверждения</div>
                )}
              </div>
            )}

          <div className="agreement">
            <label>
              <input type="checkbox" required />Я согласен с{" "}
              <a href="/terms" className="terms-link">
                публичной офертой
              </a>
            </label>
          </div>

          <p className="activation-note">
            После того, как Вы нажмете кнопку зарегистрировать, Вам придет
            письмо на почту для активации аккаунта. При его активации
            потребуется пин-код, который придет Вам на телефон. Таким образом,
            Вы подтвердите свой адрес электронной почты и номер телефона.
          </p>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            className="register-button center"
            disabled={loading}
          >
            {loading ? "ЗАГРУЗКА..." : "ЗАРЕГИСТРИРОВАТЬСЯ"}
          </button>
        </div>
      </form>
    </div>
  );
}
