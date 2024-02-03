import React, { useState } from 'react'
import '../App.css'

const NavBar = () => {

    const [showModal, setShowModal] = useState(false)
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    
    const handleSignInClick = () => {
        setShowModal(true)
    }
    const handleModalClose = () => {
        setShowModal(false)
        setPassword('')
        setError('')
    }
    const handlePasswordSubmit = () => {
        if (password === '1234') {
            window.location.href = '/Seller'
        }
        else {
            setError('incorrect password')
        }
    }

    return (
        <nav className = "navbar">
        <ul>
            <li><a href="/Products">products</a></li>
            <li><a href="/Home">home</a></li>
            <li>
                <button onClick={handleSignInClick}>Sign in as seller</button>
            </li>
        </ul>
        {showModal && (
            <div className='modal'>
                <div className='modal-content'>
                    <span className="close" onClick={handleModalClose}>&times;</span>
                    <h2> enter password</h2>
                    <input
                        type = "password"
                        value = {password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button onClick={handlePasswordSubmit}>Submit</button>
                    {error && <p className='error'>{error}</p>}
                </div>
            </div>
        )}
        </nav>
    )
}

export default NavBar
