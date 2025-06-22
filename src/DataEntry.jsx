import { useState } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';
import { useToast } from './ToastContext';

function DataEntry() {
    const [counts, setCounts] = useState({ jumbo: 0, big: 0, medium: 0, small: 0 });
    const [showModal, setShowModal] = useState(false);
    const toast = useToast();

    const adjustCount = (type, delta) => {
        setCounts(prev => ({
            ...prev,
            [type]: Math.max(0, prev[type] + delta)
        }));
    };

    const handleSave = () => setShowModal(true);

    const confirmSave = async () => {
        try {
            const response = await fetch('http://localhost:8080/egg-racks/bulk', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    jumbo_count: counts.jumbo,
                    big_count: counts.big,
                    medium_count: counts.medium,
                    small_count: counts.small
                })
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }
            setCounts({ jumbo: 0, big: 0, medium: 0, small: 0 });
            setShowModal(false);
            toast('Data berhasil disimpan.');
        } catch (error) {
            console.error('Save error:', error);
            toast('Gagal menyimpan', 'danger');
            setShowModal(false);
        }
    };

    const eggTypeMap = {
        jumbo: 'Jumbo',
        big: 'Besar',
        medium: 'Sedang',
        small: 'Kecil'
    };

    return (
        <div className="container py-4">
            <h1 className="text-center mb-4 display-5 fw-bold">📋 Input Data Telur</h1>

            <div className="row mb-2">
                {['jumbo', 'big', 'medium', 'small'].map(type => (
                    <div key={type} className="col-md-6 mb-3">
                        <Card className="text-center fs-4 fw-bold border border-3 border-dark bg-light">
                            <Card.Body className="p-0">
                                <Card.Title className="fs-2 py-3 mb-0 border-bottom border-3 border-dark">
                                    {eggTypeMap[type]}
                                </Card.Title>
                                <div className="d-flex justify-content-center align-items-center gap-4 py-4">
                                    <Button variant="light" onClick={() => adjustCount(type, -1)} className="px-5 py-3 fs-2 border border-dark">−</Button>
                                    <span className="fs-1 px-3">{counts[type]}</span>
                                    <Button variant="light" onClick={() => adjustCount(type, 1)} className="px-5 py-3 fs-2 border border-dark">+</Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                ))}
            </div>

            <div className="text-center">
                <Button
                    variant="primary"
                    size="lg"
                    className="px-5 py-2 fs-4 w-100 w-lg-auto"
                    onClick={handleSave}
                    disabled={counts.jumbo === 0 && counts.big === 0 && counts.medium === 0 && counts.small === 0}
                >
                    💾 Simpan
                </Button>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="fs-4 fw-bold">Konfirmasi Simpan</Modal.Title>
                </Modal.Header>
                <Modal.Body className="fs-5">
                    Apakah kamu yakin ingin menyimpan:<br />
                    <strong>{counts.jumbo}</strong> Telur Jumbo<br />
                    <strong>{counts.big}</strong> Telur Besar<br />
                    <strong>{counts.medium}</strong> Telur Sedang<br />
                    <strong>{counts.small}</strong> Telur Kecil
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)} className="px-4 py-2 fs-5">
                        Batal
                    </Button>
                    <Button variant="primary" onClick={confirmSave} className="px-4 py-2 fs-5">
                        Ya, Simpan
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default DataEntry;
