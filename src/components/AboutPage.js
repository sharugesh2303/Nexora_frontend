// src/components/AboutPage.jsx
import React, { useEffect, useRef } from 'react';
import styled, { createGlobalStyle, keyframes, css } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBullseye, faEye, faRocket, faPencilAlt,
    faCalendarCheck
} from '@fortawesome/free-solid-svg-icons';

/* ---------------- THEME ---------------- */
const NEON_COLOR = '#00e0b3';
const NAVY_BG = '#071025';
const PANEL_BG = '#0F172A';
const TEXT_LIGHT = '#E6F0F2';
const TEXT_MUTED = '#9AA8B8';
const BORDER_LIGHT = 'rgba(255,255,255,0.04)';

/* ---------------- KEYFRAMES ---------------- */
const softGlow = keyframes`
    0% { text-shadow: 0 0 10px ${NEON_COLOR}, 0 0 20px rgba(0,224,179,0.2); }
    50% { text-shadow: 0 0 18px ${NEON_COLOR}, 0 0 30px rgba(0,224,179,0.5); }
    100% { text-shadow: 0 0 10px ${NEON_COLOR}, 0 0 20px rgba(0,224,179,0.2); }
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
`;
const SectionSubtitle = styled.p`
    color: ${TEXT_MUTED};
    max-width: 900px;
`;

/* About Cards (Mission / Vision / Journey) */
const MVJGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px,1fr));
    gap: 20px;
    margin-top: 28px;
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

/* Footer */
const Footer = styled.footer`
    padding: 28px 36px;
    color: ${TEXT_MUTED};
    text-align: center;
    border-top: 1px solid rgba(255,255,255,0.04);
    margin-top: 60px;
`;

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
            body: safeAboutData.mission || 'Empower creativity through AI and innovation.'
        },
        {
            type: 'Vision',
            title: 'Our Vision',
            body: safeAboutData.vision || 'To become the most impactful student-led innovation hub.'
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

    return (
        <>
            <GlobalStyle />
            <StarCanvas ref={canvasRef} />

            <PageWrapper>
                {/* HEADER */}
                <Header>
                    <Logo onClick={() => onNavigate('home')}>NEXORA</Logo>
                    <NavGroup>
                        <span onClick={() => onNavigate('home')}>Home</span>
                        <span
                            onClick={() => onNavigate('about')}
                            style={{ color: NEON_COLOR }}
                        >
                            About
                        </span>
                        <span onClick={() => onNavigate('services')}>Services</span>
                        <span onClick={() => onNavigate('projects')}>Projects</span>
                        <span onClick={() => onNavigate('blog')}>Blog</span>
                        <span onClick={() => onNavigate('team')}>Team</span>

                        {/* NEW PROGRESS NAV ITEM */}
                        <span onClick={() => onNavigate('progress')}>Progress</span>

                        <span onClick={() => onNavigate('contact')}>Contact</span>
                        <span
                            onClick={() => onNavigate('schedule')}
                            style={{ color: NEON_COLOR, display: 'inline-flex', alignItems: 'center', gap: 6 }}
                        >
                            <FontAwesomeIcon icon={faCalendarCheck} />
                            Schedule Meeting
                        </span>
                    </NavGroup>
                </Header>

                {/* HERO */}
                <HeroAbout>
                    <div className="animate-in">
                        <HeroTitle className="glow">
                            {safeAboutData.heroTitle || 'Your Vision, Our '}{' '}
                            <span>Code</span>
                        </HeroTitle>

                        <HeroParagraph
                            className="animate-in"
                            style={{ animationDelay: '0.2s' }}
                        >
                            {safeAboutData.heroDescription ||
                                'Elevating businesses through cutting-edge digital innovation.'}
                        </HeroParagraph>
                    </div>
                </HeroAbout>

                {/* ABOUT CARDS */}
                <Section>
                    <SectionHeader>
                        About <span>NEXORA</span>
                    </SectionHeader>
                    <SectionSubtitle>
                        We are a student-powered creative tech consultancy shaping the future of
                        digital innovation.
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

                {/* CTA BUTTON */}
                <Section style={{ textAlign: 'center' }}>
                    <button
                        onClick={() => onNavigate('contact')}
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

                <Footer>
                    © 2025 NEXORACREW Team, Palakarai, Tiruchirappalli, Tamil Nadu
                </Footer>
            </PageWrapper>
        </>
    );
};

export default AboutPage;
