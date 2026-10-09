const form = document.querySelector("form");
const productInput = document.querySelector("#product");
const result = document.querySelector("#result");
const button = document.querySelector("button");

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const searchName = productInput.value.trim();

  if (searchName.length < 2) {
    result.textContent = "Please enter at least 2 characters.";
    return;
  }
  button.disabled = true;
  button.textContent = "Searching...";

  if (searchName === "") {
    result.textContent = "Please enter a product name.";
    return;
  }

  result.textContent = "Loading products...";

  try {
    const response = await fetch(
      `http://localhost:3000/products/cheapest?name=${encodeURIComponent(searchName)}`,
    );
    const products = await response.json();

    await new Promise(function (resolve) {
      setTimeout(resolve, 2000);
    });

    if (!response.ok) {
      throw new Error(products.message || "Search failed.");
    }

    if (products.length === 0) {
      result.textContent = "No products found.";
      return;
    }
    const cheapestPrice = products[0].price;

    result.innerHTML = `
  <h3>${products[0].name}</h3>
  ${products
    .map(function (product) {
      const isCheapest = product.price === cheapestPrice;

      return `
        <div class="product-card ${isCheapest ? "cheapest" : ""}">
          <span>${product.shop}</span>
          <strong>${product.price} kr</strong>
          ${isCheapest ? "<em>Cheapest</em>" : ""}
        </div>
      `;
    })
    .join("")}
`;
  } catch (error) {
    result.textContent = `Error: ${error.message}`;
  } finally {
    button.disabled = false;
    button.textContent = "Search";
  }
});
