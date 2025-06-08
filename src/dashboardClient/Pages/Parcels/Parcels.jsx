import React, { useEffect, useState } from "react";
import "./Parcels.css";
import {
  FaClock,
  FaWarehouse,
  FaPaperPlane,
  FaFlag,
  FaCheck,
  FaChevronDown,
  FaChevronUp,
  FaSearch,
  FaInfoCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaUndoAlt,
  FaPause,
  FaBan,
  FaSpinner,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import image from "../../../assets/image/cargo.png";
import { Tooltip } from "react-tooltip";
import { get } from "../../../api/api";

const Parcels = () => {
  const [searchTrack, setSearchTrack] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [selectedFlight, setSelectedFlight] = useState("");
  const [expandedParcels, setExpandedParcels] = useState({});
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedParcelImages, setSelectedParcelImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const token = localStorage.getItem("token");
  const [userClient, setUserClient] = useState([]);
  const [stores, setStores] = useState([]);
  const [statuses, setStatuses] = useState([]);

  const statusIconMap = {
    Проверяется: { icon: <FaClock />, color: "#ffa500" },
    "Ждем на склад": { icon: <FaSpinner />, color: "#808080" },
    "На складе": { icon: <FaWarehouse />, color: "#2196f3" },
    Отправлена: { icon: <FaPaperPlane />, color: "#9c27b0" },
    "На обработке": { icon: <FaSpinner />, color: "#795548" },
    Прибыла: { icon: <FaFlag />, color: "#ff5722" },
    "Доставлена заказчику": { icon: <FaCheck />, color: "#4caf50" },
    "Неправильный трекинг номер": {
      icon: <FaExclamationTriangle />,
      color: "#f44336",
    },
    "Возвращена отправителю": { icon: <FaUndoAlt />, color: "#e91e63" },
    "Задержана на складе": { icon: <FaPause />, color: "#ff9800" },
    Отменена: { icon: <FaBan />, color: "#9e9e9e" },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const [packagesResponse, storesResponse, statusesResponse] =
          await Promise.all([
            get.getMyPackages(config),
            get.getStore(config),
            get.getStatus(config),
          ]);

        console.log("Packages data:", packagesResponse);
        console.log("Stores data:", storesResponse);
        console.log("Statuses data:", statusesResponse);

        setUserClient(packagesResponse);
        setStores(storesResponse);

        const specialStatuses = [
          "Неправильный трекинг номер",
          "Возвращена отправителю",
          "Задержана на складе",
          "Отменена",
        ];

        const mappedStatuses = statusesResponse
          .map(([statusId, statusName]) => {
            const count = packagesResponse.filter(
              (p) => p.status === statusId
            ).length;

            if (specialStatuses.includes(statusId) && count === 0) {
              return null;
            }

            return {
              id: statusId,
              icon: statusIconMap[statusId]?.icon || <FaInfoCircle />,
              label: statusName,
              description: `Статус: ${statusName}`,
              count: count,
              color: statusIconMap[statusId]?.color || "#666",
            };
          })
          .filter(Boolean); 

        setStatuses(mappedStatuses);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const toggleParcel = (id) => {
    setExpandedParcels((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSearch = (e) => {
    setSearchTrack(e.target.value);
  };

  const filteredParcels = userClient.filter((parcel) => {
    const matchesStatus =
      selectedStatus === "" || parcel.status === selectedStatus;
    const matchesSearch =
      searchTrack === "" ||
      parcel.tracking_number
        .toLowerCase()
        .includes(searchTrack.toLowerCase()) ||
      parcel.id.toString().includes(searchTrack);
    const matchesWarehouse =
      selectedWarehouse === "" || parcel.warehouse === selectedWarehouse;
    const matchesFlight =
      selectedFlight === "" || parcel.reys === selectedFlight;

    return matchesStatus && matchesSearch && matchesWarehouse && matchesFlight;
  });

  const getStoreName = (storeId) => {
    const store = stores.find((s) => s.id === storeId);
    return store ? store.name : "Магазин не указан";
  };

  const ImageModal = ({ images, currentIndex, onClose }) => {
    if (!images || images.length === 0) return null;
    
    const goToNextImage = (e) => {
      e.stopPropagation();
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };
    
    const goToPrevImage = (e) => {
      e.stopPropagation();
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
      <div className="modal-image-overlay" onClick={onClose}>
        <div className="modal-image-container" onClick={e => e.stopPropagation()}>
          <button className="modal-image-close" onClick={onClose}>
            <FaTimes />
          </button>
          <div className="modal-image-content">
            <button 
              className="modal-image-nav modal-image-prev" 
              onClick={goToPrevImage}
              disabled={images.length <= 1}
            >
              <FaChevronLeft />
            </button>
            <img src={images[currentIndex]} alt={`Фото ${currentIndex + 1} из ${images.length}`} />
            <button 
              className="modal-image-nav modal-image-next" 
              onClick={goToNextImage}
              disabled={images.length <= 1}
            >
              <FaChevronRight />
            </button>
          </div>
          <div className="modal-image-dots">
            {images.map((_, index) => (
              <button
                key={index}
                className={`modal-image-dot ${index === currentIndex ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="parcels-container">
      <div className="parcels-header">
        <h1>Мои посылки</h1>
        <div className="search-section">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Поиск по трек-номеру или ID посылки"
              value={searchTrack}
              onChange={handleSearch}
            />
          </div>
          <button
            className="filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? "Скрыть фильтры" : "Показать фильтры"}
          </button>
        </div>
      </div>

      <div className="status-tabs">
        <div
          className={`status-tab all ${selectedStatus === "" ? "active" : ""}`}
          onClick={() => setSelectedStatus("")}
          style={{ borderColor: "#666" }}
        >
          <span className="status-icon" style={{ color: "#666" }}>
            <FaInfoCircle />
          </span>
          <span className="status-label">Все посылки</span>
          <span className="status-count" style={{ backgroundColor: "#666" }}>
            {userClient.length}
          </span>
        </div>
        {statuses.map((status) => (
          <div
            key={status.id}
            className={`status-tab ${status.id} ${
              selectedStatus === status.id ? "active" : ""
            } ${status.count === 0 ? "empty" : ""}`}
            onClick={() => setSelectedStatus(status.id)}
            style={{ borderColor: status.color }}
            data-tooltip-id={`status-${status.id}`}
          >
            <span className="status-icon" style={{ color: status.color }}>
              {status.icon}
            </span>
            <span className="status-label">{status.label}</span>
            <span
              className="status-count"
              style={{ backgroundColor: status.color }}
            >
              {status.count}
            </span>
            <Tooltip id={`status-${status.id}`} place="top">
              {status.description}
            </Tooltip>
          </div>
        ))}
      </div>

      {showFilters && (
        <div className="filters">
          <select
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
            className="filter-select"
          >
            <option value="">Все склады</option>
            <option value="США">США</option>
            <option value="Китай">Китай</option>
          </select>

          <select
            value={selectedFlight}
            onChange={(e) => setSelectedFlight(e.target.value)}
            className="filter-select"
          >
            <option value="">Все рейсы</option>
            <option value="2025/3">2025/3</option>
            <option value="2025/2">2025/2</option>
          </select>
        </div>
      )}

      <div className="parcels-table">
        <table>
          <thead>
            <tr>
              <th></th>

              <th>ПОСЫЛКА/СТАТУС</th>
              <th>
                ТРЕК-НОМЕР <FaInfoCircle data-tooltip-id="track-info" />
              </th>
              <th>РЕЙС</th>
              <th>КОММЕНТАРИИ</th>

              <th>СКЛАД</th>
              <th>МАГАЗИН</th>
              <th>ТИП УПАКОВКИ</th>
              <th>ДОСТАВКА</th>
              <th>ФОТО</th>
              <th>ДЕЙСТВИЯ</th>
            </tr>
          </thead>
          <tbody>
            {filteredParcels.length === 0 ? (
              <tr>
                <td colSpan="10" className="no-results">
                  <div className="no-results-message">
                    <FaInfoCircle />
                    <p>Посылки не найдены</p>
                    <p className="sub-message">
                      Попробуйте изменить параметры поиска
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredParcels.map((parcel) => (
                <React.Fragment key={parcel.id}>
                  <tr className={`parcel-row ${parcel.status}`}>
                    <td>
                      {parcel.package_details?.length > 0 && (
                        <button
                          className="toggle-button"
                          onClick={() => toggleParcel(parcel.id)}
                          data-tooltip-id={`toggle-${parcel.id}`}
                        >
                          {expandedParcels[parcel.id] ? (
                            <FaChevronUp />
                          ) : (
                            <FaChevronDown />
                          )}
                        </button>
                      )}
                    </td>

                    <td>
                      <div className="parcel-status">
                        <div className="parcel-id">
                          <strong>Посылка #{parcel.id}</strong>
                        </div>
                        <div
                          className="status-text"
                          style={{
                            color: statuses.find((s) => s.id === parcel.status)
                              ?.color,
                          }}
                        >
                          {statuses.find((s) => s.id === parcel.status)?.icon}
                          <span style={{ marginLeft: "5px" }}>
                            {parcel.status || "Статус не определен"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="track-number">
                      <span
                        className="copy-enabled"
                        onClick={() =>
                          navigator.clipboard.writeText(parcel.tracking_number)
                        }
                        data-tooltip-id={`track-${parcel.id}`}
                      >
                        {parcel.tracking_number || "Не указан"}
                      </span>
                      <Tooltip id={`track-${parcel.id}`}>
                        Нажмите, чтобы скопировать
                      </Tooltip>
                    </td>
                    <td>
                      {parcel.reys
                        ? `${parcel.reys.year}/${parcel.reys.number}`
                        : ""}
                    </td>
                  <td>{parcel.client_comment}</td>

                    <td>{parcel.warehouse || "Не указан"}</td>
                    <td>{getStoreName(parcel.store)}</td>
                    <td>{parcel.type_of_packaging || "Не указан"}</td>
                   
                    <td>
                      {parcel.delivery_price
                        ? `${parcel.delivery_price} $`
                        : "-"}
                    </td>
                    <td>
                      {parcel.package_image ? (
                        <div className="photo-thumbnails" style={{display:"flex", gap:"10px"}}>
                          <img
                            src={parcel.package_image}
                            alt="Фото посылки"
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                              cursor: "pointer"
                            }}
                            onClick={() => {
                              const images = [
                                parcel.package_image,
                                parcel.label_image,
                                parcel.invoice_image
                              ].filter(Boolean);
                              setSelectedParcelImages(images);
                              setCurrentImageIndex(0);
                              setShowImageModal(true);
                            }}
                          />
                          <img
                            src={parcel.label_image}
                            alt="Фото посылки"
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                              cursor: "pointer"
                            }}
                            onClick={() => {
                              const images = [
                                parcel.package_image,
                                parcel.label_image,
                                parcel.invoice_image
                              ].filter(Boolean);
                              setSelectedParcelImages(images);
                              setCurrentImageIndex(1);
                              setShowImageModal(true);
                            }}
                          />
                          <img
                            src={parcel.invoice_image}
                            alt="Фото посылки"
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                              cursor: "pointer"
                            }}
                            onClick={() => {
                              const images = [
                                parcel.package_image,
                                parcel.label_image,
                                parcel.invoice_image
                              ].filter(Boolean);
                              setSelectedParcelImages(images);
                              setCurrentImageIndex(2);
                              setShowImageModal(true);
                            }}
                          />
                        </div>
                      ) : (
                        <span className="no-photo">Нет фото</span>
                      )}
                    </td>
                    <td>
                      <button
                        className="action-button"
                        data-tooltip-id={`actions-${parcel.id}`}
                      >
                        ⋮
                      </button>
                      <Tooltip id={`actions-${parcel.id}`}>
                        Дополнительные действия
                      </Tooltip>
                    </td>
                  </tr>
                  {parcel.package_details?.length > 0 &&
                    expandedParcels[parcel.id] && (
                      <tr className="items-row">
                        <td colSpan="10">
                          <div className="items-list">
                            <div className="items-header">
                              <span>Количество</span>
                              <span>Наименование</span>
                              <span>Стоимость</span>
                            </div>
                            {parcel.package_details.map((item) => (
                              <div key={item.id} className="item-details">
                                <span>{item.count || "1 шт."}</span>
                                <span>{item.product || "Не указано"}</span>
                                <span>
                                  {item.price
                                    ? `${item.price} $`
                                    : "Не указана"}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Tooltip id="track-info">
        Трек-номер для отслеживания посылки. Нажмите на номер для копирования.
      </Tooltip>
      
      {showImageModal && (
        <ImageModal
          images={selectedParcelImages}
          currentIndex={currentImageIndex}
          onClose={() => {
            setShowImageModal(false);
            setSelectedParcelImages([]);
            setCurrentImageIndex(0);
          }}
        />
      )}
    </div>
  );
};

export default Parcels;
