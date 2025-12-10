// src/components/AboutPage.jsx

import React, { useEffect, useRef, useState } from 'react';
import styled, { createGlobalStyle, keyframes, css } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBullseye,
    faEye,
    faRocket,
    faPencilAlt,
    faCalendar,
    faServer,
    faCheckCircle,
    faUsers,
    faBars,
    faEnvelope,
    faMapMarkerAlt,
    faPhone,
} from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';

/* ---------------- THEME ---------------- */

const NEON_COLOR = '#123165';          // primary navy
const PANEL_BG = '#FFFFFF';
const TEXT_LIGHT = '#111827';
const TEXT_MUTED = '#6B7280';
const BORDER_LIGHT = 'rgba(15,23,42,0.08)';
const VERY_DARK_BG = '#F3F4F6';       // light footer bg
const GOLD_ACCENT = '#D4A937';
const NAVY_STRIP_BG = '#050f25';      // navy strip bg

/* ---------------- KEYFRAMES ---------------- */

const softGlow = keyframes`
    0% { text-shadow: 0 0 10px ${GOLD_ACCENT}, 0 0 20px rgba(212,169,55,0.2); }
    50% { text-shadow: 0 0 18px ${GOLD_ACCENT}, 0 0 30px rgba(212,169,55,0.5); }
    100% { text-shadow: 0 0 10px ${GOLD_ACCENT}, 0 0 20px rgba(212,169,55,0.2); }
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
        background:
            radial-gradient(circle at 0% 0%, #fff9e8 0, #ffffff 35%, transparent 55%),
            linear-gradient(180deg, #ffffff 0%, #f5f7fb 40%, #e5edf7 100%);
        color: ${TEXT_LIGHT};
        overflow-x: hidden;
    }

    .neon-text-shadow {
        text-shadow: 0 0 12px ${GOLD_ACCENT}, 0 0 25px rgba(212,169,55,0.25);
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
    background: rgba(255,255,255,0.95);
    backdrop-filter: blur(14px);
    border-bottom: 1px solid ${BORDER_LIGHT};
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
    text-shadow: 0 0 8px rgba(18,49,101,0.35);
`;

const NavGroup = styled.div`
    display: flex;
    gap: 22px;
    align-items: center;
    margin-right: auto;

    @media (max-width: 1024px) {
        display: none;
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
        }

        &:after {
            content: '';
            position: absolute;
            left: 0;
            bottom: -2px;
            width: 0;
            height: 2px;
            background: ${GOLD_ACCENT};
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
    background: #ffffff;
    z-index: 100;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 80px;
    transform: translateX(${props => (props.isOpen ? '0' : '100%')});
    transition: transform 0.3s ease-in-out;
    box-shadow: -4px 0 20px rgba(15,23,42,0.15);

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
        font-size: 1.3rem;
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
    padding: 140px 36px 70px;
    max-width: 1200px;
    margin: 0 auto;

    @media (max-width: 780px) {
        padding: 120px 20px 50px;
        text-align: center;
    }
`;

const HeroTitle = styled.h1`
    font-size: 3.6rem;
    font-weight: 800;
    margin-bottom: 16px;
    line-height: 1.05;
    text-shadow: 0 8px 24px rgba(15,23,42,0.25);

    span {
        background: linear-gradient(120deg, ${NEON_COLOR}, ${GOLD_ACCENT});
        -webkit-background-clip: text;
        color: transparent;
    }

    &.glow {
        animation: ${css`${softGlow} 3s ease-in-out infinite`};
    }

    @media (max-width: 780px) {
        font-size: 2.6rem;
    }
`;

const HeroParagraph = styled.p`
    max-width: 760px;
    color: ${TEXT_MUTED};
    font-size: 1.05rem;
    line-height: 1.7;

    @media (max-width: 780px) {
        margin-left: auto;
        margin-right: auto;
        font-size: 1rem;
    }
`;

/* Generic Section */

const Section = styled.section`
    padding: 60px 36px;
    max-width: 1200px;
    margin: 0 auto;
    background: transparent;

    @media (max-width: 780px) {
        padding: 40px 20px;
    }
`;

const SectionHeader = styled.h2`
    font-size: 2.3rem;
    margin-bottom: 8px;
    color: ${TEXT_LIGHT};

    span {
        color: ${GOLD_ACCENT};
    }

    @media (max-width: 780px) {
        font-size: 2rem;
    }
`;

const SectionSubtitle = styled.p`
    color: ${TEXT_MUTED};
    max-width: 900px;
`;

/* Navy strip wrapper */

const PhilosophyStrip = styled.div`
    width: 100%;
    margin: 0;
    background: radial-gradient(circle at top, rgba(212,169,55,0.18), transparent 55%),
                ${NAVY_STRIP_BG};
    color: #f9fafb;
    padding: 50px 0 60px;
`;

/* METRICS */

const MetricsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 24px;
    margin-top: 40px;

    @media (max-width: 780px) {
        grid-template-columns: 1fr;
    }
`;

const MetricCard = styled.div`
    background: rgba(255,255,255,0.95);
    border-radius: 18px;
    padding: 22px 24px;
    border: 1px solid ${BORDER_LIGHT};
    box-shadow: 0 18px 45px rgba(15,23,42,0.12);
    animation: ${rollIn} 0.5s ease forwards;
    display: flex;
    flex-direction: column;
    gap: 8px;

    .icon-box {
        width: 40px;
        height: 40px;
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, rgba(18,49,101,0.05), rgba(212,169,55,0.15));
        color: ${NEON_COLOR};
        font-size: 1.3rem;
        margin-bottom: 4px;
    }

    .value {
        color: ${TEXT_LIGHT};
        font-size: 1.3rem;
        font-weight: 700;
        margin: 0;
    }

    .label {
        color: ${TEXT_MUTED};
        font-size: 0.9rem;
        margin: 0;
    }
`;

/* Philosophy Cards */

const MVJGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px,1fr));
    gap: 22px;
    margin-top: 28px;

    @media (max-width: 780px) {
        grid-template-columns: 1fr;
    }
`;

const MVJCard = styled.div`
    background: rgba(255,255,255,0.96);
    backdrop-filter: blur(14px);
    border-radius: 18px;
    padding: 26px;
    border: 1px solid ${BORDER_LIGHT};
    transition: 0.3s ease;
    box-shadow: 0 12px 40px rgba(15,23,42,0.35);
    position: relative;
    overflow: hidden;

    &:before {
        content: '';
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at top left, rgba(212,169,55,0.22), transparent 55%);
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
    }

    &:hover {
        transform: translateY(-10px);
        border-color: ${GOLD_ACCENT};
        box-shadow: 0 22px 70px rgba(15,23,42,0.5);
    }

    &:hover:before {
        opacity: 1;
    }

    .icon-box {
        width: 62px;
        height: 62px;
        border-radius: 18px;
        background: linear-gradient(135deg, rgba(18,49,101,0.08), rgba(212,169,55,0.25));
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 14px;
    }

    h3 {
        font-size: 1.2rem;
        color: ${TEXT_LIGHT};
    }

    /* allow multiline + bullet spacing */
    p {
        color: ${TEXT_MUTED};
        line-height: 1.55;
        white-space: pre-line;
    }
`;

/* FOOTER */

const FullFooter = styled.footer`
    background: ${VERY_DARK_BG};
    padding: 60px 50px 20px;
    color: ${TEXT_MUTED};
    border-top: 1px solid ${BORDER_LIGHT};

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
            left: 0;
            bottom: -5px;
            width: 30px;
            height: 2px;
            background: ${GOLD_ACCENT};
        }
    }

    p {
        font-size: 0.9rem;
        line-height: 1.6;
        margin: 0 0 10px 0;
    }
    ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    li {
        margin-bottom: 10px;
    }
    a, span {
        color: ${TEXT_MUTED};
        text-decoration: none;
        font-size: 0.9rem;
        transition: color 0.3s;
        display: inline-flex;
        align-items: center;
        gap: 8px;

        &:hover {
            color: ${NEON_COLOR};
        }
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
        width: 32px;
        height: 32px;
        border-radius: 999px;
        background: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${NEON_COLOR};
        transition: background 0.3s, color 0.3s, box-shadow 0.3s;

        &:hover {
            background: linear-gradient(135deg, ${NEON_COLOR}, ${GOLD_ACCENT});
            color: #ffffff;
            box-shadow: 0 8px 20px rgba(15,23,42,0.35);
        }
    }
`;

const Copyright = styled.div`
    text-align: center;
    font-size: 0.8rem;
    padding-top: 30px;
    border-top: 1px solid ${BORDER_LIGHT};
    margin-top: 50px;
`;

/* Section icons */

const SECTION_ICONS = {
    Mission: faBullseye,
    Vision: faEye,
    Journey: faRocket,
    Custom: faPencilAlt,
    Text: faPencilAlt,
    default: faPencilAlt,
};

const getSectionIcon = (type) => SECTION_ICONS[type] || SECTION_ICONS.default;

/* ---------------- COMPONENT ---------------- */

const AboutPage = ({ onNavigate = () => {}, aboutData = {} }) => {
    const canvasRef = useRef(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    /* Gold particle animation in background */
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

        const stars = Array.from({ length: 140 }, () => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            r: 1 + Math.random() * 2.2,
            dx: (Math.random() - 0.5) * 0.25,
            dy: 0.08 + Math.random() * 0.35,
            alpha: 0.15 + Math.random() * 0.35,
        }));

        let raf;
        const draw = () => {
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

            stars.forEach((s) => {
                s.x += s.dx;
                s.y += s.dy;

                if (s.y > window.innerHeight + 10) s.y = -10;
                if (s.x > window.innerWidth + 10) s.x = -10;
                if (s.x < -10) s.x = window.innerWidth + 10;

                ctx.fillStyle = `rgba(212,169,55,${s.alpha})`;
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
            body:
                safeAboutData.mission ||
                `Nexora-Mission Statement 

Our mission is to help businesses grow through powerful digital solutions.

We aim to:

✨Design intuitive and impactful user experiences
✨Build high-performance websites, apps, and SaaS platforms
✨Deliver technology that improves efficiency and customer engagement
✨Provide scalable and customized solutions for every business need
✨Blend creativity, strategy, and engineering to deliver real value


At Nexora, we transform ideas into digital realities, ensuring that every project contributes to our clients’ long-term success.`,
        },
        {
            type: 'Vision',
            title: 'Our Vision',
            body:
                safeAboutData.vision ||
                `Nexora – Vision Statement 

💫To become a leading force in digital innovation by creating meaningful, human-centered technology that transforms businesses and shapes the future of digital experiences.`,
        },
        {
            type: 'Journey',
            title: 'Our Journey',
            body:
                safeAboutData.journey ||
                'We started as a small student team and grew into a focused digital product studio, blending technology, creativity, and AI.',
        },
    ];

    const mvjSections = initialSections.filter((s) => s.body);
    const customBlocks = Array.isArray(safeAboutData.sections)
        ? safeAboutData.sections.filter((s) => s.type === 'Custom' || s.type === 'Text')
        : [];

    const metricData = [
        { icon: faCalendar, label: 'Founded', value: '25 Sep 2025' },
        { icon: faServer, label: 'Incubation Access', value: 'Nov 2025' },
        { icon: faCheckCircle, label: 'Projects Done', value: 'Major 2+' },
        { icon: faUsers, label: 'Interns', value: '30+' },
    ];

    const handleNavigation = (route) => {
        onNavigate(route);
        setIsMobileMenuOpen(false);
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
                            style={{ color: NEON_COLOR}}
                        >
                            About
                        </span>
                        <span onClick={() => handleNavigation('services')}>Services</span>
                        <span onClick={() => handleNavigation('projects')}>Projects</span>
                        <span onClick={() => handleNavigation('blog')}>Blog</span>
                        <span onClick={() => handleNavigation('team')}>Team</span>
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
                    <span onClick={() => handleNavigation('about')} style={{ color: NEON_COLOR }}>
                        About
                    </span>
                    <span onClick={() => handleNavigation('services')}>Services</span>
                    <span onClick={() => handleNavigation('projects')}>Projects</span>
                    <span onClick={() => handleNavigation('blog')}>Blog</span>
                    <span onClick={() => handleNavigation('team')}>Team</span>
                    <span onClick={() => handleNavigation('progress')}>Progress</span>
                    <span onClick={() => handleNavigation('contact')}>Contact</span>
                </MobileNavMenu>

                {/* WHO WE ARE */}
                <HeroAbout>
                    <div className="animate-in">
                        <HeroTitle className="glow">
                            Who We <span>Are</span>
                        </HeroTitle>

                        <HeroParagraph
                            className="animate-in"
                            style={{ animationDelay: '0.2s' }}
                        >
                            Nexoracrew is an MSME-registered student startup from JJ College of
                            Engineering &amp; Technology, Trichy. We don’t just write code; we
                            transform raw ideas into powerful, polished digital products using
                            modern technology, thoughtful design, and Artificial Intelligence.
                        </HeroParagraph>
                    </div>

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

                {/* Separator */}
                <hr style={{ border: BORDER_LIGHT, maxWidth: 1200, margin: '50px auto' }} />

                {/* NAVY STRIP: Philosophy + CTA */}
                <PhilosophyStrip>
                    <Section>
                        <SectionHeader style={{ color: '#F9FAFB' }}>
                            Our <span>Philosophy</span>
                        </SectionHeader>
                        <SectionSubtitle style={{ color: 'rgba(249,250,251,0.82)' }}>
                            These core values guide every decision we make, from the smallest code
                            commit to major collaborations.
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
                                            color="#ffffff"
                                            size="lg"
                                        />
                                    </div>
                                    <h3>{section.title}</h3>
                                    <p>{section.body}</p>
                                </MVJCard>
                            ))}
                        </MVJGrid>
                    </Section>

                    <Section style={{ textAlign: 'center', paddingTop: 10 }}>
                        <button
                            onClick={() => handleNavigation('contact')}
                            className="animate-in"
                            style={{
                                padding: '14px 32px',
                                background: `linear-gradient(135deg, ${NEON_COLOR}, ${GOLD_ACCENT})`,
                                border: 'none',
                                borderRadius: 999,
                                color: '#ffffff',
                                fontWeight: 700,
                                cursor: 'pointer',
                                boxShadow: '0 14px 40px rgba(0,0,0,0.45)',
                                fontSize: '1.05rem',
                            }}
                        >
                            Let’s Collaborate
                        </button>
                    </Section>
                </PhilosophyStrip>

                {/* CUSTOM TEXT SECTIONS */}
                {customBlocks.map((block, idx) => (
                    <Section key={idx}>
                        <h2
                            className="animate-in"
                            style={{
                                background: `linear-gradient(120deg, ${NEON_COLOR}, ${GOLD_ACCENT})`,
                                WebkitBackgroundClip: 'text',
                                color: 'transparent',
                            }}
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

                {/* FOOTER */}
                <FullFooter>
                    <FooterGrid>
                        <FooterColumn style={{ minWidth: '300px' }}>
                            <FooterLogo onClick={() => handleNavigation('home')}>
                                NEXORACREW
                            </FooterLogo>
                            <p>
                                Transforming ideas into powerful digital products using modern
                                technology, creativity, and AI. Where ideas meet innovation.
                            </p>
                            <SocialIcons>
                                <a
                                    href="https://www.instagram.com/"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <FontAwesomeIcon icon={faInstagram} />
                                </a>
                                <a
                                    href="https://www.linkedin.com/"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <FontAwesomeIcon icon={faLinkedinIn} />
                                </a>
                                <a href={`mailto:nexora.crew@gmail.com`}>
                                    <FontAwesomeIcon icon={faEnvelope} />
                                </a>
                            </SocialIcons>
                        </FooterColumn>

                        <FooterColumn>
                            <h4>Quick Links</h4>
                            <ul>
                                <li>
                                    <a onClick={() => handleNavigation('home')}>Home</a>
                                </li>
                                <li>
                                    <a onClick={() => handleNavigation('about')}>About Us</a>
                                </li>
                                <li>
                                    <a onClick={() => handleNavigation('services')}>Services</a>
                                </li>
                                <li>
                                    <a onClick={() => handleNavigation('contact')}>
                                        Careers &amp; Process
                                    </a>
                                </li>
                                <li>
                                    <a onClick={() => handleNavigation('contact')}>Contact</a>
                                </li>
                            </ul>
                        </FooterColumn>

                        <FooterColumn>
                            <h4>Services</h4>
                            <ul>
                                <li>
                                    <a onClick={() => handleNavigation('services')}>
                                        Web Development
                                    </a>
                                </li>
                                <li>
                                    <a onClick={() => handleNavigation('services')}>
                                        AI Solutions
                                    </a>
                                </li>
                                <li>
                                    <a onClick={() => handleNavigation('services')}>
                                        SEO &amp; Growth
                                    </a>
                                </li>
                                <li>
                                    <a onClick={() => handleNavigation('services')}>
                                        Branding &amp; Design
                                    </a>
                                </li>
                                <li>
                                    <a onClick={() => handleNavigation('services')}>
                                        Server Architecture
                                    </a>
                                </li>
                            </ul>
                        </FooterColumn>

                        <FooterColumn>
                            <h4>Contact Info</h4>
                            <ul>
                                <li>
                                    <a href="#map" target="_blank" rel="noreferrer">
                                        <FontAwesomeIcon icon={faMapMarkerAlt} /> JJ College of
                                        Engineering and Technology, Trichy
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
