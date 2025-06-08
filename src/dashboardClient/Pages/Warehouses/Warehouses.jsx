import React, { useState, useEffect } from "react";
import "./Warehouses.css";
import { FaFlag } from "react-icons/fa";

const Warehouses = () => {
  const [warehouseData, setWarehouseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [copyNotification, setCopyNotification] = useState({
    show: false,
    text: "",
  });
  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyNotification({ show: true, text: `${fieldName} скопирован!` });
      setTimeout(() => {
        setCopyNotification({ show: false, text: "" });
      }, 2000);
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const userResponse = await fetch(
          "https://moicargo.kg/api/v1/profile/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!userResponse.ok) {
          throw new Error("Failed to fetch user data");
        }
        const userData = await userResponse.json();
        setUserData(userData);

        const warehouseResponse = await fetch(
          "https://moicargo.kg/api/v1/warehouse-data/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!warehouseResponse.ok) {
          throw new Error("Unauthorized access or server error");
        }

        const data = await warehouseResponse.json();

        if (data && data.length > 0) {
          const firstWarehouse = data[0];
          const formattedData = {
            usa: {
              title: "Адрес в США",
              fields: {
                "Full name": userData
                  ? `${userData.last_name} ${userData.first_name}`
                  : "",
                "Address 1": firstWarehouse.usa.usa_address_1,
                "Address 2": firstWarehouse.usa.usa_address_2,
                City: firstWarehouse.usa.usa_city,
                State: firstWarehouse.usa.usa_state,
                "ZIP code": firstWarehouse.usa.usa_zip_code,
                Phone: firstWarehouse.usa.usa_phone,
              },
            },
            china: {
              title: "Адрес в Китае",
              fields: {
                收货人: firstWarehouse.china.china_address,
                手机号: firstWarehouse.china.china_phone,
                地区: firstWarehouse.china.china_region,
                详细地址: firstWarehouse.china.china_detail_address,
                邮编: firstWarehouse.china.china_post_code,
              },
            },
          };
          setWarehouseData(formattedData);
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading..s.</div>;
  if (error) return <div>Error: {error}</div>;
  if (!warehouseData) return <div>No warehouse data availabdle</div>;

  return (
    <div className="warehouses-container">
      <h1>Адреса складов</h1>
      <div className="warehouses-grid">
        <div className="warehouse-card usa">
          <div className="warehouse-header">
            <h2>Адрес в США</h2>
            <FaFlag className="country-flag" />
          </div>
          <div className="warehouse-content">
            <div className="fields-container">
              <div className="field">
                <span className="field-label">Full name:</span>
                <span
                  className="field-value copyable"
                  onClick={() =>
                    handleCopy(
                      warehouseData.usa.fields["Full name"],
                      "Full name"
                    )
                  }
                >
                  {warehouseData.usa.fields["Full name"]}
                </span>
              </div>
              <div className="field">
                <span className="field-label">Address 1:</span>
                <span className="field-value">
                  {warehouseData.usa.fields["Address 1"]}
                </span>
              </div>
              <div className="field">
                <span className="field-label">Address 2:</span>
                <span
                  className="field-value copyable"
                  onClick={() =>
                    handleCopy(
                      warehouseData.usa.fields["Address 2"],
                      "Address 2"
                    )
                  }
                >
                  {warehouseData.usa.fields["Address 2"]}
                </span>
              </div>
              <div className="field">
                <span className="field-label">City:</span>
                <span className="field-value">
                  {warehouseData.usa.fields["City"]}
                </span>
              </div>
              <div className="field">
                <span className="field-label">State:</span>
                <span className="field-value">
                  {warehouseData.usa.fields["State"]}
                </span>
              </div>
              <div className="field">
                <span className="field-label">ZIP code:</span>
                <span className="field-value">
                  {warehouseData.usa.fields["ZIP code"]}
                </span>
              </div>
              <div className="field">
                <span className="field-label">Phone:</span>
                <span
                  className="field-value copyable"
                  onClick={() =>
                    handleCopy(warehouseData.usa.fields["Phone"], "Phone")
                  }
                >
                  {warehouseData.usa.fields["Phone"]}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="warehouse-card china">
          <div className="warehouse-header">
            <h2>Адрес в Китае</h2>
            <FaFlag className="country-flag" />
          </div>
          <div className="warehouse-content">
            <div className="fields-container">
              <div className="field">
                <span className="field-label">收货人:</span>
                <span
                  className="field-value copyable"
                  onClick={() =>
                    handleCopy(warehouseData.china.fields["收货人"], "收货人")
                  }
                >
                  {warehouseData.china.fields["收货人"]}
                </span>
              </div>
              <div className="field">
                <span className="field-label">手机号:</span>
                <span
                  className="field-value copyable"
                  onClick={() =>
                    handleCopy(warehouseData.china.fields["手机号"], "手机号")
                  }
                >
                  {warehouseData.china.fields["手机号"]}
                </span>
              </div>
              <div className="field">
                <span className="field-label">地区:</span>
                <span
                  className="field-value copyable"
                  onClick={() =>
                    handleCopy(warehouseData.china.fields["地区"], "地区")
                  }
                >
                  {warehouseData.china.fields["地区"]}
                </span>
              </div>
              <div className="field">
                <span className="field-label">详细地址:</span>
                <span
                  className="field-value copyable"
                  onClick={() =>
                    handleCopy(
                      warehouseData.china.fields["详细地址"],
                      "详细地址"
                    )
                  }
                >
                  {warehouseData.china.fields["详细地址"]}{" "}
                  {warehouseData.china.fields["收货人"]}
                </span>
              </div>
              <div className="field">
                <span className="field-label">邮编:</span>
                <span
                  className="field-value copyable"
                  onClick={() =>
                    handleCopy(warehouseData.china.fields["邮编"], "邮编")
                  }
                >
                  {warehouseData.china.fields["邮编"]}
                </span>
              </div>
              <div className="field">
                <span className="field-label">完整地址:</span>
                <span
                  className="field-value copyable"
                  onClick={() =>
                    handleCopy(
                      `${warehouseData.china.fields["收货人"]}\ 15767679937 广东省 广州市 白云区 广州市白云区松洲街 螺涌高桥路三街25号枚桂新港云仓E2栋2504号\n${warehouseData.china.fields["收货人"]}`,
                      "完整地址"
                    )
                  }
                >
                  {warehouseData.china.fields["收货人"]} <br />
                  15767679937
                  广东省 广州市 白云区   <br /> 广州市白云区松洲街 螺涌高桥路三街25号枚桂新港云仓E2栋2504号
                  {warehouseData.china.fields["收货人"]}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {copyNotification.show && (
        <div className="copy-notification">{copyNotification.text}</div>
      )}
    </div>
  );
};

export default Warehouses;
