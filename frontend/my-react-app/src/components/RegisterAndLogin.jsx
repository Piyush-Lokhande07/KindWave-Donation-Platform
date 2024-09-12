import React, { useState } from "react";
import axios from 'axios';
import '../styles/App.css';
import { useAuth } from "./AuthContext";

function RegisterAndLogin() {
    const { login } = useAuth();
    const [btnName, setBtnName] = useState('Register');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();

        const url = btnName === 'Register' ? 'http://localhost:3000/register' : 'http://localhost:3000/login';

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            const data = {
                username: username,
                password: password
            };
        
            await axios.post(url, data, config);
        
            if (btnName === 'Register') {
                setUsername('');
                setPassword('');
                setErrorMessage('Registration successful. Please log in.');
                setBtnName('Login');
            } else {
                login(); 
            }
        } catch (error) {
            console.error('Error:', error.message);
            setErrorMessage(error.response ? error.response.data : 'An unexpected error occurred.');
        }
    }

    function toggleButton(e) {
        e.preventDefault();
        setErrorMessage('');
        setBtnName(btnName === 'Register' ? 'Login' : 'Register');
    }

    function handleGoogleLogin() {
        window.location.href = 'http://localhost:3000/auth/google';
    }

    return (
        <div className="Reg">
            <form className="form" onSubmit={handleSubmit}>
                <input
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                />
                <input
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                />
                <button className="btn1" type="submit">{btnName}</button>

                <button  onClick={handleGoogleLogin} className="btn ggl">
                    Login with Google
                </button>

                {errorMessage && <div className="error">{errorMessage}</div>}
                {btnName === 'Register' ? (
                    <div>
                        Already registered?
                        <button
                            onClick={toggleButton}
                            className="btn"
                        >
                            Login here
                        </button>
                    </div>
                ) : (
                    <div>
                        <button
                            onClick={toggleButton}
                            className="btn"
                        >
                            Register here
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
}

export default RegisterAndLogin;
