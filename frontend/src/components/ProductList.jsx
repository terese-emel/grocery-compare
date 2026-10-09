const ProductList = ({ products }) => {
  if (!products || products.length === 0) {
    return null;
  }

  const cheapestPrice = products[0].price;

  return (
    <section>
      {products.length > 0 && (
        <div>
          <h2>{products[0].name}</h2>
          {products.map((product) => {
            const isCheapest = product.price === cheapestPrice;

            return (
              <p key={product._id}>
                {product.shop}: {product.price} kr
                {isCheapest && " — Cheapest"}
              </p>
            );
          })}
        </div>
      )}
      {products.length === 0 && (
        <div>
          <p>No products found.</p>
        </div>
      )}
    </section>
  );
};

export default ProductList;
