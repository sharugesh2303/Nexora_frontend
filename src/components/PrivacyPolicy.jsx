import React from 'react';
import styled from 'styled-components'; // FIX: Removed createGlobalStyle
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faArrowLeft, faLock, faUsersSlash, faUserCheck, faEnvelope
} from '@fortawesome/free-solid-svg-icons';

// --- Styled Components (Tailored to the dark theme) ---

const PolicyContainer = styled.div`
    min-height: 100vh;
    width: 100%;
    background-color: #0d0d0d;
    color: #e0e0e0;
    padding: 80px 50px;
    box-sizing: border-box;
`;

const ContentWrapper = styled.div`
    max-width: 900px;
    margin: 0 auto;
    text-align: left;
`;

const Header = styled.div`
    border-bottom: 2px solid #00e0b3;
    padding-bottom: 20px;
    margin-bottom: 40px;
    position: relative;
`;

const Title = styled.h1`
    font-size: 3em;
    color: white;
    margin: 0;
`;

const Subtitle = styled.p`
    color: #aaaaaa;
    font-size: 1.1em;
    margin-top: 10px;
`;

const BackButton = styled.button`
    position: absolute;
    top: -40px; /* Position above the header */
    left: 0;
    background: none;
    border: none;
    color: #00e0b3;
    font-size: 1.1em;
    font-weight: 600;
    cursor: pointer;
    padding: 5px 10px;
    transition: color 0.3s ease;

    &:hover {
        color: white;
    }
`;

const PolicyBlock = styled.div`
    background-color: #000000;
    border: 1px solid #1a1a1a;
    padding: 25px;
    margin-bottom: 20px;
    border-radius: 8px;
    display: flex;
    align-items: flex-start;
`;

const IconWrapper = styled.div`
    color: #00e0b3;
    font-size: 1.5em;
    margin-right: 20px;
    padding: 5px;
    border: 1px solid #00e0b3;
    border-radius: 50%;
`;

const BlockContent = styled.div`
    h3 {
        color: white;
        font-size: 1.2em;
        margin-top: 0;
        margin-bottom: 8px;
    }
    p {
        color: #cccccc;
        font-size: 0.95em;
        line-height: 1.5;
    }
    a {
        color: #00e0b3;
        text-decoration: none;
        display: block;
        margin-top: 5px;
    }
`;

const FooterBox = styled.div`
    text-align: center;
    border: 1px solid #00e0b3;
    padding: 15px;
    margin-top: 30px;
    border-radius: 5px;
    color: #cccccc;
    font-size: 0.9em;
`;

// --- Policy Data ---
const policyData = [
    {
        title: "Data Protection",
        icon: faLock,
        content: "We are committed to protecting your personal information. All data collected through our services is stored securely using industry-standard encryption methods. We implement SSL encryption across our platform to ensure your data remains confidential during transmission."
    },
    {
        title: "No Third-Party Sharing",
        icon: faUsersSlash,
        content: "Your personal data will never be shared with third parties without your explicit consent. We do not sell, rent, or trade your information to any external organizations. Your trust is our priority, and we maintain strict confidentiality of all client information."
    },
    {
        title: "Your Control",
        icon: faUserCheck,
        content: "You have full control over your personal data. You can request access to your information, request corrections, or request deletion at any time. We respect your right to privacy and will respond to all data-related requests within 48 hours."
    },
    {
        title: "Contact Us",
        icon: faEnvelope,
        content: `For any privacy-related questions or concerns, please contact us:`
    }
];


const PrivacyPolicy = () => {
    const navigate = useNavigate();
    
    // We'll assume the general contact info (email/phone) is hardcoded or fetched elsewhere
    const contactInfo = {
        email: "nexora.crew@gmail.com",
        phone: "+91 95976 46460"
    };

    return (
        <PolicyContainer>
            <ContentWrapper>
                <Header>
                    {/* BACK OPTION */}
                    <BackButton onClick={() => navigate(-1)}>
                        <FontAwesomeIcon icon={faArrowLeft} style={{marginRight: '10px'}} />
                        Back
                    </BackButton>
                    
                    <Title>Privacy Policy</Title>
                    <Subtitle>We protect your personal data with the highest standards of security</Subtitle>
                </Header>

                {policyData.map((block, index) => (
                    <PolicyBlock key={index}>
                        <IconWrapper>
                            <FontAwesomeIcon icon={block.icon} />
                        </IconWrapper>
                        <BlockContent>
                            <h3>{block.title}</h3>
                            <p>{block.content}</p>
                            {block.title === "Contact Us" && (
                                <>
                                    <p style={{marginTop: '15px'}}>Email: <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a></p>
                                    <p>Phone: <a href={`tel:${contactInfo.phone}`}>{contactInfo.phone}</a></p>
                                </>
                            )}
                        </BlockContent>
                    </PolicyBlock>
                ))}

                <FooterBox>
                    Last Updated: January 2025 | © 2025 NEXORA All Rights Reserved.
                </FooterBox>
                
            </ContentWrapper>
        </PolicyContainer>
    );
};

export default PrivacyPolicy;