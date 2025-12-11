// src/components/ProgressPage.jsx
import React from 'react';
import styled, { createGlobalStyle, keyframes, css } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBullseye,
    faTriangleExclamation,
    faBolt,
    faUserShield,
    faCalendarCheck,
    faEnvelope,
    faPhone,
    faDownload
} from '@fortawesome/free-solid-svg-icons';
import {
    faInstagram,
    faLinkedinIn,
} from '@fortawesome/free-brands-svg-icons';
import {
    faLocationDot
} from '@fortawesome/free-solid-svg-icons';

/* ---------------- THEME ---------------- */
const NEON_COLOR = '#00e0b3';
const TEXT_LIGHT = '#E6F0F2';
const TEXT_MUTED = '#9AA8B8';
const DARK_BLUE = '#050817'; 
const HIGHLIGHT_BLUE = '#526ed5'; 

/* ---------------- GLOBAL STYLE ---------------- */
const GlobalStyle = createGlobalStyle`
    html, body, #root { height: 100%; }

    body {
        margin: 0;
        font-family: 'Poppins', sans-serif;
        background: radial-gradient(circle at 20% 10%, #0a132f 0%, #050817 40%, #01030a 100%);
        color: ${TEXT_LIGHT};
        overflow-x: hidden;
    }
`;

/* ---------------- ANIMATIONS ---------------- */
const glowPulse = keyframes`
  0% { box-shadow: 0 0 0px rgba(34,197,94,0.0); }
  50% { box-shadow: 0 0 28px rgba(34,197,94,0.35); }
  100% { box-shadow: 0 0 0px rgba(34,197,94,0.0); }
`;

/* ---------------- HEADER ---------------- */
const Header = styled.header`
    display: flex;
    align-items: center;
    gap: 40px;
    padding: 14px 48px;
    position: sticky;
    top: 0;
    width: 100%;
    background: rgba(7,16,38,0.65);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255,255,255,0.04);
    z-index: 10;

    @media (max-width: 780px) {
        padding: 12px 20px;
        gap: 18px;
    }
`;

const Logo = styled.h1`
    color: ${NEON_COLOR};
    font-size: 1.8rem;
    font-weight: 800;
    cursor: pointer;
    letter-spacing: 1px;
    text-shadow: 0 0 12px ${NEON_COLOR};
`;

const NavGroup = styled.div`
    display: flex;
    gap: 22px;
    align-items: center;
    margin-right: auto;

    span {
        color: ${TEXT_MUTED};
        cursor: pointer;
        font-weight: 500;
        position: relative;
        transition: 0.3s ease;
        padding: 6px 4px;

        &:hover {
            color: ${NEON_COLOR};
            text-shadow: 0 0 10px ${NEON_COLOR};
        }

        &:after {
            content: '';
            position: absolute;
            left: 0; bottom: -2px;
            width: 0;
            height: 2px;
            background: ${NEON_COLOR};
            transition: 0.3s;
            border-radius: 4px;
        }
        &:hover:after {
            width: 100%;
        }
    }
`;

/* ---------------- PAGE LAYOUT ---------------- */
const PageWrapper = styled.div`
    position: relative;
    min-height: 100vh;
    display: flex;
    flex-direction: column; 
`;

const MainContentArea = styled.div`
    flex-grow: 1; 
`;

const ContentWrapper = styled.div`
    max-width: 1180px;
    margin: 0 auto;
    padding: 140px 24px 80px;

    @media (max-width: 780px) {
        padding: 120px 20px 60px;
    }
`;

const Shell = styled.div`
    border-radius: 32px;
    padding: 48px 40px 56px;
    background: radial-gradient(circle at top left, #020617, #020617 55%, #020617 100%);
    border: 1px solid rgba(148, 163, 184, 0.18);
    box-shadow: 0 24px 80px rgba(15, 23, 42, 0.9);
    backdrop-filter: blur(24px);

    @media (max-width: 768px) {
        padding: 32px 20px 40px;
        border-radius: 24px;
    }
`;

const Title = styled.h1`
    text-align: center;
    font-size: 34px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    margin: 0 0 40px;
    color: #e5e7eb;

    span {
        color: #facc15;
    }

    @media (max-width: 640px) {
        font-size: 26px;
        letter-spacing: 0.12em;
    }
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 28px;
    margin-top: 40px; 

    @media (max-width: 900px) {
        grid-template-columns: 1fr;
    }
`;

const BaseBox = styled.div`
    border-radius: 28px;
    padding: 26px 30px;
    background: radial-gradient(circle at top left, #020617, #020617 55%, #020617 100%);
    border: 1px solid rgba(15, 23, 42, 1);
    position: relative;
    overflow: hidden;
    transition: transform 0.16s ease-out, border-color 0.16s ease-out;

    &:before {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: inherit;
        background: radial-gradient(circle at top left, rgba(248, 250, 252, 0.05), transparent 60%);
        opacity: 0;
        transition: opacity 0.22s ease-out;
    }

    &:hover:before {
        opacity: 1;
    }

    &:hover {
        transform: translateY(-4px);
    }
`;

const StrengthBox = styled(BaseBox)`
    border-left: 3px solid #22c55e;
    animation: ${glowPulse} 4s ease-in-out infinite;
`;
const WeaknessBox = styled(BaseBox)`
    border-left: 3px solid #ef4444;
`;
const OpportunityBox = styled(BaseBox)`
    border-left: 3px solid #3b82f6;
`;
const ThreatBox = styled(BaseBox)`
    border-left: 3px solid #eab308;
`;

const HeaderRow = styled.div`
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 12px;
`;

const IconCircle = styled.div`
    width: 32px;
    height: 32px;
    border-radius: 999px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;

    ${({ variant }) =>
        variant === "strength" &&
        css`
          border: 1px solid rgba(34, 197, 94, 0.4);
          background: radial-gradient(circle, rgba(34, 197, 94, 0.08), transparent);
          color: #4ade80;
        `}
    ${({ variant }) =>
        variant === "weakness" &&
        css`
          border: 1px solid rgba(248, 113, 113, 0.5);
          background: radial-gradient(circle, rgba(248, 113, 113, 0.08), transparent);
          color: #f97373;
        `}
    ${({ variant }) =>
        variant === "opportunity" &&
        css`
          border: 1px solid rgba(59, 130, 246, 0.5);
          background: radial-gradient(circle, rgba(59, 130, 246, 0.08), transparent);
          color: #60a5fa;
        `}
    ${({ variant }) =>
        variant === "threat" &&
        css`
          border: 1px solid rgba(234, 179, 8, 0.5);
          background: radial-gradient(circle, rgba(234, 179, 8, 0.08), transparent);
          color: #facc15;
        `}
`;

const BoxTitle = styled.h2`
    font-size: 18px;
    font-weight: 700;
    color: #f9fafb;
    margin: 0;
`;

const BulletList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 8px 0 0;

    li {
        font-size: 14px;
        color: #cbd5f5;
        margin-bottom: 6px;
        position: relative;
        padding-left: 16px;
    }

    li:before {
        content: "•";
        position: absolute;
        left: 0;
        top: -1px;
        color: #64748b;
    }
`;

/* ---------------- AGILE WORKFLOW STYLES ---------------- */

const WorkflowContainer = styled.div`
    text-align: center;
    margin-bottom: 60px;
    padding: 30px 20px;
    background: rgba(0,0,0,0.2); 
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.05);

    @media (max-width: 768px) {
        padding: 20px 10px;
    }
`;

const WorkflowTitle = styled.h2`
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 8px;
    letter-spacing: 0.05em;

    span {
        color: ${HIGHLIGHT_BLUE};
    }
`;

const WorkflowSubtitle = styled.p`
    color: ${TEXT_MUTED};
    font-size: 1rem;
    margin-bottom: 40px;
`;

const ProcessBar = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    max-width: 900px;
    margin: 0 auto 30px;
    padding: 0 10px;
`;

const Line = styled.div`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    height: 4px;
    background: #1e293b; 
    width: 100%;
    z-index: 1;
    border-radius: 2px;
`;

const ActiveLine = styled.div`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    height: 4px;
    background: ${HIGHLIGHT_BLUE}; 
    width: 50%; 
    z-index: 2;
    border-radius: 2px;
    left: 0;
    max-width: calc(100% - 10px); 
`;

const Step = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100px;
    cursor: default;
    z-index: 3;
    transition: transform 0.2s ease;
    
    @media (max-width: 768px) {
        width: 80px;
    }
    @media (max-width: 500px) {
        width: 60px;
    }
`;

const Circle = styled.div`
    width: 16px;
    height: 16px;
    border-radius: 50%;
    margin-bottom: 10px;
    border: 2px solid ${({ active }) => (active ? HIGHLIGHT_BLUE : '#475569')};
    background: ${({ active }) => (active ? DARK_BLUE : 'transparent')};
    transition: all 0.3s ease;
`;

const StepLabel = styled.span`
    font-size: 0.8rem;
    font-weight: 600;
    color: ${({ active }) => (active ? TEXT_LIGHT : TEXT_MUTED)};
    text-align: center;
    transition: color 0.3s ease;
`;

const ProcessButton = styled.button`
    background-color: #1e293b;
    color: ${TEXT_LIGHT};
    border: 1px solid #475569;
    padding: 10px 25px;
    border-radius: 8px;
    font-weight: 500;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    margin-top: 20px;
    display: inline-flex;
    align-items: center;
    gap: 8px;

    &:hover {
        background-color: #273449;
        border-color: ${HIGHLIGHT_BLUE};
        color: ${HIGHLIGHT_BLUE};
        box-shadow: 0 0 10px rgba(82, 110, 213, 0.3);
    }
`;

// Helper Component for the Agile Workflow
const AgileWorkflow = () => {
    const steps = [
        "Inquiry", "Analysis", "Proposal", "Team Alloc",
        "Development", "Review", "Feedback", "Delivery"
    ];
    
    return (
        <WorkflowContainer>
            <WorkflowTitle>
                AGILE <span>WORKFLOW</span>
            </WorkflowTitle>
            <WorkflowSubtitle>
                A streamlined, transparent process designed for speed and quality.
            </WorkflowSubtitle>

            <ProcessBar>
                <Line />
                <ActiveLine /> 
                {steps.map((step, index) => {
                    const isActive = index <= 4; 
                    return (
                        <Step key={step}>
                            <Circle active={isActive} />
                            <StepLabel active={isActive}>{step}</StepLabel>
                        </Step>
                    );
                })}
            </ProcessBar>

            <ProcessButton onClick={() => alert('Downloading Process PDF...')}>
                <FontAwesomeIcon icon={faDownload} />
                Download Process PDF
            </ProcessButton>
        </WorkflowContainer>
    );
};

/* ---------------- CAREERS / FOOTER SECTION STYLES ---------------- */

const FooterContainer = styled.footer`
    width: 100%;
    padding: 60px 48px;
    background-color: ${DARK_BLUE}; 
    border-top: 1px solid rgba(255, 255, 255, 0.04);

    @media (max-width: 780px) {
        padding: 40px 20px;
    }
`;

const FooterContentWrapper = styled.div`
    max-width: 1180px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1.5fr; 
    gap: 40px;

    @media (max-width: 1024px) {
        grid-template-columns: 1fr 1fr;
    }

    @media (max-width: 640px) {
        grid-template-columns: 1fr;
    }
`;

const FooterSection = styled.div`
    padding-right: 20px; 
`;

const SectionTitle = styled.h3`
    font-size: 1.1rem;
    color: ${TEXT_LIGHT};
    margin-bottom: 20px;
    font-weight: 600;
    letter-spacing: 0.05em;
`;

const CareersSection = styled.div`
    grid-column: 1 / -1; 
    display: grid;
    grid-template-columns: 1.5fr 3fr;
    gap: 40px;
    margin-bottom: 40px;
    padding-bottom: 40px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);

    @media (max-width: 1024px) {
        grid-template-columns: 1fr;
        gap: 30px;
        padding-bottom: 30px;
    }
`;

const CareersTextGroup = styled.div`
    h2 {
        font-size: 2.2rem;
        font-weight: 800;
        margin-top: 0;
        margin-bottom: 15px;
        span {
            color: ${NEON_COLOR};
        }

        @media (max-width: 640px) {
            font-size: 1.8rem;
        }
    }

    p {
        color: ${TEXT_MUTED};
        font-size: 0.95rem;
        line-height: 1.6;
        margin-bottom: 25px;
    }

    ul {
        list-style: none;
        padding: 0;
        margin-bottom: 30px;

        li {
            display: flex;
            align-items: center;
            color: ${TEXT_LIGHT};
            font-weight: 500;
            margin-bottom: 10px;
            font-size: 0.95rem;

            svg {
                color: ${NEON_COLOR};
                margin-right: 12px;
                font-size: 1.1rem;
            }
        }
    }
`;

const ApplyButton = styled.button`
    background-color: ${NEON_COLOR};
    color: ${DARK_BLUE};
    border: none;
    padding: 12px 30px;
    border-radius: 8px;
    font-weight: 700;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    box-shadow: 0 4px 15px rgba(0, 224, 179, 0.3);

    &:hover {
        background-color: #00ffc7;
        box-shadow: 0 6px 20px rgba(0, 224, 179, 0.5);
        transform: translateY(-2px);
    }
`;

const BarChartContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    background: #020617;
    padding: 20px;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.05);

    @media (max-width: 1024px) {
        max-width: 500px;
        margin: 0 auto;
    }
`;

// Styles for the bar chart from the image
const ChartWrapper = styled.div`
    height: 160px;
    display: flex;
    align-items: flex-end;
    gap: 15px;
    margin-bottom: 10px;
    padding: 0 10px;
    border-bottom: 1px solid ${TEXT_MUTED};
`;

const BarColumn = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
`;

const Bar = styled.div`
    width: 25px;
    background-color: #475569; 
    height: ${({ height }) => height};
    position: relative;
    border-radius: 3px 3px 0 0;
    transition: height 0.3s ease-out;

    &::after {
        content: '';
        position: absolute;
        bottom: 0;
        width: 100%;
        background-color: ${NEON_COLOR}; 
        height: ${({ highlight }) => highlight};
        border-radius: 3px 3px 0 0;
    }
`;

const BarLabel = styled.span`
    color: ${TEXT_MUTED};
    font-size: 0.8rem;
    margin-top: 5px;
    text-align: center;
    white-space: nowrap;
`;

const InternshipDetail = styled.div`
    padding: 15px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);

    &:first-child {
        border-top: 1px solid rgba(255, 255, 255, 0.05);
    }

    h4 {
        color: ${TEXT_LIGHT};
        font-size: 0.95rem;
        font-weight: 600;
        margin: 0 0 4px 0;
    }
    p {
        color: ${TEXT_MUTED};
        font-size: 0.85rem;
        margin: 0;
    }
`;

const FooterQuickLinks = styled.div`
    a {
        display: block;
        color: ${TEXT_MUTED};
        text-decoration: none;
        margin-bottom: 12px;
        font-size: 0.9rem;
        transition: color 0.2s ease;

        &:hover {
            color: ${NEON_COLOR};
        }
    }
`;

const FooterServices = styled.div`
    span {
        display: block;
        color: ${TEXT_MUTED};
        margin-bottom: 12px;
        font-size: 0.9rem;
    }
`;

const FooterContactInfo = styled.div`
    div {
        display: flex;
        align-items: flex-start;
        margin-bottom: 12px;
        color: ${TEXT_MUTED};
        font-size: 0.9rem;

        svg {
            color: ${NEON_COLOR};
            margin-right: 12px;
            margin-top: 2px;
            font-size: 0.9rem;
            flex-shrink: 0;
        }

        a {
            color: ${TEXT_MUTED};
            text-decoration: none;
            transition: color 0.2s ease;

            &:hover {
                color: ${NEON_COLOR};
            }
        }
    }
`;

const FooterLogoGroup = styled.div`
    p {
        font-size: 0.85rem;
        color: ${TEXT_MUTED};
        line-height: 1.5;
        margin-top: 15px;
        margin-bottom: 20px;
    }
`;

const SocialIcons = styled.div`
    display: flex;
    gap: 15px;

    a {
        color: ${TEXT_MUTED};
        font-size: 1.2rem;
        transition: color 0.2s ease;
        text-decoration: none;

        &:hover {
            color: ${NEON_COLOR};
        }
    }
`;

// Helper component for the Careers Bar Chart
const CareersBarChart = () => (
    <BarChartContainer>
        <BarColumn style={{ marginBottom: '10px' }}>
            <BarLabel style={{ color: TEXT_LIGHT, fontSize: '0.9rem', fontWeight: '600' }}>Selection Ratio (2025)</BarLabel>
        </BarColumn>
        <ChartWrapper>
            <BarColumn>
                <Bar height="90%" highlight="60%" />
                <BarLabel>Designers</BarLabel>
            </BarColumn>
            <BarColumn>
                <Bar height="100%" highlight="75%" />
                <BarLabel>Developers</BarLabel>
            </BarColumn>
            <BarColumn>
                <Bar height="50%" highlight="30%" />
                <BarLabel>Writers</BarLabel>
            </BarColumn>
        </ChartWrapper>

        <InternshipDetail>
            <h4>How long is the internship?</h4>
            <p>3 to 6 months, project-dependent.</p>
        </InternshipDetail>
        <InternshipDetail>
            <h4>Is it paid?</h4>
            <p>Performance-based stipends for commercial projects.</p>
        </InternshipDetail>
        <InternshipDetail>
            <h4>Remote allowed?</h4>
            <p>Yes, hybrid-model supported.</p>
        </InternshipDetail>
        <InternshipDetail style={{ borderBottom: 'none' }}>
            <h4>Certification?</h4>
            <p>Yes, verified by MSME startup.</p>
        </InternshipDetail> 
    </BarChartContainer>
);

// Helper component for the entire new section
const FullFooter = ({ onNavigate }) => (
    <FooterContainer>
        <FooterContentWrapper>
            {/* Top Careers Section (Spans across) */}
            <CareersSection>
                <CareersTextGroup>
                    <h2>CAREERS @ <span>NEXORACREW</span></h2>
                    <p>We don't just offer internships; we offer a launchpad for your career. Work on live projects, handle real clients, and ship code that matters.</p>
                    <ul>
                        <li><FontAwesomeIcon icon={faCalendarCheck} /> Real-world experience</li>
                        <li><FontAwesomeIcon icon={faCalendarCheck} /> Mentorship from Seniors</li>
                        <li><FontAwesomeIcon icon={faCalendarCheck} /> Official Certification</li>
                        <li><FontAwesomeIcon icon={faCalendarCheck} /> Networking Opportunities</li>
                    </ul>
                    {/* UPDATED APPLY BUTTON */}
                    <ApplyButton onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSflR-eG2DJXiHOThlXgeToIivo95GKEyZa0dhJDJFD2WbrWlA/viewform', '_blank')}>Apply Now</ApplyButton>
                </CareersTextGroup>

                <CareersBarChart />
            </CareersSection>

            {/* Bottom Footer - NEXORACREW & Socials (Col 1) */}
            <FooterSection>
                <FooterLogoGroup>
                    <Logo>NEXORACREW</Logo>
                    <p>Transforming ideas into powerful digital products using modern technology, creativity, and AI. Where Ideas Meet Innovation.</p>
                </FooterLogoGroup>
                <SocialIcons>
                    <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faInstagram} /></a>
                    <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faLinkedinIn} /></a>
                    <a href="mailto:nexora.crew@gmail.com"><FontAwesomeIcon icon={faEnvelope} /></a>
                </SocialIcons>
            </FooterSection>

            {/* Bottom Footer - Quick Links (Col 2) */}
            <FooterSection>
                <SectionTitle>Quick Links</SectionTitle>
                <FooterQuickLinks>
                    <a href="#" onClick={() => onNavigate('home')}>Home</a>
                    <a href="#" onClick={() => onNavigate('about')}>About Us</a>
                    <a href="#" onClick={() => onNavigate('services')}>Services</a>
                    <a href="#" onClick={() => onNavigate('progress')}>Careers & Process</a>
                    <a href="#" onClick={() => onNavigate('contact')}>Contact</a>
                </FooterQuickLinks>
            </FooterSection>

            {/* Bottom Footer - Services (Col 3) */}
            <FooterSection>
                <SectionTitle>Services</SectionTitle>
                <FooterServices>
                    <span>Web Development</span>
                    <span>AI Solutions</span>
                    <span>SEO & Growth</span>
                    <span>Branding & Design</span>
                    <span>Server Architecture</span>
                </FooterServices>
            </FooterSection>

            {/* Bottom Footer - Contact Info (Col 4) */}
            <FooterSection>
                <SectionTitle>Contact Info</SectionTitle>
                <FooterContactInfo>
                    <div>
                        <FontAwesomeIcon icon={faLocationDot} />
                        <span>JJ College of Engineering and Technology, Trichy</span>
                    </div>
                    <div>
                        <FontAwesomeIcon icon={faEnvelope} />
                        <a href="mailto:nexora.crew@gmail.com">nexora.crew@gmail.com</a>
                    </div>
                    <div>
                        <FontAwesomeIcon icon={faPhone} />
                        <span>+91 95976 48460</span>
                    </div>
                </FooterContactInfo>
            </FooterSection>
        </FooterContentWrapper>
    </FooterContainer>
);


/* ---------------- COMPONENT ---------------- */
const ProgressPage = ({ onNavigate = () => {} }) => {
    return (
        <>
            <GlobalStyle />
            <PageWrapper>
                {/* NAVBAR */}
                <Header>
                    <Logo onClick={() => onNavigate('home')}>NEXORA</Logo>
                    <NavGroup>
                        <span onClick={() => onNavigate('home')}>Home</span>
                        <span onClick={() => onNavigate('about')}>About</span>
                        <span onClick={() => onNavigate('services')}>Services</span>
                        <span onClick={() => onNavigate('projects')}>Projects</span>
                        <span onClick={() => onNavigate('blog')}>Blog</span>
                        <span onClick={() => onNavigate('team')}>Team</span>

                        {/* ACTIVE ITEM FOR THIS PAGE */}
                        <span
                            onClick={() => onNavigate('progress')}
                            style={{ color: NEON_COLOR }}
                        >
                            Progress
                        </span>

                        <span onClick={() => onNavigate('contact')}>Contact</span>
                        
                    </NavGroup>
                </Header>

                <MainContentArea>
                    <ContentWrapper>
                        <Shell>
                            {/* NEW AGILE WORKFLOW SECTION */}
                            <AgileWorkflow />

                            {/* SWOT CONTENT */}
                            <Title>
                                STRATEGIC <span>ANALYSIS</span>
                            </Title>

                            <Grid>
                                <StrengthBox>
                                    <HeaderRow>
                                        <IconCircle variant="strength">
                                            <FontAwesomeIcon icon={faBullseye} />
                                        </IconCircle>
                                        <BoxTitle>Strengths</BoxTitle>
                                    </HeaderRow>
                                    <BulletList>
                                        <li>Human-centered design approach — Users-ah focus pannina products</li>
                                        <li>Strong UI/UX + Development expertise</li>
                                        <li> Customized digital solutions (web, app, SaaS)</li>
                                        <li> Fast execution & modern workflows</li>
                                        <li>Innovation-focused team</li>
                                        <li>Quality-first development → High performance, scalability</li>
                                        <li>Clear brand identity → “Meaningful technology”</li>
                                    </BulletList>
                                </StrengthBox>

                                <WeaknessBox>
                                    <HeaderRow>
                                        <IconCircle variant="weakness">
                                            <FontAwesomeIcon icon={faTriangleExclamation} />
                                        </IconCircle>
                                        <BoxTitle>Weaknesses</BoxTitle>
                                    </HeaderRow>
                                    <BulletList>
                                        <li>Brand awareness still developing </li>
                                        <li>Limited portfolio compared to big agencies</li>
                                        <li>Small team size → higher workload during multiple projects</li>
                                        <li>Scaling challenges when project volume increases</li>
                                        <li>Depends on digital marketing consistency</li>
                                    </BulletList>
                                </WeaknessBox>

                                <OpportunityBox>
                                    <HeaderRow>
                                        <IconCircle variant="opportunity">
                                            <FontAwesomeIcon icon={faBolt} />
                                        </IconCircle>
                                        <BoxTitle>Opportunities</BoxTitle>
                                    </HeaderRow>
                                    <BulletList>
                                        <li>High demand for websites, mobile apps & SaaS platforms</li>
                                        <li>Global freelancing & outsourcing market growth</li>
                                        <li>AI automation & tech integration opportunities</li>
                                        <li>Cloud technology demand increasing</li>
                                        <li>Social media presence can boost brand visibility</li>
                                        <li> Corporate branding, design, consulting areas expandable</li>
                                    </BulletList>
                                </OpportunityBox>

                                <ThreatBox>
                                    <HeaderRow>
                                        <IconCircle variant="threat">
                                            <FontAwesomeIcon icon={faUserShield} />
                                        </IconCircle>
                                        <BoxTitle>Threats</BoxTitle>
                                    </HeaderRow>
                                    <BulletList>
                                        <li> Heavy competition in tech & IT service industry</li>
                                        <li>Price competition from freelancers & low-cost agencies</li>
                                        <li> Fast-changing technologies → continuous skill upgrade needed</li>
                                        <li>Client expectations increasing day by day</li>
                                        <li>Economic slowdowns affecting project budgets</li>
                                    </BulletList>
                                </ThreatBox>
                            </Grid>
                        </Shell>
                    </ContentWrapper>
                </MainContentArea>

                {/* CAREERS/FOOTER SECTION */}
                <FullFooter onNavigate={onNavigate} />

            </PageWrapper>
        </>
    );
};

export default ProgressPage;