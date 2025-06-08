import React from "react";
import "./StatusDropdown.css";

const defaultStatusOptions = [
  {
    id: "ОТПРАВЛЕНА",
    label: "ОТПРАВЛЕНА",
    color: "#E3EDF2",
    icon: "📦",
  },
  {
    id: "ПРОВЕРЯЕТСЯ",
    label: "ПРОВЕРЯЕТСЯ",
    color: "#F4B95F",
    icon: "🔍",
  },
  {
    id: "ЖДЕМ_НА_СКЛАД",
    label: "ЖДЕМ НА СКЛАД",
    color: "#8F8F8F",
    icon: "🏭",
  },
  {
    id: "НА_СКЛАДЕ",
    label: "НА СКЛАДЕ",
    color: "#6AB77E",
    icon: "✓",
  },
];

const StatusDropdown = ({
  parcelId,
  currentStatus,
  statusOptions = defaultStatusOptions,
  isOpen,
  onStatusClick,
  onStatusChange,
}) => {
  const currentStatusOption =
    statusOptions.find((s) => s.id === currentStatus) || statusOptions[0];

  return (
   <div>
     <div className="status-dropdown-container">
      <span
        className="status-badge"
        onClick={() => onStatusClick(parcelId)}
        style={{
          backgroundColor: currentStatusOption?.color,
          color: ["#E3EDF2"].includes(currentStatusOption?.color)
            ? "#000"
            : "#fff",
        }}
      >
        {currentStatusOption?.icon && (
          <span className="status-icon">{currentStatusOption.icon}</span>
        )}
        {currentStatusOption?.label}
      </span>
      {isOpen && (
        <div className="status-dropdown">
          {statusOptions.map((option) => (
            <div
              key={option.id}
              className="status-option"
              onClick={() => onStatusChange(parcelId, option.id)}
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
    
   </div>
  );
};

export default StatusDropdown;