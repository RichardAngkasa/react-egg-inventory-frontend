import { Link, useLocation } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { BoxArrowRight, PencilFill, CardList } from 'react-bootstrap-icons';

function Navbar({ token, onLogout }) {
    const location = useLocation();
    if (!token) return null;

    return (
        <>
            {/* Mobile Top Header */}
            <div className="d-lg-none bg-dark text-light d-flex justify-content-between align-items-center px-3 py-4 sticky-top border-bottom border-light">
                <h5 className="mb-0 fw-bold fs-3 text-warning">Catat Telur</h5>
                <Button variant="outline-danger" size="md" onClick={onLogout} className='p'>
                    <BoxArrowRight size={24} />
                </Button>
            </div>

            {/* Desktop Sidebar */}
            <div
                className="d-none d-lg-flex flex-column bg-dark text-light vh-100 position-fixed top-0 start-0"
                style={{ width: '220px', zIndex: 1000 }}
            >
                <div className="text-center py-4 border-bottom border-warning">
                    <h4 className="fw-bold text-warning mb-0">Catat Telur</h4>
                </div>
                <div className="d-flex flex-column gap-3 px-3 mt-4">
                    <Link
                        to="/data-entry"
                        className={`btn ${location.pathname === '/data-entry' ? 'btn-warning text-dark' : 'btn-secondary'} fw-bold text-start`}
                    >
                        📥 Input Data Telur
                    </Link>
                    <Link
                        to="/stock-view"
                        className={`btn ${location.pathname === '/stock-view' ? 'btn-warning text-dark' : 'btn-secondary'} fw-bold text-start`}
                    >
                        📦 Tampilkan Stoks
                    </Link>
                </div>
                <div className="mt-auto p-3">
                    <Button variant="outline-danger" onClick={onLogout} className="w-100 fw-bold">
                        🔒 Logout
                    </Button>
                </div>
            </div>

            {/* Mobile Bottom Nav */}
            <div
                className="d-lg-none fixed-bottom bg-dark text-light border-top border-light d-flex justify-content-around py-3 px-3 gap-2"
                style={{ zIndex: 1000 }}
            >
                <Link to="/data-entry" className={`btn text-center text-decoration-none w-100 ${location.pathname === '/data-entry' ? 'btn-warning' : 'btn-secondary'}`}>
                    <PencilFill size={24} />
                    <div className="small">Input</div>
                </Link>
                <Link to="/stock-view" className={`btn text-center text-decoration-none w-100 ${location.pathname === '/stock-view' ? 'btn-warning' : 'btn-secondary'}`}>
                    <CardList size={24} />
                    <div className="small">Stok</div>
                </Link>
            </div>
        </>
    );
}

export default Navbar;
