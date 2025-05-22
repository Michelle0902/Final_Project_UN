// src/components/Signup.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        // Mock signup (replace with actual logic)
        alert('Account created successfully');
        navigate('/login');
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <h1 className="text-3xl font-semibold mb-6">Signup</h1>
            <div className="mb-4">
                <label className="block mb-2">Username</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-2 border rounded" />
            </div>
            <div className="mb-4">
                <label className="block mb-2">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border rounded" />
            </div>
            <div className="mb-4">
                <label className="block mb-2">Confirm Password</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full p-2 border rounded" />
            </div>
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Signup</button>
        </form>
    );
}

export default Signup;