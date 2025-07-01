import React, { useEffect, useState } from "react";
import "./EditParcel.css";
import {
  FaBox,
  FaShoppingBag,
  FaCamera,
  FaTag,
  FaFileInvoice,
} from "react-icons/fa";
import { get, put } from "../../../api/api";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const EditParcel = () => {
  const [isFlightOpen, setIsFlightOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedFlight, setSelectedFlight] = useState("");
  const years = [2000, 2023, 2024, 2025];
  const flights = Array.from({ length: 100 }, (_, i) => i + 1);
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const token = localStorage.getItem("token");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showSubcategories, setShowSubcategories] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [packageType, setPackageType] = useState("package");
  const [weight, setWeight] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [packages, setPackages] = useState(null);
  const [store, setStore] = useState(null);
  const [client, setClient] = useState(null);
  const [recipient, setRecipient] = useState(null);
  const [status, setStatus] = useState("");
  const [statusOptions, setStatusOptions] = useState([]);
  const [warehouse, setWarehouse] = useState("");
  const [packageImages, setPackageImages] = useState({
    package_image: "",
    label_image: "",
    invoice_image: "",
  });

  const [packageItems, setPackageItems] = useState([
    {
      id: 1,
      quantity: 1,
      physicalWeight: 0,
      volumeWeight: 0,
    },
  ]);

  const [contents, setContents] = useState([
    {
      id: 1,
      name: "Сумка",
      price: 20,
      quantity: 1,
      productId: null,
    },
  ]);

  const [comments, setComments] = useState({
    client: "",
    warehouse: "",
    manager: "",
  });

  const [photos, setPhotos] = useState([]);

  const [packageRows, setPackageRows] = useState([
    {
      id: 1,
      quantity: "",
      physicalWeight: "",
      volumeWeight: "",
      dimensions: {
        length: "",
        width: "",
        height: "",
      },
      showDimensions: false,
      total: 0,
    },
  ]);

  const [totalDeliveryCost, setTotalDeliveryCost] = useState("");
  const [isManualCost, setIsManualCost] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const [recipientResponse, productsResponse, statusResponse] =
          await Promise.all([
            get.getRecipient(config),
            get.getProducts(config),
            get.getStatus(config),
          ]);
        console.log("Recipients data:", recipientResponse);
        console.log("Products data:", productsResponse);
        console.log("Status data:", statusResponse);

        setCategories(productsResponse);
        setStatusOptions(statusResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await get.getPackage(id);
        console.log("Алынган маалымат:", response);

        setPackages(response);
        setStore(response.store);
        setClient(response.client);
        setRecipient(response.recipient);
        setStatus(response.status);
        setWarehouse(response.warehouse);
        setTrackingNumber(response.tracking_number);
        setPackageType(response.type_of_packaging);
        setWeight(response.weight_of_package || "");

        if (response.reys) {
          try {
            const reysData = response.reys;
            setSelectedYear(reysData.year || null);
            setSelectedFlight(reysData.number || "");
          } catch (e) {
            console.error("Error parsing reys data:", e);
          }
        }

        setPackageImages({
          package_image: response.package_image || null,
          label_image: response.label_image || null,
          invoice_image: response.invoice_image || null,
        });

        setComments({
          client: response.client_comment || "",
          warehouse: response.cladovshik_comment || "",
          manager: response.manager_comment || "",
        });

        if (response.package_details && response.package_details.length > 0) {
          const mappedContents = response.package_details.map((detail) => ({
            id: detail.id,
            name: detail.product.name,
            price: parseFloat(detail.price),
            quantity: detail.count,
            productId: detail.product.id,
          }));
          setContents(mappedContents);
        }

        setTotalDeliveryCost(response.delivery_cost || "");
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      }
    };

    fetchData();
  }, [id]);

  const handleContentChange = (itemId, field, value, productId = null) => {
    setContents((items) =>
      items.map((item) => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [field]: value };
          if (field === "name" && productId !== null) {
            updatedItem.productId = productId;
          }
          return updatedItem;
        }
        return item;
      })
    );
  };

  const handleCommentChange = (type, value) => {
    setComments((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const handlePhotoUpload = (event) => {
    const files = Array.from(event.target.files);
    setPhotos((prev) => [...prev, ...files]);
  };

  const calculateTotalWeight = () => {
    return packageItems
      .reduce((total, item) => {
        return (
          total +
          Math.max(item.physicalWeight, item.volumeWeight) * item.quantity
        );
      }, 0)
      .toFixed(3);
  };

  const calculateTotalPrice = () => {
    return contents
      .reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0)
      .toFixed(2);
  };

  const handleAddContent = () => {
    const newId =
      contents.length > 0 ? Math.max(...contents.map((c) => c.id)) + 1 : 1;
    setContents([
      ...contents,
      {
        id: newId,
        name: "",
        price: 0,
        quantity: 1,
        productId: null,
      },
    ]);
  };

  const handleRemoveContent = (id) => {
    if (contents.length > 1) {
      setContents(contents.filter((item) => item.id !== id));
    }
  };

  const handleAddRow = () => {
    const newRow = {
      id: packageRows.length + 1,
      quantity: "",
      physicalWeight: "",
      volumeWeight: "",
      dimensions: {
        length: "",
        width: "",
        height: "",
      },
      showDimensions: false,
    };
    setPackageRows([...packageRows, newRow]);
  };

  const handleDimensionsChange = (rowId, field, value) => {
    setPackageRows((rows) =>
      rows.map((row) => {
        if (row.id === rowId) {
          const newDimensions = {
            ...row.dimensions,
            [field]: value,
          };

          const volumeWeight = calculateVolumeWeight(
            newDimensions.length,
            newDimensions.width,
            newDimensions.height
          );

          return {
            ...row,
            dimensions: newDimensions,
            volumeWeight: volumeWeight,
          };
        }
        return row;
      })
    );
  };

  const toggleDimensions = (rowId) => {
    setPackageRows((rows) =>
      rows.map((row) => {
        if (row.id === rowId) {
          return {
            ...row,
            showDimensions: !row.showDimensions,
          };
        }
        return row;
      })
    );
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Отсутствует токен авторизации");
      }

      const packageDetailsData = contents
        .map((item) => ({
          product: item.productId,
          price: item.price?.toString() || "0",
          count: item.quantity || 0,
        }))
        .filter((item) => item.product !== null);

      const packageWeightsData = packageRows.map((row) => ({
        count_place: parseInt(row.quantity) || 0,
        weight: parseFloat(row.physicalWeight) || 0,
        is_volume_weight: Boolean(row.showDimensions),
        length: parseFloat(row.dimensions.length) || 0,
        width: parseFloat(row.dimensions.width) || 0,
        height: parseFloat(row.dimensions.height) || 0,
        volume_weight: parseFloat(row.volumeWeight) || 0,
      }));

      const requestData = {
        client: client?.id || 0,
        status: status || "Проверяется",
        warehouse: warehouse || "США",
        type_of_packaging: packageType || "Пакет",
        options_of_packaging: "Отправить в почтовой упаковке",
        store: store?.id || "",
        full_name: "string",
        weight_of_package: weight || 0,
        tracking_number: trackingNumber || "",
        count_scans: packages?.count_scans || 0,
        final_weight: calculateTotalWeight() || 0,
        delivery_cost: totalDeliveryCost || "0",
        client_comment: comments.client || "",
        system_comment: comments.warehouse || "",
        package_details: packageDetailsData,
        package_weights: packageWeightsData,
      };

      requestData.recipient = recipient?.id ?? null;

      if (selectedYear && selectedFlight) {
        requestData.reys = {
          id: 17,
          year: selectedYear.toString(),
          number: selectedFlight.toString()
        };
      } else {
        requestData.reys = {};
      }

      const formData = new FormData();
      
      Object.keys(requestData).forEach(key => {
        if (requestData[key] === undefined) return;
        if (key === 'package_details' || key === 'package_weights') {
          formData.append(key, JSON.stringify(requestData[key]));
        } else if (key === 'reys') {
          formData.append(key, JSON.stringify(requestData[key]));
        } else if (key === 'recipient' && requestData[key] === null) {
        } else {
          formData.append(key, requestData[key]);
        }
      });

      // Add files
      if (packageImages.package_image instanceof File) {
        formData.append("package_image", packageImages.package_image);
      }
      if (packageImages.label_image instanceof File) {
        formData.append("label_image", packageImages.label_image);
      }
      if (packageImages.invoice_image instanceof File) {
        formData.append("invoice_image", packageImages.invoice_image);
      }

      // Add additional photos
      photos.forEach((photo) => {
        if (photo instanceof File) {
          formData.append('package_images', photo);
        }
      });

      const response = await fetch(`https://moicargo.kg/api/v1/packages/${id}/`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData));
      }

      const responseData = await response.json();
      console.log("Ответ сервера:", responseData);

      Swal.fire({
        title: "Успешно!",
        text: "Посылка успешно обновлена",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        navigate(-1);
      });
    } catch (error) {
      console.error("Ошибка при обновлении посылки:", error);
      const errorMessage = error.response?.data
        ? Object.values(error.response.data).flat().join("\n")
        : error.message || "Произошла ошибка при обновлении посылки";

      Swal.fire({
        title: "Ошибка!",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleImageUpload = (type, event) => {
    const file = event.target.files[0];
    if (file) {
      setPackageImages((prev) => ({
        ...prev,
        [type]: file,
      }));
    }
  };

  const handlePackageRowChange = (rowId, field, value) => {
    setPackageRows((rows) =>
      rows.map((row) => {
        if (row.id === rowId) {
          const newRow = {
            ...row,
            [field]: value,
          };
          if (newRow.quantity && newRow.physicalWeight) {
            const qty = Number(newRow.quantity);
            const weight = Number(newRow.physicalWeight);
            newRow.total = qty * weight;
          } else {
            newRow.total = 0;
          }
          return newRow;
        }
        return row;
      })
    );
  };

  const calculateTotalPackageWeight = () => {
    return packageRows
      .reduce((total, row) => {
        let weightToUse = Number(row.physicalWeight || 0);

        if (
          row.showDimensions &&
          row.dimensions.length &&
          row.dimensions.width &&
          row.dimensions.height
        ) {
          const volumeWeight =
            (Number(row.dimensions.length) *
              Number(row.dimensions.width) *
              Number(row.dimensions.height)) /
            6000;
          weightToUse = Math.max(weightToUse, volumeWeight);
        }

        return total + weightToUse;
      }, 0)
      .toFixed(3);
  };

  const handleDeliveryCostChange = (value) => {
    if (!isManualCost) {
      const totalWeight = calculateTotalPackageWeight();
      let rate = 0;
      if (client) {
        if (warehouse === "США") {
          rate = client.tarif_usa_value || 9.5;
        } else if (warehouse === "Китай") {
          rate = client.tarif_china_value || 2.8;
        }
      } else {
        // fallback default
        rate = warehouse === "США" ? 9.5 : 2.8;
      }
      setTotalDeliveryCost((totalWeight * rate).toFixed(2));
    } else {
      setTotalDeliveryCost(value);
    }
  };

  const calculateVolumeWeight = (length, width, height) => {
    if (length && width && height) {
      const volumeWeight =
        (Number(length) * Number(width) * Number(height)) / 6000;
      return volumeWeight.toFixed(3);
    }
    return "0.000";
  };

  useEffect(() => {
    if (!isManualCost) {
      handleDeliveryCostChange();
    }
  }, [warehouse, packageRows, isManualCost, client]);

  const prepareFileForUpload = async (file) => {
    if (!file) return null;
    if (file instanceof File) return file;

    if (typeof file === "string" && file.startsWith("http")) {
      return null;
    }

    return null;
  };

  return (
    <div className="edit-parcel">
      <div className="top-section">
        <button className="tariff-button">Тарифы клиента</button>
        <div className="status-section">
          <div className="status-check">
            <select
              className="status-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {statusOptions.map((statusOption) => (
                <option key={statusOption[0]} value={statusOption[0]}>
                  {statusOption[1]}
                </option>
              ))}
            </select>
          </div>
          <div className="warehouse-selection">
            <div className="flight-select">
              <div
                className="flight-dropdown"
                onClick={() => setIsFlightOpen(!isFlightOpen)}
              >
                <span>
                  {selectedFlight
                    ? ` ${selectedYear}/${selectedFlight}`
                    : "Рейс"}
                </span>
                {isFlightOpen && (
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
                              setSelectedFlight(flight);
                              setIsFlightOpen(false);
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
              className="country-select"
              value={warehouse}
              onChange={(e) => setWarehouse(e.target.value)}
            >
              <option value="США"> США</option>
              <option value="Китай"> Китай</option>
            </select>
          </div>
        </div>
      </div>

      <div className="main-form">
        <div className="form-row">
          <div className="form-group">
            <label>
              Клиент <span className="required">*</span>
            </label>
            <select defaultValue="default">
              <option value="default">
                {client
                  ? `${client.last_name} ${client.first_name}`
                  : "Выберите клиента"}
              </option>
            </select>
          </div>
          <div className="form-group">
            <label>
              Получатель <span className="required">*</span>
            </label>
            <select defaultValue="default">
              <option value="default">
                {recipient
                  ? `${recipient.last_name} ${recipient.first_name}`
                  : "Выберите получателя"}
              </option>
            </select>
          </div>
        </div>

        <div className="package-type-section">
          <div className="package-type">
            <label>Тип упаковки</label>
            <div className="package-options">
              <button
                className={`package-btn ${
                  packageType === "Пакет" ? "active" : ""
                }`}
                onClick={() => setPackageType("Пакет")}
              >
                <FaShoppingBag /> Пакет
              </button>
              <button
                className={`package-btn ${
                  packageType === "Коробка" ? "active" : ""
                }`}
                onClick={() => setPackageType("Коробка")}
              >
                <FaBox /> Коробка
              </button>
            </div>
          </div>

          <div className="photo-sections">
            <div
              className="upload-box"
              onClick={() => document.getElementById("package-photo").click()}
            >
              <div>
                {packageImages.package_image ? (
                  <img
                    src={
                      packageImages.package_image instanceof File
                        ? URL.createObjectURL(packageImages.package_image)
                        : packageImages.package_image
                    }
                    alt="Package"
                    className="preview-image"
                  />
                ) : (
                  <>
                    <FaCamera className="upload-icon" />
                    <span className="upload-text">Фото посылки</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  id="package-photo"
                  onChange={(e) => handleImageUpload("package_image", e)}
                />
              </div>
            </div>
            <div
              className="upload-box"
              onClick={() => document.getElementById("label-photo").click()}
            >
              <div>
                {packageImages.label_image ? (
                  <img
                    src={
                      packageImages.label_image instanceof File
                        ? URL.createObjectURL(packageImages.label_image)
                        : packageImages.label_image
                    }
                    alt="Label"
                    className="preview-image"
                  />
                ) : (
                  <>
                    <FaTag className="upload-icon" />
                    <span className="upload-text">Фото лейбла</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  id="label-photo"
                  onChange={(e) => handleImageUpload("label_image", e)}
                />
              </div>
            </div>
            <div
              className="upload-box"
              onClick={() => document.getElementById("invoice-photo").click()}
            >
              <div>
                {packageImages.invoice_image ? (
                  <img
                    src={
                      packageImages.invoice_image instanceof File
                        ? URL.createObjectURL(packageImages.invoice_image)
                        : packageImages.invoice_image
                    }
                    alt="Invoice"
                    className="preview-image"
                  />
                ) : (
                  <>
                    <FaFileInvoice className="upload-icon" />
                    <span className="upload-text">Фото инвойса</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  id="invoice-photo"
                  onChange={(e) => handleImageUpload("invoice_image", e)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="order-details">
          <h3>Детали заказа</h3>
          <div className="details-row">
            <div className="form-group">
              <label>
                Магазин <span className="required">*</span>
              </label>
              <select value={store?.id || ""}>
                <option value={store?.id}>
                  {store?.name || "Выберите магазин"}
                </option>
              </select>
            </div>
            <div className="form-group">
              <label>Фамилия Имя</label>
              <input type="text" placeholder="Введите полное имя" />
            </div>
            <div className="form-group">
              <label>Вес по складу</label>
              <div className="weight-input">
                <button
                  onClick={() =>
                    setWeight((prev) => Math.max(0, Number(prev) - 1))
                  }
                >
                  -
                </button>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="Введите кг"
                />
                <button onClick={() => setWeight((prev) => Number(prev) + 1)}>
                  +
                </button>
              </div>
            </div>
            <div className="form-group">
              <label>
                Трекинг номер | Скан-ий: {packages?.count_scans || 0}{" "}
                <span className="required">*</span>
              </label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="package-weight">
          <h3>Вес посылки</h3>
          {packageRows.map((row) => (
            <div key={row.id} className="weight-row">
              <div className="weight-item">
                <span>{row.id}.</span>
                <div className="weight-inputs">
                  <div className="input-group">
                    <label>Количество мест</label>
                    <div className="number-input">
                      <button
                        className="minus"
                        onClick={() =>
                          handlePackageRowChange(
                            row.id,
                            "quantity",
                            Math.max(0, Number(row.quantity) - 1)
                          )
                        }
                      >
                        −
                      </button>
                      <input
                        type="text"
                        value={row.quantity}
                        onChange={(e) =>
                          handlePackageRowChange(
                            row.id,
                            "quantity",
                            e.target.value
                          )
                        }
                        placeholder="Введите кол-во м"
                      />
                      <button
                        className="plus"
                        onClick={() =>
                          handlePackageRowChange(
                            row.id,
                            "quantity",
                            Number(row.quantity) + 1
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                    <div className="multiply">*</div>
                  </div>
                  <div className="input-group">
                    <label>Физический вес</label>
                    <div className="number-input">
                      <button
                        className="minus"
                        onClick={() =>
                          handlePackageRowChange(
                            row.id,
                            "physicalWeight",
                            Math.max(0, Number(row.physicalWeight) - 1)
                          )
                        }
                      >
                        −
                      </button>
                      <input
                        type="text"
                        value={row.physicalWeight}
                        onChange={(e) =>
                          handlePackageRowChange(
                            row.id,
                            "physicalWeight",
                            e.target.value
                          )
                        }
                        placeholder="Введите вес"
                      />
                      <button
                        className="plus"
                        onClick={() =>
                          handlePackageRowChange(
                            row.id,
                            "physicalWeight",
                            Number(row.physicalWeight) + 1
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="input-group">
                    <label>Объемный вес</label>
                    <div
                      className="volume-weight-toggle"
                      onClick={() => toggleDimensions(row.id)}
                    >
                      <span>Объемный вес</span>
                      <div
                        className={`toggle-switch ${
                          row.showDimensions ? "active" : ""
                        }`}
                      >
                        <div className="toggle-slider"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {row.showDimensions && (
                <div className="dimensions-inputs">
                  <div className="input-group">
                    <label>Длина</label>
                    <div className="number-input">
                      <button className="minus">−</button>
                      <input
                        type="text"
                        value={row.dimensions.length}
                        onChange={(e) =>
                          handleDimensionsChange(
                            row.id,
                            "length",
                            e.target.value
                          )
                        }
                        placeholder="Введите длину"
                      />
                      <button className="plus">+</button>
                    </div>
                  </div>
                  <div className="input-group">
                    <label>Ширина</label>
                    <div className="number-input">
                      <button className="minus">−</button>
                      <input
                        type="text"
                        value={row.dimensions.width}
                        onChange={(e) =>
                          handleDimensionsChange(
                            row.id,
                            "width",
                            e.target.value
                          )
                        }
                        placeholder="Введите ширину"
                      />
                      <button className="plus">+</button>
                    </div>
                  </div>
                  <div className="input-group">
                    <label>Высота</label>
                    <div className="number-input">
                      <button className="minus">−</button>
                      <input
                        type="text"
                        value={row.dimensions.height}
                        onChange={(e) =>
                          handleDimensionsChange(
                            row.id,
                            "height",
                            e.target.value
                          )
                        }
                        placeholder="Введите высоту"
                      />
                      <button className="plus">+</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          {packageRows.length === 1 && (
            <button className="add-row-btn" onClick={handleAddRow}>
              +
            </button>
          )}
          <div className="weight-summary">
            <div className="total-weight">
              <label>Итоговый вес</label>
              <input
                type="text"
                value={calculateTotalPackageWeight()}
                readOnly
              />
            </div>
            {packageRows[0]?.showDimensions && (
              <div className="total-weight">
                <label>Объемный вес</label>
                <input
                  type="text"
                  value={calculateVolumeWeight(
                    packageRows[0].dimensions.length,
                    packageRows[0].dimensions.width,
                    packageRows[0].dimensions.height
                  )}
                  readOnly
                />
              </div>
            )}
            <div className="delivery-cost">
              <label>Стоимость доставки</label>
              <div className="cost-input">
                <input
                  type="text"
                  value={totalDeliveryCost}
                  onChange={(e) =>
                    isManualCost && handleDeliveryCostChange(e.target.value)
                  }
                  readOnly={!isManualCost}
                />
                <button
                  className="minus"
                  onClick={() =>
                    isManualCost &&
                    handleDeliveryCostChange(
                      Math.max(0, Number(totalDeliveryCost) - 1)
                    )
                  }
                  disabled={!isManualCost}
                >
                  −
                </button>
                <button
                  className="plus"
                  onClick={() =>
                    isManualCost &&
                    handleDeliveryCostChange(Number(totalDeliveryCost) + 1)
                  }
                  disabled={!isManualCost}
                >
                  +
                </button>
              </div>
              <div className="manual-cost">
                <input
                  type="checkbox"
                  id="manual-cost"
                  checked={isManualCost}
                  onChange={(e) => setIsManualCost(e.target.checked)}
                />
                <label htmlFor="manual-cost">
                  Ручное редактирование стоимости
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="comments-section">
          <div className="comment-box">
            <label>Комментарий клиента</label>
            <textarea
              value={comments.client}
              onChange={(e) => handleCommentChange("client", e.target.value)}
              placeholder="Введите комментарий"
            />
          </div>
          <div className="comment-box">
            <label>Комментарий кладовщика</label>
            <textarea
              value={comments.warehouse}
              onChange={(e) => handleCommentChange("warehouse", e.target.value)}
              placeholder="Введите комментарий"
            />
          </div>
          <div className="comment-box">
            <label>Комментарий менеджера</label>
            <textarea
              value={comments.manager}
              onChange={(e) => handleCommentChange("manager", e.target.value)}
              placeholder="Введите комментарий"
            />
          </div>
        </div>

        <div className="package-contents">
          <h3>Содержимое посылки</h3>
          {contents.map((item, index) => (
            <div key={item.id} className="contents-row">
              <span className="item-number">{item.id}.</span>
              <div className="content-inputs">
                <div className="custom-select">
                  <label>Наименование</label>
                  <div
                    className="select-selected"
                    onClick={() => {
                      setIsSelectOpen(!isSelectOpen);
                      setSelectedCategory(null);
                      setShowSubcategories(false);
                    }}
                  >
                    {item.name || "Введите наименование"}
                  </div>
                  {isSelectOpen && (
                    <div className="select-items">
                      {categories.map((category) => (
                        <div
                          key={category.id}
                          className={`select-item ${
                            selectedCategory === category.id ? "selected" : ""
                          }`}
                          onMouseEnter={() => {
                            setSelectedCategory(category.id);
                            setShowSubcategories(true);
                          }}
                          onClick={() => {
                            handleContentChange(
                              item.id,
                              "name",
                              category.name,
                              category.id
                            );
                            handleContentChange(
                              item.id,
                              "productId",
                              category.id
                            );
                            handleContentChange(
                              item.id,
                              "categoryId",
                              selectedCategory
                            );
                            setShowSubcategories(false);
                            setIsSelectOpen(false);
                          }}
                        >
                          {category.name}
                        </div>
                      ))}
                    </div>
                  )}
                  {showSubcategories && selectedCategory && isSelectOpen && (
                    <div
                      className="subcategories-dropdown"
                      onMouseEnter={() => setShowSubcategories(true)}
                      onMouseLeave={() => setShowSubcategories(false)}
                    >
                      {categories
                        .find((cat) => cat.id === selectedCategory)
                        ?.products.map((product, index) => (
                          <div
                            key={index}
                            className="subcategory-item"
                            onClick={() => {
                              handleContentChange(
                                item.id,
                                "name",
                                product.name
                              );
                              handleContentChange(
                                item.id,
                                "productId",
                                product.id
                              );
                              setShowSubcategories(false);
                              setIsSelectOpen(false);
                            }}
                          >
                            {product.name}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
                <div className="input-group">
                  <label>Цена</label>
                  <div className="number-input">
                    <button
                      onClick={() =>
                        handleContentChange(item.id, "price", item.price - 1)
                      }
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) =>
                        handleContentChange(
                          item.id,
                          "price",
                          parseFloat(e.target.value)
                        )
                      }
                    />
                    <button
                      onClick={() =>
                        handleContentChange(item.id, "price", item.price + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="input-group">
                  <label>Количество</label>
                  <div className="number-input">
                    <button
                      onClick={() =>
                        handleContentChange(
                          item.id,
                          "quantity",
                          item.quantity - 1
                        )
                      }
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleContentChange(
                          item.id,
                          "quantity",
                          parseInt(e.target.value)
                        )
                      }
                    />
                    <button
                      onClick={() =>
                        handleContentChange(
                          item.id,
                          "quantity",
                          item.quantity + 1
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="item-total">
                  <span>
                    Итого: USD {(item.price * item.quantity).toFixed(2)}
                  </span>
                  <span>
                    Итого: KGS{" "}
                    {(item.price * item.quantity * 0.5085).toFixed(2)}
                  </span>
                </div>
                <div className="row-actions">
                  <button
                    className="row-action-btn remove"
                    onClick={() => handleRemoveContent(item.id)}
                    disabled={contents.length === 1}
                  >
                    -
                  </button>
                  <button
                    className="row-action-btn add"
                    onClick={handleAddContent}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div className="total-sum">
            <span>
              Итого: USD {packages?.whole_summa || calculateTotalPrice()}
            </span>
            <span>Итого: EUR {packages?.whole_summa_eur || 0}</span>
          </div>
        </div>

        <div className="photos-section">
          <h3>Фотографии заказа</h3>
          <div className="photo-upload">
            <input
              type="file"
              multiple
              onChange={handlePhotoUpload}
              style={{ display: "none" }}
              id="photo-upload"
            />
            <label htmlFor="photo-upload">
              <button type="button">Выберите фотографии</button>
            </label>
          </div>
        </div>

        <div className="forwarding">
          <button className="forwarding-btn">Переопределение +</button>
        </div>

        <div className="submit-section">
          <button className="submit-btn" onClick={handleSubmit}>
            Сохранить посылку
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditParcel;
