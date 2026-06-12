import API from "./api";
import { showToast } from "../components/Toast";

export const handleApiCall = async (apiFunction, successMessage = null) => {
  try {
    const response = await apiFunction();

    if (response.data?.message) {
      showToast(response.data.message, "success");
    } else if (successMessage) {
      showToast(successMessage, "success");
    }

    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Operation failed";
    showToast(message, "error");
    throw error;
  }
};

export default API;
