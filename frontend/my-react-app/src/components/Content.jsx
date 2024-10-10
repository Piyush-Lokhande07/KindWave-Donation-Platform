import React, { useState } from 'react';
import Navbar from './Navbar';
import HomeText from './HomeText';
import Footer from './Footer';
import CampaignForm from './CampaignForm';
import CreateCampaign from './CreateDonateCampaign';

function Content() {
    const [currentView, setCurrentView] = useState('home'); 

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
