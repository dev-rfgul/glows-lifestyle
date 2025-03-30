import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, role, requiredRole }) => {
    if (!role || role !== requiredRole) {
        return <Navigate to="/" />;
    }
    return children;
};

export default ProtectedRoute;
