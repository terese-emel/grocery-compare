const SearchForm = ({ productName, setProductName, handleSubmit, loading }) => {
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="product">Product name</label>

      <input
        id="product"
        type="text"
        placeholder="Try milk"
        value={productName}
        onChange={(event) => setProductName(event.target.value)}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Searching..." : "Search"}
      </button>
    </form>
  );
};

export default SearchForm;
