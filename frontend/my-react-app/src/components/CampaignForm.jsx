import React, { useState } from 'react';
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
            {!campaign ? (
                <>
                <div className='form-body2'>
                <h2>Search Campaign to Donate</h2>
                    <form onSubmit={handleFormSubmit}>
                        <div className='lab'>Enter Campaign ID:</div>
                        <input
                            placeholder='Ex.266'
                            type="text"
                            id="campaignId"
                            name="campaignId"
                            value={campaignId}
                            onChange={handleInputChange}
                            required
                        />
                        <button className='btn1 create-camp-btn ' type="submit">Submit</button>
                    </form>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    </div>
                </>
                
                    
            ) : (
                <div className="campaign-details">
                    {/* <h2>Campaign Details</h2> */}
                    <p className='c-title'>{campaign.title}</p>
                    <p className='description'> {campaign.description}</p>
                    {/* <p><strong>Amount:</strong> ${campaign.donation_amount}</p> */}
                    <button className='btn1 pay' onClick={() => alert('Payment feature coming soon!')}>
                        Donate ₹{campaign.donation_amount}
                    </button>
                </div>
            )}
        </div>
    );
}

export default CampaignForm;
