import { useState, useEffect } from 'react';
import { ListGroup } from 'react-bootstrap';

function StockView() {
    const [racks, setRacks] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8080/egg-racks', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
        .then(res => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        })
        .then(data => setRacks(data))
        .catch(err => {
            console.error('Fetch error:', err);
            alert('Failed to load egg racks: Is the backend running?');
        });
    }, []);

    return (
        <div className="container py-4">
            <h1 className="text-center mb-4">🥚 Egg Rack Stock</h1>
            <ListGroup>
                {racks.length === 0 ? (
                    <ListGroup.Item>No egg racks found.</ListGroup.Item>
                ) : (
                    racks.map(rack => (
                        <ListGroup.Item key={rack.id}>
                            <strong>{rack.egg_type}</strong> (ID: {rack.id}, Added: {new Date(rack.date_created).toLocaleString()})
                        </ListGroup.Item>
                    ))
                )}
            </ListGroup>
        </div>
    );
}

export default StockView;