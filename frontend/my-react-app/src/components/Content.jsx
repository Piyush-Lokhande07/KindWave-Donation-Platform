import React from 'react';
import { useAuth } from './AuthContext'; // Importing the useAuth hook

function Content() {
    const { logout } = useAuth(); // Destructuring logout from useAuth

    function handleLogOut(e) {
        e.preventDefault();
        logout(); 
    }

    return (
        <div>
            <button className='btn1 lout' onClick={handleLogOut}>
                Log Out
            </button>
        </div>
    );
}

export default Content;
