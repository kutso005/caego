import {
  FaBox,
  FaShoppingBag,
  FaCamera,
  FaTag,
  FaFileInvoice,
} from "react-icons/fa";
import { get } from "../../../api/api";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import "./AddParcel.css";

const warehouseCurrencies = {
  США: { symbol: "USD", rate: 1 },
  Китай: { symbol: "CNY", rate: 7.56 },
};

const deliveryRates = {
  США: 9.5, 
  Китай: 2.8, 
};

export default function AddParcel() {
  const [packageDetails, setPackageDetails] = useState([
    {
      product: 1,
      price: "",
      count: 1,
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const [productsResponse] = await Promise.all([get.getProducts(config)]);
        console.log("Products data:", productsResponse);
        setCategories(productsResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        };
        const response = await get.getStore(config);
        console.log("Stores data:", response);
        setStores(response);
      } catch (error) {
        console.error("Error fetching stores:", error);
      }
    };

    fetchStores();
  }, []);

  const { id } = useParams();
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const token = localStorage.getItem("token");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showSubcategories, setShowSubcategories] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [packageType, setPackageType] = useState("Пакет");
  const [weight, setWeight] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [packages, setPackages] = useState(null);
  const [store, setStore] = useState(null);
  const [stores, setStores] = useState([]);
  const [client, setClient] = useState(null);
  const [clients, setClients] = useState([]);
  const [recipient, setRecipient] = useState(null);
  const [recipients, setRecipients] = useState([]);
  const [status, setStatus] = useState("");
  const [statusOptions, setStatusOptions] = useState([]);
  const [warehouse, setWarehouse] = useState("США"); // Default to "США"
  const [packageImages, setPackageImages] = useState({
    package_image: "",
    label_image: "",
    invoice_image: "",
  });
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

  const [isFlightOpen, setIsFlightOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedFlight, setSelectedFlight] = useState("");

  const years = [2000, 2023, 2024, 2025];
  const flights = Array.from({ length: 100 }, (_, i) => i + 1);

  const [trackingNumberError, setTrackingNumberError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const [
          recipientResponse,
          productsResponse,
          statusResponse,
          recipientsListResponse,
          clientsListResponse,
          storesListResponse,
        ] = await Promise.all([
          get.getRecipient(config),
          get.getProducts(config),
          get.getStatus(config),
          fetch("https://moicargo.kg/api/v1/choices/recipient/", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }).then((res) => res.json()),
          fetch("https://moicargo.kg/api/v1/choices/user/", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }).then((res) => res.json()),
          fetch("https://moicargo.kg/api/v1/choices/store/", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }).then((res) => res.json()),
        ]);
        console.log("Recipients data:", recipientResponse);
        console.log("Products data:", productsResponse);
        console.log("Status data:", statusResponse);
        console.log("Recipients list:", recipientsListResponse);
        console.log("Clients list:", clientsListResponse);
        console.log("Stores list:", storesListResponse);

        setCategories(productsResponse);
        setStatusOptions(statusResponse);
        setRecipients(recipientsListResponse);
        setClients(clientsListResponse);
        setStores(storesListResponse);
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
    return packageRows.reduce((total, row) => {
      const physicalWeight = Number(row.physicalWeight) || 0;
      const volumeWeight = row.showDimensions
        ? Number(
            calculateVolumeWeight(
              row.dimensions.length,
              row.dimensions.width,
              row.dimensions.height
            )
          ) || 0
        : 0;
      const rowWeight = Math.max(physicalWeight, volumeWeight);
      const quantity = Number(row.quantity) || 0;
      return total + rowWeight * quantity;
    }, 0);
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

  const checkTrackingNumber = async (number) => {
    try {
      const response = await fetch(`https://moicargo.kg/api/v1/packages/check-tracking/${number}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      


      if (!response.ok) {
        const data = await response.json();
        if (response.status === 400) {
          setTrackingNumberError("Такой трек номер уже существует");
          return false;
        }
        throw new Error(data.message);
      }
      
      setTrackingNumberError("");
      return true;
    } catch (error) {
      console.error("Error checking tracking number:", error);
      return false;
    }
  };

  const handleTrackingNumberChange = async (e) => {
    const newTrackingNumber = e.target.value;
    setTrackingNumber(newTrackingNumber);
    
    if (newTrackingNumber) {
      await checkTrackingNumber(newTrackingNumber);
    } else {
      setTrackingNumberError("");
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Отсутствует токен авторизации");
      const packageData = {
        client: client?.id,
        recipient: recipient?.id || null,
        status: status || "Проверяется",
        warehouse: warehouse || "США",
        type_of_packaging: packageType,
        options_of_packaging: "Отправить в почтовой упаковке",
        store: store?.id,
        reys: {
          year: selectedYear?.toString() || "",
          number: selectedFlight?.toString() || "",
        },
        full_name: "string",
        weight_of_package: weight || "0",
        tracking_number: trackingNumber,
        count_scans: packages?.count_scans || 0,
        final_weight: calculateTotalWeight(),
        delivery_cost: totalDeliveryCost || "0",
        client_comment: comments.client || "",
        system_comment: comments.warehouse || "",
        package_details: packageDetails
          .filter((detail) => detail.product)
          .map((detail) => ({
            product: parseInt(detail.product),
            price: detail.price.toString(),
            count: detail.count,
          })),
        package_weights: packageRows
          .filter((row) => row.quantity && row.physicalWeight)
          .map((row) => ({
            count_place: parseInt(row.quantity),
            weight: parseFloat(row.physicalWeight),
            is_volume_weight: Boolean(row.showDimensions),
            length: row.showDimensions
              ? parseFloat(row.dimensions.length) || 0
              : 0,
            width: row.showDimensions
              ? parseFloat(row.dimensions.width) || 0
              : 0,
            height: row.showDimensions
              ? parseFloat(row.dimensions.height) || 0
              : 0,
            volume_weight: parseFloat(row.volumeWeight) || 0,
          })),
      };

      if (packageData.package_details.length === 0) {
        throw new Error("Добавьте содержимое посылки");
      }

      console.log("Sending data:", packageData);

      const response = await fetch("https://moicargo.kg/api/v1/packages/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(packageData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData));
      }

      const responseData = await response.json();
      console.log("Ответ сервера:", responseData);

      Swal.fire({
        title: "Успешно!",
        text: "Посылка успешно создана",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => navigate(-1));
    } catch (error) {
      console.error("Ошибка при создании посылки:", error);
      Swal.fire({
        title: "Ошибка!",
        text: error.message,
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

        const quantity = Number(row.quantity) || 0;
        return total + weightToUse * quantity;
      }, 0)
      .toFixed(3);
  };

  const handleDeliveryCostChange = () => {
    if (!isManualCost) {
      const totalWeight = calculateTotalPackageWeight();
      const rate = deliveryRates[warehouse] || 0;
      const calculatedCost = (totalWeight * rate).toFixed(2);
      setTotalDeliveryCost(calculatedCost);
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
  }, [warehouse, packageRows, isManualCost]);

  const handleProductSelection = (index, productId) => {
    try {
      let selectedProduct = null;
      for (const category of categories) {
        if (category.id === productId) {
          selectedProduct = category;
          break;
        }
        const product = category.products?.find((p) => p.id === productId);
        if (product) {
          selectedProduct = product;
          break;
        }
      }

      if (!selectedProduct) {
        throw new Error("Продукт не найден");
      }

      const newDetails = [...packageDetails];
      newDetails[index] = {
        product: productId,
        price: selectedProduct.price || 0,
        count: 1,
        name: selectedProduct.name,
      };
      setPackageDetails(newDetails);
      setShowSubcategories(false);
      setIsSelectOpen(false);
    } catch (error) {
      console.error("Error in product selection:", error);
      Swal.fire({
        title: "Ошибка!",
        text: error.message,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="edit-parcel">
      <div className="main-form">
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
                <option value="США">США</option>
                <option value="Китай">Китай</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>
              Клиент <span className="required">*</span>
            </label>
            <select
              value={client?.id || "default"}
              onChange={(e) => {
                const selectedClient = clients.find(
                  (c) => c.id === Number(e.target.value)
                );
                setClient(selectedClient);
              }}
            >
              <option value="default">Выберите клиента</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {`${c.last_name} ${c.first_name}`}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>
              Получатель <span className="required">*</span>
            </label>
            <select
              value={recipient?.id || "default"}
              onChange={(e) => {
                const selectedRecipient = recipients.find(
                  (r) => r.id === Number(e.target.value)
                );
                setRecipient(selectedRecipient);
              }}
            >
              <option value="default">Выберите получателя</option>
              {recipients.map((r) => (
                <option key={r.id} value={r.id}>
                  {`${r.last_name} ${r.first_name}`}
                </option>
              ))}
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
              <select
                value={store?.id || "default"}
                onChange={(e) => {
                  const selectedStore = stores.find(
                    (s) => s.id === Number(e.target.value)
                  );
                  setStore(selectedStore);
                }}
              >
                <option value="default">Выберите магазин</option>
                {stores.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
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
                  <button
                    className="remove-btn "
                    onClick={() => {
                      const newRows = packageRows.filter(
                        (r) => r.id !== row.id
                      );
                      const reorderedRows = newRows.map((r, index) => ({
                        ...r,
                        id: index + 1,
                      }));
                      setPackageRows(reorderedRows);
                    }}
                  >
                    Удалить
                  </button>
                </div>
              </div>
              {row.showDimensions && (
                <div className="dimensions-inputs">
                  <div className="input-group">
                    <label>Длина</label>
                    <div className="number-input">
                      <button
                        className="minus"
                        onClick={() =>
                          handleDimensionsChange(
                            row.id,
                            "length",
                            Math.max(0, Number(row.dimensions.length) - 1)
                          )
                        }
                      >
                        −
                      </button>
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
                      <button
                        className="plus"
                        onClick={() =>
                          handleDimensionsChange(
                            row.id,
                            "length",
                            Number(row.dimensions.length) + 1
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="input-group">
                    <label>Ширина</label>
                    <div className="number-input">
                      <button
                        className="minus"
                        onClick={() =>
                          handleDimensionsChange(
                            row.id,
                            "width",
                            Math.max(0, Number(row.dimensions.width) - 1)
                          )
                        }
                      >
                        −
                      </button>
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
                      <button
                        className="plus"
                        onClick={() =>
                          handleDimensionsChange(
                            row.id,
                            "width",
                            Number(row.dimensions.width) + 1
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="input-group">
                    <label>Высота</label>
                    <div className="number-input">
                      <button
                        className="minus"
                        onClick={() =>
                          handleDimensionsChange(
                            row.id,
                            "height",
                            Math.max(0, Number(row.dimensions.height) - 1)
                          )
                        }
                      >
                        −
                      </button>
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
                      <button
                        className="plus"
                        onClick={() =>
                          handleDimensionsChange(
                            row.id,
                            "height",
                            Number(row.dimensions.height) + 1
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          <button className="add-row-btn" onClick={handleAddRow}>
            +
          </button>
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
                    isManualCost && setTotalDeliveryCost(e.target.value)
                  }
                  readOnly={!isManualCost}
                />
                <button
                  className="minus"
                  onClick={() =>
                    isManualCost &&
                    setTotalDeliveryCost(
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
                    setTotalDeliveryCost(Number(totalDeliveryCost) + 1)
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

        <div className="form-section">
          <h3>Товары </h3>
          <div className="declaration-form">
            {packageDetails.map((detail, index) => (
              <div key={index} className="declaration-row">
                <div className="declaration-number">{index + 1}.</div>
                <div className="custom-select">
                  <div
                    className="select-selected"
                    onClick={() => {
                      const newDetails = [...packageDetails];
                      newDetails.forEach((detail, i) => {
                        if (i !== index) {
                          detail.isSelectOpen = false;
                        }
                      });
                      newDetails[index].isSelectOpen =
                        !newDetails[index].isSelectOpen;
                      setPackageDetails(newDetails);
                      setSelectedCategory(null);
                      setShowSubcategories(false);
                    }}
                  >
                    {detail.productName || "Введите наименование"}
                  </div>
                  {detail.isSelectOpen && (
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
                            const newDetails = [...packageDetails];
                            newDetails[index].product = category.id;
                            newDetails[index].productName = category.name;
                            newDetails[index].isSelectOpen = false;
                            setPackageDetails(newDetails);
                          }}
                        >
                          {category.name}
                        </div>
                      ))}
                    </div>
                  )}
                  {showSubcategories &&
                    selectedCategory &&
                    detail.isSelectOpen && (
                      <div
                        className="subcategories-dropdown"
                        onMouseEnter={() => setShowSubcategories(true)}
                        onMouseLeave={() => setShowSubcategories(false)}
                      >
                        {categories
                          .find((cat) => cat.id === selectedCategory)
                          ?.products.map((product, idx) => (
                            <div
                              key={idx}
                              className="subcategory-item"
                              onClick={() => {
                                const newDetails = [...packageDetails];
                                newDetails[index].product = product.id;
                                newDetails[index].productName = product.name;
                                newDetails[index].isSelectOpen = false;
                                setPackageDetails(newDetails);
                                setShowSubcategories(false);
                              }}
                            >
                              {product.name}
                            </div>
                          ))}
                      </div>
                    )}
                </div>
                <div className="price-input">
                  <span>$</span>
                  <input
                    type="number"
                    value={detail.price}
                    onChange={(e) => {
                      const newDetails = [...packageDetails];
                      newDetails[index].price = e.target.value;
                      setPackageDetails(newDetails);
                    }}
                  />
                </div>
                <div className="quantity-control">
                  <button
                    onClick={() => {
                      const newDetails = [...packageDetails];
                      if (newDetails[index].count > 1) {
                        newDetails[index].count--;
                        setPackageDetails(newDetails);
                      }
                    }}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={detail.count}
                    onChange={(e) => {
                      const newDetails = [...packageDetails];
                      newDetails[index].count = parseInt(e.target.value) || 1;
                      setPackageDetails(newDetails);
                    }}
                  />
                  <button
                    onClick={() => {
                      const newDetails = [...packageDetails];
                      newDetails[index].count++;
                      setPackageDetails(newDetails);
                    }}
                  >
                    +
                  </button>
                </div>
                <div className="total-price">
                  Итого {warehouseCurrencies[warehouse]?.symbol || "USD"}:{" "}
                  {(
                    detail.price *
                    detail.count *
                    (warehouseCurrencies[warehouse]?.rate || 1)
                  ).toFixed(2)}
                  <br />
                  Итого EUR:{" "}
                  {(detail.price * detail.count * 0.953716).toFixed(2)}
                </div>
                {packageDetails.length > 1 && (
                  <button
                    className="remove-row"
                    onClick={() => {
                      const newDetails = packageDetails.filter(
                        (_, i) => i !== index
                      );
                      setPackageDetails(newDetails);
                    }}
                  >
                    -
                  </button>
                )}
              </div>
            ))}
            <button
              className="add-row-btn"
              onClick={() => {
                setPackageDetails([
                  ...packageDetails,
                  { product: "", price: "", count: 1 },
                ]);
              }}
            >
              +
            </button>
            <div className="total-sum">
              Итог:{" "}
              {packageDetails
                .reduce(
                  (sum, detail) => sum + detail.price * detail.count * 0.953716,
                  0
                )
                .toFixed(2)}{" "}
              €
            </div>
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
}