import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  "https://support-ticket-entry-system-pink.vercel.app";

const ApiRequest = async (method, path, data) => {
  try {
    console.log(
      "app-url",
      API_BASE_URL,
      "env",
      process.env.REACT_APP_API_BASE_URL,
      "final-url",
      `${API_BASE_URL}/api${path}`
    );
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
