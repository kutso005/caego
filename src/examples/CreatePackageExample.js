import { createPackage } from "../api/packages";

// Example usage of createPackage function
const createPackageExample = async () => {
  try {
    const packageData = {
      client: 0,
      recipient: 0,
      status: "Проверяется",
      warehouse: "США",
      type_of_packaging: "Пакет",
      options_of_packaging: "Отправить в почтовой упаковке",
      store: 0,
      reys: "string",
      full_name: "string",
      weight_of_package: 0,
      tracking_number: "string",
      count_scans: 2147483647,
      final_weight: 0,
      delivery_cost: "6633.82",
      client_comment: "string",
      system_comment: "string",
      package_details: [
        {
          product: 0,
          price: "27854",
          count: 2147483647,
        },
      ],
      package_images: [
        {
          image: "string", // In real usage, this should be a File object
        },
      ],
      package_weights: [
        {
          count_place: 2147483647,
          weight: 0,
          is_volume_weight: true,
          length: 0,
          width: 0,
          height: 0,
          volume_weight: 0,
        },
      ],
      // Optional image files
      package_image: null, // Should be a File object in real usage
      label_image: null, // Should be a File object in real usage
      invoice_image: null, // Should be a File object in real usage
    };

    const response = await createPackage(packageData);
    console.log("Package created successfully:", response);
  } catch (error) {
    console.error("Failed to create package:", error);
  }
};

export default createPackageExample;
