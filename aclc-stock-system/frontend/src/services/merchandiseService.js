import { api } from "./api";
import { secureFetch } from "./authService";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const PRODUCT_URL = `${API_URL}/products`;

export const productService = {
  getAllProduct: () =>
    api(() =>
      secureFetch(API_URL, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    ),

  getAllProductsForAdmin: () =>
    api(() =>
      secureFetch(`${PRODUCT_URL}/admin/all`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    ),

  archiveProduct: (id) =>
    api(() =>
      secureFetch(`${PRODUCT_URL}/${id}/archive`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    ),

  restoreProduct: (id) =>
    api(() =>
      secureFetch(`${PRODUCT_URL}/${id}/restore`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    ),

  addProduct: (product, imageFiles) =>
    api(() => {
      const formData = new FormData();

      Object.keys(product).forEach((key) => {
        if (key !== "item_images") {
          if (key === "item_sizes") {
            formData.append(key, JSON.stringify(product[key]));
          } else {
            formData.append(key, product[key]);
          }
        }
      });

      imageFiles.forEach((file) => {
        formData.append("item_images", file);
      });

      return secureFetch(PRODUCT_URL, {
        method: "POST",
        credentials: "include",
        headers: {},
        body: formData,
      });
    }),

  updateProduct: (id, updatedData, imageFiles, existingImages) =>
    api(() => {
      const formData = new FormData();

      Object.keys(updatedData).forEach((key) => {
        if (
          key !== "item_images" &&
          key !== "isArchived" &&
          key !== "archivedAt"
        ) {
          if (key === "item_sizes") {
            formData.append(key, JSON.stringify(updatedData[key]));
          } else {
            formData.append(key, updatedData[key]);
          }
        }
      });

      imageFiles.forEach((file) => {
        formData.append("item_images", file);
      });

      existingImages.forEach((file) => {
        formData.append("existing_images", file);
      });

      return secureFetch(`${PRODUCT_URL}/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {},
        body: formData,
      });
    }),

  deleteProduct: (id) =>
    api(() =>
      secureFetch(`${PRODUCT_URL}/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {},
      }),
    ),
};
