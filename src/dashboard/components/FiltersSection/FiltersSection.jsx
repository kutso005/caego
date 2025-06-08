import React, { memo, useState, useEffect } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";
import "./FiltersSection.css";
import { get } from "../../../api/api";

const FiltersSection = memo(
  ({ filters, handleFilterChange, handleSearch, navigate }) => {
    const [statusOptions, setStatusOptions] = useState([]);
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [clients, setClients] = useState([]);
    const [isClientOpen, setIsClientOpen] = useState(false);
    const [clientSearch, setClientSearch] = useState("");
    const [isFlightOpen, setIsFlightOpen] = useState(false);
    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedFlight, setSelectedFlight] = useState("");

    const statusColors = {
      Проверяется: "#FFB74D",
      "На складе": "#4CAF50",
      Отправлена: "#2196F3",
      "На обработке": "#9CCC65",
      Прибыла: "#7E57C2",
      "Доставлена заказчику": "#66BB6A",
      "Неправильный трекинг номер": "#EF5350",
      "Возвращена отправителю": "#EC407A",
      "Задержана на складе": "#FF7043",
      Отменена: "#E53935",
    };

    const years = [2000, 2023, 2024, 2025];
    const flights = Array.from({ length: 100 }, (_, i) => i + 1);

    useEffect(() => {
      fetchStatuses();
      fetchClients();
    }, []);

    const fetchStatuses = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await get.getStatus(config);
        const formattedStatuses = response.map(([value, label]) => ({
          id: value,
          label: label,
          color: statusColors[label] || "#808080",
        }));
        setStatusOptions(formattedStatuses);
      } catch (error) {
        console.error("Error fetching statuses:", error);
      }
    };

    const fetchClients = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await get.getUsers(config);
        setClients(response);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      if (name === "trackNumber") {
        // Сбрасываем все остальные фильтры при вводе трек-номера
        handleFilterChange({ target: { name, value } });
        handleFilterChange({ target: { name: "client", value: "" } });
        handleFilterChange({ target: { name: "clientByWarehouse", value: "" } });
        handleFilterChange({ target: { name: "magazine", value: "" } });
        handleFilterChange({ target: { name: "reys", value: "" } });
        handleFilterChange({ target: { name: "status", value: "" } });
        handleFilterChange({ target: { name: "dateCreatedStart", value: "" } });
        handleFilterChange({ target: { name: "dateCreatedEnd", value: "" } });
        handleFilterChange({
          target: { name: "dateOnWarehouseStart", value: "" },
        });
        handleFilterChange({ target: { name: "dateOnWarehouseEnd", value: "" } });
        handleFilterChange({ target: { name: "clientRequest", value: "" } });
        setClientSearch("");
        setSelectedYear(null);
        setSelectedFlight("");
      } else {
        handleFilterChange({ target: { name, value } });
      }
    };

    const handleClientSearch = (e) => {
      setClientSearch(e.target.value);
      setIsClientOpen(true);
    };

    const handleClientSelect = (client) => {
      handleFilterChange({ target: { name: "client", value: client.id } });
      setClientSearch(`${client.client_id} - ${client.first_name} ${client.last_name}`);
      setIsClientOpen(false);
    };

    const handleFlightSelect = (year, flight) => {
      setSelectedYear(year);
      setSelectedFlight(flight);
      setIsFlightOpen(false);
      handleFilterChange({
        target: {
          name: "reys",
          value: `${year}/${flight}`,
        },
      });
    };

    const handleDateChange = (e) => {
      const { name, value } = e.target;
      handleFilterChange({ target: { name, value } });
    };

    const normalizeTrackNumbers = (input) => {
      return input
        .split(/,|\n/)
        .map((num) => num.trim())
        .filter((num) => num.length > 0);
    };

    const handleSearchClick = () => {
      const trackNumbers = normalizeTrackNumbers(filters.trackNumber);
      handleSearch({ trackNumber: trackNumbers });
    };

    const filteredClients = clients.filter((client) =>
      `${client.first_name} ${client.client_id} ${client.last_name}`
        .toLowerCase()
        .includes(clientSearch.toLowerCase())
    );

    return (
      <div className="filters-section">
        <div className="filters-row">
          <div className="filter-group">
            <input
              type="text"
              name="trackNumber"
              placeholder="Введите трек-номера через запятую или с новой строки"
              value={filters.trackNumber}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSearchClick();
                }
              }}
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                handleSearchClick();
              }}
              className="search-btn"
            >
              <FaSearch /> Поиск
            </button>
          </div>
          <button
            className="add-parcel-btn"
            onClick={() => navigate("add-parcel")}
          >
            <FaPlus /> Добавить посылку
          </button>
        </div>

        <div className="filters-grid">
          <div className="client-dropdown-container">
            <input
              type="text"
              placeholder="Клиент"
              value={clientSearch}
              onChange={handleClientSearch}
              onFocus={() => setIsClientOpen(true)}
              disabled={filters.trackNumber.length > 0}
            />
            {isClientOpen && !filters.trackNumber && (
              <div className="client-dropdown">
                {filteredClients.map((client) => (
                  <div
                    key={client.id}
                    className="client-option"
                    onClick={() => handleClientSelect(client)}
                  >
                    <span className="client-id">{client.client_id}</span>
                    <span className="client-name">{`${client.first_name} ${client.last_name}`}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <input
            name="clientByWarehouse"
            placeholder="Клиент по складу"
            value={filters.clientByWarehouse}
            onChange={handleInputChange}
            disabled={filters.trackNumber.length > 0}
          />
          <select
            name="magazine"
            value={filters.magazine || ""}
            onChange={handleInputChange}
            className="magazine-select"
            disabled={filters.trackNumber.length > 0}
          >
            <option value="">Все склады</option>
            <option value="Китай">Китай</option>
            <option value="США">США</option>
          </select>
          <div className="flight-select">
            <div
              className="flight-dropdown"
              onClick={() => !filters.trackNumber && setIsFlightOpen(!isFlightOpen)}
            >
              <span>
                {selectedFlight ? ` ${selectedYear}/${selectedFlight}` : "Рейс"}
              </span>
              {isFlightOpen && !filters.trackNumber && (
                <div className="years-list">
                  {years.map((year) => (
                    <div
                      key={year}
                      className="year-item"
                      onMouseEnter={() => setSelectedYear(year)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedYear(year);
                      }}
                    >
                      {year}
                    </div>
                  ))}
                  {selectedYear && (
                    <div className="flights-list">
                      {flights.map((flight) => (
                        <div
                          key={flight}
                          className="flight-item"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFlightSelect(selectedYear, flight);
                          }}
                        >
                          {flight}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <select
            name="status"
            value={filters.status || ""}
            onChange={handleInputChange}
            disabled={filters.trackNumber.length > 0}
          >
            <option value="">Статус</option>
            {statusOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="date-filters">
          <div className="date-group">
            <input
              type="date"
              name="dateCreatedStart"
              value={filters.dateCreatedStart}
              onChange={handleDateChange}
              disabled={filters.trackNumber.length > 0}
            />
            <input
              type="date"
              name="dateCreatedEnd"
              value={filters.dateCreatedEnd}
              onChange={handleDateChange}
              disabled={filters.trackNumber.length > 0}
            />
          </div>
          <div className="date-group">
            <input
              type="date"
              name="dateOnWarehouseStart"
              value={filters.dateOnWarehouseStart}
              onChange={handleDateChange}
              disabled={filters.trackNumber.length > 0}
            />
            <input
              type="date"
              name="dateOnWarehouseEnd"
              value={filters.dateOnWarehouseEnd}
              onChange={handleDateChange}
              disabled={filters.trackNumber.length > 0}
            />
          </div>
          <input
            type="text"
            name="clientRequest"
            placeholder="Запрос от клиента"
            value={filters.clientRequest}
            onChange={handleInputChange}
            disabled={filters.trackNumber.length > 0}
          />
        </div>
      </div>
    );
  }
);

export default FiltersSection;