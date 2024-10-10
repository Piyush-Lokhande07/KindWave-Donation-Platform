

import React from 'react';
import { useAuth } from './AuthContext'; 

function Navbar({ onNavClick }) {
    const { logout } = useAuth(); 

    function handleLogOut(e) {
        e.preventDefault();
        logout(); 
    }
    return (
        <nav>
            <button className=' con donate' onClick={() => onNavClick('donate')}>Donate</button>
            <button className='con camp' onClick={() => onNavClick('createCampaign')}>Create Donation Campaign</button>
            <button className=' con home' onClick={() => onNavClick('home')}>Home</button>
            <button className=' lout con' onClick={handleLogOut}>Logout</button>
        </nav>
    );
}

export default Navbar;
