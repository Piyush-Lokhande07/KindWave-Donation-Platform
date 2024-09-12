import React, { useState } from 'react';
import Navbar from './Navbar';
import HomeText from './HomeText';
import Footer from './Footer';
import CampaignForm from './CampaignForm';
import CreateCampaign from './CreateDonateCampaign'; // Ensure this component exists

function Content() {
    const [currentView, setCurrentView] = useState('home'); // default view is home

    const handleNavClick = (view) => {
        setCurrentView(view);
    };

    return (
        <div className="content">
            <Navbar onNavClick={handleNavClick} />
            <div className="mid-content">
                {currentView === 'home' && <HomeText />}
                {currentView === 'donate' && <CampaignForm />}
                {currentView === 'createCampaign' && <CreateCampaign />}
            </div>
            <Footer />
        </div>
    );
}

export default Content;
