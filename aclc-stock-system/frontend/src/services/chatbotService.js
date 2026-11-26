import { api } from "./api";
import { secureFetch } from "./authService";

export const chatbotService = {
  sendMessage: (message) =>
    api(() => {
      return secureFetch("http://localhost:5000/api/chatbot", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });
    }),
};
