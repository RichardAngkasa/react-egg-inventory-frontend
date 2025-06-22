import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './Navbar';
import Login from './Login';
import DataEntry from './DataEntry';
import StockView from './StockView';

function ProtectedRoute({ children }) {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
}

function App() {
    const [token, setToken] = useState(localStorage.getItem('token') || '');

    const handleLogin = (newToken) => {
        setToken(newToken);
        localStorage.setItem('token', newToken);
    };

    const handleLogout = () => {
        setToken('');
        localStorage.removeItem('token');
    };

    return (
        <Router>
            <div className="container-fluid">
                <Navbar token={token} onLogout={handleLogout} />
                <Routes>
                    <Route path="/login" element={<Login onLogin={handleLogin} />} />
                    <Route
                        path="/data-entry"
                        element={
                            <ProtectedRoute>
                                <DataEntry />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/stock-view"
                        element={
                            <ProtectedRoute>
                                <StockView />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="*" element={<Navigate to={token ? "/data-entry" : "/login"} />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;