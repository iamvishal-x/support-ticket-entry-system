import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

/**
 * Common API call function
 * @param {*} method Get, Post, Patch
 * @param {*} path endpoint of the api
 * @param {*} data body object
 * @returns
 */
const ApiRequest = async (method, path, data) => {
  try {
    console.log("Api Request:", { method, path, data });
    const response = await axios({
      method,
      url: `${API_BASE_URL}/api${path}`,
      data,
    });
    console.log("Api Request Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("API Request Error:", error);
    throw error.response.data;
  }
};

export default ApiRequest;
