import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "../../../assets/image/logoi.png";
import { FaBox, FaUsers, FaBarcode, FaFileAlt, FaUser } from "react-icons/fa";

export default function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleProfileClick = (e) => {
    e.preventDefault();
    setIsProfileOpen(!isProfileOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/dashboard" className="brand-link">
          <img className="logos" src={logo} alt="logo" />
        </Link>
      </div>

      <div className="nav-links">
        <Link to="/dashboard" className="nav-link">
          <FaBox className="nav-icon" />
          <span>Посылки</span>
        </Link>

        <Link to="/dashboard/clients" className="nav-link">
          <FaUsers className="nav-icon" />
          <span>Клиенты</span>
        </Link>

        <Link to="/dashboard/scanning" className="nav-link">
          <FaBarcode className="nav-icon" />
          <span>Сканирование</span>
        </Link>

        <Link to="/dashboard/awb" className="nav-link">
          <FaFileAlt className="nav-icon" />
          <span>AWB</span>
        </Link>

        <Link to="/dashboard/registry" className="nav-link">
          <FaFileAlt className="nav-icon" />
          <span>Реестр</span>
        </Link>
      </div>

      <div className="nav-footer">
        <div className="profile-container">
          <Link
            className="nav-link"
            onClick={handleProfileClick}
          >
            <FaUser className="nav-icon" />
            <span>Профиль</span>
          </Link>
          {isProfileOpen && (
            <div className="profile-dropdown">
              <Link to="/logout" style={{ color: "white", textDecoration: "none" }}>
                Выйти
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
