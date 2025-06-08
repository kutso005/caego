import React, { useState, useEffect } from "react";
import "./AddParcel.css";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPlus, FaBox } from "react-icons/fa";
import { post, get } from "../../../api/api";

const AddParcel = () => {
  const navigate = useNavigate();
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [selectedStore, setSelectedStore] = useState("");
  const [selectedRecipient, setSelectedRecipient] = useState("");
  const [typeOfPackaging, setTypeOfPackaging] = useState("Пакет");
  const [stores, setStores] = useState([]);
  const [packageDetails, setPackageDetails] = useState([
    {
      product: 1,
      productName: "",
      price: "",
      count: 1,
      isSelectOpen: false,
    },
  ]);
  const token = localStorage.getItem("token");
  const [userClient, setUserClient] = useState([]);
  const [categories, setCategories] = useState([]);
  const [comment, setComment] = useState("");

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showSubcategories, setShowSubcategories] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [isStoreSelectOpen, setIsStoreSelectOpen] = useState(false);
  const [isRecipientSelectOpen, setIsRecipientSelectOpen] = useState(false);
  const [isWarehouseSelectOpen, setIsWarehouseSelectOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const [recipientResponse, productsResponse] = await Promise.all([
          get.getRecipient(config),
          get.getProducts(config),
        ]);
        console.log("Recipients data:", recipientResponse);
        console.log("Products data:", productsResponse);

        setUserClient(recipientResponse);
        setCategories(productsResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const warehouses = [
    { id: "usa", name: "США", flag: "https://flagcdn.com/w40/us.png" },
    { id: "china", name: "Китай", flag: "https://flagcdn.com/w40/cn.png" },
  ];

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const packageData = {
      warehouse:
        selectedWarehouse === "usa"
          ? "США"
          : selectedWarehouse === "china"
          ? "Китай"
          : "Китай",
      tracking_number: trackingNumber,
      store: parseInt(selectedStore) || 1,
      type_of_packaging: typeOfPackaging,
      recipient: parseInt(selectedRecipient) || 1,
      package_details: packageDetails,
      client_comment: comment,
    };

    try {
      const response = await post.addPackage(packageData);
      console.log("Package added successfully:", response);
      navigate(-1);
    } catch (error) {
      console.error("Error adding package:", error);
    }
  };

  return (
    <div className="add-parcel-container">
      <div className="back-button" onClick={() => navigate(-1)}>
        <FaArrowLeft style={{ marginRight: "8px" }} /> Добавление посылки
      </div>

      <div className="parcel-form-container">
        <h2>Информация о посылке</h2>

        <div className="form-section">
          <h3>Склад</h3>
          <div className="custom-select">
            <div
              className="select-selected"
              onClick={() => setIsWarehouseSelectOpen(!isWarehouseSelectOpen)}
            >
              {warehouses.find((w) => w.id === selectedWarehouse)?.name ||
                "Выберите склад"}
            </div>
            {isWarehouseSelectOpen && (
              <div className="select-items">
                {warehouses.map((warehouse) => (
                  <div
                    key={warehouse.id}
                    className={`select-item ${
                      selectedWarehouse === warehouse.id ? "selected" : ""
                    }`}
                    onClick={() => {
                      setSelectedWarehouse(warehouse.id);
                      setIsWarehouseSelectOpen(false);
                    }}
                  >
                    <img
                      src={warehouse.flag}
                      alt={`${warehouse.name} flag`}
                      className="warehouse-flag"
                    />
                    <span>{warehouse.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="form-section">
          <h3>Трекинг номер</h3>
          <div className="tracking-input-container">
            <input
              type="text"
              placeholder="Введите трек номер"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
            />
            <div className="custom-select">
              <div
                className="select-selected"
                onClick={() => setIsStoreSelectOpen(!isStoreSelectOpen)}
              >
                {stores.find((store) => store.id === selectedStore)?.name ||
                  "Выберите магазин"}
              </div>
              {isStoreSelectOpen && (
                <div className="select-items">
                  {stores.map((store) => (
                    <div
                      key={store.id}
                      className={`select-item ${
                        selectedStore === store.id ? "selected" : ""
                      }`}
                      onClick={() => {
                        setSelectedStore(store.id);
                        setIsStoreSelectOpen(false);
                      }}
                    >
                      {store.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Получатель</h3>
          <div className="recipient-container">
            <div className="custom-select">
              <div
                className="select-selected"
                onClick={() => setIsRecipientSelectOpen(!isRecipientSelectOpen)}
              >
                {userClient.find((user) => user.id === selectedRecipient)
                  ? `${
                      userClient.find((user) => user.id === selectedRecipient)
                        .last_name
                    } ${
                      userClient.find((user) => user.id === selectedRecipient)
                        .first_name
                    }`
                  : "Выберите получателя"}
              </div>
              {isRecipientSelectOpen && (
                <div className="select-items">
                  {userClient.map((user) => (
                    <div
                      key={user.id}
                      className={`select-item ${
                        selectedRecipient === user.id ? "selected" : ""
                      }`}
                      onClick={() => {
                        setSelectedRecipient(user.id);
                        setIsRecipientSelectOpen(false);
                      }}
                    >
                      {user.last_name} {user.first_name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Декларация</h3>
          {selectedWarehouse ? (
            <div className="declaration-form">
              {packageDetails.map((detail, index) => (
                <div key={index} className="declaration-row">
                  <div className="declaration-number">{index + 1}.</div>
                  <div className="custom-select">
                    <div
                      className="select-selected"
                      onClick={() => {
                        const newDetails = [...packageDetails];
                        // Close all other selects
                        newDetails.forEach((detail, i) => {
                          if (i !== index) {
                            detail.isSelectOpen = false;
                          }
                        });
                        // Toggle current select
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
                    Итого USD: {(detail.price * detail.count).toFixed(2)}
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
                    {
                      product: "",
                      productName: "",
                      price: "",
                      count: 1,
                      isSelectOpen: false,
                    },
                  ]);
                }}
              >
                +
              </button>
              <div className="total-sum">
                Итог:{" "}
                {packageDetails
                  .reduce(
                    (sum, detail) =>
                      sum + detail.price * detail.count * 0.953716,
                    0
                  )
                  .toFixed(2)}{" "}
                €
              </div>
            </div>
          ) : (
            <div className="declaration-message">
              Чтобы добавить товары, выберите Склад.
            </div>
          )}
        </div>
        <div>
          <input
            type="text"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
            placeholder="Коментарий для товара"
            className="comment-textarea"
          ></input>
        </div>

        <button className="submit-parcel-btn" onClick={handleSubmit}>
          <FaBox style={{ fontSize: "16px" }} /> Добавить посылку
        </button>
      </div>
    </div>
  );
};

export default AddParcel;
