import { useState } from "react";
import ErrorMessage from "../../components/ErrorMessage";
import styles from "./AddProductForm.module.css";
import { createProduct } from "./productApi";

const AddProductForm = ({ onCreated }) => {
  const [productName, setProductName] = useState("");
  const [shopName, setShopName] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const resetForm = () => {
    setProductName("");
    setShopName("");
    setPrice("");
    setUnit("");
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (
      productName.trim() === "" ||
      shopName.trim() === "" ||
      price.trim() === "" ||
      unit.trim() === ""
    ) {
      setError("Please fill in all fields.");
      return;
    }

    setSaving(true);

    try {
      const product = {
        name: productName,
        shop: shopName,
        price: parseFloat(price),
        unit: unit,
      };

      const response = await createProduct(product);
      onCreated?.(response.product);

      setMessage("Product added successfully!");
      setProductName("");
      setShopName("");
      setPrice("");
      setUnit("");
    } catch (error) {
      setError(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className={styles.container}>
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label htmlFor="add-product-name">Product name</label>

        <input
          id="add-product-name"
          type="text"
          placeholder="Product name"
          value={productName}
          onChange={(event) => setProductName(event.target.value)}
        />

        <label htmlFor="add-shop">Shop Name</label>

        <input
          id="add-shop"
          type="text"
          placeholder="Shop name"
          value={shopName}
          onChange={(event) => setShopName(event.target.value)}
        />

        <label htmlFor="price">Price</label>
        <input
          id="price"
          type="number"
          placeholder="Price"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
        />

        <label htmlFor="unit">Unit</label>
        <input
          id="unit"
          type="text"
          placeholder="Unit"
          value={unit}
          onChange={(event) => setUnit(event.target.value)}
        />

        <button type="submit" disabled={saving}>
          {saving ? "Adding..." : "Add Product"}
        </button>
        <button
          className={styles.secondaryButton}
          type="button"
          onClick={resetForm}
          disabled={saving}
        >
          Reset
        </button>
      </form>
      {error && <ErrorMessage message={error} />}
      {message && <alert className={styles.sucessMessage}>{message}</alert>}
    </section>
  );
};

export default AddProductForm;
