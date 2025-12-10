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
    faMapMarkerAlt,
    faPhone,
    faBars,
    faTimes,
    faHandshake
} from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import axios from 'axios';

// ====================================================================
// ========== CONFIG & API ENDPOINTS ==========
// ====================================================================
const API_BASE = (process.env.REACT_APP_API_BASE_URL || process.env.REACT_APP_API_BASE || 'http://localhost:5000').replace(/\/$/, '');

const MILESTONE_FETCH_URL = `${API_BASE}/api/milestones`;
const STORY_FETCH_URL = `${API_BASE}/api/stories`;
const PARTNER_FETCH_URL = `${API_BASE}/api/partners`;

// ====================================================================
// ========== DESIGN TOKENS ==========
// ====================================================================
const NEON_COLOR = '#00e0b3';
const DARK_BG = '#0F172A';
const LIGHT_TEXT = '#E2E8F0';
const MUTED_TEXT = '#A9B7C7';
const VERY_DARK_BG = '#02040a';

// ====================================================================
// ========== GLOBAL STYLES ==========
// ====================================================================
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
  * { box-sizing: border-box; }
`;

// ====================================================================
// ========== KEYFRAMES ==========
// ====================================================================
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

const scrollX = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

// ====================================================================
// ========== STYLED COMPONENTS ==========
// ====================================================================
const StarCanvas = styled.canvas`
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  z-index: 0; pointer-events: none; display: block;
  background: radial-gradient(circle at 10% 10%, #071022 0%, #081226 25%, #071020 55%, #05060a 100%);
`;

const PageLayer = styled.div`
  position: relative; z-index: 2; overflow-x: hidden;
`;

// --- HEADER ---
const Header = styled.header`
  display: flex; align-items: center; gap: 40px; padding: 14px 48px;
  position: sticky; top: 0; width: 100%;
  background: rgba(7,16,38,0.85); backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255,255,255,0.04); z-index: 1000;
  @media (max-width: 768px) { padding: 14px 20px; gap: 20px; justify-content: space-between; }
`;

const Logo = styled.h1`
  color: ${NEON_COLOR}; font-size: 1.8rem; font-weight: 800; cursor: pointer;
  letter-spacing: 1px; text-shadow: 0 0 12px ${NEON_COLOR}; margin: 0;
  @media (max-width: 480px) { font-size: 1.5rem; }
`;

const NavGroup = styled.div`
  display: flex; gap: 22px; align-items: center; margin-right: auto;
  @media (max-width: 1024px) { display: none; }
  span {
    color: ${MUTED_TEXT}; cursor: pointer; font-weight: 500; position: relative;
    transition: 0.3s ease; padding: 6px 4px;
    &:hover { color: ${NEON_COLOR}; text-shadow: 0 0 10px ${NEON_COLOR}; }
    &:after {
      content: ''; position: absolute; left: 0; bottom: -2px; width: 0;
      height: 2px; background: ${NEON_COLOR}; transition: 0.3s; border-radius: 4px;
    }
    &:hover:after { width: 100%; }
  }
`;

const MobileMenuButton = styled.button`
  display: none; background: none; border: none; color: ${NEON_COLOR};
  font-size: 1.5rem; cursor: pointer;
  @media (max-width: 1024px) { display: block; }
`;

// --- ANIMATION WRAPPER ---
const AnimatedSection = styled.div.attrs(props => ({
  'data-visible': props.$isVisible ? 'true' : 'false',
}))`
  opacity: 0;
  transform: translateY(30px) scale(0.95);
  will-change: opacity, transform;

  ${({ $isVisible, $delay }) =>
    $isVisible &&
    css`
      animation: ${rollIn} 0.8s cubic-bezier(0.25,0.46,0.45,0.94) forwards;
      animation-delay: ${$delay || '0s'};
    `}
`;

// --- HERO ---
const HeroSection = styled.section`
  min-height: 90vh; display: flex; align-items: center; justify-content: center;
  padding: 120px 20px 80px; box-sizing: border-box; animation: ${fadeUp} 0.9s ease forwards;
  @media (max-width: 768px) { min-height: 75vh; padding: 80px 20px 60px; }
`;

const HeroInner = styled.div`
  max-width: 1200px; width: 100%; display: flex; gap: 60px;
  align-items: center; justify-content: center; flex-direction: column;
`;

const TextBlock = styled.div`
  max-width: 1200px; color: ${LIGHT_TEXT}; text-align: center;
`;

const Headline = styled.h1`
  font-size: clamp(2.4rem, 6vw, 6.5rem); line-height: 0.95; margin: 0 0 18px 0;
  letter-spacing: -0.02em; display: inline-block; will-change: transform;
  animation: ${glowPulse} 3s infinite ease-in-out; color: ${LIGHT_TEXT};
  span.word { display: inline-block; margin: 0 0.5rem; }
  @media (max-width: 480px) { font-size: clamp(2rem, 10vw, 4rem); }
`;

const Letter = styled.span`
  display: inline-block; transform-origin: center bottom;
  animation: ${flagWave} 2.2s ease-in-out infinite;
  transform: translateY(0) rotate(0deg) scale(var(--dpr-scale, 1));
  &.neon { color: ${NEON_COLOR}; filter: drop-shadow(0 0 8px ${NEON_COLOR}); }
`;

const Subtitle = styled.p`
  color: ${MUTED_TEXT}; font-size: clamp(0.95rem, 1.2vw, 1.05rem);
  margin: 16px 0 28px; line-height: 1.6; max-width: 900px; margin-left: auto; margin-right: auto;
  @media (max-width: 480px) { font-size: 0.9rem; }
`;

const ButtonGroup = styled.div`
  display: flex; gap: 16px; flex-wrap: wrap; justify-content: center;
`;

const PrimaryBtn = styled.button`
  background: ${NEON_COLOR}; color: ${DARK_BG}; padding: 12px 26px; border-radius: 10px;
  font-weight: 700; box-shadow: 0 10px 30px rgba(0,224,179,0.25); display: inline-flex;
  align-items: center; gap: 10px; transition: transform .18s ease, box-shadow .18s ease;
  border: none; cursor: pointer;
  &:hover { transform: translateY(-3px); box-shadow: 0 16px 40px rgba(0,224,179,0.35); }
  @media (max-width: 480px) { padding: 10px 20px; font-size: 0.9rem; }
`;

const SecondaryBtn = styled(PrimaryBtn)`
  background: transparent; color: ${LIGHT_TEXT}; border: 1px solid rgba(255,255,255,0.06);
  box-shadow: none; &:hover { box-shadow: 0 0 10px rgba(255,255,255,0.1); }
`;

// --- MILESTONES ---
const MilestonesSection = styled.section`
  padding: 80px 20px; background: transparent; text-align: center;
  @media (max-width: 768px) { padding: 60px 20px; }
`;

const MilestonesHeader = styled.h2`
  font-size: 1.2rem; color: ${NEON_COLOR}; text-transform: uppercase;
  letter-spacing: 0.15em; margin-bottom: 50px;
`;

const MilestonesGrid = styled.div`
  max-width: 1200px; margin: 0 auto; display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 30px; justify-items: center;
  @media (max-width: 600px) { grid-template-columns: repeat(2, 1fr); gap: 20px; }
  @media (max-width: 400px) { grid-template-columns: 1fr; }
`;

const MilestoneCard = styled.div`
  display: flex; flex-direction: column; align-items: center; padding: 20px;
`;

const MilestoneIcon = styled.div`
  width: 80px; height: 80px; background: ${NEON_COLOR}; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; margin-bottom: 20px;
  box-shadow: 0 0 20px rgba(0,224,179,0.4);

  ${({ $isExperience }) =>
    $isExperience &&
    css`
      background: #008060;
      box-shadow: 0 0 20px rgba(0,128,96,0.4);
    `}

  .svg-inline--fa {
    color: ${DARK_BG}; font-size: 36px;

    ${({ $isExperience }) =>
      $isExperience &&
      css`
        color: ${LIGHT_TEXT};
      `}
  }
`;

const MilestoneNumberText = styled.p`
  margin: 0 0 5px 0; display: inline-flex; align-items: center; gap: 6px; line-height: 1; justify-content: center;
  .num { font-size: 3.5rem; font-weight: 800; color: ${LIGHT_TEXT}; line-height: 1; letter-spacing: -0.02em; }
  .plus { font-size: 3.5rem; color: #ffffff; font-weight: 900; line-height: 1; margin-left: 6px; filter: drop-shadow(0 0 6px rgba(255,255,255,0.06)); }
  @media (max-width: 480px) { .num { font-size: 2.4rem; } .plus { font-size: 2.4rem; margin-left: 4px; } }
`;

const MilestoneDescription = styled.p`
  font-size: 1rem; color: ${MUTED_TEXT}; margin: 0; text-transform: uppercase; letter-spacing: 0.05em;
  @media (max-width: 480px) { font-size: 0.85rem; }
`;

// --- PARTNERS (INFINITE SCROLL MARQUEE) ---
const PartnersSection = styled.section`
  padding: 60px 0;
  text-align: center;
  background: transparent;
  overflow: hidden;
`;

const PartnersHeader = styled.p`
  font-size: 0.85rem;
  color: ${MUTED_TEXT};
  text-transform: uppercase;
  letter-spacing: 0.2em;
  margin-bottom: 50px;
  font-weight: 500;
  padding: 0 20px;
`;

const MarqueeContainer = styled.div`
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
  position: relative;
  overflow: hidden;

  mask-image: linear-gradient(
    to right,
    transparent 0%,
    black 20%,
    black 80%,
    transparent 100%
  );
  -webkit-mask-image: linear-gradient(
    to right,
    transparent 0%,
    black 20%,
    black 80%,
    transparent 100%
  );
`;

const MarqueeTrack = styled.div`
  display: flex;
  gap: 80px;
  width: max-content;
  animation: ${scrollX} 40s linear infinite;

  &:hover {
    animation-play-state: paused;
  }

  @media (max-width: 768px) {
    gap: 50px;
    animation-duration: 25s;
  }
`;

const PartnerCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-width: 150px;
  cursor: pointer;
  transition: transform 0.3s ease;
  padding-bottom: 8px;

  &:hover {
    transform: scale(1.05);
    .icon-box {
      border-color: ${NEON_COLOR};
      box-shadow: 0 0 15px rgba(0, 224, 179, 0.25);
      color: ${NEON_COLOR};
    }
  }

  .icon-box {
    width: 90px;
    height: 90px;
    border-radius: 24px;
    border: 1px solid rgba(255,255,255,0.12);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
    background: radial-gradient(circle at 10% 10%, rgba(255,255,255,0.06), rgba(0,0,0,0.4));
    color: ${MUTED_TEXT};
    font-size: 2rem;
    transition: all 0.3s ease;
    overflow: hidden;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

// use a dedicated styled component for the name to avoid global h4 overrides in production
const PartnerName = styled.div`
  margin: 0;
  font-size: 0.9rem;
  color: ${LIGHT_TEXT};
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  text-align: center;
  white-space: nowrap;
`;

// --- STACK ---
const StackSection = styled.section`
  padding: 80px 20px; text-align: center;
  @media (max-width: 768px) { padding: 60px 20px; }
`;

const StackTitle = styled.h2`
  font-size: clamp(1.8rem, 4vw, 3rem); font-weight: 800; margin: 0 0 8px 0; color: ${LIGHT_TEXT};
  span { color: ${NEON_COLOR}; text-shadow: 0 0 10px rgba(0,224,179,0.4); }
  @media (max-width: 480px) { font-size: 2rem; }
`;

const StackSubtitle = styled.p`
  font-size: 1rem; color: ${MUTED_TEXT}; margin-bottom: 50px;
  @media (max-width: 480px) { font-size: 0.9rem; margin-bottom: 30px; }
`;

const StackGrid = styled.div`
  max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 25px;
  @media (max-width: 600px) { grid-template-columns: 1fr; }
`;

const StackCard = styled.div`
  background: rgba(255,255,255,0.03); border-radius: 12px; padding: 30px;
  text-align: left; border-top: 3px solid transparent; transition: all 0.3s ease; cursor: default;
  &:hover { border-top-color: ${NEON_COLOR}; transform: translateY(-5px); box-shadow: 0 10px 30px rgba(0,0,0,0.15); }
  h3 { font-size: 1.3rem; color: ${LIGHT_TEXT}; margin: 0 0 8px 0; font-weight: 700; }
  p { font-size: 0.9rem; color: ${MUTED_TEXT}; margin: 0; }
  @media (max-width: 480px) { padding: 20px; h3 { font-size: 1.2rem; } p { font-size: 0.85rem; } }
`;

// --- STORIES ---
const StoriesSection = styled.section`
  padding: 80px 20px; background: ${VERY_DARK_BG}; text-align: center;
  @media (max-width: 768px) { padding: 60px 20px; }
`;

const StoriesTitle = styled.h2`
  font-size: clamp(1.8rem, 4vw, 3rem); font-weight: 800; margin: 0 0 50px 0; color: ${LIGHT_TEXT};
  span { color: ${NEON_COLOR}; text-shadow: 0 0 10px rgba(0,224,179,0.4); }
  @media (max-width: 480px) { font-size: 2rem; }
`;

const StoriesGrid = styled.div`
  max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const StoryCard = styled(AnimatedSection)`
  background: rgba(255,255,255,0.03); border-radius: 12px; padding: 30px;
  text-align: left; min-height: 180px; display: flex; flex-direction: column;
  justify-content: space-between; border: 1px solid rgba(255,255,255,0.05);
  .quote-icon { color: #FFC72C; font-size: 1.2rem; margin-bottom: 15px; }
  .quote-text { font-style: italic; color: ${LIGHT_TEXT}; line-height: 1.6; font-size: 0.95rem; margin-bottom: 20px; }
  .author-info {
    border-top: 1px solid rgba(255,255,255,0.05); padding-top: 15px;
    p { margin: 0; line-height: 1.4; }
    .name { color: ${NEON_COLOR}; font-weight: 600; font-size: 1rem; }
    .role { color: ${MUTED_TEXT}; font-size: 0.85rem; }
  }
`;

// --- CTA ---
const CtaSection = styled.section`
  padding: 100px 20px; text-align: center;
  @media (max-width: 768px) { padding: 60px 20px; }
`;

const CtaContainer = styled.div`
  max-width: 900px; margin: 0 auto; padding: 60px 40px; border-radius: 20px;
  background: linear-gradient(135deg, #008060, #00e0b3); box-shadow: 0 20px 60px rgba(0, 224, 179, 0.4);
  @media (max-width: 768px) { padding: 40px 20px; }
  h2 { font-size: clamp(2rem, 5vw, 4rem); color: ${LIGHT_TEXT}; margin-top: 0; margin-bottom: 15px; font-weight: 900; letter-spacing: -0.05em; }
  p { color: rgba(255,255,255,0.8); font-size: 1.1rem; margin-bottom: 30px; }
  button {
    background: ${LIGHT_TEXT}; color: ${DARK_BG}; font-weight: 700; padding: 12px 30px;
    border: none; border-radius: 10px; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;
    &:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2); }
  }
`;

// --- FOOTER ---
const FullFooter = styled.footer`
  background: ${VERY_DARK_BG}; padding: 60px 50px 20px; color: ${MUTED_TEXT};
  border-top: 1px solid rgba(255,255,255,0.04);
  @media (max-width: 768px) { padding: 40px 20px 20px; }
`;

const FooterGrid = styled.div`
  max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; gap: 30px;
  @media (max-width: 768px) { flex-direction: column; align-items: flex-start; gap: 20px; }
`;

const FooterColumn = styled.div`
  min-width: 200px;
  @media (max-width: 768px) { min-width: unset; width: 100%; margin-bottom: 10px; }
  h4 {
    color: ${LIGHT_TEXT}; font-size: 1.1rem; margin-bottom: 20px; font-weight: 700; position: relative;
    &:after { content: ''; position: absolute; left: 0; bottom: -5px; width: 30px; height: 2px; background: ${NEON_COLOR}; }
  }
  p { font-size: 0.9rem; line-height: 1.6; margin: 0 0 10px 0; }
  ul { list-style: none; padding: 0; margin: 0; }
  li { margin-bottom: 10px; }
  a, span {
    color: ${MUTED_TEXT}; text-decoration: none; font-size: 0.9rem; transition: color 0.3s;
    display: inline-flex; align-items: center; gap: 8px; cursor: pointer;
    &:hover { color: ${NEON_COLOR}; }
  }
`;

const FooterLogo = styled(Logo)`
  font-size: 1.5rem; margin-bottom: 10px;
`;

const SocialIcons = styled.div`
  display: flex; gap: 15px; margin-top: 15px;
  a {
    width: 30px; height: 30px; border-radius: 50%; background: rgba(255,255,255,0.05);
    display: flex; align-items: center; justify-content: center; color: ${LIGHT_TEXT}; transition: background 0.3s, color 0.3s;
    &:hover { background: ${NEON_COLOR}; color: ${DARK_BG}; }
  }
`;

const Copyright = styled.div`
  text-align: center; font-size: 0.8rem; padding-top: 30px;
  border-top: 1px solid rgba(255,255,255,0.02); margin-top: 50px;
`;

const MobileNavMenu = styled.div`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: ${DARK_BG}; z-index: 1100; display: flex; flex-direction: column; align-items: center;
  padding-top: 80px; transform: translateX(${props => (props.$isOpen ? '0' : '100%')});
  transition: transform 0.3s ease-in-out;
  .close-btn { position: absolute; top: 20px; right: 20px; background: none; border: none; color: ${LIGHT_TEXT}; font-size: 2rem; cursor: pointer; }
  span { font-size: 1.5rem; margin: 15px 0; cursor: pointer; color: ${MUTED_TEXT}; &:hover { color: ${NEON_COLOR}; } }
`;

// ====================================================================
// ========== HELPERS & COMPONENTS ==========
// ====================================================================
const ICON_MAP = {
  projects: faClipboardList,
  experience: faStar,
  clients: faUsers,
  hours: faClock,
};

const useIntersectionObserver = (options) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        if (ref.current && options.unobserveAfterVisible !== false) observer.unobserve(ref.current);
      } else if (options.repeat) {
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

// ====================================================================
// ========== MAIN COMPONENT ==========
// ====================================================================
const HomePage = ({ onNavigate = () => {}, generalData = {} }) => {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  const [milestones, setMilestones] = useState([]);
  const [clientStories, setClientStories] = useState([]);
  const [partners, setPartners] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [milestonesRef, isMilestonesVisible] = useIntersectionObserver({ threshold: 0.2, rootMargin: '0px 0px -100px 0px' });
  const [storiesRef, isStoriesVisible] = useIntersectionObserver({ threshold: 0.2, rootMargin: '0px 0px -50px 0px' });
  const [ctaRef] = useIntersectionObserver({ threshold: 0.2, rootMargin: '0px 0px -50px 0px' });

  const stackData = [
    { title: 'Development', tech: 'React, Node.js, Firebase' },
    { title: 'Design', tech: 'Figma, Adobe, Spline' },
    { title: 'AI & ML', tech: 'Gemini, OpenAI, Python' },
    { title: 'Marketing', tech: 'Analytics, SEO Suite' },
  ];

  const safeGeneralData = {
    email: generalData?.email || 'nexora.crew@gmail.com',
    phone: generalData?.phone || '+91 95976 46460',
    location: generalData?.location || 'JJ College of Engineering, Trichy',
  };

  const navItems = ['home', 'about', 'services', 'projects', 'team', 'progress', 'blog', 'contact'];

  // --- FETCH DATA ---
  useEffect(() => {
    let cancelled = false;

    const fetchMilestones = async () => {
      try {
        const res = await axios.get(MILESTONE_FETCH_URL);
        if (cancelled) return;
        const data = Array.isArray(res.data) ? res.data : [];
        const mapped = data.map((m, i) => {
          const key = (m.key || '').toString().toLowerCase();
          return {
            icon: ICON_MAP[key] || ICON_MAP['projects'],
            number: typeof m.count === 'number' ? m.count : Number(m.count) || 0,
            description: m.label || (key || '').replace(/_/g, ' '),
            delay: `${(i * 0.12).toFixed(2)}s`,
            isExperience: key === 'experience' || key === 'years' || key === 'year',
            key,
          };
        });
        setMilestones(mapped);
      } catch (err) {
        console.error('Error fetching milestones', err);
      }
    };

    const getFallbackStories = () => [
      { _id: 'd1', quote: 'Nexoracrew built a fully functional digital canteen portal with modern UI.', author: 'Principal', role: 'JJ College' },
      { _id: 'd2', quote: 'A strong team with dedication and talent. We appreciate their passion.', author: 'Team Securix', role: 'Partner' },
      { _id: 'd3', quote: 'Delivered a secure and user-friendly system ahead of time.', author: 'HOD', role: 'Cybersecurity Dept.' },
    ];

    const fetchStories = async () => {
      try {
        const res = await axios.get(STORY_FETCH_URL);
        if (cancelled) return;
        const data = Array.isArray(res.data) ? res.data : [];
        setClientStories(data.length > 0 ? data : getFallbackStories());
      } catch (err) {
        console.error('Error fetching stories', err);
        if (!cancelled) setClientStories(getFallbackStories());
      }
    };

    const fetchPartners = async () => {
      try {
        const res = await axios.get(PARTNER_FETCH_URL);
        if (cancelled) return;
        const data = Array.isArray(res.data) ? res.data : [];
        setPartners(data);
      } catch (err) {
        console.error('Error fetching partners', err);
      }
    };

    const poll = () => {
      if (!document.hidden) {
        fetchMilestones();
        fetchPartners();
      }
    };

    fetchMilestones();
    fetchStories();
    fetchPartners();

    const intervalId = setInterval(poll, 5000);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, []);

  // --- CANVAS EFFECTS ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });

    const resize = () => {
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    let width = window.innerWidth,
      height = window.innerHeight;
    const starCount = Math.floor((width * height) / 50000);
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 0.5 + Math.random() * 1.5,
      a: 0.3 + Math.random() * 0.7,
      dx: (Math.random() - 0.5) * 0.2,
      dy: 0.1 + Math.random() * 0.5,
      twinkle: Math.random() * Math.PI * 2,
    }));

    const draw = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      ctx.clearRect(0, 0, width, height);
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#071025');
      grad.addColorStop(1, '#02040a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      stars.forEach((s) => {
        s.x += s.dx;
        s.y += s.dy;
        s.twinkle += 0.05;
        if (s.y > height) s.y = -5;
        if (s.x > width) s.x = -5;
        if (s.x < -5) s.x = width;
        const alpha = s.a * (0.5 + Math.sin(s.twinkle) * 0.5);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // --- TYPING EFFECT ---
  const neonWord = 'NEXORACREW';
  const [typedCount, setTypedCount] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      let idx = 0;
      const interval = setInterval(() => {
        idx++;
        setTypedCount(idx);
        if (idx >= neonWord.length) clearInterval(interval);
      }, 120);
      return () => clearInterval(interval);
    }, 300);
    return () => clearTimeout(t);
  }, []);

  const handleNavigation = (route) => {
    onNavigate(route);
    setIsMobileMenuOpen(false);
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
            {navItems.map((item) => (
              <span
                key={item}
                onClick={() => handleNavigation(item)}
                style={item === 'home' ? { color: NEON_COLOR } : {}}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </span>
            ))}
          </NavGroup>
          <MobileMenuButton onClick={() => setIsMobileMenuOpen(true)}>
            <FontAwesomeIcon icon={faBars} />
          </MobileMenuButton>
        </Header>

        {/* MOBILE MENU */}
        <MobileNavMenu $isOpen={isMobileMenuOpen}>
          <button className="close-btn" onClick={() => setIsMobileMenuOpen(false)}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
          {navItems.map((item) => (
            <span
              key={item}
              onClick={() => handleNavigation(item)}
              style={item === 'home' ? { color: NEON_COLOR } : {}}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </span>
          ))}
        </MobileNavMenu>

        {/* HERO */}
        <HeroSection>
          <HeroInner>
            <TextBlock>
              <Headline aria-hidden>
                Welcome to &nbsp;
                <span className="word">
                  {Array.from(neonWord).map((ch, i) => (
                    <Letter
                      key={i}
                      className="neon"
                      style={{
                        visibility: i < typedCount ? 'visible' : 'hidden',
                        animationDelay: `${i * 0.04}s`,
                      }}
                    >
                      {ch}
                    </Letter>
                  ))}
                </span>
              </Headline>
              <Subtitle>
                Empowering students and businesses with next-level digital solutions — design, build, and grow with a
                student-driven creative studio.
              </Subtitle>
              <ButtonGroup>
                <SecondaryBtn onClick={() => handleNavigation('contact')}>
                  Join Our Community <FontAwesomeIcon icon={faUsers} />
                </SecondaryBtn>
              </ButtonGroup>
            </TextBlock>
          </HeroInner>
        </HeroSection>

        {/* MILESTONES */}
        <MilestonesSection ref={milestonesRef}>
          <MilestonesHeader>OUR MILESTONES</MilestonesHeader>
          <MilestonesGrid>
            {milestones.length === 0 ? (
              <div style={{ color: MUTED_TEXT, gridColumn: '1/-1', padding: 20 }}>Loading Milestones...</div>
            ) : (
              milestones.map((ms, index) => (
                <AnimatedSection key={ms.key || index} $isVisible={isMilestonesVisible} $delay={ms.delay}>
                  <MilestoneCard>
                    <MilestoneIcon $isExperience={ms.isExperience}>
                      <FontAwesomeIcon icon={ms.icon} />
                    </MilestoneIcon>
                    <CountUpNumber targetNumber={ms.number} isVisible={isMilestonesVisible} delay={ms.delay} />
                    <MilestoneDescription>{ms.description}</MilestoneDescription>
                  </MilestoneCard>
                </AnimatedSection>
              ))
            )}
          </MilestonesGrid>
        </MilestonesSection>

        {/* PARTNERS */}
        <PartnersSection>
          <PartnersHeader>TRUSTED PARTNERS & COLLABORATORS</PartnersHeader>
          {partners.length > 0 ? (
            <MarqueeContainer>
              <MarqueeTrack>
                {[...partners, ...partners, ...partners, ...partners].map((p, i) => {
                  const name =
                    p.displayName ||
                    p.name ||
                    p.partnerName ||
                    p.title ||
                    'Partner';
                  return (
                    <PartnerCard key={`p-${p._id || i}-${i}`}>
                      <div className="icon-box">
                        {p.logoUrl ? (
                          <img src={p.logoUrl} alt={name} />
                        ) : (
                          <FontAwesomeIcon icon={faHandshake} />
                        )}
                      </div>
                      <PartnerName>{name}</PartnerName>
                    </PartnerCard>
                  );
                })}
              </MarqueeTrack>
            </MarqueeContainer>
          ) : (
            <div style={{ color: MUTED_TEXT, opacity: 0.5 }}>No partners listed yet.</div>
          )}
        </PartnersSection>

        {/* TECH STACK */}
        <StackSection>
          <StackTitle>
            POWERFUL <span>STACK</span>
          </StackTitle>
          <StackSubtitle>We use the latest enterprise-grade technologies.</StackSubtitle>
          <StackGrid>
            {stackData.map((s, i) => (
              <AnimatedSection key={i} $isVisible={true} $delay={`${(i * 0.15).toFixed(2)}s`}>
                <StackCard>
                  <h3>{s.title}</h3>
                  <p>{s.tech}</p>
                </StackCard>
              </AnimatedSection>
            ))}
          </StackGrid>
        </StackSection>

        {/* CLIENT STORIES */}
        <StoriesSection>
          <StoriesTitle>
            CLIENT <span>STORIES</span>
          </StoriesTitle>
          <StoriesGrid ref={storiesRef}>
            {clientStories.map((story, i) => (
              <StoryCard key={story._id || i} $isVisible={isStoriesVisible} $delay={`${(i * 0.15).toFixed(2)}s`}>
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

        {/* CTA */}
        <CtaSection ref={ctaRef}>
          <CtaContainer>
            <h2>JOIN THE FUTURE.</h2>
            <p>Be part of the Nexoracrew community. Access AI tools, workshops, and events.</p>
            <button onClick={() => handleNavigation('contact')}>Explore Community</button>
          </CtaContainer>
        </CtaSection>

        {/* FOOTER */}
        <FullFooter>
          <FooterGrid>
            <FooterColumn style={{ minWidth: '300px' }}>
              <FooterLogo onClick={() => handleNavigation('home')}>NEXORACREW</FooterLogo>
              <p>Transforming ideas into powerful digital products using modern technology, creativity, and AI.</p>
              <SocialIcons>
                <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">
                  <FontAwesomeIcon icon={faInstagram} />
                </a>
                <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">
                  <FontAwesomeIcon icon={faLinkedinIn} />
                </a>
                <a href={`mailto:${safeGeneralData.email}`}>
                  <FontAwesomeIcon icon={faEnvelope} />
                </a>
              </SocialIcons>
            </FooterColumn>
            <FooterColumn>
              <h4>Quick Links</h4>
              <ul>
                {['Home', 'About', 'Team', 'Progress', 'Contact'].map((l, i) => (
                  <li key={i}>
                    <a onClick={() => handleNavigation(l.toLowerCase())}>{l}</a>
                  </li>
                ))}
              </ul>
            </FooterColumn>
            <FooterColumn>
              <h4>Services</h4>
              <ul>
                {['Web Development', 'AI Solutions', 'SEO & Growth', 'Branding & Design'].map((l, i) => (
                  <li key={i}>
                    <a onClick={() => handleNavigation('services')}>{l}</a>
                  </li>
                ))}
              </ul>
            </FooterColumn>
            <FooterColumn>
              <h4>Contact Info</h4>
              <ul>
                <li>
                  <a href="#map">
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
          <Copyright>© 2025 Nexoracrew. All Rights Reserved.</Copyright>
        </FullFooter>
      </PageLayer>
    </>
  );
};

export default HomePage;
