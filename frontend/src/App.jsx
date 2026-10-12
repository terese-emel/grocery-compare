import { useState, useEffect } from "react";
import SearchForm from "./components/SearchForm";
import ProductList from "./components/ProductList";
import {
  searchProducts,
  deleteProduct,
  updateProduct,
} from "./services/productApi";
import ErrorMessage from "./components/ErrorMessage";
import AddProductForm from "./components/AddProductForm";
import AuthForm from "./components/AuthForm";
import { useAuth } from "./context/authContextValue";

function App() {
  const [productName, setProductName] = useState("");
  const [shopName, setShopName] = useState("");
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const { user, isAuthLoading, logout } = useAuth();

  useEffect(() => {
    document.title = productName || "Grocery Compare";
  }, [productName]);

  const loadProducts = async (page) => {
    setError("");
    setLoading(true);

    if (productName.trim() === "") {
      setError("Please enter a product name.");
      setLoading(false);
      return;
    }

    if (productName.trim().length < 2) {
      setError("Please enter at least 2 characters.");
      setLoading(false);
      return;
    }

    try {
      const data = await searchProducts({
        name: productName,
        shop: shopName,
        page,
      });

      if (data.items.length === 0) {
        setError("No products found.");
        setProducts([]);
        setPagination(null);
        setLoading(false);
        return;
      }

      setProducts(data.items);
      setPagination({ page: data.page, pages: data.pages });
      setCurrentPage(data.page);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProducts([]);
    await loadProducts(1);
  };

  const clearSearch = () => {
    setProductName("");
    setProducts([]);
    setError("");
    setPagination(null);
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);

      setProducts((currentProducts) =>
        currentProducts.filter((product) => product._id !== id),
      );
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleUpdate = async (id, newPrice) => {
    try {
      const data = await updateProduct(id, { price: newPrice });

      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product._id === id ? data.product : product,
        ),
      );
    } catch (requestError) {
      setError(requestError.message);
      throw requestError;
    }
  };

  const handleCreated = (product) => {
    if (!productName.trim()) return;

    if (product.name.toLowerCase().includes(productName.trim().toLowerCase())) {
      setProducts((currentProducts) =>
        [...currentProducts, product].sort((a, b) => a.price - b.price),
      );
    }
  };

  const handleLogout = () => {
    logout();
    setProducts([]);
    setError("");
  };
  if (isAuthLoading) {
    return <p>Loading session...</p>;
  }

  if (!user) {
    return (
      <main>
        <h1>Grocery Compare</h1>
        <AuthForm mode={authMode} />
        <button
          className="button-secondary auth-switch"
          type="button"
          onClick={() =>
            setAuthMode(authMode === "login" ? "register" : "login")
          }
        >
          {authMode === "login"
            ? "Create a new account"
            : "I already have an account"}
        </button>
      </main>
    );
  }

  return (
    <main>
      <h1>Grocery Compare</h1>
      <p>Find the cheapest grocery products.</p>
      <p>Signed in as {user.email}</p>
      <button className="button-secondary" type="button" onClick={handleLogout}>
        Logout
      </button>

      <SearchForm
        productName={productName}
        setProductName={setProductName}
        shopName={shopName}
        setShopName={setShopName}
        handleSubmit={handleSubmit}
        loading={loading}
        clearSearch={clearSearch}
      />

      <ErrorMessage message={error} />

      <ProductList
        products={products}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
        loggedInUser={user}
      />

      {pagination && pagination.pages > 1 && (
        <nav className="pagination-controls" aria-label="Product pages">
          <button
            className="button-secondary"
            type="button"
            onClick={() => loadProducts(currentPage - 1)}
            disabled={loading || currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            className="button-secondary"
            type="button"
            onClick={() => loadProducts(currentPage + 1)}
            disabled={loading || currentPage === pagination.pages}
          >
            Next
          </button>
        </nav>
      )}
      <AddProductForm onCreated={handleCreated} />
    </main>
  );
}

export default App;
