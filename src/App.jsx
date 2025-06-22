import { useState, useEffect } from 'react';
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
    const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setViewportWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogin = (newToken) => {
        setToken(newToken);
        localStorage.setItem('token', newToken);
    };

    const handleLogout = () => {
        setToken('');
        localStorage.removeItem('token');
    };

    const isDesktop = viewportWidth >= 992;

    return (
        <Router>
            <Navbar token={token} onLogout={handleLogout} />
            <div
                style={{
                    marginLeft: isDesktop && token ? '220px' : 0,
                    paddingBottom: !isDesktop && token ? '70px' : 0,
                }}
            >
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
