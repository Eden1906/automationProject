import React from 'react';
import '../App.css';

const NavBar = () => {
    const handlePasswordSubmit = () => {
        const password = prompt('Enter password');
        if (password !== null) {
            if (password === '1234') {
                window.location.href = '/Seller';
            } else {
                alert('Incorrect password');
            }
        }
    };

    const buttonStyle = {
        backgroundColor: 'transparent',
        color: 'black',
        fontWeight: 'bold',
        border: 'none',
        padding: '5px 10px',
        textDecoration: 'underline',
        fontSize: '18px', 
        cursor: 'pointer',
    };

    return (
        <nav className="navbar">
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', alignItems: 'center' }}>
                <li style={{ marginRight: '20px' }}>
                    <a href="/Products" style={{ textDecoration: 'underline', color: 'black', fontSize: '18px', fontWeight: 'bold' }}>
                        Products
                    </a>
                </li>
                <li>
                    <button style={buttonStyle} onClick={handlePasswordSubmit}>
                        Sign in as <span style={{ textDecoration: 'underline' }}>seller</span>
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;
