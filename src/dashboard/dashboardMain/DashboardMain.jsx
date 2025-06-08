import React, { useState, useEffect, useCallback } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";
import "./DashboardMain.css";
import MainDashboard from "../components/MainDashboard/MainDashboard";
import Clients from "../pages/Clients";
import Recipients from "../pages/Recipients";
import Aggregation from "../pages/Aggregation";
import Scanning from "../pages/Scanning";
import Awb from "../pages/Awb";
import Outgoing from "../pages/Outgoing";
import AddParcel from "../pages/AddParcel/AddParcel";
import EditParcel from "../pages/EditParcel/EditParcel";
import AddClient from "../pages/AddClien/AddClient";
import { get } from "../../api/api";
import useDebounce from "../../hooks/useDebounce";

export default function DashboardMain() {
  const navigate = useNavigate();

  const [parcels, setParcels] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [filters, setFilters] = useState({
    trackNumber: "",
    client: "",
    clientByWarehouse: "",
    magazine: "",
    reys: "",
    warehouse: "",
    dateCreatedStart: "",
    dateCreatedEnd: "",
    dateOnWarehouseStart: "",
    dateOnWarehouseEnd: "",
    clientRequest: "",
    status: "",
  });
  const debouncedFilters = useDebounce(filters, 500);
  const [selectedParcelId, setSelectedParcelId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    fetchParcels();
    fetchStatuses();
  }, []);

  useEffect(() => {
    // Запускаем поиск только если трек-номер не заполнен
    if (!filters.trackNumber.trim()) {
      handleSearch();
    }
  }, [debouncedFilters]);

  const fetchParcels = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      const response = await axios.get("https://moicargo.kg/api/v1/packages/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setParcels(response.data);
    } catch (error) {
      setError("Ошибка при загрузке посылок: " + error.message);
      console.error("Error fetching parcels:", error);
    } finally {
      setLoading(false);
    }
  };

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
      setError("Ошибка при загрузке статусов: " + error.message);
      console.error("Error fetching statuses:", error);
    }
  };

  const handleSearch = useCallback(async (searchFilters = filters) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      let url = "https://moicargo.kg/api/v1/packages/";
      const queryParams = new URLSearchParams();

      // Если переданы трек-номера, используем только их
      if (searchFilters.trackNumber && searchFilters.trackNumber.length > 0) {
        queryParams.append("tracking_number", searchFilters.trackNumber.join(","));
      } else {
        Object.entries(searchFilters).forEach(([key, value]) => {
          if (value && key !== "trackNumber") {
            switch (key) {
              case "dateCreatedStart":
                queryParams.append("created_at_after", value);
                break;
              case "dateCreatedEnd":
                queryParams.append("created_at_before", value);
                break;
              case "dateOnWarehouseStart":
                queryParams.append("date_on_warehouse_after", value);
                break;
              case "dateOnWarehouseEnd":
                queryParams.append("date_on_warehouse_before", value);
                break;
              case "client":
                queryParams.append("client", value);
                break;
              case "clientByWarehouse":
                queryParams.append("client_by_warehouse", value);
                break;
              case "magazine":
                queryParams.append("warehouse", value);
                break;
              case "reys":
                queryParams.append("flight", value);
                break;
              case "status":
                queryParams.append("status", value);
                break;
              case "clientRequest":
                queryParams.append("client_request", value);
                break;
              default:
                queryParams.append(key, value);
            }
          }
        });
      }

      const queryString = queryParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }

      console.log("Search URL:", url);

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setParcels(response.data);
    } catch (error) {
      setError("Ошибка при поиске посылок: " + error.message);
      console.error("Error searching parcels:", error);
      setParcels([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const handleFilterChange = useCallback((e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleStatusClick = useCallback(
    (parcelId) => {
      setSelectedParcelId(selectedParcelId === parcelId ? null : parcelId);
    },
    [selectedParcelId]
  );

  const handleStatusChange = useCallback(async (parcelId, newStatus) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      // Update the local state immediately for instant UI feedback
      setParcels(prevParcels => 
        prevParcels.map(parcel => 
          parcel.id === parcelId 
            ? { ...parcel, status: newStatus }
            : parcel
        )
      );

      // Make the API call
      await axios.patch(
        `https://moicargo.kg/api/v1/packages/${parcelId}/`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Close the dropdown
      setSelectedParcelId(null);
    } catch (error) {
      // Revert the optimistic update in case of error
      setParcels(prevParcels => {
        const originalParcel = prevParcels.find(p => p.id === parcelId);
        return prevParcels.map(parcel => 
          parcel.id === parcelId 
            ? { ...parcel, status: originalParcel.status }
            : parcel
        );
      });
      setError("Ошибка при обновлении статуса: " + error.message);
      console.error("Error updating status:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = useCallback(async (parcelId) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      await axios.delete(`https://moicargo.kg/api/v1/packages/${parcelId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchParcels();
    } catch (error) {
      setError("Ошибка при удалении посылки: " + error.message);
      console.error("Error deleting parcel:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleBulkStatusChange = useCallback(async (selectedIds, newStatus) => {
    // Store original states for rollback
    const originalParcels = parcels.map(p => ({...p}));
    
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      // Optimistic update
      setParcels(prevParcels => 
        prevParcels.map(parcel => 
          selectedIds.includes(parcel.id)
            ? { ...parcel, status: newStatus }
            : parcel
        )
      );

      // Make the API calls
      await Promise.all(
        selectedIds.map((id) =>
          axios.patch(
            `https://moicargo.kg/api/v1/packages/${id}/`,
            { status: newStatus },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
        )
      );

      setSelectedParcelId(null);
    } catch (error) {
      // Revert to original state in case of error
      setParcels(originalParcels);
      setError("Ошибка при массовом обновлении статуса: " + error.message);
      console.error("Error bulk updating status:", error);
    } finally {
      setLoading(false);
    }
  }, [parcels]);

  const handleBulkDelete = useCallback(async (selectedIds) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      await Promise.all(
        selectedIds.map((id) =>
          axios.delete(`https://moicargo.kg/api/v1/packages/${id}/`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        )
      );

      await fetchParcels();
    } catch (error) {
      setError("Ошибка при массовом удалении: " + error.message);
      console.error("Error bulk deleting:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <MainDashboard
            filters={filters}
            handleFilterChange={handleFilterChange}
            handleSearch={handleSearch}
            navigate={navigate}
            loading={loading}
            error={error}
            parcels={parcels}
            statusOptions={statusOptions}
            selectedParcelId={selectedParcelId}
            handleStatusClick={handleStatusClick}
            handleStatusChange={handleStatusChange}
            handleDelete={handleDelete}
            handleBulkStatusChange={handleBulkStatusChange}
            handleBulkDelete={handleBulkDelete}
          />
        }
      />
      <Route
        path="/parcels"
        element={
          <MainDashboard
            filters={filters}
            handleFilterChange={handleFilterChange}
            handleSearch={handleSearch}
            navigate={navigate}
            loading={loading}
            error={error}
            parcels={parcels}
            statusOptions={statusOptions}
            selectedParcelId={selectedParcelId}
            handleStatusClick={handleStatusClick}
            handleStatusChange={handleStatusChange}
            handleDelete={handleDelete}
            handleBulkStatusChange={handleBulkStatusChange}
            handleBulkDelete={handleBulkDelete}
          />
        }
      />
      <Route path="/clients" element={<Clients />} />
      <Route path="/clients/add/:id" element={<AddClient />} />
      <Route path="/recipients" element={<Recipients />} />
      <Route path="/aggregation" element={<Aggregation />} />
      <Route path="/scanning" element={<Scanning />} />
      <Route path="/scanning/outgoing" element={<Scanning />} />
      <Route path="/scanning/locations" element={<Scanning />} />
      <Route path="/scanning/search" element={<Scanning />} />
      <Route path="/outgoing" element={<Outgoing />} />
      <Route path="/awb" element={<Awb />} />
      <Route path="/add-parcel" element={<AddParcel />} />
      <Route path="/edit-parcel/:id" element={<EditParcel />} />
    </Routes>
  );
}
