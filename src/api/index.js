import axios from "axios";

const BASE_URL = "https://moicargo.kg/api/v1";

export const requester = async (endpoint, options = {}) => {
  const { data, method = "GET", headers = {} } = options;

  const config = {
    url: `${BASE_URL}${endpoint}`,
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    data,
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const api = {
  getCountries: () => requester("/countries"),
};
