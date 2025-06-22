import { Link } from 'react-router-dom';
import { Navbar as BSNavbar, Nav, Button } from 'react-bootstrap';

function Navbar({ token, onLogout }) {
    if (!token) return null;

    return (
        <BSNavbar bg="light" expand="lg" className="mb-4">
            <BSNavbar.Brand as={Link} to="/data-entry">Egg Rack Manager</BSNavbar.Brand>
            <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
            <BSNavbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link as={Link} to="/data-entry">Data Entry</Nav.Link>
                    <Nav.Link as={Link} to="/stock-view">Stock View</Nav.Link>
                </Nav>
                <Button variant="outline-danger" onClick={onLogout}>Logout</Button>
            </BSNavbar.Collapse>
        </BSNavbar>
    );
}

export default Navbar;