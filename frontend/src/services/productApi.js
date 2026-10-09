const API_URL = import.meta.env.VITE_API_URL;

export async function searchProducts(name) {
  const response = await fetch(
    `${API_URL}/products?name=${encodeURIComponent(name)}`,
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Search failed.");
  }

  return data;
}

export async function getProductById(id) {
  const response = await fetch(`${API_URL}/products/${id}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch product.");
  }

  return data;
}

export async function getAllProducts() {
  const response = await fetch(`${API_URL}/products`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch products.");
  }

  return data;
}

export async function createProduct(product) {
  const response = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: {
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
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Failed to delete product.");
  }
}
