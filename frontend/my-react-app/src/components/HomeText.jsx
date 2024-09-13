import React from "react";

function HomeText(){
    return(
        <div className="text-container">
             <div className='text'>
            <img src="/donation-img.webp" alt="donation img" />
                <h1>Welcome to My Donation Platform!</h1>
                    <p> 
                            Welcome to our Donation Platform, a web application designed to facilitate seamless donations to organizations and causes that matter. Whether you're supporting charities, schools, or any community-driven initiatives, our platform simplifies the process for donors and organizations alike.
                            <br />
                            <br />
                            Features for Donors:
                            Secure Login: Users can sign in with their email to access a personalized dashboard of donation opportunities.
                            Easy Payments: Donations can be made using a variety of secure payment methods, including bank transfers, UPI (like Google Pay and PhonePe), and credit/debit cards.
                            Transparent Process: Donors receive real-time updates on their contributions, ensuring full transparency throughout the donation process.
                            <br />
                            <br />
                            Features for Organizations:
                            Create Donation Campaigns: Organizations can easily create donation campaigns by providing essential details like:
                            Campaign Title: A short, clear title for the donation campaign.
                            Account Information: Bank details where the donations will be transferred.
                            Fixed Donation Amount: Set a fixed amount for donations to ensure uniformity.
                            Each organization has complete control over their campaign, allowing them to manage donations with transparency and security.
                            Why Use Our Platform?
                            User-friendly Interface: Simple and intuitive design, making it easy for users to navigate.
                            Security: We use advanced security measures to ensure your payments and personal information are safe.
                            Impactful: Whether you're donating or running a campaign, our platform helps you make a tangible difference in the world by connecting people to causes.
                    </p>
                    
            </div>
        </div>
       
    )
}
export default HomeText;