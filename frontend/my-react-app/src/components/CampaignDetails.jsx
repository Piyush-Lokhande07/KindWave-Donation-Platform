import React from 'react';
import PropTypes from 'prop-types';

function CampaignDetails({ campaign }) {
    const handlePayment = () => {
        alert('Payment feature coming soon!');
    };

    return (
        <div>
            <h2>Campaign Details</h2>
            <p><strong>Name:</strong> {campaign.title}</p>
            <p><strong>Description:</strong> {campaign.description}</p>
            <p><strong>Amount:</strong> ${campaign.donation_amount}</p>
            <button onClick={handlePayment}>Donate ${campaign.donation_amount}</button>
        </div>
    );
}

CampaignDetails.propTypes = {
    campaign: PropTypes.shape({
        title: PropTypes.string,
        description: PropTypes.string,
        donation_amount: PropTypes.number,
    }).isRequired,
};

export default CampaignDetails;
