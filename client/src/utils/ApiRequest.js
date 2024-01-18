import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ApiRequest = async (method, path, data) => {
  try {
    const response = await axios({
      method,
      url: `${API_BASE_URL}/api${path}`,
      data,
    });
    return response.data;
  } catch (error) {
    console.error("----API Request error:", error);
    throw error.response.data;
  }
};

export default ApiRequest;
