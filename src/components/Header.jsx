import React, { useEffect, useState } from "react";
import logo from "../assets/image/logoi.png";
import { NavLink, useNavigate } from "react-router-dom";
import i18n from "../i18n/i18nextr";
import { IoIosArrowDown } from "react-icons/io";

export default function Header() {
  const navigate = useNavigate();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(
    localStorage.getItem("i18nextLng") || "ru"
  );

  useEffect(() => {
    const savedLanguage = localStorage.getItem("i18nextLng");
    if (savedLanguage && i18n.language !== savedLanguage) {
      i18n.changeLanguage(savedLanguage);
      setSelectedLang(savedLanguage);
    }
  }, []);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("i18nextLng", lng);
    setSelectedLang(lng);
    setIsLangOpen(false);
    window.location.reload();
  };

  const languages = [
    { code: "ky", label: "KG" },
    { code: "ru", label: "RU" },
    { code: "en", label: "EN" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isLangOpen) setIsLangOpen(false);
  };

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
    setIsLangOpen(false);
  };

  return (
    <div id="header">
    <div className="container">
    <div className="header">
      <img className="logos" onClick={() => navigate("/")} src={logo} alt="" />

      <div className="pages">
        <NavLink to="/about-us">О нас</NavLink>
        <NavLink to="/news">Новости</NavLink>
        <NavLink to="/services">Услуги</NavLink>
        <NavLink to="/contacts">Контакты</NavLink>
      </div>

      <div className="login-register">
        <div className="language-selector">
          <div
            className={`register-button ${isLangOpen ? "open" : ""}`}
            onClick={() => setIsLangOpen(!isLangOpen)}
          >
            {languages.find((lang) => lang.code === selectedLang)?.label}
            <span className="arrow">
              <IoIosArrowDown color="#fff" size={15} />
            </span>
          </div>
          <div className={`language-dropdown ${isLangOpen ? "open" : ""}`}>
            {languages.map((lang) => (
              <div
                key={lang.code}
                className={`language-option ${
                  selectedLang === lang.code ? "active" : ""
                }`}
                onClick={() => changeLanguage(lang.code)}
              >
                {lang.label}
              </div>
            ))}
          </div>
        </div>
        <button className="register-button" onClick={() => navigate("/login")}>
          Вход
        </button>
        <button
          className="register-button"
          onClick={() => navigate("/register")}
        >
          Регистрация
        </button>
      </div>

      <div
        className={`burger-menu ${isMobileMenuOpen ? "active" : ""}`}
        onClick={toggleMobileMenu}
      >
        <div className="burger-bar"></div>

        <div className="burger-bar"></div>

        <div className="burger-bar"></div>

      </div>

      <div className={`mobile-nav ${isMobileMenuOpen ? "active" : ""}`}>
        <div className="pages">
          <NavLink to="/about-us" onClick={handleNavClick}>
            О нас
          </NavLink>
          <NavLink to="/news" onClick={handleNavClick}>
            Новости
          </NavLink>
          <NavLink to="/services" onClick={handleNavClick}>
            Услуги
          </NavLink>
        
          <NavLink to="/contacts" onClick={handleNavClick}>
            Контакты
          </NavLink>
        </div>

        <div className="login-register">
          <div className="language-selector">
            <div
              className={`register-button ${isLangOpen ? "open" : ""}`}
              onClick={() => setIsLangOpen(!isLangOpen)}
            >
              {languages.find((lang) => lang.code === selectedLang)?.label}
              <span className="arrow">
                <IoIosArrowDown color="#fff" size={15} />
              </span>
            </div>
            <div className={`language-dropdown ${isLangOpen ? "open" : ""}`}>
              {languages.map((lang) => (
                <div
                  key={lang.code}
                  className={`language-option ${
                    selectedLang === lang.code ? "active" : ""
                  }`}
                  onClick={() => changeLanguage(lang.code)}
                >
                  {lang.label}
                </div>
              ))}
            </div>
          </div>
          <button
            className="register-button"
            onClick={() => {
              navigate("/login");
              handleNavClick();
            }}
          >
            Вход
          </button>
          <button
            className="register-button"
            onClick={() => {
              navigate("/register");
              handleNavClick();
            }}
          >
            Регистрация
          </button>
        </div>
      </div>

      <div
        className={`mobile-overlay ${isMobileMenuOpen ? "active" : ""}`}
        onClick={toggleMobileMenu}
      ></div>
    </div>
    </div>
    </div>
  );
}
