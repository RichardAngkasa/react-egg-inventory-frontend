import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form } from 'react-bootstrap';

function StockView() {
    // Notebook for egg racks, filter choice, and sort order
    const [racks, setRacks] = useState([]);
    const [filterType, setFilterType] = useState('All'); // Start with all eggs
    const [sortOrder, setSortOrder] = useState('Terbaru'); // Start with newest
    const [displayRacks, setDisplayRacks] = useState([]); // Racks to show

    // Fetch racks when the page loads
    useEffect(() => {
        fetch('http://localhost:8080/egg-racks', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
        .then(res => {
            if (!res.ok) throw new Error('Network error');
            return res.json();
        })
        .then(data => setRacks(Array.isArray(data) ? data : []))
        .catch(err => {
            console.error('Fetch error:', err);
            alert('Tidak bisa mengambil data telur.');
        });
    }, []);

    // Update displayed racks when filter or sort changes
    useEffect(() => {
        let filteredRacks = racks;
        // Filter by egg type if not 'All'
        if (filterType !== 'All') {
            filteredRacks = racks.filter(rack => rack.egg_type.toLowerCase() === filterType.toLowerCase());
        }
        // Sort by date
        const sortedRacks = [...filteredRacks].sort((a, b) => {
            const dateA = new Date(a.date_created);
            const dateB = new Date(b.date_created);
            return sortOrder === 'Terbaru' ? dateB - dateA : dateA - dateB;
        });
        setDisplayRacks(sortedRacks);
    }, [racks, filterType, sortOrder]);

    // Labels for egg types in Indonesian
    const typeLabelMap = {
        jumbo: 'Jumbo',
        big: 'Besar',
        medium: 'Sedang',
        small: 'Kecil',
    };

    // Count racks by type for the cards
    const countByType = (type) =>
        Array.isArray(racks)
            ? racks.filter(r => r.egg_type?.toLowerCase() === type.toLowerCase()).length
            : 0;

    // Format date in Indonesian
    const formatDate = (isoDate) => {
        const d = new Date(isoDate);
        const date = d.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
        const time = d.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
        });
        return `<strong>${date}</strong> at ${time}`;
    };

    return (
        <div className="container py-4">
            <h1 className="text-center mb-4 display-5 fw-bold text-dark">📦 STOK TELUR</h1>

            {/* Summary Cards */}
            <div className="row text-center mb-2">
                {['Jumbo', 'Big', 'Medium', 'Small'].map((type, idx) => (
                    <div className="col-6 col-lg-3 mb-3" key={type}>
                        <div className={`card text-white fs-4 fw-bold ${['bg-danger', 'bg-primary', 'bg-success', 'bg-secondary text-dark'][idx]}`}>
                            <div className="card-body">
                                🥚 {typeLabelMap[type]}
                                <div className="fs-1 mt-2">{countByType(type)}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Table or Empty Message */}
            {displayRacks.length === 0 ? (
                <div className="alert alert-danger fs-4 fw-bold text-center">
                    ⚠️ BELUM ADA DATA MASUK
                </div>
            ) : (
                <>
                    <div
                    className="d-flex justify-content-end align-items-center gap-2 gap-md-3 bg-secondary-subtle p-2 ps-md-3 ms-auto"
                    style={{ width: 'fit-content' }}
                >

                    <div className="fw-bold fs-6 text text-dark">Filter dan Urutkan</div>
                    <div className="d-flex flex-md-row justify-content-end gap-2">
                        <Form.Select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="fs-7 w-100 w-md-auto"
                        >
                            <option value="All">Semua Jenis</option>
                            {['jumbo', 'big', 'medium', 'small'].map(type => (
                                <option key={type} value={type}>{typeLabelMap[type]}</option>
                            ))}
                        </Form.Select>
                        <Form.Select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="fs-7 w-100 w-md-auto"
                        >
                            <option value="Terbaru">Terbaru</option>
                            <option value="Terlama">Terlama</option>
                        </Form.Select>
                    </div>
                </div>
                <div className="table-responsive">
                    <table className="table table-bordered table-striped fs-6">
                        <thead className="table-dark text-left">
                            <tr>
                                <th>TANGGAL MASUK</th>
                                <th>JENIS TELUR</th>
                                <th>PENANGGUNG JAWAB</th>
                                <th>ID</th>
                            </tr>
                        </thead>
                        <tbody className="text-left">
                            {displayRacks.map(rack => (
                                <tr key={rack.id}>
                                    <td dangerouslySetInnerHTML={{ __html: formatDate(rack.date_created) }} />
                                    <td>{typeLabelMap[rack.egg_type] || rack.egg_type}</td>
                                    <td>{rack.user}</td>
                                    <td>{rack.id.slice(0, 8)}</td> {/* Shortened UUID */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                </>
            )}
        </div>
    );
}

export default StockView;