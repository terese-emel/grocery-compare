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
import { logout, getCurrentUser } from "./services/authApi";

function App() {
  const [productName, setProductName] = useState("");
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    document.title = productName || "Grocery Compare";
  }, [productName]);

  useEffect(() => {
    async function restoreSession() {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setIsAuthLoading(false);
    }

    restoreSession();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);
    setProducts([]);

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
  };

  const clearSearch = () => {
    setProductName("");
    setProducts([]);
    setError("");
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

  const handleLogin = async (loggedInUser) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    logout();
    setUser(null);
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
        <AuthForm mode={authMode} onSuccess={handleLogin} />
        <button
          className="button-secondary"
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
        handleSubmit={handleSubmit}
        loading={loading}
        clearSearch={clearSearch}
      />

      <ErrorMessage message={error} />

      <ProductList
        products={products}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
      />
      <AddProductForm onCreated={handleCreated} />
    </main>
  );
}

export default App;
