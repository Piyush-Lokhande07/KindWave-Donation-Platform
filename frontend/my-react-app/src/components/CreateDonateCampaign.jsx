import React, { useState } from 'react';
import axios from 'axios'; // Import axios for making API requests

function CreateCampaign() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        accountNumber: '',
        donationAmount: ''
    });
    const [campaignId, setCampaignId] = useState(null); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/campaigns', formData);
            setCampaignId(response.data.campaignId); // Set the campaign ID from response
            console.log('Campaign Created:', response.data.campaignId);
        } catch (error) {
            console.error('Error creating campaign:', error);
        }
    };

    return (
        <div className="create-campaign">
            <h2>Create a New Donation Campaign</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Campaign Title:</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        className="large-textarea"
                    ></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="accountNumber">Account Number:</label>
                    <input
                        type="text"
                        id="accountNumber"
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="donationAmount">Fixed Donation Amount:</label>
                    <input
                        type="number"
                        id="donationAmount"
                        name="donationAmount"
                        value={formData.donationAmount}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Create Campaign</button>
            </form>
            {campaignId && (
                <div className="campaign-id">
                    <h3>Your Campaign ID: {campaignId}</h3>
                </div>
            )}
        </div>
    );
}

export default CreateCampaign;
