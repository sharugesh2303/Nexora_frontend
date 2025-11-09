import React from 'react';
import styled, { createGlobalStyle, keyframes, css } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faDesktop, faRobot, faFilePdf, faCommentDots, 
    faBullhorn, faCode, faBrain, faVideo, faShieldHalved, 
    faFileContract, faQuestionCircle
} from '@fortawesome/free-solid-svg-icons';

// --- DESIGN TOKENS (Matching Homepage Light Theme) ---
const NEON_COLOR = '#00e0b3'; 
const PRIMARY_ACCENT_LIGHT = '#1ddc9f'; // A slightly darker neon green for contrast
const PRIMARY_BG_LIGHT = '#FFFFFF'; 
const SECONDARY_BG_LIGHT = '#F8F8F8'; 
const TERTIARY_BG_LIGHT = '#EEEEEE'; 
const TEXT_DARK = '#333333'; 
const TEXT_MUTED = '#666666'; 
const BORDER_LIGHT = '#DDDDDD'; 

// --- ANIMATION KEYFRAMES ---
const slideInUp = keyframes`
    from { opacity: 0; transform: translateY(50px); }
    to { opacity: 1; transform: translateY(0); }
`;
const pulseBorder = keyframes`
    0% { box-shadow: 0 0 0 rgba(0, 224, 179, 0); }
    50% { box-shadow: 0 0 15px rgba(0, 224, 179, 0.4); }
    100% { box-shadow: 0 0 0 rgba(0, 224, 179, 0); }
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
    .animate-in {
        opacity: 0;
        animation: ${slideInUp} 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; /* Smooth, noticeable easing */
    }
    .neon-text-shadow {
        text-shadow: 0 0 3px ${NEON_COLOR}, 0 0 8px rgba(0, 224, 179, 0.3);
    }
`;

// --- General Styled Components ---
const ServicesContainer = styled.div`
    width: 100%;
    min-height: 100vh;
    background-color: ${PRIMARY_BG_LIGHT}; 
    padding-top: 80px; 
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
    padding: 0 15px; /* Added padding for separation */
    font-size: 0.95em;
    transition: color 0.3s ease;
    cursor: pointer;
    
    &:hover {
        color: ${NEON_COLOR};
    }
`;

const Section = styled.section`
    padding: 100px 50px; 
    max-width: 1200px;
    margin: 0 auto;
    text-align: center;
    position: relative;
    z-index: 5;
    background-color: ${PRIMARY_BG_LIGHT};
    
    @media (max-width: 768px) {
        padding: 60px 20px;
    }
`;

const SectionHeader = styled.h2`
    font-size: 3.5em; /* Bigger title */
    color: ${TEXT_DARK}; 
    margin-bottom: 15px;
    span {
        color: ${NEON_COLOR};
        filter: drop-shadow(0 0 2px ${NEON_COLOR});
    }
    @media (max-width: 768px) {
        font-size: 2.5em;
    }
`;
const SectionSubtitle = styled.p`
    color: ${TEXT_MUTED}; 
    margin-bottom: 80px; /* More space below subtitle */
    max-width: 700px;
    margin: 0 auto 80px auto;
    font-size: 1.15em;
`;

// --- Service Grid and Card Styling ---
const ServiceGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); 
    gap: 40px 30px;
    margin-top: 50px;
`;
const ServiceCard = styled.div`
    background-color: ${PRIMARY_BG_LIGHT}; 
    padding: 35px;
    border-radius: 15px; 
    text-align: left;
    border: 1px solid ${BORDER_LIGHT}; 
    transition: transform 0.4s cubic-bezier(0.19, 1, 0.22, 1), box-shadow 0.4s ease, border-color 0.4s;
    min-height: 250px;
    position: relative;
    overflow: hidden;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);

    /* Initial pulse animation on load */
    animation: ${pulseBorder} 2s ease-out 1s 1; 
    animation-fill-mode: forwards;
    
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, transparent 90%, ${NEON_COLOR}20);
        opacity: 0;
        transition: opacity 0.4s ease;
    }

    &:hover {
        transform: translateY(-12px); /* Higher lift */
        border-color: ${NEON_COLOR};
        box-shadow: 0 25px 40px rgba(0, 0, 0, 0.1); 
        &::before {
            opacity: 1;
        }
    }

    .icon-box {
        display: inline-block;
        color: ${NEON_COLOR};
        font-size: 2.5em; /* Larger icons */
        margin-bottom: 20px;
        filter: drop-shadow(0 0 5px rgba(0, 224, 179, 0.5));
    }

    h3 {
        color: ${TEXT_DARK}; 
        font-size: 1.4em; /* Larger title */
        margin: 0 0 5px 0;
    }
    
    p {
        color: ${TEXT_MUTED}; 
        font-size: 1em;
        line-height: 1.6;
        margin-bottom: 30px;
        min-height: 50px; 
    }
`;

const GetQuoteButton = styled.button`
    background-color: transparent;
    color: ${NEON_COLOR};
    border: 2px solid ${NEON_COLOR};
    padding: 10px 20px;
    border-radius: 8px;
    font-size: 1em;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &::after {
        content: ' →'; 
        transition: transform 0.2s ease;
    }
    &:hover {
        background-color: ${NEON_COLOR};
        color: ${PRIMARY_BG_LIGHT};
        transform: translateY(-2px);
    }
`;

// --- Final CTA Section Styling ---
const FinalCtaSection = styled(Section)`
    background-color: ${TERTIARY_BG_LIGHT}; 
    margin-top: 100px;
    padding: 80px 50px;
    border-radius: 20px; /* More defined radius */
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05); /* Soft shadow for lift */
    
    h2 {
        font-size: 2.8em;
        color: ${TEXT_DARK}; 
        margin-bottom: 15px;
    }
    p {
        color: ${TEXT_MUTED};
        margin-bottom: 30px;
        font-size: 1.1em;
    }
`;

const SubscribeButton = styled.button`
    background-color: ${NEON_COLOR};
    color: ${PRIMARY_BG_LIGHT};
    border: none;
    padding: 15px 40px; /* Larger button */
    border-radius: 10px;
    font-size: 1.2em;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 6px 20px rgba(0, 224, 179, 0.4);

    &::after {
        content: ' →'; 
        transition: transform 0.2s ease;
    }
    &:hover {
        background-color: ${PRIMARY_ACCENT_LIGHT};
        transform: translateY(-4px); /* Higher lift on hover */
    }
`;

const Footer = styled.footer`
    background-color: ${SECONDARY_BG_LIGHT}; 
    padding: 30px 50px;
    text-align: center;
    color: ${TEXT_MUTED};
    border-top: 1px solid ${BORDER_LIGHT};
`;

// --- Icon Map ---
const iconMap = {
    faBullhorn: faBullhorn, faCode: faCode, faRobot: faRobot, faFileContract: faFileContract,
    faCommentDots: faCommentDots, faDesktop: faDesktop, faShieldHalved: faShieldHalved,
    faBrain: faBrain, faVideo: faVideo, faFilePdf: faFilePdf, default: faQuestionCircle
};
const getServiceIcon = (iconName) => iconMap[iconName] || iconMap.default;


// --- ServicesPage Component ---
const ServicesPage = ({ 
    onNavigate,
    servicesData
}) => {

    const getServiceData = () => {
        if (servicesData && servicesData.length > 0) return servicesData;

        // Default structure if servicesData is empty/undefined
        return [
            { _id: '1', title: 'Web Development', desc: 'Creation of responsive, high-performance websites and web applications.', icon: 'faCode' },
            { _id: '2', title: 'AI & Automation', desc: 'Implementing custom AI solutions and automated workflows for business efficiency.', icon: 'faRobot' },
            { _id: '3', title: 'Content Strategy', desc: 'Crafting compelling, SEO-optimized content that drives engagement and conversions.', icon: 'faCommentDots' },
            { _id: '4', title: 'UI/UX Design', desc: 'Designing intuitive, attractive user interfaces for optimal customer experiences.', icon: 'faDesktop' },
            { _id: '5', title: 'Branding Strategy', desc: 'Developing a cohesive brand identity, voice, and visual system.', icon: 'faBullhorn' },
            { _id: '6', title: 'Security Audits', desc: 'Professional security assessments to protect your digital assets.', icon: 'faShieldHalved' },
        ];
    };

    const safeServicesData = getServiceData();
    
    return (
        <ServicesContainer>
            <GlobalStyle />
            
            {/* --- HEADER --- */}
            <Header>
                <Logo onClick={() => onNavigate('home')} className="neon-text-shadow">NEXORA</Logo>
                <div>
                    <NavItem onClick={() => onNavigate('home')}>Home</NavItem>
                    <NavItem onClick={() => onNavigate('about')}>About</NavItem>
                    <NavItem onClick={() => onNavigate('services')} style={{ color: NEON_COLOR }}>Services</NavItem>
                    <NavItem onClick={() => onNavigate('projects')}>Projects</NavItem>
                    <NavItem onClick={() => onNavigate('blog')}>Blog</NavItem>
                    <NavItem onClick={() => onNavigate('contact')}>Contact</NavItem>
                </div>
            </Header>

            {/* --- INTRO SECTION --- */}
            <Section style={{ paddingTop: '150px' }} className="animate-in">
                <SectionHeader>Our <span>Services</span></SectionHeader>
                <SectionSubtitle>Comprehensive creative and technology solutions provided with professional excellence and student-driven innovation.</SectionSubtitle>
                
                {/* --- SERVICE GRID --- */}
                <ServiceGrid>
                    {safeServicesData.map((service, index) => (
                        <ServiceCard 
                            key={service._id}
                            className="animate-in"
                            // Staggered animation delay for dynamic appearance
                            style={{ animationDelay: `${0.12 * (index) + 0.3}s` }}
                        >
                            <div className="icon-box">
                                <FontAwesomeIcon icon={getServiceIcon(service.icon)} />
                            </div>
                            <h3>{service.title}</h3>
                            <p>{service.desc}</p>
                            <GetQuoteButton onClick={() => onNavigate('contact')}>Get Quote</GetQuoteButton>
                        </ServiceCard>
                    ))}
                </ServiceGrid>
            </Section>

            {/* --- FINAL CTA SECTION --- */}
            <FinalCtaSection 
                className="animate-in" 
                // Delay this section to appear after all cards have loaded
                style={{ animationDelay: `${0.12 * safeServicesData.length + 0.5}s` }}
            >
                <h2>Ready to Bring Your Vision to Life?</h2>
                <p>Let us discuss your project and unlock its full potential. Contact us for a personalized quote.</p>
                <SubscribeButton onClick={() => onNavigate('contact')}>Let's Collaborate</SubscribeButton>
            </FinalCtaSection>

            {/* --- FOOTER --- */}
            <Footer>
                &copy; 2025 Crafted with care by NEXORA Team, JJ College.
            </Footer>
        </ServicesContainer>
    );
};

export default ServicesPage;