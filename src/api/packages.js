import axios from "axios";

export const createPackage = async (packageData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authorization token found");
    }

    const formData = new FormData();

    // Append all the required fields
    formData.append("client", packageData.client || 0);
    formData.append("recipient", packageData.recipient || 0);
    formData.append("status", packageData.status || "Проверяется");
    formData.append("warehouse", packageData.warehouse || "США");
    formData.append(
      "type_of_packaging",
      packageData.type_of_packaging || "Пакет"
    );
    formData.append(
      "options_of_packaging",
      packageData.options_of_packaging || "Отправить в почтовой упаковке"
    );
    formData.append("store", packageData.store || 0);
    formData.append("reys", packageData.reys || "string");
    formData.append("full_name", packageData.full_name || "string");
    formData.append("weight_of_package", packageData.weight_of_package || 0);
    formData.append("tracking_number", packageData.tracking_number || "string");
    formData.append("count_scans", packageData.count_scans || 0);
    formData.append("final_weight", packageData.final_weight || 0);
    formData.append("delivery_cost", packageData.delivery_cost || "0");
    formData.append("client_comment", packageData.client_comment || "");
    formData.append("system_comment", packageData.system_comment || "");

    // Handle package details array
    if (packageData.package_details && packageData.package_details.length > 0) {
      formData.append(
        "package_details",
        JSON.stringify(packageData.package_details)
      );
    }

    // Handle package weights array
    if (packageData.package_weights && packageData.package_weights.length > 0) {
      formData.append(
        "package_weights",
        JSON.stringify(packageData.package_weights)
      );
    }

    // Handle images
    if (packageData.package_image) {
      formData.append("package_image", packageData.package_image);
    }
    if (packageData.label_image) {
      formData.append("label_image", packageData.label_image);
    }
    if (packageData.invoice_image) {
      formData.append("invoice_image", packageData.invoice_image);
    }

    // Handle additional package images
    if (packageData.package_images && packageData.package_images.length > 0) {
      packageData.package_images.forEach((image, index) => {
        formData.append(`package_images[${index}]image`, image.image);
      });
    }

    const response = await axios.post(
      "https://moicargo.kg/api/v1/packages/",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error creating package:", error);
    throw error;
  }
};
