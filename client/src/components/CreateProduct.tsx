import { useAppDispatch } from '../store/hooks';
import { addProduct } from '../slices/productSlice';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateProduct() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const parsedPrice = parseFloat(price);

 try {
  await dispatch(
    addProduct({ name, description, price: parseFloat(price), category })
  ).unwrap();

  navigate('/');
} catch (err: any) {
    console.log('FULL AXIOS ERROR:', err);
        if (err?.errors) {
            setErrors(err.errors); 
        } else {
            console.error('Other error:', err);
            alert(err.message || 'Something went wrong');
        }
    }
};

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <h1 className="text-3xl font-semibold mb-6">Create Product</h1>

      {errors.global && <p className="text-red-600 mb-4">{errors.global}</p>}

      <div className="mb-4">
        <label className="block mb-1">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>

      <div className="mb-4">
        <label className="block mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description}</p>
        )}
      </div>

      <div className="mb-4">
  <label className="block mb-1">Category</label>
  <select
    value={category}
    onChange={(e) => setCategory(e.target.value)}
    className="w-full p-2 border rounded"
  >
    <option value="">-- Select Category --</option>
    <option value="Phone">Phone</option>
    <option value="ipad">ipad</option>
    <option value="General">General</option>
  </select>
  {errors.category && (
    <p className="text-red-500 text-sm">{errors.category}</p>
  )}
</div>


      <div className="mb-4">
        <label className="block mb-1">Price</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-2 border rounded"
          step="0.01"
        />
        {errors.price && (
          <p className="text-red-500 text-sm">{errors.price}</p>
        )}
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Create
      </button>
    </form>
  );
}

export default CreateProduct;
