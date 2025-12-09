// src/pages/HomePage.jsx
import React, { useEffect, useRef, useState } from 'react';
import styled, { createGlobalStyle, keyframes, css } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUsers,
    faEnvelope,
    faClipboardList,
    faStar,
    faClock,
    faMapMarkerAlt, // Added for Contact Info location
    faPhone, // Added for Contact Info phone
    faBars, // Added for mobile menu icon
} from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import axios from 'axios';

/* ------------------------------------------------------------------
    FIX APPLIED HERE: Using process.env.REACT_APP_API_BASE_URL 
    to match the environment variable key set in Vercel.
------------------------------------------------------------------ */
const API_CONFIG_KEY = process.env.REACT_APP_API_BASE_URL || '';

/* -------------------------
    DESIGN TOKENS
    ------------------------- */
const NEON_COLOR = '#00e0b3'; // Teal/Green Neon
// const PURPLE_COLOR = '#6200ff'; // Removed/Replaced
const DARK_BG = '#0F172A';
const LIGHT_TEXT = '#E2E8F0';
const MUTED_TEXT = '#A9B7C7';
const VERY_DARK_BG = '#02040a'; // For sections like Footer

// --- API Configuration ---
const API_BASE_URL = API_CONFIG_KEY.replace(/\/$/, '');
const MILESTONE_FETCH_URL = API_BASE_URL ? `${API_BASE_URL}/api/milestones` : '/api/milestones';
const STORY_FETCH_URL = API_BASE_URL ? `${API_BASE_URL}/api/stories` : '/api/stories'; // <--- NEW ENDPOINT

/* -------------------------
    GLOBAL STYLE
    ------------------------- */
const GlobalStyle = createGlobalStyle`
    html, body, #root { height: 100%; }
    body {
        margin: 0;
        font-family: 'Poppins', sans-serif;
        background: ${DARK_BG};
        color: ${LIGHT_TEXT};
        overflow-x: hidden;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        --dpr-scale: 1;
    }
    .neon-text-shadow {
        text-shadow: 0 0 3px ${NEON_COLOR}, 0 0 8px rgba(0,224,179,0.5);
    }
`;

/* -------------------------
    KEYFRAMES
    ------------------------- */
const fadeUp = keyframes`
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
`;

const rollIn = keyframes`
    from { opacity: 0; transform: translateY(30px) scale(0.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
`;

const flagWave = keyframes`
    0% { transform: translateY(0) rotate(0deg); }
    25% { transform: translateY(-10px) rotate(-1.5deg); }
    50% { transform: translateY(0) rotate(0deg); }
    75% { transform: translateY(8px) rotate(1deg); }
    100% { transform: translateY(0) rotate(0deg); }
`;

const glowPulse = keyframes`
    0% { text-shadow: 0 0 8px ${NEON_COLOR}, 0 0 18px rgba(0,224,179,0.5); }
    50% { text-shadow: 0 0 18px ${NEON_COLOR}, 0 0 30px rgba(0,224,179,0.8); }
    100% { text-shadow: 0 0 8px ${NEON_COLOR}, 0 0 18px rgba(0,224,179,0.5); }
`;

/* -------------------------
    STAR CANVAS
    ------------------------- */
const StarCanvas = styled.canvas`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 0;
    pointer-events: none;
    display: block;
    background: radial-gradient(circle at 10% 10%, #071022 0%, #081226 25%, #071020 55%, #05060a 100%);
`;

/* -------------------------
    PAGE LAYER
    ------------------------- */
const PageLayer = styled.div`
    position: relative;
    z-index: 2;
    overflow-x: hidden;
`;

/* -------------------------
    HEADER 
    ------------------------- */
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

    @media (max-width: 768px) {
        padding: 14px 20px;
        gap: 20px;
    }
`;

const Logo = styled.h1`
    color: ${NEON_COLOR};
    font-size: 1.8rem;
    font-weight: 800;
    cursor: pointer;
    letter-spacing: 1px;
    text-shadow: 0 0 12px ${NEON_COLOR};
    margin: 0;

    @media (max-width: 480px) {
        font-size: 1.5rem;
    }
`;

const NavGroup = styled.div`
    display: flex;
    gap: 22px;
    align-items: center;
    margin-right: auto;

    @media (max-width: 1024px) {
        display: none; /* Hide desktop nav for simplicity on smaller screens */
    }

    span {
        color: ${MUTED_TEXT};
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
    background: none;
    border: none;
    color: ${NEON_COLOR};
    font-size: 1.5rem;
    cursor: pointer;
    margin-left: auto;

    @media (max-width: 1024px) {
        display: block;
    }
`;

/* -------------------------
    UTILITIES / HOOKS
    ------------------------- */
const useIntersectionObserver = (options) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                // We unobserve after it becomes visible to run the animation only once
                if (ref.current && options.unobserveAfterVisible !== false) {
                    observer.unobserve(ref.current);
                }
            } else if (options.repeat) {
                // If repeat is true, reset visibility when it leaves
                setIsVisible(false);
            }
        }, options);

        if (ref.current) observer.observe(ref.current);

        return () => {
            if (ref.current) observer.unobserve(ref.current);
            observer.disconnect();
        };
    }, [options]);

    return [ref, isVisible];
};

/* -------------------------
    ANIMATED SECTION
    ------------------------- */
const AnimatedSection = styled.div.attrs(props => ({
    'data-visible': props.isVisible ? 'true' : 'false',
}))`
    opacity: 0;
    transform: translateY(30px) scale(0.95);
    will-change: opacity, transform;

    ${props => props['data-visible'] === 'true' && css`
        animation: ${rollIn} 0.8s cubic-bezier(0.25,0.46,0.45,0.94) forwards;
        animation-delay: ${props.delay || '0s'};
    `}
`;

/* -------------------------
    HERO COMPONENTS
    ------------------------- */
const HeroSection = styled.section`
    min-height: 90vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 120px 20px 80px;
    box-sizing: border-box;
    animation: ${fadeUp} 0.9s ease forwards;

    @media (max-width: 768px) {
        min-height: 75vh;
        padding: 80px 20px 60px;
    }
`;

const HeroInner = styled.div`
    max-width: 1200px;
    width: 100%;
    display: flex;
    gap: 60px;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`;

const TextBlock = styled.div`
    max-width: 1200px;
    color: ${LIGHT_TEXT};
    text-align: center;
`;

const Headline = styled.h1`
    font-size: clamp(2.4rem, 6vw, 6.5rem);
    line-height: 0.95;
    margin: 0 0 18px 0;
    letter-spacing: -0.02em;
    display: inline-block;
    will-change: transform;
    animation: ${glowPulse} 3s infinite ease-in-out;
    color: ${LIGHT_TEXT};
    span.word { display: inline-block; margin: 0 0.5rem; }

    @media (max-width: 480px) {
        font-size: clamp(2rem, 10vw, 4rem);
    }
`;

const Letter = styled.span`
    display: inline-block;
    transform-origin: center bottom;
    animation: ${flagWave} 2.2s ease-in-out infinite;
    transform: translateY(0) rotate(0deg) scale(var(--dpr-scale, 1));
    &.neon {
        color: ${NEON_COLOR};
        filter: drop-shadow(0 0 8px ${NEON_COLOR});
    }
`;

const Subtitle = styled.p`
    color: ${MUTED_TEXT};
    font-size: clamp(0.95rem, 1.2vw, 1.05rem);
    margin: 16px 0 28px;
    line-height: 1.6;
    max-width: 900px;
    margin-left: auto;
    margin-right: auto;

    @media (max-width: 480px) {
        font-size: 0.9rem;
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    justify-content: center;
`;

const PrimaryBtn = styled.button`
    background: ${NEON_COLOR};
    color: ${DARK_BG};
    padding: 12px 26px;
    border-radius: 10px;
    font-weight: 700;
    box-shadow: 0 10px 30px rgba(0,224,179,0.25);
    display: inline-flex;
    align-items: center;
    gap: 10px;
    transition: transform .18s ease, box-shadow .18s ease;
    border: none;
    cursor: pointer;
    &:hover { transform: translateY(-3px); box-shadow: 0 16px 40px rgba(0,224,179,0.35); }

    @media (max-width: 480px) {
        padding: 10px 20px;
        font-size: 0.9rem;
    }
`;

const SecondaryBtn = styled(PrimaryBtn)`
    background: transparent;
    color: ${LIGHT_TEXT};
    border: 1px solid rgba(255,255,255,0.06);
    box-shadow: none;
    &:hover { box-shadow: 0 0 10px rgba(255,255,255,0.1); }
`;

/* -------------------------
    MILESTONES
    ------------------------- */
const MilestonesSection = styled.section`
    padding: 80px 20px;
    background: transparent;
    text-align: center;

    @media (max-width: 768px) {
        padding: 60px 20px;
    }
`;

const MilestonesHeader = styled.h2`
    font-size: 1.2rem;
    color: ${NEON_COLOR};
    text-transform: uppercase;
    letter-spacing: 0.15em;
    margin-bottom: 50px;
`;

const MilestonesGrid = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 30px;
    justify-items: center;

    @media (max-width: 600px) {
        grid-template-columns: repeat(2, 1fr); /* 2 columns for smaller phones */
        gap: 20px;
    }

    @media (max-width: 400px) {
        grid-template-columns: 1fr; /* 1 column for very narrow screens */
    }
`;

const MilestoneCard = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
`;

const MilestoneIcon = styled.div`
    width: 80px;
    height: 80px;
    background: ${NEON_COLOR};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    box-shadow: 0 0 20px rgba(0,224,179,0.4);

    ${props => props.isExperience && css`
        background: #008060;
        box-shadow: 0 0 20px rgba(0,128,96,0.4);
    `}

    .svg-inline--fa {
        color: ${DARK_BG};
        font-size: 36px;
        ${props => props.isExperience && css` color: ${LIGHT_TEXT}; `}
    }
`;

const MilestoneNumberText = styled.p`
    margin: 0 0 5px 0;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    line-height: 1;
    justify-content: center;

    .num {
        font-size: 3.5rem;
        font-weight: 800;
        color: ${LIGHT_TEXT};
        display: inline-block;
        line-height: 1;
        letter-spacing: -0.02em;
    }

    .plus {
        font-size: 3.5rem;
        color: #ffffff;
        font-weight: 900;
        line-height: 1;
        display: inline-block;
        margin-left: 6px;
        filter: drop-shadow(0 0 6px rgba(255,255,255,0.06));
    }

    @media (max-width: 480px) {
        .num { font-size: 2.4rem; }
        .plus { font-size: 2.4rem; margin-left: 4px; }
    }
`;

const MilestoneDescription = styled.p`
    font-size: 1rem;
    color: ${MUTED_TEXT};
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.05em;

    @media (max-width: 480px) {
        font-size: 0.85rem;
    }
`;

/* -------------------------
    NEW SECTION: TRUSTED PARTNERS
    ------------------------- */
const PartnersSection = styled.section`
    padding: 60px 20px;
    text-align: center;
`;

const PartnersHeader = styled.p`
    font-size: 0.85rem;
    color: ${MUTED_TEXT};
    text-transform: uppercase;
    letter-spacing: 0.2em;
    margin-bottom: 40px;
    font-weight: 500;
`;

const PartnersGrid = styled.div`
    max-width: 900px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 40px 60px;

    @media (max-width: 480px) {
        gap: 30px 40px;
    }
`;

const PartnerLogo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    opacity: 0.65;
    transition: opacity 0.3s;
    cursor: pointer;
    max-width: 150px;

    &:hover { opacity: 1; }

    .icon-box {
        width: 45px;
        height: 45px;
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 8px;
        background: rgba(255,255,255,0.02);
    }

    p {
        margin: 0;
        font-size: 0.75rem;
        color: ${MUTED_TEXT};
        text-transform: uppercase;
        letter-spacing: 0.1em;
        font-weight: 500;
    }
`;

/* -------------------------
    NEW SECTION: POWERFUL STACK
    ------------------------- */
const StackSection = styled.section`
    padding: 80px 20px;
    text-align: center;

    @media (max-width: 768px) {
        padding: 60px 20px;
    }
`;

const StackTitle = styled.h2`
    font-size: clamp(1.8rem, 4vw, 3rem);
    font-weight: 800;
    margin: 0 0 8px 0;
    color: ${LIGHT_TEXT};
    
    span {
        color: ${NEON_COLOR}; /* Changed from PURPLE_COLOR */
        text-shadow: 0 0 10px rgba(0,224,179,0.4); /* Neon Glow */
    }

    @media (max-width: 480px) {
        font-size: 2rem;
    }
`;

const StackSubtitle = styled.p`
    font-size: 1rem;
    color: ${MUTED_TEXT};
    margin-bottom: 50px;

    @media (max-width: 480px) {
        font-size: 0.9rem;
        margin-bottom: 30px;
    }
`;

const StackGrid = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 25px;

    @media (max-width: 600px) {
        grid-template-columns: 1fr; /* Stack columns on small screens */
    }
`;

const StackCard = styled.div`
    background: rgba(255,255,255,0.03);
    border-radius: 12px;
    padding: 30px;
    text-align: left;
    border-top: 3px solid transparent;
    transition: all 0.3s ease;
    cursor: default;

    &:hover {
        border-top-color: ${NEON_COLOR};
        transform: translateY(-5px);
        box-shadow: 0 10px 30px rgba(0,0,0,0.15);
    }
    
    @media (max-width: 480px) {
        padding: 20px;
        h3 { font-size: 1.2rem; }
        p { font-size: 0.85rem; }
    }

    h3 {
        font-size: 1.3rem;
        color: ${LIGHT_TEXT};
        margin: 0 0 8px 0;
        font-weight: 700;
    }

    p {
        font-size: 0.9rem;
        color: ${MUTED_TEXT};
        margin: 0;
    }
`;

/* -------------------------
    NEW SECTION: CLIENT STORIES
    ------------------------- */
const StoriesSection = styled.section`
    padding: 80px 20px;
    background: ${VERY_DARK_BG};
    text-align: center;

    @media (max-width: 768px) {
        padding: 60px 20px;
    }
`;

const StoriesTitle = styled.h2`
    font-size: clamp(1.8rem, 4vw, 3rem);
    font-weight: 800;
    margin: 0 0 50px 0;
    color: ${LIGHT_TEXT};

    span {
        color: ${NEON_COLOR}; /* Changed from PURPLE_COLOR */
        text-shadow: 0 0 10px rgba(0,224,179,0.4); /* Neon Glow */
    }

    @media (max-width: 480px) {
        font-size: 2rem;
    }
`;

const StoriesGrid = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 30px;

    @media (max-width: 768px) {
        grid-template-columns: 1fr; /* Stack columns on tablets/phones */
    }
`;

const StoryCard = styled(AnimatedSection)`
    background: rgba(255,255,255,0.03);
    border-radius: 12px;
    padding: 30px;
    text-align: left;
    min-height: 180px; 
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border: 1px solid rgba(255,255,255,0.05);

    .quote-icon {
        color: #FFC72C; /* Gold-like color for star */
        font-size: 1.2rem;
        margin-bottom: 15px;
    }

    .quote-text {
        font-style: italic;
        color: ${LIGHT_TEXT};
        line-height: 1.6;
        font-size: 0.95rem;
        margin-bottom: 20px;
    }

    .author-info {
        border-top: 1px solid rgba(255,255,255,0.05);
        padding-top: 15px;
        p { margin: 0; line-height: 1.4; }
        .name { color: ${NEON_COLOR}; font-weight: 600; font-size: 1rem; }
        .role { color: ${MUTED_TEXT}; font-size: 0.85rem; }
    }
`;

/* -------------------------
    NEW SECTION: CTA (Join the Future)
    ------------------------- */
const CtaSection = styled.section`
    padding: 100px 20px;
    text-align: center;

    @media (max-width: 768px) {
        padding: 60px 20px;
    }
`;

const CtaContainer = styled.div`
    max-width: 900px;
    margin: 0 auto;
    padding: 60px 40px;
    border-radius: 20px;
    /* Updated to Neon/Teal Gradient */
    background: linear-gradient(135deg, #008060, #00e0b3); 
    box-shadow: 0 20px 60px rgba(0, 224, 179, 0.4);

    @media (max-width: 768px) {
        padding: 40px 20px;
    }

    h2 {
        font-size: clamp(2rem, 5vw, 4rem);
        color: ${LIGHT_TEXT};
        margin-top: 0;
        margin-bottom: 15px;
        font-weight: 900;
        letter-spacing: -0.05em;

        @media (max-width: 480px) {
            font-size: 2.5rem;
        }
    }

    p {
        color: rgba(255,255,255,0.8);
        font-size: 1.1rem;
        margin-bottom: 30px;

        @media (max-width: 480px) {
            font-size: 0.95rem;
            margin-bottom: 25px;
        }
    }

    button {
        background: ${LIGHT_TEXT};
        color: ${DARK_BG}; /* Button text is dark on light background */
        font-weight: 700;
        padding: 12px 30px;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;

        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }
    }
`;

/* -------------------------
    FULL FOOTER
    ------------------------- */
const FullFooter = styled.footer`
    background: ${VERY_DARK_BG};
    padding: 60px 50px 20px;
    color: ${MUTED_TEXT};
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
    min-width: 200px; /* Standardize column width */

    @media (max-width: 768px) {
        min-width: unset;
        width: 100%;
        margin-bottom: 10px;
    }

    h4 {
        color: ${LIGHT_TEXT};
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
        color: ${MUTED_TEXT};
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
        color: ${LIGHT_TEXT};
        transition: background 0.3s, color 0.3s;

        &:hover {
            background: ${NEON_COLOR};
            color: ${DARK_BG};
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

/* -------------------------
    Count-up component 
    ------------------------- */
const CountUpNumber = ({ targetNumber, duration = 1500, isVisible, delay = 0, showPlus = true }) => {
    const [count, setCount] = useState(0);
    const prevIsVisible = useRef(false);

    const rawTarget = Number(targetNumber) || 0;

    useEffect(() => {
        if (isVisible && !prevIsVisible.current) {
            let start = 0;
            const steps = Math.max(6, Math.round(duration / 16));
            const stepValue = rawTarget / steps;
            const startTime = Date.now() + (parseFloat(delay) * 1000 || 0);

            const timer = setInterval(() => {
                const now = Date.now();
                if (now < startTime) return;
                start += stepValue;
                if (start >= rawTarget) {
                    setCount(rawTarget);
                    clearInterval(timer);
                } else {
                    setCount(Math.round(start));
                }
            }, 16);

            prevIsVisible.current = true;
            return () => clearInterval(timer);
        }
    }, [isVisible, rawTarget, duration, delay]);

    return (
        <MilestoneNumberText aria-hidden>
            <span className="num">{Math.round(count).toLocaleString()}</span>
            {showPlus && <span className="plus">+</span>}
        </MilestoneNumberText>
    );
};

/* -------------------------
    ICON MAP 
    ------------------------- */
const ICON_MAP = {
    projects: faClipboardList,
    experience: faStar,
    clients: faUsers,
    hours: faClock
};

/* -------------------------
    renderAnimatedTitle helper
    ------------------------- */
const renderAnimatedTitle = (text, neonWord = 'NEXORACREW') => {
    const words = text.split(' ');
    return words.map((w, wi) => (
        <span className="word" key={`w-${wi}`}>
            {Array.from(w).map((ch, li) => {
                const isNeon = w.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() === neonWord;
                const globalIndex = words.slice(0, wi).join(' ').length + li + wi;
                const delay = (globalIndex % 20) * 0.04;
                return (
                    <Letter
                        key={`l-${wi}-${li}`}
                        className={isNeon ? 'neon' : ''}
                        style={{ animationDelay: `${delay}s` }}
                    >
                        {ch}
                    </Letter>
                );
            })}
            {wi !== words.length - 1 && ' '}
        </span>
    ));
};

/* -------------------------
    HomePage component
    ------------------------- */
const HomePage = ({ onNavigate = () => {}, generalData = {}, homeData = {} }) => {
    const canvasRef = useRef(null);
    const rafRef = useRef(null);
    const dprReference = useRef(typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1);

    const [milestones, setMilestones] = useState([]);
    const [clientStories, setClientStories] = useState([]); // <--- NEW STATE FOR STORIES
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    // Intersection Observers for new sections
    const [milestonesRef, isMilestonesVisible] = useIntersectionObserver({ threshold: 0.2, rootMargin: '0px 0px -100px 0px' });
    const [storiesRef, isStoriesVisible] = useIntersectionObserver({ threshold: 0.2, rootMargin: '0px 0px -50px 0px' });
    const [ctaRef, isCtaVisible] = useIntersectionObserver({ threshold: 0.2, rootMargin: '0px 0px -50px 0px' });
    
    /* ---------- fetch & poll milestones ---------- */
    useEffect(() => {
        let cancelled = false;
        let intervalId = null;

        const fetchMilestones = async () => {
            try {
                const res = await axios.get(MILESTONE_FETCH_URL);
                if (cancelled) return;
                const data = Array.isArray(res.data) ? res.data : [];

                const mapped = data.map((m, i) => {
                    const key = (m.key || '').toString().toLowerCase();
                    const icon = ICON_MAP[key] || ICON_MAP['projects'];
                    const isExperience = key === 'experience' || key === 'years' || key === 'year';
                    const count = typeof m.count === 'number' ? m.count : Number(m.count) || 0;
                    return {
                        icon,
                        number: count,
                        description: m.label || (key || '').replace(/_/g, ' '),
                        delay: `${(i * 0.12).toFixed(2)}s`,
                        isExperience,
                        key
                    };
                });

                setMilestones(mapped);
            } catch (err) {
                console.error('API Error: Could not fetch milestones.', MILESTONE_FETCH_URL, err?.message || err);
            }
        };

        const poll = async () => {
            if (document.hidden) return;
            await fetchMilestones();
        };

        poll();
        intervalId = setInterval(poll, 5000);

        const onVis = () => { if (!document.hidden) poll(); };
        document.addEventListener('visibilitychange', onVis);

        return () => {
            cancelled = true;
            clearInterval(intervalId);
            document.removeEventListener('visibilitychange', onVis);
        };
    }, []);

    /* ---------- fetch client stories (NEW) ---------- */
    useEffect(() => {
        const fetchStories = async () => {
            try {
                const res = await axios.get(STORY_FETCH_URL);
                const data = Array.isArray(res.data) ? res.data : [];
                if (data.length > 0) {
                    setClientStories(data);
                } else {
                    // Fallback data if API returns empty
                    setClientStories([
                       { _id: 'default1', quote: "Nexoracrew built a fully functional digital canteen portal with modern UI. Excellent work.", author: "Principal", role: "JJ College of Engineering" },
                       { _id: 'default2', quote: "A strong team with dedication and talent. We truly appreciate their passion.", author: "Team Securix", role: "Security Partner" },
                       { _id: 'default3', quote: "The Nexoracrew team delivered a secure and user-friendly payslip system ahead of time.", author: "HOD", role: "Cybersecurity Dept." },
                    ]);
                }
            } catch (err) {
                console.error('Could not fetch stories:', err);
                // Fallback data on error
                setClientStories([
                    { _id: 'default1', quote: "Nexoracrew built a fully functional digital canteen portal with modern UI. Excellent work.", author: "Principal", role: "JJ College of Engineering" },
                    { _id: 'default2', quote: "A strong team with dedication and talent. We truly appreciate their passion.", author: "Team Securix", role: "Security Partner" },
                    { _id: 'default3', quote: "The Nexoracrew team delivered a secure and user-friendly payslip system ahead of time.", author: "HOD", role: "Cybersecurity Dept." },
                 ]);
            }
        };
        fetchStories();
    }, []);

    /* ---------- Canvas / stars drawing ---------- */
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: true });

        const setSize = () => {
            const dprLocal = Math.max(1, window.devicePixelRatio || 1);
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            canvas.width = Math.round(window.innerWidth * dprLocal);
            canvas.height = Math.round(window.innerHeight * dprLocal);
            ctx.setTransform(dprLocal, 0, 0, dprLocal, 0, 0);
        };
        setSize();

        let width = canvas.width / (window.devicePixelRatio || 1);
        let height = canvas.height / (window.devicePixelRatio || 1);

        const starCount = Math.max(80, Math.floor((window.innerWidth * window.innerHeight) / 50000));
        const stars = Array.from({ length: starCount }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            baseR: 0.6 + Math.random() * 1.6,
            dx: (Math.random() - 0.5) * 0.25,
            dy: 0.15 + Math.random() * 0.7,
            alpha: 0.3 + Math.random() * 0.7,
            twinklePhase: Math.random() * Math.PI * 2,
            twinkleSpeed: 0.004 + Math.random() * 0.014,
            glow: 3 + Math.random() * 6
        }));

        const orbs = Array.from({ length: 5 }, (_, i) => ({
            x: Math.random() * width,
            y: Math.random() * (height * 0.6),
            radius: 70 + Math.random() * 140,
            vx: (Math.random() - 0.5) * 0.12,
            vy: (Math.random() - 0.5) * 0.06,
            color: i % 2 ? 'rgba(98,0,255,0.035)' : 'rgba(0,224,179,0.05)'
        }));

        let meteors = [];
        function spawnMeteor() {
            const startX = Math.random() < 0.5 ? -80 : width + 80;
            const startY = Math.random() * height * 0.45;
            const dir = startX < 0 ? 1 : -1;
            meteors.push({
                x: startX,
                y: startY,
                vx: dir * (4 + Math.random() * 6),
                vy: 1 + Math.random() * 2,
                length: 80 + Math.random() * 140,
                life: 0,
                maxLife: 40 + Math.floor(Math.random() * 40)
            });
        }
        let meteorTimer = 0;
        const meteorIntervalBase = 360;

        const onResize = () => {
            setSize();
            width = canvas.width / (window.devicePixelRatio || 1);
            height = canvas.height / (window.devicePixelRatio || 1);
        };
        window.addEventListener('resize', onResize);

        function draw() {
            ctx.clearRect(0, 0, width, height);
            const gBg = ctx.createLinearGradient(0, 0, 0, height);
            gBg.addColorStop(0, '#071025');
            gBg.addColorStop(1, '#02040a');
            ctx.fillStyle = gBg;
            ctx.fillRect(0, 0, width, height);

            orbs.forEach(orb => {
                orb.x += orb.vx;
                orb.y += orb.vy;
                if (orb.x < -200) orb.x = width + 200;
                if (orb.x > width + 200) orb.x = -200;
                if (orb.y < -200) orb.y = height + 200;
                if (orb.y > height + 200) orb.y = -200;

                const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
                grad.addColorStop(0, orb.color);
                grad.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.globalCompositeOperation = 'lighter';
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.closePath();
                ctx.globalCompositeOperation = 'source-over';
            });

            stars.forEach(s => {
                s.twinklePhase += s.twinkleSpeed;
                const tw = 0.5 + Math.sin(s.twinklePhase) * 0.5;
                const radius = s.baseR * (0.8 + tw * 1.5);
                const glowR = radius * s.glow;

                s.x += s.dx;
                s.y += s.dy;
                if (s.y > height + 10) s.y = -10;
                if (s.x > width + 10) s.x = -10;
                if (s.x < -10) s.x = width + 10;

                const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, glowR);
                grad.addColorStop(0, `rgba(255,255,255,${0.9 * s.alpha})`);
                grad.addColorStop(0.1, `rgba(0,224,179,${0.55 * s.alpha})`);
                grad.addColorStop(0.35, `rgba(0,224,179,${0.18 * s.alpha})`);
                grad.addColorStop(1, 'rgba(0,0,0,0)');

                ctx.globalCompositeOperation = 'lighter';
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(s.x, s.y, glowR, 0, Math.PI * 2);
                ctx.fill();
                ctx.closePath();

                ctx.fillStyle = `rgba(255,255,255,${0.95 * s.alpha})`;
                ctx.beginPath();
                ctx.arc(s.x, s.y, radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.closePath();
                ctx.globalCompositeOperation = 'source-over';
            });

            meteorTimer += 1;
            if (meteorTimer > (meteorIntervalBase + Math.random() * 600)) {
                spawnMeteor();
                meteorTimer = 0;
            }
            meteors = meteors.filter(m => m.life < m.maxLife);
            meteors.forEach(m => {
                ctx.globalCompositeOperation = 'lighter';
                const trailGrad = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * m.length, m.y - m.vy * m.length);
                trailGrad.addColorStop(0, 'rgba(255,255,255,0.95)');
                trailGrad.addColorStop(1, 'rgba(0,224,179,0.02)');
                ctx.strokeStyle = trailGrad;
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.moveTo(m.x, m.y);
                ctx.lineTo(m.x - m.vx * m.length, m.y - m.vy * m.length);
                ctx.stroke();
                ctx.closePath();

                ctx.fillStyle = 'rgba(255,255,255,1)';
                ctx.beginPath();
                ctx.arc(m.x, m.y, 2.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.closePath();
                ctx.globalCompositeOperation = 'source-over';

                m.x += m.vx;
                m.y += m.vy;
                m.life++;
            });

            rafRef.current = requestAnimationFrame(draw);
        }

        draw();

        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener('resize', onResize);
        };
    }, []);

    useEffect(() => {
        const setVar = () => {
            const d = Math.max(1, window.devicePixelRatio || 1);
            const scale = Math.min(1.25, 1 + (d - 1) * 0.18);
            document.documentElement.style.setProperty('--dpr-scale', String(scale));
            dprReference.current = d;
        };
        setVar();
        window.addEventListener('resize', setVar);
        let poll = setInterval(() => {
            const now = Math.max(1, window.devicePixelRatio || 1);
            if (now !== dprReference.current) setVar();
        }, 600);
        return () => {
            window.removeEventListener('resize', setVar);
            clearInterval(poll);
        };
    }, []);

    const safeGeneralData = {
        email: generalData?.email || 'nexora.crew@gmail.com',
        phone: generalData?.phone || '+91 95976 46460',
        location: generalData?.location || 'JJ College of Engineering and Technology, Trichy',
    };

    /* -------------------------
        TYPING EFFECT FOR NEXORA 
        ------------------------- */
    const neonWord = 'NEXORACREW';
    const [typedCount, setTypedCount] = useState(0);

    useEffect(() => {
        const initialDelay = 300;
        let mounted = true;
        let idx = 0;
        const typingSpeed = 120;

        const start = setTimeout(function tick() {
            if (!mounted) return;
            if (idx < neonWord.length) {
                idx += 1;
                setTypedCount(idx);
                setTimeout(tick, typingSpeed);
            }
        }, initialDelay);

        return () => {
            mounted = false;
            clearTimeout(start);
        };
    }, []);

    const renderHeadlineWithTyping = () => {
        const before = 'Welcome to';
        const beforeNodes = renderAnimatedTitle(before, '');
        const letters = Array.from(neonWord);
        return (
            <>
                {beforeNodes}
                &nbsp;
                <span className="word" aria-hidden>
                    {letters.map((ch, i) => {
                        const isShown = i < typedCount;
                        const delay = i * 0.04;
                        return (
                            <Letter
                                key={`typed-${i}`}
                                className="neon"
                                style={{
                                    visibility: isShown ? 'visible' : 'hidden',
                                    animationDelay: `${delay}s`,
                                }}
                                aria-hidden={!isShown}
                            >
                                {ch}
                            </Letter>
                        );
                    })}
                </span>
            </>
        );
    };

    const partnerData = [
        { name: 'SECURIX', role: 'CYBER SECURITY' },
        { name: 'UMMATI', role: 'TECH & BRANDING' },
        { name: '33 INCUBATION', role: 'INFRASTRUCTURE' },
        { name: 'CYBER DEPT', role: 'ACADEMIC PARTNER' },
    ];

    const stackData = [
        { title: 'Development', tech: 'React, Node.js, Firebase' },
        { title: 'Design', tech: 'Figma, Adobe, Spline' },
        { title: 'AI & ML', tech: 'Gemini, OpenAI, Python' },
        { title: 'Marketing', tech: 'Analytics, SEO Suite' },
    ];

    /* --- Mobile Menu component definition --- */
    const MobileNavMenu = styled.div`
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: ${DARK_BG};
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
            color: ${LIGHT_TEXT};
            font-size: 2rem;
            cursor: pointer;
        }

        span {
            font-size: 1.5rem;
            margin: 15px 0;
            cursor: pointer;
            color: ${MUTED_TEXT};
            
            &:hover {
                color: ${NEON_COLOR};
            }
        }
    `;
    
    const handleNavigation = (route) => {
        onNavigate(route);
        setIsMobileMenuOpen(false); // Close menu after navigation
    };

    return (
        <>
            <GlobalStyle />
            <StarCanvas ref={canvasRef} />

            <PageLayer>
                {/* HEADER */}
                <Header>
                    <Logo onClick={() => handleNavigation('home')}>NEXORACREW</Logo>
                    <NavGroup>
                        <span onClick={() => handleNavigation('home')} style={{ color: NEON_COLOR }}>
                            Home
                        </span>
                        <span onClick={() => handleNavigation('about')}>About</span>
                        <span onClick={() => handleNavigation('services')}>Services</span>
                        <span onClick={() => handleNavigation('projects')}>Projects</span>
                        <span onClick={() => handleNavigation('blog')}>Blog</span>
                        <span onClick={() => handleNavigation('contact')}>Contact</span>
                        
                        {/* SCHEDULE MEETING REMOVED HERE */}
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
                    <span onClick={() => handleNavigation('home')} style={{ color: NEON_COLOR }}>
                        Home
                    </span>
                    <span onClick={() => handleNavigation('about')}>About</span>
                    <span onClick={() => handleNavigation('services')}>Services</span>
                    <span onClick={() => handleNavigation('projects')}>Projects</span>
                    <span onClick={() => handleNavigation('blog')}>Blog</span>
                    <span onClick={() => handleNavigation('contact')}>Contact</span>
                    {/* SCHEDULE MEETING REMOVED HERE */}
                </MobileNavMenu>

                {/* Hero */}
                <HeroSection>
                    <HeroInner>
                        <TextBlock>
                            <Headline aria-hidden>
                                {renderHeadlineWithTyping()}
                            </Headline>

                            <Subtitle>
                                Empowering students and businesses with next-level digital solutions — design, build, and grow with a student-driven creative studio.
                            </Subtitle>

                            <ButtonGroup>
                                <SecondaryBtn onClick={() => handleNavigation('contact')}>
                                    Join Our Community <FontAwesomeIcon icon={faUsers} />
                                </SecondaryBtn>
                            </ButtonGroup>
                        </TextBlock>
                    </HeroInner>
                </HeroSection>

                {/* Milestones */}
                <MilestonesSection ref={milestonesRef}>
                    <MilestonesHeader>OUR MILESTONES</MilestonesHeader>
                    <MilestonesGrid>
                        {milestones.length === 0 ? (
                            <div style={{ color: MUTED_TEXT, gridColumn: '1/-1', padding: 20 }}>
                                {API_CONFIG_KEY 
                                    ? `No milestones configured yet or the client cannot reach the API at: ${MILESTONE_FETCH_URL}` 
                                    : "No milestones configured yet or the client cannot reach the API. (Hint: Environment key is missing in deployment.)"
                                }
                            </div>
                        ) : (
                            milestones.map((milestone, index) => (
                                <AnimatedSection
                                    key={milestone.key || index}
                                    isVisible={isMilestonesVisible}
                                    delay={milestone.delay}
                                >
                                    <MilestoneCard>
                                        <MilestoneIcon isExperience={milestone.isExperience}>
                                            <FontAwesomeIcon icon={milestone.icon} />
                                        </MilestoneIcon>
                                        <CountUpNumber
                                            targetNumber={milestone.number}
                                            isVisible={isMilestonesVisible}
                                            delay={milestone.delay}
                                            showPlus={true}
                                        />
                                        <MilestoneDescription>{milestone.description}</MilestoneDescription>
                                    </MilestoneCard>
                                </AnimatedSection>
                            ))
                        )}
                    </MilestonesGrid>
                </MilestonesSection>

                {/* NEW SECTION: Trusted Partners/Collaborators */}
                <PartnersSection>
                    <PartnersHeader>TRUSTED PARTNERS & COLLABORATORS</PartnersHeader>
                    <PartnersGrid>
                        {partnerData.map((p, index) => (
                            <PartnerLogo key={index}>
                                <div className="icon-box">
                                    <FontAwesomeIcon icon={faStar} color={LIGHT_TEXT} /> 
                                </div>
                                <p>{p.name}</p>
                                <p style={{ color: NEON_COLOR, fontWeight: 600, marginTop: 4 }}>{p.role}</p>
                            </PartnerLogo>
                        ))}
                    </PartnersGrid>
                </PartnersSection>

                {/* NEW SECTION: Powerful Stack */}
                <StackSection>
                    <StackTitle>POWERFUL <span>STACK</span></StackTitle>
                    <StackSubtitle>We use the latest enterprise-grade technologies.</StackSubtitle>
                    <StackGrid>
                        {stackData.map((s, index) => (
                            <AnimatedSection
                                key={index}
                                isVisible={true} 
                                delay={`${(index * 0.15).toFixed(2)}s`}
                                style={{ opacity: 1, transform: 'none' }}
                            >
                                <StackCard>
                                    <h3>{s.title}</h3>
                                    <p>{s.tech}</p>
                                </StackCard>
                            </AnimatedSection>
                        ))}
                    </StackGrid>
                </StackSection>

                {/* NEW SECTION: Client Stories */}
                <StoriesSection>
                    <StoriesTitle>CLIENT <span>STORIES</span></StoriesTitle>
                    <StoriesGrid ref={storiesRef}>
                        {clientStories.map((story, index) => (
                            <StoryCard
                                key={story._id || index}
                                isVisible={isStoriesVisible}
                                delay={`${(index * 0.15).toFixed(2)}s`}
                            >
                                <FontAwesomeIcon icon={faStar} className="quote-icon" />
                                <p className="quote-text">{story.quote}</p>
                                <div className="author-info">
                                    <p className="name">{story.author}</p>
                                    <p className="role">{story.role}</p>
                                </div>
                            </StoryCard>
                        ))}
                    </StoriesGrid>
                </StoriesSection>

                {/* NEW SECTION: CTA (Join the Future) */}
                <CtaSection ref={ctaRef}>
                    <CtaContainer>
                        <h2>JOIN THE FUTURE.</h2>
                        <p>Be part of the Nexoracrew community. Access AI tools, workshops, and events.</p>
                        <button onClick={() => handleNavigation('contact')}>
                            Explore Community
                        </button>
                    </CtaContainer>
                </CtaSection>

                {/* UPDATED FULL FOOTER */}
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
                                <a href={`mailto:${safeGeneralData.email}`}><FontAwesomeIcon icon={faEnvelope} /></a>
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
                                        <FontAwesomeIcon icon={faMapMarkerAlt} /> {safeGeneralData.location}
                                    </a>
                                </li>
                                <li>
                                    <a href={`mailto:${safeGeneralData.email}`}>
                                        <FontAwesomeIcon icon={faEnvelope} /> {safeGeneralData.email}
                                    </a>
                                </li>
                                <li>
                                    <a href={`tel:${safeGeneralData.phone}`}>
                                        <FontAwesomeIcon icon={faPhone} /> {safeGeneralData.phone}
                                    </a>
                                </li>
                            </ul>
                        </FooterColumn>
                    </FooterGrid>

                    <Copyright>
                        © 2025 Nexoracrew. All Rights Reserved.
                    </Copyright>
                </FullFooter>
            </PageLayer>
        </>
    );
};

export default HomePage;