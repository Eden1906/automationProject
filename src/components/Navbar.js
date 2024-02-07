import '../App.css'

const NavBar = () => {

    const handlePasswordSubmit = () => {
        const password = prompt('enter password')
        if (password !== null) {
            if (password === '1234') {
                window.location.href = '/Seller'
            }
            else {
                alert('incorrect password')
            }
        }
    }

    return (
        <nav className = "navbar">
        <ul>
            <li><a href="/Products">products</a></li>
            <li>
                <button 
                style={{
                backgroundColor: 'transparent',
                color: 'black',
                fontWeight: 'bold',
                border: 'none',
                padding: 0,
                textAlign: 'left',
                textDecoration: 'underline',
                display: 'inline',
                fontSize: '16px',
                cursor: 'pointer',
            }}
                onClick={handlePasswordSubmit}> sign in as seller </button>
            </li>
        </ul>
        </nav>
    )
}

export default NavBar
