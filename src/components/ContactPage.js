import React, { useState } from 'react';
import styled, { createGlobalStyle, keyframes, css } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faMapMarkerAlt, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

// --- API URL (Kept for completeness, though functional API call is mocked) ---
const API_URL = 'http://localhost:5000/api/messages'; 

// --- DESIGN TOKENS (Matching Homepage Light Theme) ---
const NEON_COLOR = '#00e0b3'; 
const PRIMARY_ACCENT_LIGHT = '#1ddc9f';
const PRIMARY_BG_LIGHT = '#FFFFFF'; 
const SECONDARY_BG_LIGHT = '#F8F8F8'; 
const TERTIARY_BG_LIGHT = '#EEEEEE'; 
const TEXT_DARK = '#333333'; 
const TEXT_MUTED = '#666666'; 
const BORDER_LIGHT = '#DDDDDD'; 

// --- ANIMATION KEYFRAMES ---
const slideInUp = keyframes`
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
`;


// --- GLOBAL STYLES ---
const GlobalStyle = createGlobalStyle`
    body {
        margin: 0;
        font-family: 'Poppins', sans-serif;
        background-color: ${PRIMARY_BG_LIGHT};
        color: ${TEXT_DARK};
        min-height: 100vh;
    }
    .neon-text-shadow {
        text-shadow: 0 0 3px ${NEON_COLOR}, 0 0 8px rgba(0, 224, 179, 0.3);
    }
    .animate-in {
        opacity: 0;
        animation: ${slideInUp} 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    }
`;

// --- General Styled Components ---
const ContactContainer = styled.div`
    width: 100%;
    min-height: 100vh;
    background-color: ${PRIMARY_BG_LIGHT};
    padding-top: 80px; 
    text-align: center;
`;
const Header = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 50px;
    background-color: ${PRIMARY_BG_LIGHT};
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    box-sizing: border-box;
    z-index: 1000;
    border-bottom: 1px solid ${BORDER_LIGHT};
`;
const Logo = styled.h1`
    color: ${NEON_COLOR}; 
    font-size: 1.8em;
    margin: 0;
    cursor: pointer;
    ${css`text-shadow: 0 0 3px ${NEON_COLOR}, 0 0 8px rgba(0, 224, 179, 0.3);`}
`;
const NavItem = styled.a`
    color: ${TEXT_DARK};
    text-decoration: none;
    padding: 0 15px;
    font-size: 0.95em;
    transition: color 0.3s ease;
    cursor: pointer;
    
    &:hover {
        color: ${NEON_COLOR};
    }
`;
const Section = styled.section`
    padding: 100px 50px;
    max-width: 1000px;
    margin: 0 auto;
    text-align: center;
`;

// --- Contact Specific Styling ---
const MainTitle = styled.h1`
    font-size: 3.5em;
    color: ${TEXT_DARK};
    margin-bottom: 10px;
    span {
        color: ${NEON_COLOR};
    }
`;
const SubText = styled.p`
    color: ${TEXT_MUTED};
    margin-bottom: 60px;
    font-size: 1.15em;
`;
const ContactGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    gap: 60px;
    text-align: left;
    margin-top: 50px;
    
    /* Light Theme Styling for the main contact block */
    background-color: ${PRIMARY_BG_LIGHT};
    border: 1px solid ${BORDER_LIGHT};
    padding: 40px;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08); /* Professional shadow */
    
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;
const GetInTouch = styled.div`
    padding-right: 20px;
    border-right: 1px solid ${BORDER_LIGHT}; /* Separator line for desktop */
    
    @media (max-width: 768px) {
        border-right: none;
        padding-right: 0;
        border-bottom: 1px solid ${BORDER_LIGHT};
        padding-bottom: 30px;
        margin-bottom: 30px;
    }
    
    h2 {
        color: ${TEXT_DARK};
        font-size: 1.8em;
        margin-bottom: 15px;
    }
    p {
        color: ${TEXT_MUTED};
        font-size: 1em;
        margin-bottom: 30px;
        line-height: 1.6;
    }
`;
const ContactInfoItem = styled.div`
    display: flex;
    align-items: flex-start;
    margin-bottom: 25px;
    
    .icon-box {
        color: ${NEON_COLOR};
        font-size: 1.5em; /* Larger icon */
        margin-right: 20px;
        filter: drop-shadow(0 0 1px ${NEON_COLOR});
    }
    
    span {
        color: ${TEXT_DARK};
        font-weight: 700;
        display: block;
        font-size: 1em;
    }
    small {
        color: ${TEXT_MUTED};
        display: block;
        font-size: 0.9em;
        margin-top: 4px;
    }
`;
const ContactForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 18px;
    padding: 0 10px;
`;
const FormInput = styled.input`
    background-color: ${SECONDARY_BG_LIGHT}; /* Light input background */
    color: ${TEXT_DARK};
    border: 1px solid ${BORDER_LIGHT};
    padding: 16px;
    border-radius: 8px;
    font-size: 1em;
    outline: none;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
    
    &:focus {
        border-color: ${NEON_COLOR};
        box-shadow: 0 0 5px rgba(0, 224, 179, 0.5);
    }
`;
const FormTextArea = styled.textarea`
    background-color: ${SECONDARY_BG_LIGHT}; /* Light input background */
    color: ${TEXT_DARK};
    border: 1px solid ${BORDER_LIGHT};
    padding: 16px;
    border-radius: 8px;
    font-size: 1em;
    resize: vertical;
    min-height: 150px; /* Taller text area */
    outline: none;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
    
    &:focus {
        border-color: ${NEON_COLOR};
        box-shadow: 0 0 5px rgba(0, 224, 179, 0.5);
    }
`;

const SubmitButton = styled.button`
    background-color: ${NEON_COLOR};
    color: ${PRIMARY_BG_LIGHT};
    border: none;
    padding: 15px 20px;
    border-radius: 8px;
    font-size: 1.1em;
    font-weight: 700;
    cursor: pointer;
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0, 224, 179, 0.3);
    
    &:hover {
        background-color: ${PRIMARY_ACCENT_LIGHT};
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0, 224, 179, 0.4);
    }
    
    svg {
        margin-left: 10px;
        transition: transform 0.3s ease;
    }
    &:hover svg {
        transform: translateX(5px);
    }
`;

const FormMessage = styled.p`
    font-size: 1em;
    font-weight: 600;
    text-align: center;
    margin-top: 15px;
    color: ${props => (props.type === 'error' ? '#ff6b6b' : NEON_COLOR)};
`;

const Footer = styled.footer`
    background-color: ${SECONDARY_BG_LIGHT};
    padding: 30px 50px;
    text-align: center;
    color: ${TEXT_MUTED};
    border-top: 1px solid ${BORDER_LIGHT};
    position: relative;
    z-index: 5;
`;


// --- ContactPage Component ---
const ContactPage = ({ 
    onNavigate,
    generalData
}) => {
    const [formData, setFormData] = useState({ name: '', email: '', mobile: '', message: '' });
    const [formMessage, setFormMessage] = useState({ type: '', text: '' });

    const safeGeneralData = generalData || {};
    const defaultPhoneNumber = '+91 95976 46460'; 

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormMessage({ type: 'info', text: 'Sending...' });
        
        // --- Mock API Call (Since actual API call relies on external backend) ---
        try {
            // Replace with actual axios.post(API_URL, formData) in a real environment
            // const res = await axios.post(API_URL, formData); 
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
            
            setFormMessage({ type: 'success', text: 'Success! Your message has been sent. We will get back to you shortly.' });
            setFormData({ name: '', email: '', mobile: '', message: '' }); 
        } catch (err) {
            console.error("Form submit error:", err);
            setFormMessage({ type: 'error', text: 'An error occurred. Please verify all fields and try again.' });
        }
    };

    return (
        <ContactContainer>
            <GlobalStyle />
            {/* --- HEADER --- */}
            <Header>
                <Logo onClick={() => onNavigate('home')} className="neon-text-shadow">NEXORA</Logo>
                <div>
                    <NavItem onClick={() => onNavigate('home')}>Home</NavItem>
                    <NavItem onClick={() => onNavigate('about')}>About</NavItem>
                    <NavItem onClick={() => onNavigate('services')}>Services</NavItem>
                    <NavItem onClick={() => onNavigate('projects')}>Projects</NavItem>
                    <NavItem onClick={() => onNavigate('blog')}>Blog</NavItem>
                    <NavItem onClick={() => onNavigate('contact')} style={{ color: NEON_COLOR }}>Contact</NavItem>
                </div>
            </Header>

            {/* --- MAIN CONTACT SECTION --- */}
            <Section style={{ paddingTop: '150px' }}>
                <MainTitle className="animate-in" style={{ animationDelay: '0s' }}>Let's <span>Collaborate</span></MainTitle>
                <SubText className="animate-in" style={{ animationDelay: '0.1s' }}>Have a project in mind? Get in touch with us and let's create something amazing together.</SubText>

                <ContactGrid className="animate-in" style={{ animationDelay: '0.3s' }}>
                    
                    {/* LEFT SIDEBAR: Contact Info (Company Side) */}
                    <GetInTouch>
                        <h2>Get In Touch</h2>
                        <p>Whether you need design, development, or AI solutions, we're here to help. Reach out and let us know about your project.</p>

                        <ContactInfoItem>
                            <FontAwesomeIcon icon={faEnvelope} className="icon-box" />
                            <div>
                                <span>Email</span>
                                <small>{safeGeneralData.email || 'info@nexora.com'}</small>
                            </div>
                        </ContactInfoItem>
                        
                        <ContactInfoItem>
                            <FontAwesomeIcon icon={faPhone} className="icon-box" />
                            <div>
                                <span>Phone</span>
                                <small>{safeGeneralData.phone || defaultPhoneNumber}</small> 
                            </div>
                        </ContactInfoItem>

                        <ContactInfoItem>
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="icon-box" />
                            <div>
                                <span>Location</span>
                                <small>{safeGeneralData.location || 'Coimbatore, India'}</small>
                            </div>
                        </ContactInfoItem>
                    </GetInTouch>

                    {/* RIGHT SIDE: Contact Form */}
                    <ContactForm onSubmit={handleSubmit}>
                        <FormInput 
                            type="text" 
                            name="name" 
                            placeholder="Your Name" 
                            value={formData.name} 
                            onChange={handleChange} 
                            required 
                        />
                        <FormInput 
                            type="email" 
                            name="email" 
                            placeholder="Your Email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            required 
                        />
                        <FormInput 
                            type="tel" 
                            name="mobile" 
                            placeholder="Mobile Number" 
                            value={formData.mobile} 
                            onChange={handleChange} 
                            required 
                        />
                        <FormTextArea 
                            name="message" 
                            placeholder="Tell us about your project..." 
                            value={formData.message} 
                            onChange={handleChange} 
                            required 
                        />
                        <SubmitButton type="submit">
                            Send Message <FontAwesomeIcon icon={faPaperPlane} />
                        </SubmitButton>
                        {formMessage.text && (
                            <FormMessage type={formMessage.type}>
                                {formMessage.text}
                            </FormMessage> 
                        )}
                    </ContactForm>
                </ContactGrid>
            </Section>

            {/* --- FOOTER --- */}
            <Footer style={{ marginTop: '100px' }}>
                &copy; 2025 Crafted with care by NEXORA Team, JJ College.
            </Footer>
        </ContactContainer>
    );
};

export default ContactPage;