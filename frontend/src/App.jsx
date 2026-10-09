import { useState, useEffect } from "react";
import SearchForm from "./components/SearchForm";
import ProductList from "./components/ProductList";
import { searchProducts } from "./services/productApi";
import ErrorMessage from "./components/ErrorMessage";

function App() {
  const [productName, setProductName] = useState("");
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = productName || "Grocery Compare";
  }, [productName]);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setLoading(true);
    setProducts([]);

    if (productName.trim().length < 2) {
      setError("Please enter at least 2 characters.");
      setLoading(false);
      return;
    }

    if (productName.trim() === "") {
      setError("Please enter a product name.");
      setLoading(false);
      return;
    }

    try {
      const data = await searchProducts(productName);

      if (data.length === 0) {
        setError("No products found.");
        setLoading(false);
        return;
      }

      setProducts(data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <h1>Grocery Compare</h1>
      <p>Find the cheapest grocery products.</p>

      <SearchForm
        productName={productName}
        setProductName={setProductName}
        handleSubmit={handleSubmit}
        loading={loading}
      />

      <ErrorMessage message={error} />

      <ProductList products={products} />
    </main>
  );
}

export default App;
