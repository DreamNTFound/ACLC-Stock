import { api } from "./api";
import { secureFetch } from "./authService";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const chatbotService = {
  sendMessage: (message) =>
    api(() => {
      return secureFetch(`${API_URL}/chatbot`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });
    }),
};
