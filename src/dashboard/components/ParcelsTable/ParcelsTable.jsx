import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StatusDropdown from "../StatusDropdown/StatusDropdown";
import "./ParcelsTable.css";

const ParcelsTable = ({
  parcels,
  statusOptions,
  selectedParcelId,
  handleStatusClick,
  handleStatusChange,
  handleDelete,
  handleBulkStatusChange,
  handleBulkDelete,
  handleBulkFlightChange,
  availableFlights,
}) => {
  const navigate = useNavigate();
  const [selectedParcels, setSelectedParcels] = useState(new Set());
  const [showBulkStatusDropdown, setShowBulkStatusDropdown] = useState(false);
  const [showBulkFlightDropdown, setShowBulkFlightDropdown] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const years = [2000, 2023, 2024, 2025];
  const flightNumbers = Array.from({ length: 100 }, (_, i) => i + 1);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedParcels(new Set(parcels.map((parcel) => parcel.id)));
    } else {
      setSelectedParcels(new Set());
    }
  };

  const handleSelectParcel = (parcelId) => {
    const newSelected = new Set(selectedParcels);
    if (newSelected.has(parcelId)) {
      newSelected.delete(parcelId);
    } else {
      newSelected.add(parcelId);
    }
    setSelectedParcels(newSelected);
  };

  const handleBulkStatusChangeClick = async (status) => {
    await handleBulkStatusChange(Array.from(selectedParcels), status);
    setShowBulkStatusDropdown(false);
    setSelectedParcels(new Set());
  };

  const handleBulkDeleteClick = () => {
    if (window.confirm("Вы уверены, что хотите удалить выбранные посылки?")) {
      handleBulkDelete(Array.from(selectedParcels));
      setSelectedParcels(new Set());
    }
  };

  const handleBulkFlightChangeClick = async (flightData) => {
    try {
      setIsLoading(true);
      const selectedParcelIds = Array.from(selectedParcels);
      const token = localStorage.getItem('token');
      
      const updatePromises = selectedParcelIds.map(async (parcelId) => {
        const response = await fetch(`https://moicargo.kg/api/v1/packages/${parcelId}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            reys: {
              year: String(flightData.year),
              number: String(flightData.number)
            }
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to update parcel');
        }

        return response.json();
      });

      await Promise.all(updatePromises);

      if (handleBulkFlightChange) {
        await handleBulkFlightChange(selectedParcelIds, flightData);
      }

      setShowBulkFlightDropdown(false);
      setSelectedParcels(new Set());
      setSelectedYear(null);
    } catch (error) {
      console.error('Error updating parcels:', error);
      alert('Произошла ошибка при обновлении рейсов: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="table-container">
      {selectedParcels.size > 0 && (
        <div className="bulk-actions">
          <div className="status-dropdown-container">
            <button
              className="bulk-action-btn"
              onClick={() => setShowBulkStatusDropdown(!showBulkStatusDropdown)}
            >
              Изменить статус выбранных
            </button>
            {showBulkStatusDropdown && (
              <div className="status-dropdown">
                {statusOptions.map((option) => (
                  <div
                    key={option.id}
                    className="status-option"
                    onClick={() => handleBulkStatusChangeClick(option.id)}
                    style={{
                      backgroundColor: option.color,
                      color: ["#E3EDF2"].includes(option.color) ? "#000" : "#fff",
                    }}
                  >
                    {option.icon && (
                      <span className="status-icon">{option.icon}</span>
                    )}
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flight-dropdown-container">
            <button
              className="bulk-action-btn"
              onClick={() => setShowBulkFlightDropdown(!showBulkFlightDropdown)}
            >
              Изменить рейс выбранных
            </button>
            {showBulkFlightDropdown && (
              <div className="flight-dropdowns">
                <div className="year-dropdown">
                  {years.map((year) => (
                    <div
                      key={year}
                      className={`year-option ${selectedYear === year ? 'selected' : ''}`}
                      onClick={() => setSelectedYear(year)}
                    >
                      {year}
                    </div>
                  ))}
                </div>
                {selectedYear && (
                  <div className="number-dropdown">
                    {flightNumbers.map((number) => (
                      <div
                        key={number}
                        className="number-option"
                        onClick={() => {
                          handleBulkFlightChangeClick({ 
                            year: selectedYear, 
                            number: number 
                          });
                        }}
                      >
                        {number}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          <button
            className="bulk-action-btn delete"
            onClick={handleBulkDeleteClick}
          >
            Удалить выбранные
          </button>
          <span className="selected-count">
            Выбрано: {selectedParcels.size}
          </span>
        </div>
      )}
      {!parcels.length && <div>Нет посылок для отображения</div>}
      {parcels.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedParcels.size === parcels.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th>ID/Внешний ID</th>
              <th>Клиент</th>
              <th>Клиент по складу</th>
              <th>Содержимое</th>
              <th>Трек-номер</th>
              <th>Комментарий</th>
              <th>Рейс</th>
              <th>Склад/Магазин</th>
              <th>Статус</th>
              <th>Вес</th>
              <th>Сумма</th>
              <th>Дата создания</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {parcels.map((parcel) => (
              <tr key={parcel.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedParcels.has(parcel.id)}
                    onChange={() => handleSelectParcel(parcel.id)}
                  />
                </td>
                <td>{parcel.id}</td>
                <td>
                  {parcel.client
                    ? `${parcel.client.first_name} ${parcel.client.last_name}`
                    : ""}
                </td>
                <td>
                  {parcel.client
                    ? `${parcel.client.first_name} ${parcel.client.last_name}`
                    : ""}
                </td>
                <td>
                  {parcel.package_details?.map((detail, index) => (
                    <div key={index}>
                      {detail.product.name} - {detail.count} шт. -{" "}
                      {detail.price}
                    </div>
                  ))}
                </td>
                <td>{parcel.tracking_number}</td>
                <td>{parcel.client_comment}</td>
                <td>
                  {parcel.reys
                    ? `${parcel.reys.year}${parcel.reys.year?` - №${parcel.reys.number}` : ''}`
                    : ""}
                </td>
                <td>
                  {parcel.warehouse}
                  <span className="country-flag">{parcel.country}</span>
                </td>
                <td>
                  <StatusDropdown
                    parcelId={parcel.id}
                    currentStatus={parcel.status}
                    statusOptions={statusOptions}
                    isOpen={selectedParcelId === parcel.id}
                    onStatusClick={handleStatusClick}
                    onStatusChange={handleStatusChange}
                  />
                </td>
                <td>{parcel.weight_of_package}</td>
                <td>{parcel.amount}</td>
                <td>{new Date(parcel.created_at).toLocaleString()}</td>
                <td className="actions-cell">
                  <button
                    className="action-btn edit-btn"
                    title="Изменить"
                    onClick={() => {
                      navigate(`edit-parcel/${parcel.id}`);
                    }}
                  >
                    ✏️
                  </button>
                  <button
                    className="action-btn delete-btn"
                    title="Удалить"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Вы уверены, что хотите удалить эту посылку?"
                        )
                      ) {
                        handleDelete(parcel.id);
                      }
                    }}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ParcelsTable;