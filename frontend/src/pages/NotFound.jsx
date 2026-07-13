import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="container mt-5 text-center text-white-override">
            <h1 className="display-1 fw-bold">404</h1>
            <h2 className="mb-4">Page Not Found</h2>
            <p className="lead mb-5">
                The page you are looking for doesn't exist or has been moved.
            </p>
            <Link to="/" className="btn btn-primary btn-lg">
                Return Home
            </Link>
        </div>
    );
};

export default NotFound;
