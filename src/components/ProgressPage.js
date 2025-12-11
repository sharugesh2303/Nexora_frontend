// src/components/ProgressPage.jsx
import React, { useEffect, useRef, useState } from 'react';
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

/* ---------------- THEME (white UI — navy & gold accents) ---------------- */
const GOLD = '#D4AF37';            // specification / highlight color
const NAVY = '#083047';            // primary navy color for text/background elements
const TEXT_DARK = '#052635';       // main text color
const TEXT_MUTED = '#6b7280';      // muted text (gray)
const SHELL_BG = '#ffffff';        // white surface for cards
const SURFACE_BORDER = 'rgba(8,48,71,0.06)';

/* ---------------- GLOBAL STYLE ---------------- */
const GlobalStyle = createGlobalStyle`
    /* ensure the entire page background is white so no black bars appear */
    html, body, #root { height: 100%; background: #ffffff; }

    body {
        margin: 0;
        font-family: 'Poppins', sans-serif;
        -webkit-font-smoothing:antialiased;
        -moz-osx-font-smoothing:grayscale;
        background: #ffffff;
        color: ${TEXT_DARK};
        overflow-x: hidden;
    }

    /* Respect reduced motion */
    @media (prefers-reduced-motion: reduce) {
      * {
        animation: none !important;
      }
    }
`;

/* ---------------- STAR CANVAS BACKGROUND ---------------- */
const StarCanvas = styled.canvas`
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
`;

/* ---------------- ANIMATIONS ---------------- */
const glowPulse = keyframes`
  0% { box-shadow: 0 0 0px rgba(212,175,55,0.0); }
  50% { box-shadow: 0 0 18px rgba(212,175,55,0.12); }
  100% { box-shadow: 0 0 0px rgba(212,175,55,0.0); }
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
    background: rgba(255,255,255,0.98);
    backdrop-filter: blur(6px);
    border-bottom: 1px solid ${SURFACE_BORDER};
    z-index: 10;

    @media (max-width: 780px) {
        padding: 12px 20px;
        gap: 18px;
    }
`;

const Logo = styled.h1`
    color: ${NAVY};
    font-size: 1.8rem;
    font-weight: 800;
    cursor: pointer;
    letter-spacing: 1px;
    display: inline-flex;
    align-items: center;

    span {
        color: ${GOLD};
        margin-left: 6px;
        font-weight: 900;
    }
`;

const NavGroup = styled.div`
    display: flex;
    gap: 22px;
    align-items: center;
    margin-right: auto;

    span {
        color: ${TEXT_MUTED};
        cursor: pointer;
        font-weight: 600;
        position: relative;
        transition: 0.25s ease;
        padding: 6px 4px;
        font-size: 0.95rem;

        &:hover {
            color: ${NAVY};
        }

        &:after {
            content: '';
            position: absolute;
            left: 0; bottom: -6px;
            width: 0;
            height: 3px;
            background: ${GOLD};
            transition: 0.22s;
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
    background: #ffffff; /* explicit white background to avoid visible black gutters */
    z-index: 1; /* ensure content sits above canvas */
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
    border-radius: 16px;
    padding: 48px 40px 56px;
    background: ${SHELL_BG};
    border: 1px solid ${SURFACE_BORDER};
    box-shadow: 0 10px 30px rgba(8,48,71,0.06);

    @media (max-width: 768px) {
        padding: 28px 16px 36px;
        border-radius: 12px;
    }
`;

const Title = styled.h1`
    text-align: center;
    font-size: 32px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin: 0 0 28px;
    color: ${NAVY};

    span {
        color: ${GOLD};
    }

    @media (max-width: 640px) {
        font-size: 24px;
    }
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px;
    margin-top: 32px; 

    @media (max-width: 900px) {
        grid-template-columns: 1fr;
    }
`;

const BaseBox = styled.div`
    border-radius: 12px;
    padding: 22px 24px;
    background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
    border: 1px solid ${SURFACE_BORDER};
    position: relative;
    overflow: hidden;
    transition: transform 0.12s ease-out, border-color 0.12s ease-out;

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 6px 18px rgba(8,48,71,0.06);
    }
`;

const StrengthBox = styled(BaseBox)`
    border-left: 3px solid ${GOLD};
    animation: ${glowPulse} 4s ease-in-out infinite;
`;
const WeaknessBox = styled(BaseBox)`
    border-left: 3px solid #ef4444;
`;
const OpportunityBox = styled(BaseBox)`
    border-left: 3px solid ${NAVY};
`;
const ThreatBox = styled(BaseBox)`
    border-left: 3px solid #9ca3af;
`;

const HeaderRow = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 10px;
`;

const IconCircle = styled.div`
    width: 36px;
    height: 36px;
    border-radius: 999px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;

    ${({ variant }) =>
        variant === "strength" &&
        css`
          border: 1px solid rgba(212,175,55,0.18);
          background: linear-gradient(180deg, rgba(212,175,55,0.06), transparent);
          color: ${GOLD};
        `}
    ${({ variant }) =>
        variant === "weakness" &&
        css`
          border: 1px solid rgba(239,68,68,0.12);
          background: linear-gradient(180deg, rgba(239,68,68,0.04), transparent);
          color: #ef4444;
        `}
    ${({ variant }) =>
        variant === "opportunity" &&
        css`
          border: 1px solid rgba(8,48,71,0.12);
          background: linear-gradient(180deg, rgba(8,48,71,0.04), transparent);
          color: ${NAVY};
        `}
    ${({ variant }) =>
        variant === "threat" &&
        css`
          border: 1px solid rgba(156,163,175,0.12);
          background: linear-gradient(180deg, rgba(156,163,175,0.02), transparent);
          color: #9ca3af;
        `}
`;

const BoxTitle = styled.h2`
    font-size: 16px;
    font-weight: 700;
    color: ${TEXT_DARK};
    margin: 0;
`;

const BulletList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 8px 0 0;

    li {
        font-size: 14px;
        color: ${TEXT_DARK};
        margin-bottom: 8px;
        position: relative;
        padding-left: 18px;
    }

    li:before {
        content: "•";
        position: absolute;
        left: 0;
        top: -1px;
        color: ${TEXT_MUTED};
    }
`;

/* ---------------- AGILE WORKFLOW STYLES ---------------- */

const WorkflowContainer = styled.div`
    text-align: center;
    margin-bottom: 48px;
    padding: 26px 18px;
    background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
    border-radius: 10px;
    border: 1px solid ${SURFACE_BORDER};
`;

const WorkflowTitle = styled.h2`
    font-size: 2rem;
    font-weight: 800;
    margin-bottom: 6px;
    letter-spacing: 0.02em;

    span {
        color: ${GOLD};
    }
`;

const WorkflowSubtitle = styled.p`
    color: ${TEXT_MUTED};
    font-size: 0.95rem;
    margin-bottom: 22px;
`;

const ProcessBar = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    max-width: 900px;
    margin: 0 auto 20px;
    padding: 0 10px;
`;

const Line = styled.div`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    height: 4px;
    background: rgba(8,48,71,0.08);
    width: 100%;
    z-index: 1;
    border-radius: 2px;
`;

const ActiveLine = styled.div`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    height: 4px;
    background: ${GOLD};
    width: 40%;
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
`;

const Circle = styled.div`
    width: 18px;
    height: 18px;
    border-radius: 50%;
    margin-bottom: 10px;
    border: 2px solid ${({ active }) => (active ? GOLD : 'rgba(8,48,71,0.18)')};
    background: ${({ active }) => (active ? NAVY : 'transparent')};
    transition: all 0.3s ease;
`;

const StepLabel = styled.span`
    font-size: 0.82rem;
    font-weight: 600;
    color: ${({ active }) => (active ? TEXT_DARK : TEXT_MUTED)};
    text-align: center;
    transition: color 0.3s ease;
`;

const ProcessButton = styled.button`
    background-color: ${NAVY};
    color: #ffffff;
    border: none;
    padding: 10px 22px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.18s ease-in-out;
    margin-top: 12px;
    display: inline-flex;
    align-items: center;
    gap: 0px;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(8,48,71,0.08);
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
    background-color: #ffffff;
    border-top: 1px solid ${SURFACE_BORDER};

    @media (max-width: 780px) {
        padding: 40px 20px;
    }
`;

const FooterContentWrapper = styled.div`
    max-width: 1180px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1.5fr; 
    gap: 28px;

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
    font-size: 1.05rem;
    color: ${TEXT_DARK};
    margin-bottom: 16px;
    font-weight: 700;
`;

const CareersSection = styled.div`
    grid-column: 1 / -1; 
    display: grid;
    grid-template-columns: 1.5fr 3fr;
    gap: 28px;
    margin-bottom: 36px;
    padding-bottom: 36px;
    border-bottom: 1px solid ${SURFACE_BORDER};

    @media (max-width: 1024px) {
        grid-template-columns: 1fr;
        gap: 20px;
        padding-bottom: 24px;
    }
`;

const CareersTextGroup = styled.div`
    h2 {
        font-size: 1.9rem;
        font-weight: 800;
        margin-top: 0;
        margin-bottom: 12px;
        span {
            color: ${GOLD};
        }

        @media (max-width: 640px) {
            font-size: 1.5rem;
        }
    }

    p {
        color: ${TEXT_MUTED};
        font-size: 0.95rem;
        line-height: 1.6;
        margin-bottom: 18px;
    }

    ul {
        list-style: none;
        padding: 0;
        margin-bottom: 22px;

        li {
            display: flex;
            align-items: center;
            color: ${TEXT_DARK};
            font-weight: 600;
            margin-bottom: 8px;
            font-size: 0.95rem;

            svg {
                color: ${GOLD};
                margin-right: 12px;
                font-size: 1.1rem;
            }
        }
    }
`;

const ApplyButton = styled.button`
    background-color: ${GOLD};
    color: #042027;
    border: none;
    padding: 12px 28px;
    border-radius: 8px;
    font-weight: 700;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.18s ease-in-out;
    box-shadow: 0 6px 18px rgba(212,175,55,0.12);

    &:hover {
        transform: translateY(-2px);
    }
`;

const BarChartContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    background: #ffffff;
    padding: 16px;
    border-radius: 8px;
    border: 1px solid ${SURFACE_BORDER};
`;

const ChartWrapper = styled.div`
    height: 140px;
    display: flex;
    align-items: flex-end;
    gap: 12px;
    margin-bottom: 6px;
    padding: 0 6px;
    border-bottom: 1px solid ${TEXT_MUTED};
`;

const BarColumn = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
`;

const Bar = styled.div`
    width: 24px;
    background-color: #e6eef6; 
    height: ${({ height }) => height};
    position: relative;
    border-radius: 4px 4px 0 0;
    transition: height 0.3s ease-out;

    &::after {
        content: '';
        position: absolute;
        bottom: 0;
        width: 100%;
        background-color: ${GOLD}; 
        height: ${({ highlight }) => highlight};
        border-radius: 4px 4px 0 0;
    }
`;

const BarLabel = styled.span`
    color: ${TEXT_MUTED};
    font-size: 0.8rem;
    margin-top: 6px;
    text-align: center;
    white-space: nowrap;
`;

const InternshipDetail = styled.div`
    padding: 12px 0;
    border-bottom: 1px solid rgba(8,48,71,0.04);

    &:first-child {
        border-top: 1px solid rgba(8,48,71,0.02);
    }

    h4 {
        color: ${TEXT_DARK};
        font-size: 0.95rem;
        font-weight: 700;
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
        margin-bottom: 10px;
        font-size: 0.9rem;
        transition: color 0.18s ease;

        &:hover {
            color: ${NAVY};
        }
    }
`;

const FooterServices = styled.div`
    span {
        display: block;
        color: ${TEXT_MUTED};
        margin-bottom: 10px;
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
            color: ${GOLD};
            margin-right: 12px;
            margin-top: 2px;
            font-size: 0.95rem;
            flex-shrink: 0;
        }

        a {
            color: ${TEXT_MUTED};
            text-decoration: none;

            &:hover {
                color: ${NAVY};
            }
        }
    }
`;

const FooterLogoGroup = styled.div`
    p {
        font-size: 0.9rem;
        color: ${TEXT_MUTED};
        line-height: 1.5;
        margin-top: 8px;
        margin-bottom: 16px;
    }
`;

const SocialIcons = styled.div`
    display: flex;
    gap: 12px;

    a {
        color: ${TEXT_MUTED};
        font-size: 1.1rem;
        transition: color 0.18s ease;
        text-decoration: none;

        &:hover {
            color: ${NAVY};
        }
    }
`;

// Helper component for the Careers Bar Chart
const CareersBarChart = () => (
    <BarChartContainer>
        <BarColumn style={{ marginBottom: '6px' }}>
            <BarLabel style={{ color: TEXT_DARK, fontSize: '0.9rem', fontWeight: '700' }}>Selection Ratio (2025)</BarLabel>
        </BarColumn>
        <ChartWrapper>
            <BarColumn>
                <Bar height="70%" highlight="40%" />
                <BarLabel>Designers</BarLabel>
            </BarColumn>
            <BarColumn>
                <Bar height="90%" highlight="60%" />
                <BarLabel>Developers</BarLabel>
            </BarColumn>
            <BarColumn>
                <Bar height="50%" highlight="22%" />
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
                    <p>Transforming ideas into powerful digital products using modern technology, creativity, and AI. Where Ideas Meet Innovation.</p>
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
                    <Logo style={{ color: NAVY }}>NEXORA<span>CREW</span></Logo>
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
                    <a href="#" onClick={() => onNavigate('about')}>About</a>
                    <a href="#" onClick={() => onNavigate('services')}>Services</a>
                    <a href="#" onClick={() => onNavigate('projects')}>Projects</a>
                    <a href="#" onClick={() => onNavigate('blog')}>Blog</a>
                    <a href="#" onClick={() => onNavigate('team')}>Team</a>
                    <a href="#" onClick={() => onNavigate('progress')}>Progress</a>
                    <a href="#" onClick={() => onNavigate('contact')}>Contact</a>
                </FooterQuickLinks>
            </FooterSection>

            {/* Bottom Footer - Services (Col 3) */}
            <FooterSection>
                <SectionTitle>Services</SectionTitle>
                <FooterServices>
                    <span>Web Development</span>
                    <span>Poster designing & logo making</span>
                    <span>Digital marketing &SEO</span>
                    <span>AI and automation</span>
                    <span>Hosting & Support</span>
                    <span>Printing &Branding solutions</span>
                    <span>Enterprise networking &server architecture</span>
                    <span>Bold branding&Immersive visual design</span>
                    <span>Next gen web & mobile experience</span>
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
    // canvas ref for background animation
    const canvasRef = useRef(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: true });
        const DPR = window.devicePixelRatio || 1;

        function resize() {
            canvas.width = window.innerWidth * DPR;
            canvas.height = window.innerHeight * DPR;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        }
        resize();

        // star/particle data — scale count by screen size for performance
        const baseCount = Math.max(Math.floor((window.innerWidth * window.innerHeight) / 12000), 60);
        const isSmall = window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
        const count = isSmall ? Math.max(40, Math.floor(baseCount * 0.5)) : baseCount;

        const stars = Array.from({ length: count }, () => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            r: 0.8 + Math.random() * 2.2,
            dx: (Math.random() - 0.5) * 0.3,
            dy: 0.05 + Math.random() * 0.5,
            alpha: 0.12 + Math.random() * 0.5,
            hue: Math.random() > 0.8 ? 'gold' : 'navy' // mostly gold with occasional navy tints
        }));

        let rafId;
        const draw = () => {
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

            // subtle gradient background (keeps white UI look)
            // optional — commented out to preserve page's white background
            // const g = ctx.createLinearGradient(0, 0, 0, window.innerHeight);
            // g.addColorStop(0, 'rgba(255,255,255,0.0)');
            // g.addColorStop(1, 'rgba(250,250,252,0.0)');
            // ctx.fillStyle = g;
            // ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

            stars.forEach((s) => {
                s.x += s.dx;
                s.y += s.dy;

                if (s.y > window.innerHeight + 10) s.y = -10;
                if (s.x > window.innerWidth + 10) s.x = -10;
                if (s.x < -10) s.x = window.innerWidth + 10;

                // choose color based on hue flag
                if (s.hue === 'gold') ctx.fillStyle = `rgba(212,169,55,${s.alpha})`;
                else ctx.fillStyle = `rgba(8,48,71,${s.alpha * 0.9})`;

                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fill();
            });

            rafId = requestAnimationFrame(draw);
        };

        draw();
        window.addEventListener('resize', resize);
        return () => { cancelAnimationFrame(rafId); window.removeEventListener('resize', resize); };
    }, []);

    // Create a simple particle config only for fallback/no-canvas cases (not visible)
    const isMobile = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width: 768px)').matches;

    return (
        <>
            <GlobalStyle />
            <StarCanvas ref={canvasRef} aria-hidden />
            <PageWrapper>
                {/* NAVBAR */}
                <Header>
                    <Logo onClick={() => onNavigate('home')}>NEXORA<span>CREW</span></Logo>
                    <NavGroup>
                        <span onClick={() => onNavigate('home')}>Home</span>
                        <span onClick={() => onNavigate('about')}>About</span>
                        <span onClick={() => onNavigate('services')}>Services</span>
                        <span onClick={() => onNavigate('projects')}>Projects</span>
                        <span onClick={() => onNavigate('blog')}>Blog</span>
                        <span onClick={() => onNavigate('team')}>Team</span>
                        <span onClick={() => onNavigate('progress')}>Progress</span>
                        <span onClick={() => onNavigate('contact')}>Contact</span>

                        {/* ACTIVE ITEM FOR THIS PAGE */}
                        <span
                            onClick={() => onNavigate('progress')}
                            style={{ color: NAVY, fontWeight: 700 }}
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
