import React from "react";
import Navbar from "../Navbar/Navbar";
import FiltersSection from "../FiltersSection/FiltersSection";
import ParcelsTable from "../ParcelsTable/ParcelsTable";
import "./MainDashboard.css";

const MainDashboard = ({
  filters,
  handleFilterChange,
  handleSearch,
  navigate,
  loading,
  parcels,
  statusOptions,
  selectedParcelId,
  handleStatusClick,
  handleStatusChange,
  handleDelete,
  handleBulkStatusChange,
  handleBulkDelete,
}) => {
  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-container">
        <FiltersSection
          filters={filters}
          handleFilterChange={handleFilterChange}
          handleSearch={handleSearch}
          navigate={navigate}
        />
        {loading ? (
          <div className="loading-spinner">Загрузка...</div>
        ) : (
          <ParcelsTable
            parcels={parcels}
            statusOptions={statusOptions}
            selectedParcelId={selectedParcelId}
            handleStatusClick={handleStatusClick}
            handleStatusChange={handleStatusChange}
            handleDelete={handleDelete}
            handleBulkStatusChange={(selectedIds, newStatus) => {
              handleBulkStatusChange(selectedIds, newStatus);
            }}
            handleBulkDelete={handleBulkDelete}
          />
        )}
      </div>
    </div>
  );
};

export default MainDashboard;