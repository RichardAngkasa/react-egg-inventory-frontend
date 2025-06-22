import { useState } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';

function DataEntry() {
    const [counts, setCounts] = useState({ big: 0, medium: 0, small: 0 });
    const [showModal, setShowModal] = useState(false);

    const adjustCount = (type, delta) => {
        setCounts(prev => ({
            ...prev,
            [type]: Math.max(0, prev[type] + delta)
        }));
    };

    const handleSave = async () => {
        setShowModal(true);
    };

    const confirmSave = async () => {
        try {
            const response = await fetch('http://localhost:8080/egg-racks/bulk', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    big_count: counts.big,
                    medium_count: counts.medium,
                    small_count: counts.small
                })
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }
            setCounts({ big: 0, medium: 0, small: 0 });
            setShowModal(false);
            alert('Egg racks saved successfully!');
        } catch (error) {
            console.error('Save error:', error);
            alert(`Failed to save egg racks: ${error.message}`);
            setShowModal(false);
        }
    };

    return (
        <div className="container py-4">
            <h1 className="text-center mb-4">🥚 Egg Rack Data Entry</h1>
            <div className="row g-4">
                {['big', 'medium', 'small'].map(type => (
                    <div key={type} className="col-md-4">
                        <Card className="text-center">
                            <Card.Body>
                                <Card.Title>{type.charAt(0).toUpperCase() + type.slice(1)} Eggs</Card.Title>
                                <div className="d-flex justify-content-center align-items-center mb-3">
                                    <Button variant="outline-primary" onClick={() => adjustCount(type, -1)}>-</Button>
                                    <span className="mx-3">{counts[type]}</span>
                                    <Button variant="outline-primary" onClick={() => adjustCount(type, 1)}>+</Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                ))}
            </div>
            <div className="d-flex justify-content-center mt-4">
                <Button variant="primary" onClick={handleSave} disabled={counts.big === 0 && counts.medium === 0 && counts.small === 0}>
                    Save
                </Button>
            </div>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Save</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to save {counts.big} Big, {counts.medium} Medium, and {counts.small} Small batches?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={confirmSave}>Confirm</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default DataEntry;