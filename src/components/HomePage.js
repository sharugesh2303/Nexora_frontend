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
  faHandshake,
  faArrowRight,
  faCode, // Icon for Web/Dev stack
  faMobileAlt, // Icon for Mobile stack
  faProjectDiagram, // Icon for Blockchain stack
  faMagic, // Icon for AI/ML stack
  faPaintBrush, // Icon for Design stack
  faBullhorn, // Icon for Marketing stack
  faDatabase, // Icon for Data Science
  faChartBar, // Icon for Analytics/SEO Suite
} from '@fortawesome/free-solid-svg-icons';
import {
  faInstagram,
  faLinkedinIn,
  faReact, // Icon for React
  faNodeJs, // Icon for Node.js
} from '@fortawesome/free-brands-svg-icons';
import axios from 'axios';

// --- Placeholder/External Tech Logos (for demonstration based on your image) ---
// Note: You should replace these with actual local image imports for best performance
const TECH_LOGOS = {
  // Provided in your image
  'React Native': 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg',
  'Flutter': 'https://upload.wikimedia.org/wikipedia/commons/4/44/Flutter_logo.svg',
  'Swift': 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Swift_logo.svg',
  'Kotlin': 'https://upload.wikimedia.org/wikipedia/commons/7/74/Kotlin-logo.svg',
  // Design tools
  'Figma': 'https://www.vectorlogo.zone/logos/figma/figma-icon.svg',
  'Canva': 'https://www.vectorlogo.zone/logos/canva/canva-icon.svg',
  'Adobe Suite': 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Adobe_Inc.-logo.svg',
  'Spline': 'https://spline.design/icon.png', // Using Spline's icon as a placeholder
  // AI/ML Tools
  'Gemini': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Google_gemini_logo.svg/100px-Google_gemini_logo.svg.png',
  'OpenAI': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/OpenAI_Logo.svg/120px-OpenAI_Logo.svg.png',
  'Python': 'https://www.vectorlogo.zone/logos/python/python-icon.svg',
  // General Tech
  'Node.js': 'https://www.vectorlogo.zone/logos/nodejs/nodejs-icon.svg',
  'MongoDB': 'https://www.vectorlogo.zone/logos/mongodb/mongodb-icon.svg',
  'AWS': 'https://www.vectorlogo.zone/logos/amazon_aws/amazon_aws-icon.svg',
  'Solidity': 'https://upload.wikimedia.org/wikipedia/commons/9/98/Solidity_logo.svg',
  'Ethereum': 'https://upload.wikimedia.org/wikipedia/commons/0/05/Ethereum_logo_2021.svg',
};

// ====================================================================
// ========== CONFIG & API ENDPOINTS ==========
// ====================================================================
const API_BASE = (process.env.REACT_APP_API_BASE_URL || process.env.REACT_APP_API_BASE || 'http://localhost:5000').replace(/\/$/, '');

const MILESTONE_FETCH_URL = `${API_BASE}/api/milestones`;
const STORY_FETCH_URL = `${API_BASE}/api/stories`;
const PARTNER_FETCH_URL = `${API_BASE}/api/partners`;

// ====================================================================
// ========== DESIGN TOKENS (LIGHT THEME) ==========
// ====================================================================

// primary accent (navy)
const NEON_COLOR = '#123165';
// page base colors
const LIGHT_TEXT = '#111827';
const MUTED_TEXT = '#6B7280';
const CARD_BG = '#FFFFFF';
const BORDER_LIGHT = 'rgba(15,23,42,0.08)';
const FOOTER_BG = '#F3F4F6';
// gold accent
const GOLD_ACCENT = '#D4A937';
const NAVY_STRIP_BG = '#050f25'; // only if needed later

// ====================================================================
// ========== GLOBAL STYLES ==========
// ====================================================================
const GlobalStyle = createGlobalStyle`
  html, body, #root { height: 100%; }
  body {
    margin: 0;
    font-family: 'Poppins', sans-serif;
    background:
      radial-gradient(circle at 0% 0%, #fff9e8 0, #ffffff 35%, transparent 55%),
      linear-gradient(180deg, #ffffff 0%, #f5f7fb 40%, #e5edf7 100%);
    color: ${LIGHT_TEXT};
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    --dpr-scale: 1;
  }
  .neon-text-shadow {
    text-shadow: 0 0 8px ${GOLD_ACCENT}, 0 0 18px rgba(212,169,55,0.5);
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
  0% { text-shadow: 0 0 8px ${GOLD_ACCENT}, 0 0 18px rgba(212,169,55,0.4); }
  50% { text-shadow: 0 0 18px ${GOLD_ACCENT}, 0 0 30px rgba(212,169,55,0.8); }
  100% { text-shadow: 0 0 8px ${GOLD_ACCENT}, 0 0 18px rgba(212,169,55,0.4); }
`;

const scrollX = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

// ====================================================================
// ========== STYLED COMPONENTS ==========
// ====================================================================
const StarCanvas = styled.canvas`
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  z-index: 0;
  pointer-events: none;
  display: block;
`;

const PageLayer = styled.div`
  position: relative;
  z-index: 2;
  overflow-x: hidden;
`;

// --- HEADER ---
const Header = styled.header`
  display: flex;
  align-items: center;
  gap: 40px;
  padding: 14px 48px;
  position: sticky;
  top: 0;
  width: 100%;
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid ${BORDER_LIGHT};
  z-index: 1000;
  @media (max-width: 768px) {
    padding: 14px 20px;
    gap: 20px;
    justify-content: space-between;
  }
`;

const Logo = styled.h1`
  color: ${NEON_COLOR};
  font-size: 1.8rem;
  font-weight: 800;
  cursor: pointer;
  letter-spacing: 1px;
  text-shadow: 0 0 8px rgba(18,49,101,0.35);
  margin: 0;
  @media (max-width: 480px) { font-size: 1.5rem; }
`;

const NavGroup = styled.div`
  display: flex;
  gap: 22px;
  align-items: center;
  margin-right: auto;
  @media (max-width: 1024px) { display: none; }

  span {
    color: ${MUTED_TEXT};
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
    &:hover:after { width: 100%; }
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${NEON_COLOR};
  font-size: 1.5rem;
  cursor: pointer;
  @media (max-width: 1024px) { display: block; }
`;

const MobileNavMenu = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: #ffffff;
  z-index: 1100;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 80px;
  transform: translateX(${props => (props.$isOpen ? '0' : '100%')});
  transition: transform 0.3s ease-in-out;
  box-shadow: -4px 0 20px rgba(15,23,42,0.15);

  .close-btn {
    position: absolute;
    top: 20px; right: 20px;
    background: none;
    border: none;
    color: ${LIGHT_TEXT};
    font-size: 2rem;
    cursor: pointer;
  }

  span {
    font-size: 1.3rem;
    margin: 15px 0;
    cursor: pointer;
    color: ${MUTED_TEXT};
    &:hover { color: ${NEON_COLOR}; }
  }
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
  @media (max-width: 480px) { font-size: clamp(2rem, 10vw, 4rem); }
`;

const Letter = styled.span`
  display: inline-block;
  transform-origin: center bottom;
  animation: ${flagWave} 2.2s ease-in-out infinite;
  transform: translateY(0) rotate(0deg) scale(var(--dpr-scale, 1));
  &.neon {
    background: linear-gradient(120deg, ${NEON_COLOR}, ${GOLD_ACCENT});
    -webkit-background-clip: text;
    color: transparent;
    filter: drop-shadow(0 0 8px rgba(212,169,55,0.4));
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
  @media (max-width: 480px) { font-size: 0.9rem; }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
`;

const PrimaryBtn = styled.button`
  background: ${NEON_COLOR};
  color: #ffffff;
  padding: 12px 26px;
  border-radius: 999px;
  font-weight: 700;
  box-shadow: 0 10px 30px rgba(18,49,101,0.35);
  display: inline-flex;
  align-items: center;
  gap: 10px;
  transition: transform .18s ease, box-shadow .18s ease;
  border: none;
  cursor: pointer;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 16px 40px rgba(18,49,101,0.5);
  }
  @media (max-width: 480px) {
    padding: 10px 20px;
    font-size: 0.9rem;
  }
`;

const SecondaryBtn = styled(PrimaryBtn)`
  background: transparent;
  color: ${NEON_COLOR};
  border: 1px solid ${NEON_COLOR};
  box-shadow: none;
  &:hover {
    background: ${NEON_COLOR};
    color: #ffffff;
  }
`;

// --- MILESTONES ---
const MilestonesSection = styled.section`
  padding: 80px 20px;
  background: transparent;
  text-align: center;
  @media (max-width: 768px) { padding: 60px 20px; }
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
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  @media (max-width: 400px) { grid-template-columns: 1fr; }
`;

const MilestoneCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 22px 20px;
  border-radius: 18px;
  background: ${CARD_BG};
  box-shadow: 0 10px 30px rgba(15,23,42,0.12);
  border: 1px solid ${BORDER_LIGHT};
`;

const MilestoneIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
  background: linear-gradient(135deg, rgba(18,49,101,0.08), rgba(212,169,55,0.25));
  color: #ffffff;
  box-shadow: 0 8px 22px rgba(15,23,42,0.25);

  .svg-inline--fa {
    font-size: 30px;
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
    font-size: 3rem;
    font-weight: 800;
    color: ${LIGHT_TEXT};
    line-height: 1;
    letter-spacing: -0.02em;
  }
  .plus {
    font-size: 3rem;
    color: ${GOLD_ACCENT};
    font-weight: 900;
    line-height: 1;
    margin-left: 4px;
  }

  @media (max-width: 480px) {
    .num { font-size: 2.2rem; }
    .plus { font-size: 2.2rem; }
  }
`;

const MilestoneDescription = styled.p`
  font-size: 0.9rem;
  color: ${MUTED_TEXT};
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  @media (max-width: 480px) { font-size: 0.8rem; }
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
      box-shadow: 0 0 15px rgba(18,49,101,0.3);
      color: ${NEON_COLOR};
    }
  }

  .icon-box {
    width: 90px;
    height: 90px;
    border-radius: 24px;
    border: 1px solid ${BORDER_LIGHT};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
    background: radial-gradient(circle at 10% 10%, rgba(18,49,101,0.08), rgba(0,0,0,0.02));
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
  padding: 80px 20px;
  text-align: center;
  @media (max-width: 768px) { padding: 60px 20px; }
`;

const StackTitle = styled.h2`
  font-size: clamp(1.8rem, 4vw, 3rem);
  font-weight: 800;
  margin: 0 0 8px 0;
  color: ${LIGHT_TEXT};
  span {
    color: ${NEON_COLOR};
  }
  @media (max-width: 480px) { font-size: 2rem; }
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

// --- NEW STYLES FOR STACK TABS ---
const StackTabs = styled.div`
  max-width: 900px;
  margin: 0 auto 40px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
`;

const StackTabButton = styled.button`
  padding: 10px 20px;
  border: 1px solid ${BORDER_LIGHT};
  border-radius: 999px;
  background: ${props => (props.$isActive ? NEON_COLOR : CARD_BG)};
  color: ${props => (props.$isActive ? '#ffffff' : LIGHT_TEXT)};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;

  &:hover {
    background: ${props => (props.$isActive ? NEON_COLOR : FOOTER_BG)};
    color: ${props => (props.$isActive ? '#ffffff' : NEON_COLOR)};
    border-color: ${props => (props.$isActive ? NEON_COLOR : NEON_COLOR)};
  }
`;

// --- NEW STYLES FOR TECH GRID ---
const TechGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 25px;
  @media (max-width: 600px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 400px) { grid-template-columns: 1fr; }
`;

const TechCardWrapper = styled(AnimatedSection)`
  text-align: center;
`;

const TechCardInner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 25px 20px;
  background: ${CARD_BG};
  border-radius: 14px;
  border: 1px solid ${BORDER_LIGHT};
  box-shadow: 0 10px 30px rgba(15,23,42,0.1);
  transition: all 0.3s ease;
  height: 100%;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 16px 40px rgba(15,23,42,0.15);
    border-color: ${NEON_COLOR};
  }
`;

const TechIconBox = styled.div`
  width: 80px;
  height: 80px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const TechName = styled.h4`
  font-size: 1.1rem;
  color: ${LIGHT_TEXT};
  margin: 0;
  font-weight: 700;
`;
// --- END NEW STYLES FOR TECH GRID ---


// --- OLD STACK STYLES (Kept for compatibility, though not used in the final design structure) ---
const StackGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
  @media (max-width: 600px) { grid-template-columns: 1fr; }
`;

const StackCard = styled.div`
  background: ${CARD_BG};
  border-radius: 14px;
  padding: 30px;
  text-align: left;
  border: 1px solid ${BORDER_LIGHT};
  box-shadow: 0 12px 35px rgba(15,23,42,0.12);
  transition: all 0.3s ease;
  cursor: default;
  
  // Custom styling for the single focused card (like AI/ML)
  ${({ $isSingle }) => 
    $isSingle && css`
      max-width: 800px;
      margin-left: auto;
      margin-right: auto;
      text-align: center;
    `}


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

  @media (max-width: 480px) {
    padding: 20px;
    h3 { font-size: 1.2rem; }
    p { font-size: 0.85rem; }
  }
`;
// --- END OLD STACK STYLES ---


// --- STORIES ---
const StoriesSection = styled.section`
  padding: 80px 20px;
  background: ${FOOTER_BG};
  text-align: center;
  @media (max-width: 768px) { padding: 60px 20px; }
`;

const StoriesTitle = styled.h2`
  font-size: clamp(1.8rem, 4vw, 3rem);
  font-weight: 800;
  margin: 0 0 50px 0;
  color: ${LIGHT_TEXT};
  span {
    color: ${NEON_COLOR};
  }
  @media (max-width: 480px) { font-size: 2rem; }
`;

const StoriesGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const StoryCard = styled(AnimatedSection)`
  background: ${CARD_BG};
  border-radius: 14px;
  padding: 30px;
  text-align: left;
  min-height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid ${BORDER_LIGHT};
  box-shadow: 0 10px 30px rgba(15,23,42,0.12);

  .quote-icon {
    color: ${GOLD_ACCENT};
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
    border-top: 1px solid ${BORDER_LIGHT};
    padding-top: 15px;
    p { margin: 0; line-height: 1.4; }
    .name { color: ${NEON_COLOR}; font-weight: 600; font-size: 1rem; }
    .role { color: ${MUTED_TEXT}; font-size: 0.85rem; }
  }
`;

// --- CTA ---
const CtaSection = styled.section`
  padding: 100px 20px;
  text-align: center;
  @media (max-width: 768px) { padding: 60px 20px; }
`;

const CtaContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 60px 40px;
  border-radius: 20px;
  background: linear-gradient(135deg, ${NEON_COLOR}, ${GOLD_ACCENT});
  box-shadow: 0 20px 60px rgba(15,23,42,0.45);
  @media (max-width: 768px) { padding: 40px 20px; }

  h2 {
    font-size: clamp(2rem, 5vw, 3.2rem);
    color: #ffffff;
    margin-top: 0;
    margin-bottom: 15px;
    font-weight: 900;
    letter-spacing: -0.05em;
  }
  p {
    color: rgba(255,255,255,0.9);
    font-size: 1.1rem;
    margin-bottom: 30px;
  }
  button {
    background: #ffffff;
    color: ${NEON_COLOR};
    font-weight: 700;
    padding: 12px 30px;
    border: none;
    border-radius: 999px;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 8px 20px rgba(15,23,42,0.35);
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 26px rgba(15,23,42,0.5);
    }
  }
`;

// --- FOOTER ---
const FullFooter = styled.footer`
  background: ${FOOTER_BG};
  padding: 60px 50px 20px;
  color: ${MUTED_TEXT};
  border-top: 1px solid ${BORDER_LIGHT};
  @media (max-width: 768px) { padding: 40px 20px 20px; }
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
  @media (max-width: 768px) { min-width: unset; width: 100%; margin-bottom: 10px; }

  h4 {
    color: ${LIGHT_TEXT};
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
    cursor: pointer;
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
      box-shadow: 0 6px 18px rgba(15,23,42,0.4);
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

// ====================================================================
// ========== HELPERS & COMPONENTS ==========
// ====================================================================
const ICON_MAP = {
  projects: faClipboardList,
  experience: faStar,
  clients: faUsers,
  hours: faClock,
};

// --- Tech Card Component ---
const TechCard = ({ tech, name, delay, isVisible }) => (
  <TechCardWrapper $isVisible={isVisible} $delay={delay}>
    <TechCardInner>
      <TechIconBox>
        {tech.logoUrl ? (
          <img src={tech.logoUrl} alt={name} />
        ) : (
          <FontAwesomeIcon icon={tech.icon || faCode} size="3x" color={NEON_COLOR} />
        )}
      </TechIconBox>
      <TechName>{name}</TechName>
    </TechCardInner>
  </TechCardWrapper>
);


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
  // Setting default to 'ai' as requested/shown in the active tab image
  const [activeStackTab, setActiveStackTab] = useState('ai'); 

  const [milestonesRef, isMilestonesVisible] = useIntersectionObserver({ threshold: 0.2, rootMargin: '0px 0px -100px 0px' });
  const [storiesRef, isStoriesVisible] = useIntersectionObserver({ threshold: 0.2, rootMargin: '0px 0px -50px 0px' });
  const [stackRef, isStackVisible] = useIntersectionObserver({ threshold: 0.2, rootMargin: '0px 0px -100px 0px' });
  const [ctaRef] = useIntersectionObserver({ threshold: 0.2, rootMargin: '0px 0px -50px 0px' });

  // --- UPDATED STACK DATA with Tech Sub-categories ---
  const stackData = {
    tabs: [
      { key: 'web', label: 'Web', icon: faCode },
      { key: 'mobile', label: 'Mobile', icon: faMobileAlt },
      { key: 'blockchain', label: 'Blockchain', icon: faProjectDiagram },
      { key: 'ai', label: 'AI/ML', icon: faMagic },
      { key: 'design', label: 'Design', icon: faPaintBrush },
      { key: 'marketing', label: 'Marketing', icon: faBullhorn },
    ],
    tech: {
      web: [
        { name: 'React', logoUrl: TECH_LOGOS['React Native'] },
        { name: 'Node.js', logoUrl: TECH_LOGOS['Node.js'] },
        { name: 'MongoDB', logoUrl: TECH_LOGOS['MongoDB'] },
        { name: 'AWS', logoUrl: TECH_LOGOS['AWS'] },
      ],
      mobile: [
        { name: 'React Native', logoUrl: TECH_LOGOS['React Native'] },
        { name: 'Flutter', logoUrl: TECH_LOGOS['Flutter'] },
        { name: 'Swift (iOS)', logoUrl: TECH_LOGOS['Swift'] },
        { name: 'Kotlin (Android)', logoUrl: TECH_LOGOS['Kotlin'] },
      ],
      blockchain: [
        { name: 'Solidity', logoUrl: TECH_LOGOS['Solidity'] },
        { name: 'Ethereum', logoUrl: TECH_LOGOS['Ethereum'] },
        { name: 'Hyperledger', icon: faProjectDiagram },
        { name: 'Web3.js', icon: faCode },
      ],
      // UPDATED: AI/ML Stack now uses TechCard format
      ai: [
        { name: 'Gemini', logoUrl: TECH_LOGOS['Gemini'] },
        { name: 'OpenAI', logoUrl: TECH_LOGOS['OpenAI'] },
        { name: 'Python', logoUrl: TECH_LOGOS['Python'] },
        { name: 'Data Science', icon: faDatabase, description: 'Model Training & Analysis' },
      ],
      design: [
        { name: 'Figma', logoUrl: TECH_LOGOS['Figma'] },
        { name: 'Canva', logoUrl: TECH_LOGOS['Canva'] },
        { name: 'Adobe Suite', logoUrl: TECH_LOGOS['Adobe Suite'] },
        { name: 'Spline (3D)', logoUrl: TECH_LOGOS['Spline'] },
      ],
      // UPDATED: Marketing Stack now uses TechCard format
      marketing: [
        { name: 'Analytics', icon: faChartBar, description: 'Google Analytics, Mixpanel' },
        { name: 'SEO Suite', icon: faBullhorn, description: 'Ahrefs, SEMrush' },
        { name: 'Social Media', icon: faInstagram, description: 'Campaign Management' },
        { name: 'Strategy', icon: faHandshake, description: 'Growth & Planning' },
      ],
    },
  };

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

  // --- CANVAS EFFECTS (omitted for brevity) ---
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
    const starCount = Math.floor((width * height) / 60000);
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 1 + Math.random() * 2.2,
      a: 0.15 + Math.random() * 0.35,
      dx: (Math.random() - 0.5) * 0.25,
      dy: 0.08 + Math.random() * 0.35,
      twinkle: Math.random() * Math.PI * 2,
    }));

    const draw = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      ctx.clearRect(0, 0, width, height);

      stars.forEach((s) => {
        s.x += s.dx;
        s.y += s.dy;
        s.twinkle += 0.05;
        if (s.y > height + 10) s.y = -10;
        if (s.x > width + 10) s.x = -10;
        if (s.x < -10) s.x = width + 10;
        const alpha = s.a * (0.5 + Math.sin(s.twinkle) * 0.5);
        ctx.fillStyle = `rgba(212,169,55,${alpha})`;
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

  // --- TYPING EFFECT (omitted for brevity) ---
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

  // Logic to render the correct stack section
  const renderStackContent = (activeTab, isVisible) => {
    const techKeys = ['web', 'mobile', 'blockchain', 'design', 'ai', 'marketing'];
    
    // Check if the tab uses the TechGrid (with logos/icons)
    if (techKeys.includes(activeTab)) {
      const techList = stackData.tech[activeTab] || [];
      return (
        <TechGrid>
          {techList.map((tech, i) => (
            <TechCard
              key={tech.name}
              tech={tech}
              name={tech.name}
              isVisible={isVisible}
              delay={`${(i * 0.15).toFixed(2)}s`}
            />
          ))}
        </TechGrid>
      );
    } 
    
    // Default return or loading state
    return <div style={{ color: MUTED_TEXT, opacity: 0.7, padding: 30 }}>Select a powerful stack category above to see the tools we use.</div>;
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
                <PrimaryBtn onClick={() => handleNavigation('contact')}>
                  Start a Project <FontAwesomeIcon icon={faArrowRight} />
                </PrimaryBtn>
                <SecondaryBtn onClick={() => handleNavigation('projects')}>
                  See Our Work <FontAwesomeIcon icon={faClipboardList} />
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
              <div style={{ color: MUTED_TEXT, gridColumn: '1/-1', padding: 20 }}>
                Loading Milestones...
              </div>
            ) : (
              milestones.map((ms, index) => (
                <AnimatedSection key={ms.key || index} $isVisible={isMilestonesVisible} $delay={ms.delay}>
                  <MilestoneCard>
                    <MilestoneIcon>
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

        {/* TECH STACK - UPDATED */}
        <StackSection ref={stackRef}>
          <StackTitle>
            POWERFUL <span>STACK</span>
          </StackTitle>
          <StackSubtitle>We use the latest enterprise-grade technologies.</StackSubtitle>
          
          <StackTabs>
            {stackData.tabs.map((tab) => (
              <StackTabButton
                key={tab.key}
                $isActive={activeStackTab === tab.key}
                onClick={() => setActiveStackTab(tab.key)}
              >
                <FontAwesomeIcon icon={tab.icon} />
                {tab.label}
              </StackTabButton>
            ))}
          </StackTabs>

          {renderStackContent(activeStackTab, isStackVisible)}
          
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