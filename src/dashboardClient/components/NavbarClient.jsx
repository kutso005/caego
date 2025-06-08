import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaBox,
  FaUsers,
  FaWarehouse,
  FaGlobe,
  FaMoneyBill,
  FaEdit,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import "./NavbarClient.css";
import logo from "../../assets/image/logoi.png";
import { get } from "../../api/api";
import { MdLogout } from "react-icons/md";

export default function NavbarClient() {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
  });
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
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await get.getUserClient(config);
        setUserData(response);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    navigate("/login");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isDropdownOpen) setIsDropdownOpen(false);
  };

  return (
    <div className="navbar-client-container">
      <div className="navbar-client-top">
        <div className="navbar-client-brand">
          <Link to="/">
            <img className="logos" src={logo} alt="" />
          </Link>
          <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
        <div className="navbar-client-user">
          <div className="user-info" onClick={toggleDropdown}>
            <span className="user-name">{`${userClient.first_name} ${userClient.last_name}`}</span>
            <span className="user-id">{userClient.client_id}</span>
            {isDropdownOpen && (
              <div className="user-dropdown">
                <button onClick={handleLogout} className="dropdown-item">
                  <FaSignOutAlt className="dropdown-icon" />
                  <span>Выйти</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={`navbar-client-side ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
        <button
          className="add-parcel-btn"
          onClick={() => {
            navigate("/dashboardclient/add-parcel");
            setIsMobileMenuOpen(false);
          }}
        >
          Добавить посылку
        </button>
        <nav className="side-nav">
          <NavLink
            to="/dashboardclient"
            end
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FaUser className="nav-icon" />
            <span>Аккаунт</span>
          </NavLink>
          <NavLink
            to="/dashboardclient/parcels"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FaBox className="nav-icon" />
            <span>Посылки</span>
          </NavLink>
          <NavLink
            to="/dashboardclient/recipients"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FaUsers className="nav-icon" />
            <span>Получатели</span>
          </NavLink>
          <NavLink
            to="/dashboardclient/warehouses"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FaWarehouse className="nav-icon" />
            <span>Адреса складов</span>
          </NavLink>
          <NavLink
            to="/dashboardclient/tariff"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FaMoneyBill className="nav-icon" />
            <span>Тарифы</span>
          </NavLink>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <MdLogout className="nav-icon" />
           
            <span>Выйти</span>
          </NavLink>
        </nav>
      </div>
    </div>
  );
}
