import { useState } from "react";
import { createProduct } from "./productApi";
import ErrorMessage from "../../components/ErrorMessage";

const AddProductForm = ({ onCreated }) => {
  const [productName, setProductName] = useState("");
  const [shopName, setShopName] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const resetForm = () => {
    setProductName("");
    setShopName("");
    setPrice("");
    setUnit("");
    setMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");

    if (
      productName.trim() === "" ||
      shopName.trim() === "" ||
      price.trim() === "" ||
      unit.trim() === ""
    ) {
      setMessage("Please fill in all fields.");
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
      setMessage(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section>
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
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
          className="button-secondary"
          type="button"
          onClick={resetForm}
          disabled={saving}
        >
          Reset
        </button>
      </form>
      {typeof message === "object" ? (
        <ErrorMessage message={message} />
      ) : (
        message && <p>{message}</p>
      )}
    </section>
  );
};

export default AddProductForm;
