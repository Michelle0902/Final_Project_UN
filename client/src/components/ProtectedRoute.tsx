// src/components/ProtectedRoute.tsx
import { JSX } from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }: { children: JSX.Element }) {
    const token = localStorage.getItem('token');
    const isAuthenticated = !!token;

    return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
