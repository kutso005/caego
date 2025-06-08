import axios from "axios";

export const api = axios.create({
  baseURL: "https://moicargo.kg/api/v1/",
});
api.interceptors.request.use(
  (config) => {
      const userLanguage = localStorage.getItem("i18nextLng");
      if (userLanguage) {
          config.headers["Accept-Language"] = userLanguage;
      }
      return config;
  }
);
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
const requester = async (url, config = {}) => {
  try {
    const response = await api.get(url, config);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data:`, error);
    throw error;
  }
};

const poster = async (url, data, config = {}) => {
  try {
    const response = await api.post(url, data, config);
    return response.data;
  } catch (error) {
    console.error(`Error posting data:`, error);
    throw error;
  }
};

const putter = async (url, data, config = {}) => {
  try {
    // If data is FormData, set the correct content type
    const headers =
      data instanceof FormData
        ? { "Content-Type": "multipart/form-data" }
        : { "Content-Type": "application/json" };

    const response = await api.put(url, data, {
      ...config,
      headers: {
        ...headers,
        ...config.headers,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating data:`, error);
    throw error;
  }
};

export const get = {
  getAboutUs: () => requester("about-us/"),
  getAboutUsPage: () => requester("about-us-page/"),
  getApplication: () => requester("application/"),
  getApplicationSettings: () => requester("application-settings/"),
  getBanners: () => requester("banners/"),
  getFaq: () => requester("faq/"),
  getGallery: () => requester("gallery/"),
  getNews: () => requester("news/"),
  getHowItWorks: () => requester("how-it-works/"),
  getOurServices: () => requester("our-services/"),
  getPaymentData: () => requester("payment-data/"),
  getPriceAndPayment: () => requester("price-and-payment/"),
  getPvz: () => requester("pvz/"),
  getStore: (config) => requester("choices/store/", config),
  //dashboard
  getIncoming: (config) => requester("scans/incoming/", config),
  getOutgoing: (config) => requester("scans/outgoing/", config),
  getLocations: (config) => requester("scans/location/", config),
  searchScans: (config) => requester("scans/", config),
  Location: (config) => requester("/locations/", config),
  getStatus: (config) => requester("choices/status/", config),
  getCountries: () => requester("/countries"),
  //dashboard client
  getUserClient: (config) => requester("/profile/", config),
  getRecipient: (config) => requester("profile/recipient/", config),
  getStore: (config) => requester("choices/store/", config),
  getProducts: (config) => requester("choices/products/", config),
  getRecipientd: (config) => requester("/users/recipients/", config),

  getUsers: (config) => requester("/users/", config),
  getUsersId: (id) => requester(`/users/${id}`),
  getPackage: (id) => requester(`packages/${id}/`),

  getMyPackages: (config) => requester("my-packages/", config),
  getClients: (config) => requester("clients/", config),
};

export const post = {
  addPackage: (data) => poster("my-packages/", data),
  addUserRecipient: (id) => poster(`/users/${id}/recipients/`),
  
};

export const put = {
  updatePackage: (id, data) => putter(`packages/${id}/`, data),
  updateUser: (id, data) => putter(`users/${id}/`, data),
};
export const path = {
  pathRecipient: (id, data) => putter(`/users/recipients/${id}/`, data),
};
