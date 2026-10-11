const API_URL = import.meta.env.VITE_API_URL;

function authHeaders() {
  const token = localStorage.getItem("authToken");

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function searchProducts(name) {
  const response = await fetch(
    `${API_URL}/products?name=${encodeURIComponent(name)}`,
    {
      headers: authHeaders(),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Search failed.");
  }

  return data;
}

export async function createProduct(product) {
  const response = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: {
      ...authHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create product.");
  }

  return data;
}

export async function updateProduct(id, product) {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "PUT",
    headers: {
      ...authHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update product.");
  }

  return data;
}

export async function deleteProduct(id) {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete product.");
  }

  return data;
}
