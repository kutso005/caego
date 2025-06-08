import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import "./Scanning.css";
import { get } from "../../api/api";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export default function Scanning() {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes("/outgoing")) return "outgoing";
    if (path.includes("/locations")) return "location";
    if (path.includes("/search")) return "search";
    return "incoming";
  };

  const [activeTab, setActiveTab] = useState(getActiveTab());
  const [trackNumber, setTrackNumber] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [qualities, setQualities] = useState([]);
  const [outgoingData, setOutgoingData] = useState([]);
  const [locationsData, setLocationsData] = useState([]);
  const [locations, setLocations] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    setActiveTab(getActiveTab());
  }, [location.pathname]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await get.Location(config);
        setLocations(response || []);
      } catch (error) {
        console.error("Ошибка при получении локаций:", error);
      }
    };

    fetchLocations();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        if (getActiveTab() === "incoming") {
          const response = await get.getIncoming(config);
          setQualities(response);
        } else if (getActiveTab() === "outgoing") {
          const response = await get.getOutgoing(config);
          setOutgoingData(response);
        } else if (getActiveTab() === "location") {
          const response = await get.getLocations(config);
          setLocationsData(response || []);
        } else if (getActiveTab() === "search") {
          handleSearch();
        }
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      }
    };

    fetchData();
  }, [location.pathname]);

  const handleTabClick = (tab) => {
    switch (tab) {
      case "incoming":
        navigate("/dashboard/scanning");
        break;
      case "outgoing":
        navigate("/dashboard/scanning/outgoing");
        break;
      case "location":
        navigate("/dashboard/scanning/locations");
        break;
      case "search":
        navigate("/dashboard/scanning/search");
        break;
      default:
        navigate("/dashboard/scanning");
    }
  };
  const handleSearch = async () => {
    try {
      const params = new URLSearchParams();

      if (!trackNumber && !selectedType && !selectedCountry) {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await get.searchScans(config);
        setSearchResults(response);
        return;
      }

      if (selectedType === "Локация") {
        params.append("location", "true");
        params.append("type", "");
      } else if (selectedType) {
        params.append("type", selectedType);
        params.append("location", "false");
      }

      if (trackNumber) {
        params.append("tracking_number", trackNumber);
      }
      if (selectedCountry) {
        params.append("country", selectedCountry);
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: params,
      };

      console.log("Search params:", params.toString());
      const response = await get.searchScans(config);
      console.log("Search response:", response);

      let filteredResponse = response;
      if (selectedType === "Локация") {
        filteredResponse = response.filter((item) => item.location);
      } else if (selectedType) {
        filteredResponse = response.filter(
          (item) => item.type === selectedType
        );
      }

      setSearchResults(filteredResponse);
    } catch (error) {
      console.error("Ошибка при поиске:", error);
    }
  };

  useEffect(() => {
    if (getActiveTab() === "search") {
      handleSearch();
    }
  }, [trackNumber, selectedType, selectedCountry]);

  const handleClear = () => {
    setTrackNumber("");
    setSelectedType("");
    setSelectedCountry("");
    handleSearch();
  };

  const handleTypeChange = async (e) => {
    const newType = e.target.value;
    setSelectedType(newType);

    try {
      const params = new URLSearchParams();

      if (newType === "Локация") {
        params.append("location", "true");
        params.append("type", "");
      } else if (newType) {
        params.append("type", newType);
        params.append("location", "false");
      }

      if (trackNumber) {
        params.append("tracking_number", trackNumber);
      }
      if (selectedCountry) {
        params.append("country", selectedCountry);
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: params,
      };

      console.log("Search params:", params.toString());
      const response = await get.searchScans(config);
      console.log("Search response:", response);

      let filteredResponse = response;
      if (newType === "Локация") {
        filteredResponse = response.filter((item) => item.location);
      } else if (newType) {
        filteredResponse = response.filter((item) => item.type === newType);
      }

      setSearchResults(filteredResponse);
    } catch (error) {
      console.error("Ошибка при поиске:", error);
    }
  };

  const handleCountryChange = async (e) => {
    const newCountry = e.target.value;
    setSelectedCountry(newCountry);

    try {
      const params = new URLSearchParams();

      if (selectedType) {
        params.append("type", selectedType);
      }
      if (trackNumber) {
        params.append("tracking_number", trackNumber);
      }
      if (newCountry) {
        params.append("country", newCountry);
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: params.toString() ? params : undefined,
      };

      const response = await get.searchScans(config);
      setSearchResults(response);
    } catch (error) {
      console.error("Ошибка при поиске:", error);
    }
  };

  const debouncedScanSubmit = React.useCallback(
    debounce(async (newTrackNumber) => {
      if (newTrackNumber) {
        try {
          const requestData = {
            tracking_number: newTrackNumber,
            tracking_number_2: "string",
          };

          let response;
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          };

          if (activeTab === "incoming") {
            response = await axios.post(
              "https://moicargo.kg/api/v1/scans/incoming/",
              requestData,
              config
            );
          } else if (activeTab === "outgoing") {
            response = await axios.post(
              "https://moicargo.kg/api/v1/scans/outgoing/",
              requestData,
              config
            );
          } else if (activeTab === "location" && selectedLocation) {
            const selectedLocationObj = locations.find(
              (loc) => loc.name === selectedLocation
            );
            if (selectedLocationObj) {
              requestData.location = selectedLocationObj.id;
              response = await axios.post(
                "https://moicargo.kg/api/v1/scans/location/",
                requestData,
                config
              );
            }
          }

          if (
            response &&
            (response.status === 200 || response.status === 201)
          ) {
            toast.success(
              activeTab === "location"
                ? "Локация успешно сохранена"
                : "Скан успешно сохранен",
              {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
              }
            );
            setTrackNumber("");
            const fetchConfig = {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            };
            if (activeTab === "incoming") {
              const newData = await get.getIncoming(fetchConfig);
              setQualities(newData);
            } else if (activeTab === "outgoing") {
              const newData = await get.getOutgoing(fetchConfig);
              setOutgoingData(newData);
            } else if (activeTab === "location") {
              const newData = await get.getLocations(fetchConfig);
              setLocationsData(newData || []);
            }
          }
        } catch (error) {
          console.error("Ошибка при сохранении:", error);
          toast.error(
            activeTab === "location"
              ? "Ошибка при сохранении локации"
              : "Ошибка при сохранении скана",
            {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            }
          );
        }
      }
    }, 200),
    [activeTab, token, selectedLocation, locations]
  );

  const handleTrackNumberChange = async (e) => {
    const newTrackNumber = e.target.value;
    setTrackNumber(newTrackNumber);

    if (activeTab !== "search") {
      debouncedScanSubmit(newTrackNumber);
    }
  };

  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
    if (trackNumber && activeTab === "location") {
      debouncedScanSubmit(trackNumber);
    }
  };

  const items =
    activeTab === "incoming"
      ? qualities
      : activeTab === "outgoing"
      ? outgoingData
      : activeTab === "location"
      ? locationsData
      : searchResults;

  return (
    <div className="dashboard-layout">
      <ToastContainer />
      <Navbar />
      <div className="dashboard-container">
        <div className="scanning-header">
          <div className="tabs">
            <button
              className={`tab ${activeTab === "incoming" ? "active" : ""}`}
              onClick={() => handleTabClick("incoming")}
            >
              Входящие
            </button>
            <button
              className={`tab ${activeTab === "outgoing" ? "active" : ""}`}
              onClick={() => handleTabClick("outgoing")}
            >
              Исходящие
            </button>
            <button
              className={`tab ${activeTab === "location" ? "active" : ""}`}
              onClick={() => handleTabClick("location")}
            >
              Локации
            </button>
            <button
              className={`tab ${activeTab === "search" ? "active" : ""}`}
              onClick={() => handleTabClick("search")}
            >
              Поиск
            </button>
          </div>
        </div>

        <div className="search-filters">
          {activeTab === "search" ? (
            <div className="search-filters-row">
              <input
                type="number"
                placeholder="Введите трек номер"
                value={trackNumber}
                onChange={handleTrackNumberChange}
                className="search-input"
              />
              <select
                value={selectedType}
                onChange={handleTypeChange}
                className="search-select"
              >
                <option value="">Все типы</option>
                <option value="Входящие">Входящие</option>
                <option value="Исходящие">Исходящие</option>
                <option value="Локация">Локации</option>
              </select>
              <select
                value={selectedCountry}
                onChange={handleCountryChange}
                className="search-select"
              >
                <option value="">Выберите страну</option>
                <option value="1">Кыргызстан</option>
              </select>
              <button onClick={handleClear} className="clear-button">
                ×
              </button>
            </div>
          ) : (
            <div className="search-group">
              <label>Трек номер</label>
              <input
                type="number"
                placeholder="Введите трек номер"
                value={trackNumber}
                onChange={handleTrackNumberChange}
              />
            </div>
          )}
          {activeTab === "location" && (
            <div className="search-group">
              <label>Название локации</label>
              <select
                value={selectedLocation}
                onChange={handleLocationChange}
                className="location-select"
              >
                <option value="">Выберите локацию</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.name}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          {activeTab !== "search" && activeTab !== "location" && <div></div>}
        </div>

        <div className="scanning-table">
          <table>
            <thead>
              <tr>
                <th>Трек номер</th>
                <th>Трек номер 2</th>
                <th>Дата сканирования</th>
                <th>Тип</th>
                <th>Менеджер</th>
                <th>Страна</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td>{item.tracking_number}</td>
                  <td>{item.tracking_number_2}</td>
                  <td>{new Date(item.updated_at).toLocaleString()}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        item.type === "Входящие"
                          ? "incoming"
                          : item.type === "Исходящие"
                          ? "outgoing"
                          : "location"
                      }`}
                    >
                      {item.location
                        ? `Локация ${item.location.name}`
                        : item.type}
                    </span>
                  </td>
                  <td>
                    {typeof item.manager === "object" && item.manager !== null
                      ? `${item.manager.first_name || ""} ${
                          item.manager.last_name || ""
                        }`.trim()
                      : item.manager || ""}
                  </td>
                  <td>
                    {typeof item.manager === "object" && item.manager?.country
                      ? item.manager.country.name
                      : ""}
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
