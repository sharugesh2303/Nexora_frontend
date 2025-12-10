// src/components/AboutPage.jsx
import React, { useEffect, useRef, useState } from 'react';
import styled, { createGlobalStyle, keyframes, css } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBullseye, 
    faEye, 
    faRocket, 
    faPencilAlt,
    faCalendar, // Used for 'Founded' date
    faServer, // Used for 'Incubation Access'
    faCheckCircle, // Used for 'Projects Done'
    faUsers, // Used for 'Interns'
    faBars, // Added for mobile menu icon
    faEnvelope,
    faMapMarkerAlt, 
    faPhone, 
} from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons'; // Import brand icons

/* ---------------- THEME ---------------- */
const NEON_COLOR = '#00e0b3';
// PURPLE_HIGHLIGHT removed
const NAVY_BG = '#071025';
const PANEL_BG = '#0F172A';
const TEXT_LIGHT = '#E6F0F2';
const TEXT_MUTED = '#9AA8B8';
const BORDER_LIGHT = 'rgba(255,255,255,0.04)';
const VERY_DARK_BG = '#02040a'; // For the main footer background

/* ---------------- KEYFRAMES ---------------- */
const softGlow = keyframes`
    0% { text-shadow: 0 0 10px ${NEON_COLOR}, 0 0 20px rgba(0,224,179,0.2); }
    50% { text-shadow: 0 0 18px ${NEON_COLOR}, 0 0 30px rgba(0,224,179,0.5); }
    100% { text-shadow: 0 0 10px ${NEON_COLOR}, 0 0 20px rgba(0,224,179,0.2); }
`;
const rollIn = keyframes`
    from { opacity: 0; transform: translateY(30px) scale(0.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
`;

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

    .neon-text-shadow {
        text-shadow: 0 0 12px ${NEON_COLOR}, 0 0 25px rgba(0,224,179,0.25);
    }

    .animate-in {
        opacity: 0;
        transform: translateY(20px);
        animation: fadeSlide 0.8s ease forwards;
    }

    @keyframes fadeSlide {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

/* ---------------- STAR CANVAS ---------------- */
const StarCanvas = styled.canvas`
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
`;

/* ---------------- LAYOUT ---------------- */
const PageWrapper = styled.div`
    position: relative;
    z-index: 1;
    min-height: 100vh;
`;

/* Header */
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
    
    @media (max-width: 1024px) {
        display: none; /* Hide desktop nav for mobile responsiveness */
    }


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

const MobileMenuButton = styled.button`
    display: none;
    @media (max-width: 1024px) {
        display: block;
        background: none;
        border: none;
        color: ${NEON_COLOR};
        font-size: 1.5rem;
        cursor: pointer;
        margin-left: auto;
    }
`;

const MobileNavMenu = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${PANEL_BG};
    z-index: 100;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 80px;
    transform: translateX(${props => (props.isOpen ? '0' : '100%')});
    transition: transform 0.3s ease-in-out;

    .close-btn {
        position: absolute;
        top: 20px;
        right: 20px;
        background: none;
        border: none;
        color: ${TEXT_LIGHT};
        font-size: 2rem;
        cursor: pointer;
    }

    span {
        font-size: 1.5rem;
        margin: 15px 0;
        cursor: pointer;
        color: ${TEXT_MUTED};
        
        &:hover {
            color: ${NEON_COLOR};
        }
    }
`;

/* Hero Section */
const HeroAbout = styled.section`
    padding: 150px 36px 80px;
    max-width: 1200px;
    margin: 0 auto;

    @media (max-width: 780px) {
        padding: 120px 20px 60px;
        text-align: center;
    }
`;

const HeroTitle = styled.h1`
    font-size: 3.8rem;
    font-weight: 700;
    margin-bottom: 16px;
    line-height: 1.05;

    span {
        color: ${NEON_COLOR};
        text-shadow: 0 0 15px ${NEON_COLOR};
    }

    &.glow {
        animation: ${css`${softGlow} 3s ease-in-out infinite`};
    }

    @media (max-width: 780px) {
        font-size: 2.4rem;
    }
`;

const HeroParagraph = styled.p`
    max-width: 760px;
    color: ${TEXT_MUTED};
    font-size: 1.2rem;
    line-height: 1.7;

    @media (max-width: 780px) {
        margin-left: auto;
        margin-right: auto;
        font-size: 1rem;
    }
`;

/* Section Wrapper */
const Section = styled.section`
    padding: 60px 36px;
    max-width: 1200px;
    margin: 0 auto;

    @media (max-width: 780px) {
        padding: 40px 20px;
    }
`;

const SectionHeader = styled.h2`
    font-size: 2.4rem;
    margin-bottom: 8px;

    span {
        color: ${NEON_COLOR};
    }

    @media (max-width: 780px) {
        font-size: 2rem;
    }
`;
const SectionSubtitle = styled.p`
    color: ${TEXT_MUTED};
    max-width: 900px;
`;

/* ---------------- METRICS CARDS (Who We Are) ---------------- */
const MetricsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 20px;
    margin-top: 50px;

    @media (max-width: 780px) {
        grid-template-columns: 1fr;
    }
`;

const MetricCard = styled.div`
    background: ${PANEL_BG};
    border-radius: 10px;
    padding: 20px;
    border: 1px solid rgba(255,255,255,0.06);
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    
    .icon-box {
        color: ${NEON_COLOR};
        font-size: 1.5rem;
        margin-bottom: 8px;
    }

    .value {
        color: ${TEXT_LIGHT};
        font-size: 1.5rem;
        font-weight: 700;
        margin: 0;
    }
    
    .label {
        color: ${TEXT_MUTED};
        font-size: 0.9rem;
        margin: 0;
    }
`;

/* ---------------- POWERFUL STACK SECTION COMPONENTS (REMOVED) ---------------- */
// All components related to Stack were removed here.

/* About Cards (Mission / Vision / Journey) */
const MVJGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px,1fr));
    gap: 20px;
    margin-top: 28px;

    @media (max-width: 780px) {
        grid-template-columns: 1fr;
    }
`;

const MVJCard = styled.div`
    background: rgba(15,23,42,0.55);
    backdrop-filter: blur(12px);
    border-radius: 14px;
    padding: 26px;
    border: 1px solid rgba(255,255,255,0.06);
    transition: 0.3s ease;
    box-shadow: 0 8px 30px rgba(0,0,0,0.45);

    &:hover {
        transform: translateY(-10px);
        border-color: ${NEON_COLOR};
        box-shadow: 0 20px 60px rgba(0,224,179,0.12);
    }

    .icon-box {
        width: 62px;
        height: 62px;
        border-radius: 50%;
        background: rgba(255,255,255,0.03);
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 14px;
    }

    h3 { font-size: 1.2rem; }
    p { color: ${TEXT_MUTED}; line-height: 1.55; }
`;

/* ---------------- FULL FOOTER COMPONENTS ---------------- */
const FullFooter = styled.footer`
    background: ${VERY_DARK_BG};
    padding: 60px 50px 20px;
    color: ${TEXT_MUTED};
    border-top: 1px solid rgba(255,255,255,0.04);

    @media (max-width: 768px) {
        padding: 40px 20px 20px;
    }
`;

const FooterGrid = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    gap: 30px;

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 20px;
    }
`;

const FooterColumn = styled.div`
    min-width: 200px;

    @media (max-width: 768px) {
        min-width: unset;
        width: 100%;
        margin-bottom: 10px;
    }

    h4 {
        color: ${TEXT_LIGHT};
        font-size: 1.1rem;
        margin-bottom: 20px;
        font-weight: 700;
        position: relative;
        &:after {
            content: '';
            position: absolute;
            left: 0; bottom: -5px;
            width: 30px;
            height: 2px;
            background: ${NEON_COLOR};
        }
    }

    p { font-size: 0.9rem; line-height: 1.6; margin: 0 0 10px 0; }
    ul { list-style: none; padding: 0; margin: 0; }
    li { margin-bottom: 10px; }
    a, span {
        color: ${TEXT_MUTED};
        text-decoration: none;
        font-size: 0.9rem;
        transition: color 0.3s;
        display: inline-flex;
        align-items: center;
        gap: 8px;

        &:hover { color: ${NEON_COLOR}; }
    }
`;

const FooterLogo = styled(Logo)`
    font-size: 1.5rem;
    margin-bottom: 10px;
`;

const SocialIcons = styled.div`
    display: flex;
    gap: 15px;
    margin-top: 15px;

    a {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: rgba(255,255,255,0.05);
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${TEXT_LIGHT};
        transition: background 0.3s, color 0.3s;

        &:hover {
            background: ${NEON_COLOR};
            color: ${NAVY_BG};
        }
    }
`;

const Copyright = styled.div`
    text-align: center;
    font-size: 0.8rem;
    padding-top: 30px;
    border-top: 1px solid rgba(255,255,255,0.02);
    margin-top: 50px;
`;
/* ---------------- END FULL FOOTER ---------------- */


/* Section icons */
const SECTION_ICONS = {
    Mission: faBullseye,
    Vision: faEye,
    Journey: faRocket,
    Custom: faPencilAlt,
    Text: faPencilAlt,
    default: faPencilAlt
};

const getSectionIcon = (type) => SECTION_ICONS[type] || SECTION_ICONS.default;

/* ---------------- COMPONENT ---------------- */
const AboutPage = ({ onNavigate = () => {}, aboutData = {} }) => {
    const canvasRef = useRef(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    /* Star animation */
    useEffect(() => {
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

        const stars = Array.from({ length: 160 }, () => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            r: 0.8 + Math.random() * 1.4,
            dx: (Math.random() - 0.5) * 0.3,
            dy: 0.15 + Math.random() * 0.6,
            alpha: 0.4 + Math.random() * 0.6
        }));

        let raf;
        const draw = () => {
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

            stars.forEach((s) => {
                s.x += s.dx;
                s.y += s.dy;

                if (s.y > window.innerHeight) s.y = -5;
                if (s.x > window.innerWidth) s.x = -5;
                if (s.x < -5) s.x = window.innerWidth;

                ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fill();
            });

            raf = requestAnimationFrame(draw);
        };

        draw();
        window.addEventListener('resize', resize);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', resize);
        };
    }, []);

    /* DATA PROCESSING */
    const safeAboutData = aboutData || {};
    const initialSections = [
        {
            type: 'Mission',
            title: 'Our Mission',
            body: safeAboutData.mission || 'Our mission is to help businesses grow through powerful digital solutions.'

        },
        {
            type: 'Vision',
            title: 'Our Vision',
            body: safeAboutData.vision || '💫To become a leading force in digital innovation by creating meaningful, human-centered technology that transforms businesses and shapes the future of digital experiences.'
        },
        {
            type: 'Journey',
            title: 'Our Journey',
            body: safeAboutData.journey || 'Started small, grown to a powerful creative team.'
        }
    ];

    const mvjSections = initialSections.filter(s => s.body);
    const customBlocks = Array.isArray(safeAboutData.sections)
        ? safeAboutData.sections.filter(s => s.type === 'Custom' || s.type === 'Text')
        : [];
    
    const metricData = [
        { icon: faCalendar, label: 'Founded', value: '25 Sep 2025' },
        { icon: faServer, label: 'Incubation Access', value: 'Nov 2025' },
        { icon: faCheckCircle, label: 'Projects Done', value: 'Major 2+' },
        { icon: faUsers, label: 'Interns', value: '30+' },
    ];
    
    // Stack data is intentionally omitted per request.

    const handleNavigation = (route) => {
        onNavigate(route);
        setIsMobileMenuOpen(false); // Close menu after navigation
    };

    return (
        <>
            <GlobalStyle />
            <StarCanvas ref={canvasRef} />

            <PageWrapper>
                {/* HEADER */}
                <Header>
                    <Logo onClick={() => handleNavigation('home')}>NEXORACREW</Logo>
                    <NavGroup>
                        <span onClick={() => handleNavigation('home')}>Home</span>
                        <span
                            onClick={() => handleNavigation('about')}
                            style={{ color: NEON_COLOR }}
                        >
                            About
                        </span>
                        <span onClick={() => handleNavigation('services')}>Services</span>
                        <span onClick={() => handleNavigation('projects')}>Projects</span>
                        <span onClick={() => handleNavigation('blog')}>Blog</span>
                        <span onClick={() => handleNavigation('team')}>Team</span>

                        {/* PROGRESS NAV ITEM */}
                        <span onClick={() => handleNavigation('progress')}>Progress</span>

                        <span onClick={() => handleNavigation('contact')}>Contact</span>
                    </NavGroup>
                    <MobileMenuButton onClick={() => setIsMobileMenuOpen(true)}>
                        <FontAwesomeIcon icon={faBars} />
                    </MobileMenuButton>
                </Header>

                {/* Mobile Menu */}
                <MobileNavMenu isOpen={isMobileMenuOpen}>
                    <button className="close-btn" onClick={() => setIsMobileMenuOpen(false)}>
                        &times;
                    </button>
                    <span onClick={() => handleNavigation('home')}>Home</span>
                    <span onClick={() => handleNavigation('about')} style={{ color: NEON_COLOR }}>About</span>
                    <span onClick={() => handleNavigation('services')}>Services</span>
                    <span onClick={() => handleNavigation('projects')}>Projects</span>
                    <span onClick={() => handleNavigation('blog')}>Blog</span>
                    <span onClick={() => handleNavigation('team')}>Team</span>
                    <span onClick={() => handleNavigation('progress')}>Progress</span>
                    <span onClick={() => handleNavigation('contact')}>Contact</span>
                </MobileNavMenu>


                {/* WHO WE ARE SECTION (Combines Hero & Metrics) */}
                <HeroAbout>
                    <div className="animate-in">
                        <HeroTitle>
                            Who We <span>Are</span>
                        </HeroTitle>

                        <HeroParagraph
                            className="animate-in"
                            style={{ animationDelay: '0.2s' }}
                        >
                            Nexoracrew is an **MSME-registered student startup** from JJ College of Engineering & Technology, Trichy. We don’t just write code; we **transform raw ideas into powerful digital products** using modern technology, creative design, and Artificial Intelligence.
                        </HeroParagraph>
                    </div>
                    
                    {/* Metrics Grid */}
                    <MetricsGrid>
                        {metricData.map((metric, i) => (
                            <MetricCard
                                key={i}
                                className="animate-in"
                                style={{ animationDelay: `${0.4 + i * 0.1}s` }}
                            >
                                <div className="icon-box">
                                    <FontAwesomeIcon icon={metric.icon} />
                                </div>
                                <p className="value">{metric.value}</p>
                                <p className="label">{metric.label}</p>
                            </MetricCard>
                        ))}
                    </MetricsGrid>
                </HeroAbout>
                
                {/* HORIZONTAL LINE SEPARATOR */}
                <hr style={{ border: BORDER_LIGHT, maxWidth: 1200, margin: '60px auto' }} />

                {/* MISSION/VISION/JOURNEY CARDS (Original Section) */}
                <Section>
                    <SectionHeader>
                        Our <span>Philosophy</span>
                    </SectionHeader>
                    <SectionSubtitle>
                        These core values guide every decision we make, from the smallest code commit to major collaborations.
                    </SectionSubtitle>

                    <MVJGrid>
                        {mvjSections.map((section, i) => (
                            <MVJCard
                                key={i}
                                className="animate-in"
                                style={{ animationDelay: `${0.3 + i * 0.15}s` }}
                            >
                                <div className="icon-box">
                                    <FontAwesomeIcon
                                        icon={getSectionIcon(section.type)}
                                        color={NEON_COLOR}
                                        size="lg"
                                    />
                                </div>
                                <h3>{section.title}</h3>
                                <p>{section.body}</p>
                            </MVJCard>
                        ))}
                    </MVJGrid>
                </Section>

                {/* CUSTOM TEXT SECTIONS */}
                {customBlocks.map((block, idx) => (
                    <Section key={idx}>
                        <h2
                            className="animate-in"
                            style={{ color: NEON_COLOR }}
                        >
                            {block.title}
                        </h2>
                        <p
                            className="animate-in"
                            style={{ animationDelay: '0.2s', color: TEXT_MUTED }}
                        >
                            {block.body}
                        </p>
                    </Section>
                ))}

                {/* CTA BUTTON - Moved before the Full Footer */}
                <Section style={{ textAlign: 'center', paddingBottom: '0' }}>
                    <button
                        onClick={() => handleNavigation('contact')}
                        className="animate-in"
                        style={{
                            padding: '14px 32px',
                            background: NEON_COLOR,
                            border: 'none',
                            borderRadius: 10,
                            color: NAVY_BG,
                            fontWeight: 700,
                            cursor: 'pointer',
                            boxShadow: '0 8px 30px rgba(0,224,179,0.25)',
                            fontSize: '1.05rem'
                        }}
                    >
                        Let’s Collaborate
                    </button>
                </Section>
                
                {/* NEW: FULL FOOTER */}
                <FullFooter>
                    <FooterGrid>
                        <FooterColumn style={{ minWidth: '300px' }}>
                            <FooterLogo onClick={() => handleNavigation('home')}>NEXORACREW</FooterLogo>
                            <p>
                                Transforming ideas into powerful digital products using modern technology, creativity, and AI. Where ideas Meet innovation.
                            </p>
                            <SocialIcons>
                                <a href="https://www.instagram.com/" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faInstagram} /></a>
                                <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faLinkedinIn} /></a>
                                <a href={`mailto:nexora.crew@gmail.com`}><FontAwesomeIcon icon={faEnvelope} /></a>
                            </SocialIcons>
                        </FooterColumn>

                        <FooterColumn>
                            <h4>Quick Links</h4>
                            <ul>
                                <li><a onClick={() => handleNavigation('home')}>Home</a></li>
                                <li><a onClick={() => handleNavigation('about')}>About Us</a></li>
                                <li><a onClick={() => handleNavigation('services')}>Services</a></li>
                                <li><a onClick={() => handleNavigation('contact')}>Careers & Process</a></li>
                                <li><a onClick={() => handleNavigation('contact')}>Contact</a></li>
                            </ul>
                        </FooterColumn>

                        <FooterColumn>
                            <h4>Services</h4>
                            <ul>
                                <li><a onClick={() => handleNavigation('services')}>Web Development</a></li>
                                <li><a onClick={() => handleNavigation('services')}>AI Solutions</a></li>
                                <li><a onClick={() => handleNavigation('services')}>SEO & Growth</a></li>
                                <li><a onClick={() => handleNavigation('services')}>Branding & Design</a></li>
                                <li><a onClick={() => handleNavigation('services')}>Server Architecture</a></li>
                            </ul>
                        </FooterColumn>

                        <FooterColumn>
                            <h4>Contact Info</h4>
                            <ul>
                                <li>
                                    <a href="#map" target="_blank" rel="noreferrer">
                                        <FontAwesomeIcon icon={faMapMarkerAlt} /> JJ College of Engineering and Technology, Trichy
                                    </a>
                                </li>
                                <li>
                                    <a href={`mailto:nexora.crew@gmail.com`}>
                                        <FontAwesomeIcon icon={faEnvelope} /> nexora.crew@gmail.com
                                    </a>
                                </li>
                                <li>
                                    <a href={`tel:+919597646460`}>
                                        <FontAwesomeIcon icon={faPhone} /> +91 95976 46460
                                    </a>
                                </li>
                            </ul>
                        </FooterColumn>
                    </FooterGrid>

                    <Copyright>
                        © 2025 NEXORACREW Team, Palakarai, Tiruchirappalli, Tamil Nadu
                    </Copyright>
                </FullFooter>
            </PageWrapper>
        </>
    );
};

export default AboutPage;