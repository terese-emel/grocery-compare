import { apiRequest } from "./apiClient";

export function searchProducts({ name, page = 1, limit = 10 }) {
  return apiRequest(
    `/products?name=${encodeURIComponent(name)}&page=${page}&limit=${limit}`,
  );
}

export function getProductById(id) {
  return apiRequest(`/products/${id}`);
}

export function getAllProducts() {
  return apiRequest("/products");
}

export function createProduct(product) {
  return apiRequest("/products", {
    method: "POST",
    body: JSON.stringify(product),
  });
}

export function updateProduct(id, product) {
  return apiRequest(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(product),
  });
}

export function deleteProduct(id) {
  return apiRequest(`/products/${id}`, {
    method: "DELETE",
  });
}
