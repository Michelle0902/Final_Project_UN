// src/components/ProductEditor.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { editProduct } from '../slices/productSlice';

const ProductEditor: React.FC = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const product = useAppSelector((state) => state.products.products.find(p => p.id === Number(id)));

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        description: product.description,
        category: product.category,
        price: product.price.toString(),
      });
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.description || !form.category || !form.price) {
      setError('All fields are required');
      return;
    }
    const priceNum = parseFloat(form.price);
    if (isNaN(priceNum)) {
      setError('Price must be a number');
      return;
    }

    await dispatch(editProduct({
      id: Number(id),
      data: {
        name: form.name,
        description: form.description,
        category: form.category,
        price: priceNum,
      },
    }));

    navigate('/');
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="border px-3 py-2 w-full" />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="border px-3 py-2 w-full" />
        <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="border px-3 py-2 w-full" />
        <input name="price" value={form.price} onChange={handleChange} placeholder="Price" className="border px-3 py-2 w-full" />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save Changes</button>
      </form>
    </div>
  );
};

export default ProductEditor;
