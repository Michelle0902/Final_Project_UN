import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loadReviews, submitReview } from '../slices/reviewSlice';

const CreateReview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);
  const dispatch = useAppDispatch();
  const navigate = useNavigate(); // 👈
  const reviews = useAppSelector((state) => state.reviews.reviews);
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState('');

  const existing = reviews.find((r) => r.productId === productId && r.author === 'currentUser'); // TODO: replace 'currentUser'

  useEffect(() => {
    dispatch(loadReviews(productId));
  }, [dispatch, productId]);

  useEffect(() => {
    if (existing) {
      setAuthor(existing.author);
      setRating(existing.rating);
      setComment(existing.comment);
    }
  }, [existing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author || !comment || rating === 0) {
      alert('All fields are required');
      return;
    }

    await dispatch(
      submitReview({
        productId,
        reviewId: existing?.id,
        review: { author, rating, comment },
      })
    );

    navigate(-1); // 👈 Go back
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">{existing ? 'Edit' : 'Create'} Review</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Your Name"
          className="w-full border rounded px-3 py-2"
          required
        />
        <input
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          type="number"
          placeholder="Rating (1-5)"
          className="w-full border rounded px-3 py-2"
          min={1}
          max={5}
          required
        />
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Your Comment"
          className="w-full border rounded px-3 py-2"
          required
        ></textarea>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {existing ? 'Update' : 'Submit'} Review
        </button>
      </form>
    </div>
  );
};

export default CreateReview;
