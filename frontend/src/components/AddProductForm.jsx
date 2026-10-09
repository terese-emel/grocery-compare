import { useState } from "react";
import { createProduct } from "../services/productApi";

const AddProductForm = () => {
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
        unit,
      };

      await createProduct(product);

      setMessage("Product added successfully!");
      setProductName("");
      setShopName("");
      setPrice("");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section>
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="productName">Product name</label>

        <input
          id="productName"
          type="text"
          placeholder="Product name"
          value={productName}
          onChange={(event) => setProductName(event.target.value)}
        />

        <label htmlFor="shop">Shop Name</label>

        <input
          id="shop"
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
        <button type="button" onClick={resetForm} disabled={saving}>
          Reset
        </button>
      </form>
      {message && <p>{message}</p>}
    </section>
  );
};

export default AddProductForm;
