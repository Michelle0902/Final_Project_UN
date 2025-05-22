import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loadProducts, filterProducts, fetchByCategory } from '../slices/productSlice';
import { Link } from 'react-router-dom';

const ProductList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { products, loading, currentPage, totalPages } = useAppSelector((state) => state.products);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (search.trim()) {
      dispatch(filterProducts({ page, search }));
    } else if (category !== 'All') {
      dispatch(fetchByCategory({ page, category }));
    } else {
      dispatch(loadProducts({ page }));
    }
  }, [dispatch, page, search, category]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
    setSearch('');
    setPage(1);
  };

  return (
    <div className="px-4 py-6 max-w-6xl mx-auto">
      <Link to="/create-product" className="mb-4 inline-block bg-green-600 text-white px-4 py-2 rounded">
        ➕ Create Product
      </Link>

      <h2 className="text-3xl font-bold mb-4 text-center text-blue-700">Available Products</h2>

      <form onSubmit={handleSearch} className="mb-4 flex gap-2 justify-center">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-full max-w-md"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Search
        </button>
      </form>

      {/* 🔽 Category Filter */}
      <div className="mb-6 flex justify-center">
        <select
          value={category}
          onChange={handleCategoryChange}
          className="border px-3 py-2 rounded"
        >
          <option value="All">All Categories</option>
          <option value="Phone">Phone</option>
          <option value="ipad">ipad</option>
          <option value="General">General</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center">Loading products...</div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow hover:shadow-xl transition duration-200 p-6">
                <Link to={`/products/${product.id}`}>
                  <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <p className="text-lg font-bold text-green-600">${product.price.toFixed(2)}</p>
                </Link>
                <Link to={`/products/${product.id}/edit`} className="text-blue-600 underline mt-2 inline-block">
                  <button className="px-3 py-2 bg-gray-200 rounded disabled:opacity-50 font-bold">✏️ Edit</button>
                </Link>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-8 gap-4">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-gray-600 self-center">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductList;
