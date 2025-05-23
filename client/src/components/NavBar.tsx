import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../store/hooks';
import { useAppDispatch } from '../store/hooks';
import { logout } from '../slices/authSlice';

const NavBar: React.FC = React.memo(() => {
  const { isAuthenticated } = useAuth();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="bg-gray-800 text-white p-4 mb-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-lg font-semibold">Product Review App</Link>
        <div>
          {isAuthenticated ? (
            <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded">Logout</button>
          ) : (
            <>
              <Link to="/login" className="mr-4">Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
});

export default NavBar;