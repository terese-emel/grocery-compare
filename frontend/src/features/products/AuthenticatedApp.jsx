import { useEffect, useRef, useState } from "react";
import ErrorMessage from "../../components/ErrorMessage";
import NavigationBar from "../../components/NavigationBar";
import AddProductForm from "./AddProductForm";
import styles from "./AuthenticatedApp.module.css";
import { deleteProduct, searchProducts, updateProduct } from "./productApi";
import ProductList from "./ProductList";
import SearchForm from "./SearchForm";

function AuthenticatedApp({ user, logout }) {
  const [productName, setProductName] = useState("");
  const [shopName, setShopName] = useState("");
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const searchController = useRef(null);

  useEffect(() => {
    document.title = productName || "Grocery Compare";
  }, [productName]);

  useEffect(() => {
    return () => searchController.current?.abort();
  }, []);

  async function loadProducts(page) {
    searchController.current?.abort();
    const controller = new AbortController();
    searchController.current = controller;

    setError("");
    setLoading(true);

    const trimmedProductName = productName.trim();
    const trimmedShopName = shopName.trim();

    if (trimmedProductName === "" && trimmedShopName === "") {
      setError("Please enter a product name or shop name.");
      setLoading(false);
      return;
    }

    if (trimmedProductName !== "" && trimmedProductName.length < 2) {
      setError("Please enter at least 2 characters.");
      setLoading(false);
      return;
    }

    try {
      const data = await searchProducts({
        name: productName,
        shop: shopName,
        page,
        signal: controller.signal,
      });

      if (data.items.length === 0) {
        setError("No products found.");
        setProducts([]);
        setPagination(null);
        return;
      }

      setProducts(data.items);
      setPagination({ page: data.page, pages: data.pages });
      setCurrentPage(data.page);
    } catch (requestError) {
      if (requestError.name !== "AbortError") {
        setError(requestError.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setProducts([]);
    await loadProducts(1);
  }

  function clearSearch() {
    setProductName("");
    setShopName("");
    setProducts([]);
    setError("");
    setPagination(null);
    setCurrentPage(1);
  }

  async function handleDelete(id) {
    try {
      await deleteProduct(id);
      setProducts((currentProducts) =>
        currentProducts.filter((product) => product._id !== id),
      );
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function handleUpdate(id, newPrice) {
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
  }

  function handleCreated(product) {
    if (!productName.trim()) return;

    if (product.name.toLowerCase().includes(productName.trim().toLowerCase())) {
      setProducts((currentProducts) =>
        [...currentProducts, product].sort((a, b) => a.price - b.price),
      );
    }
  }

  return (
    <main>
      <NavigationBar user={user} onLogout={logout} />
      <section id="add-product">
        <AddProductForm onCreated={handleCreated} />
      </section>
      <section id="search">
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
      </section>

      <ProductList
        products={products}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
        loggedInUser={user}
      />

      {pagination && pagination.pages > 1 && (
        <nav className={styles.paginationControls} aria-label="Product pages">
          <button
            className={styles.secondaryButton}
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
            className={styles.secondaryButton}
            type="button"
            onClick={() => loadProducts(currentPage + 1)}
            disabled={loading || currentPage === pagination.pages}
          >
            Next
          </button>
        </nav>
      )}
    </main>
  );
}

export default AuthenticatedApp;
