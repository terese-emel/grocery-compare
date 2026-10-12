import { useState } from "react";

function getId(value) {
  if (!value) {
    return null;
  }

  return typeof value === "object" ? value._id : value;
}

function ProductList({ products, onDelete, onUpdate, loggedInUser }) {
  const [editingProductId, setEditingProductId] = useState(null);
  const [editedProductPrice, setEditedProductPrice] = useState("");
  const [savingProductId, setSavingProductId] = useState(null);

  if (!products || products.length === 0) {
    return null;
  }

  const loggedInUserId = getId(loggedInUser?.id);
  const cheapestPrice = products[0].price;

  function startEditing(productId, currentPrice) {
    setEditingProductId(productId);
    setEditedProductPrice(currentPrice);
  }

  function cancelEditing() {
    setEditingProductId(null);
    setEditedProductPrice("");
  }

  async function saveEditedPrice(productId) {
    setSavingProductId(productId);

    try {
      await onUpdate(productId, parseFloat(editedProductPrice));
      cancelEditing();
    } finally {
      setSavingProductId(null);
    }
  }

  return (
    <section>
      <h2>{products[0].name}</h2>

      {products.map((product) => {
        const isCheapest = product.price === cheapestPrice;
        const isEditing = product._id === editingProductId;
        const productOwnerId = getId(product.owner);
        const canManage = loggedInUserId === productOwnerId;

        return (
          <div
            className={`product-card ${isCheapest ? "cheapest" : ""}`}
            key={product._id}
          >
            <span>{product.shop}</span>

            {isEditing && canManage ? (
              <>
                <input
                  type="number"
                  value={editedProductPrice}
                  step="0.01"
                  onChange={(event) =>
                    setEditedProductPrice(event.target.value)
                  }
                />

                <button
                  type="button"
                  onClick={() => saveEditedPrice(product._id)}
                  disabled={savingProductId === product._id}
                >
                  {savingProductId === product._id ? "Saving..." : "Save"}
                </button>

                <button
                  type="button"
                  onClick={cancelEditing}
                  disabled={savingProductId === product._id}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <strong>{product.price} kr</strong>

                {isCheapest && <em>Cheapest</em>}

                {canManage && (
                  <>
                    <button
                      type="button"
                      onClick={() => startEditing(product._id, product.price)}
                    >
                      Edit
                    </button>

                    <button type="button" onClick={() => onDelete(product._id)}>
                      Delete
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        );
      })}
    </section>
  );
}

export default ProductList;
