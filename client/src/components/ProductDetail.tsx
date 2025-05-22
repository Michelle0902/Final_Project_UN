// src/components/ProductDetail.tsx
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { useEffect } from 'react';
import { getProductById } from '../slices/productSlice';
import { loadReviews, deleteReview } from '../slices/reviewSlice';

function ProductDetail() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const productId = Number(id);

  const { selectedProduct, loading: productLoading } = useAppSelector((state) => state.products);
  const reviews = useAppSelector((state) =>
    state.reviews.reviews.filter((r) => r.productId === productId)
  );

  const handleDelete = (reviewId: number) => {
    if (confirm('Are you sure you want to delete this review?')) {
      dispatch(deleteReview({ productId, reviewId }));
    }
  };

  // Average rating from reviews
  const averageRating = reviews.length
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : 0;

  useEffect(() => {
    if (productId) {
      dispatch(getProductById(productId));
      dispatch(loadReviews(productId));
    }
  }, [dispatch, productId]);

  if (productLoading) return <div className="text-center mt-10">⏳ Loading product...</div>;
  if (!selectedProduct) return <div className="text-center mt-10 text-red-600">❌ Product not found</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 bg-white shadow rounded-lg">
      <h1 className="text-3xl font-bold mb-4 text-blue-700">{selectedProduct.name}</h1>
      <p className="text-gray-700 mb-3">{selectedProduct.description}</p>
      <p className="text-lg font-semibold text-green-600 mb-2">${selectedProduct.price.toFixed(2)}</p>

      <div className="flex items-center gap-2 mb-6">
        <div className="text-yellow-500 text-lg">
          {'★'.repeat(Math.round(averageRating))}
          {'☆'.repeat(5 - Math.round(averageRating))}
        </div>
        <span className="text-sm text-gray-500">
          {averageRating.toFixed(1)} / 5
        </span>
      </div>

      <Link
        to={`/create-review/${selectedProduct.id}`}
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
      >
        ➕ Add Review
      </Link>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          <ul className="space-y-4">
            {reviews
              .slice()
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((review) => (
                <li key={review.id} className="bg-gray-50 p-4 rounded shadow">
                  <p className="text-sm text-gray-600 mb-1">
                    {new Date(review.date).toLocaleDateString()}
                  </p>
                  <p className="font-semibold">{review.author}</p>
                  <p className="text-yellow-500 mb-1">
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                  </p>
                  <p>{review.comment}</p>
                  <p className="text-sm text-purple-600 italic">
                    Sentiment: {review.sentiment || 'Unknown'}
                  </p>
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="mt-2 text-sm text-red-600 hover:underline"
                  >
                    🗑️ Delete
                  </button>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;
