import { api } from "./api";
import { secureFetch } from "./authService";

export const recommendedShopService = {
  getRecommendedShop: () =>
    api(() =>
      secureFetch("http://localhost:5000/api/local-shops", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    ),

  addLocalShop: (shop) =>
    api(() => {
      return secureFetch("http://localhost:5000/api/local-shops", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(shop),
      });
    }),

  updateLocalShop: (id, updatedData) =>
    api(() => {
      return secureFetch(`http://localhost:5000/api/local-shops/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
    }),

  deleteLocalShop: (id) =>
    api(() => {
      return secureFetch(`http://localhost:5000/api/local-shops/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
    }),
};

// export const recommendedShopService = {
//   addLocalShop: (shop) =>
//     api(async () => {
//       try {
//         const users = JSON.parse(localStorage.getItem("user"));
//         const  = users?.;
//         if (!) throw new Error("User not authenticated.");
//         return fetch("http://localhost:5000/api/local-shops", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${}`,
//           },
//           body: JSON.stringify(shop),
//         });
//       } catch (error) {
//         console.error("Error creating recommended shop:", error);
//         throw error;
//       }
//     }),
//   getRecommendedShop: () =>
//     api(async () => {
//       try {
//         const users = JSON.parse(localStorage.getItem("user"));
//         const  = users?.;
//         if (!) throw new Error("User not authenticated.");
//         return fetch("http://localhost:5000/api/local-shops", {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${}`,
//           },
//         });
//       } catch (error) {
//         console.error("Error fetching recommended shop;", error);
//         throw error;
//       }
//     }),
//   updateLocalShop: (id, updatedData) =>
//     api(async () => {
//       try {
//         const users = JSON.parse(localStorage.getItem("user"));
//         const  = users?.;
//         if (!) throw new Error("User not authenticated.");
//         return fetch(`http://localhost:5000/api/local-shops/${id}`, {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${}`,
//           },
//           body: JSON.stringify(updatedData),
//         });
//       } catch (error) {
//         console.error("Error updating recommended shop:", error);
//         throw error;
//       }
//     }),
//   deleteLocalShop: (id) =>
//     api(async () => {
//       try {
//         const users = JSON.parse(localStorage.getItem("user"));
//         const  = users?.;
//         if (!) throw new Error("User not authenticated.");
//         return fetch(`http://localhost:5000/api/local-shops/${id}`, {
//           method: "DELETE",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${}`,
//           },
//         });
//       } catch (error) {
//         console.error("Error deleting recommended shop:", error);
//         throw error;
//       }
//     }),
// };
