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
