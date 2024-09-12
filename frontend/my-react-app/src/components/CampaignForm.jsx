import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

function CampaignForm() {
    const [campaignId, setCampaignId] = useState('');
    const [campaign, setCampaign] = useState(null);  // Stores the campaign details
    const [error, setError] = useState(null);  // Stores any error messages

    const handleInputChange = (e) => {
        setCampaignId(e.target.value);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setError(null);  // Clear previous errors
        setCampaign(null);  // Reset campaign details before making a request
        
        try {
            const response = await axios.get(`http://localhost:3000/api/campaigns/${campaignId}`);
            setCampaign(response.data);
        } catch (err) {
            setError('Campaign ID does not exist. Please enter a valid Campaign ID.');
        }
    };

    return (
        <div className="campaign-form">
            <h2>Enter Campaign ID</h2>
            <form onSubmit={handleFormSubmit}>
                <label htmlFor="campaignId">Campaign ID:</label>
                <input
                    type="text"
                    id="campaignId"
                    name="campaignId"
                    value={campaignId}
                    onChange={handleInputChange}
                    required
                />
                <button type="submit">Submit</button>
            </form>
            {campaign && (
                <div className="campaign-details">
                    <h2>Campaign Details</h2>
                    <p><strong>Name:</strong> {campaign.title}</p>
                    <p><strong>Description:</strong> {campaign.description}</p>
                    <p><strong>Amount:</strong> ${campaign.donation_amount}</p>
                    <button onClick={() => alert('Payment feature coming soon!')}>
                        Donate ${campaign.donation_amount}
                    </button>
                </div>
            )}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}

CampaignForm.propTypes = {
    // No props needed anymore
};

export default CampaignForm;
