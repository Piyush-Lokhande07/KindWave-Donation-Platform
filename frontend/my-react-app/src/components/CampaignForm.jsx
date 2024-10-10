import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CampaignForm() {
    const [campaignId, setCampaignId] = useState('');
    const [campaign, setCampaign] = useState(null);  
    const [error, setError] = useState(null);  
    const [amount, setAmount] = useState(0);  
    const currency = "INR";

    const handleInputChange = (e) => {
        setCampaignId(e.target.value);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setError(null);  
        setCampaign(null);  
        
        try {
            const response = await axios.get(`http://localhost:3000/api/campaigns/${campaignId}`);
            const campaignData = response.data;
            setCampaign(campaignData);
           
            setAmount(Number(campaignData.donation_amount) || 0);  
        } catch (err) {
            setError('Campaign ID does not exist. Please enter a valid Campaign ID.');
        }
    };

    const handlePayment = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:3000/order", {
                method: "POST",
                body: JSON.stringify({
                    amount:amount * 100,
                    currency,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }

            const order = await response.json();
            console.log(order);

            var options = {
                "key": "rzp_test_TBBRXgPa4yzuqK", 
                amount, 
                currency,
                "name": "Piyush Donation Platform", 
                "description": "Test Transaction",
                "image": "https://example.com/your_logo",
                "order_id": order.id, 
                "handler": async function (response){
                    const body = {
                        ...response,
                    };

                    const validateRes= await fetch("http://localhost:5000/order/validate",
                    {
                        method:"POST",
                        body: JSON.stringify(body),
                        headers:{
                            "Content-Type":"application/json",
                        }

                    });

                },
                "prefill": {
                    "name": "Piyush Lokhande",
                    "email": "gaurav.kumar@example.com", 
                    "contact": "9000090000"  
                },
                "notes": {
                    "address": "Razorpay Corporate Office"
                },
                "theme": {
                    "color": "#3399cc"
                }
            };
            var rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', function (response){
                    alert(response.error.code);
                    alert(response.error.description);
                    alert(response.error.source);
                    alert(response.error.step);
                    alert(response.error.reason);
                    alert(response.error.metadata.order_id);
                    alert(response.error.metadata.payment_id);
            });
            rzp1.open();
        } catch (error) {
            console.error("Payment error:", error.message);
            alert(`Payment error: ${error.message}`);
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
                    <p className='c-title'>{campaign.title}</p>
                    <p className='description'> {campaign.description}</p>
                    <button className='btn1 pay' onClick={handlePayment}>
                        Donate ₹{amount}
                    </button>
                </div>
            )}
        </div>
    );
}

export default CampaignForm;
