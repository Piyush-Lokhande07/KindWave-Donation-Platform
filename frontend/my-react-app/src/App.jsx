import React from 'react';
import RegisterAndLogin from './components/RegisterAndLogin';
import Content from './components/Content';
import { useAuth } from './components/AuthContext'

function App() {
    const { isAuthenticated } = useAuth();

    return (
        <div>
            {isAuthenticated ? <Content /> : <RegisterAndLogin />}
        </div>
    );
}

export default App;
