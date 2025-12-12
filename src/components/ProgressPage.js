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
    faDownload,
    faBars,
    faTimes,
    faMapMarkerAlt
} from '@fortawesome/free-solid-svg-icons';
import {
    faInstagram,
    faLinkedinIn,
    faWhatsapp,
    faYoutube,
} from '@fortawesome/free-brands-svg-icons';

/* ---------------- THEME CONSTANTS ---------------- */
const NEON_COLOR = '#123165';          // primary navy
const TEXT_LIGHT = '#111827';          // Dark text for white bg
const TEXT_MUTED = '#6B7280';
const BORDER_LIGHT = 'rgba(15,23,42,0.08)';
const GOLD_ACCENT = '#D4A937';
const SURFACE_BORDER = 'rgba(8,48,71,0.06)';

/* ---------------- KEYFRAMES ---------------- */
const rollIn = keyframes`
    from { opacity: 0; transform: translateY(30px) scale(0.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
`;

const glowPulse = keyframes`
  0% { box-shadow: 0 0 0px rgba(212,175,55,0.0); }
  50% { box-shadow: 0 0 18px rgba(212,175,55,0.12); }
  100% { box-shadow: 0 0 0px rgba(212,175,55,0.0); }
`;

/* ---------------- GLOBAL STYLES ---------------- */
const GlobalStyle = createGlobalStyle`
    html, body {
        margin: 0;
        padding: 0;
        width: 100%;
        overflow-x: hidden;
        font-family: 'Poppins', sans-serif;
        background: 
            radial-gradient(circle at 0% 0%, #fff9e8 0, #ffffff 35%, transparent 55%),
            linear-gradient(180deg, #ffffff 0%, #f5f7fb 40%, #e5edf7 100%);
        color: ${TEXT_LIGHT};
    }
    #root { width: 100%; overflow-x: hidden; }
    .animate-in { opacity: 0; transform: translateY(20px); animation: fadeSlide 0.8s ease forwards; }
    @keyframes fadeSlide { to { opacity: 1; transform: translateY(0); } }
`;

/* ---------------- STAR CANVAS ---------------- */
const StarCanvas = styled.canvas`
    position: fixed; inset: 0; width: 100vw; height: 100vh; z-index: 0; pointer-events: none;
`;

/* ---------------- HEADER COMPONENTS ---------------- */
const Header = styled.header`
  display: flex;
  align-items: center;
  gap: 40px;
  padding: 14px 48px;
  position: sticky;
  top: 0;
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid ${BORDER_LIGHT};
  z-index: 1100;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 14px 20px;
    gap: 20px;
    justify-content: space-between;
  }
`;

const Logo = styled.h1`
  margin: 0;
  font-weight: 800;
  font-size: 1.8rem;
  cursor: pointer;
  letter-spacing: 1px;
  display: inline-flex;
  align-items: center;
  gap: 0;

  span {
    display: inline-block;
    line-height: 1;
    margin: 0;
    padding: 0;
    font-size: inherit;
  }

  color: ${NEON_COLOR};
  span.gold {
    color: ${GOLD_ACCENT};
    margin-left: 0;
  }

  @media (max-width: 480px) {
    font-size: 1.4rem;
  }
`;

const NavGroup = styled.nav`
  display: flex;
  gap: 22px;
  align-items: center;
  margin-right: auto;

  span {
    color: ${TEXT_MUTED};
    font-weight: 500;
    cursor: pointer;
    position: relative;
    padding: 6px 4px;
    transition: 0.3s ease;
    font-size: 1rem;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  span:hover { color: ${NEON_COLOR}; }
  span::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -2px;
    width: 0;
    height: 2px;
    background: ${GOLD_ACCENT};
    transition: 0.3s;
    border-radius: 4px;
  }
  span:hover::after { width: 100%; }
  
  @media (max-width: 1024px) { display: none; }
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
  }
`;

const MobileNavMenu = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #ffffff;
  z-index: 1200;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 80px;
  transform: translateX(${(p) => (p.isOpen ? "0" : "100%")});
  transition: transform 0.28s ease-in-out;
  box-shadow: -4px 0 20px rgba(15, 23, 42, 0.12);

  .close-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    background: none;
    border: none;
    font-size: 2rem;
    cursor: pointer;
    color: ${TEXT_LIGHT};
  }
  span {
    font-size: 1.3rem;
    margin: 14px 0;
    color: ${TEXT_MUTED};
    cursor: pointer;
  }
`;

/* ---------------- PAGE LAYOUT ---------------- */
const PageWrapper = styled.div`
    position: relative;
    z-index: 1;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: transparent;
`;

const ContentWrapper = styled.div`
    max-width: 1180px;
    margin: 0 auto;
    padding: 120px 24px 80px;
    width: 100%;
    box-sizing: border-box;

    @media (max-width: 780px) {
        padding: 100px 20px 60px;
    }
`;

const Shell = styled.div`
    border-radius: 16px;
    padding: 48px 40px 56px;
    background: #ffffff;
    border: 1px solid ${SURFACE_BORDER};
    box-shadow: 0 10px 30px rgba(8,48,71,0.06);
    width: 100%;
    box-sizing: border-box;

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
    color: ${NEON_COLOR};

    span {
        color: ${GOLD_ACCENT};
    }

    @media (max-width: 640px) {
        font-size: 24px;
    }
`;

/* SWOT GRID - Responsive */
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
    border-left: 3px solid ${GOLD_ACCENT};
    animation: ${glowPulse} 4s ease-in-out infinite;
`;
const WeaknessBox = styled(BaseBox)`
    border-left: 3px solid #ef4444;
`;
const OpportunityBox = styled(BaseBox)`
    border-left: 3px solid ${NEON_COLOR};
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
    flex-shrink: 0;

    ${({ variant }) => variant === "strength" && css`
        border: 1px solid rgba(212,175,55,0.18);
        background: linear-gradient(180deg, rgba(212,175,55,0.06), transparent);
        color: ${GOLD_ACCENT};
    `}
    ${({ variant }) => variant === "weakness" && css`
        border: 1px solid rgba(239,68,68,0.12);
        background: linear-gradient(180deg, rgba(239,68,68,0.04), transparent);
        color: #ef4444;
    `}
    ${({ variant }) => variant === "opportunity" && css`
        border: 1px solid rgba(18,49,101,0.12);
        background: linear-gradient(180deg, rgba(18,49,101,0.04), transparent);
        color: ${NEON_COLOR};
    `}
    ${({ variant }) => variant === "threat" && css`
        border: 1px solid rgba(156,163,175,0.12);
        background: linear-gradient(180deg, rgba(156,163,175,0.02), transparent);
        color: #9ca3af;
    `}
`;

const BoxTitle = styled.h2`
    font-size: 16px;
    font-weight: 700;
    color: ${TEXT_LIGHT};
    margin: 0;
`;

const BulletList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 8px 0 0;

    li {
        font-size: 14px;
        color: ${TEXT_LIGHT};
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
    color: ${NEON_COLOR};
    span { color: ${GOLD_ACCENT}; }
    @media (max-width: 600px) { font-size: 1.6rem; }
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

    /* Mobile: Stack items in a grid instead of a long horizontal line */
    @media (max-width: 768px) {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
        justify-items: center;
    }
`;

/* Line is hidden on mobile to avoid breaking layout */
const Line = styled.div`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    height: 4px;
    background: rgba(8,48,71,0.08);
    width: 100%;
    z-index: 1;
    border-radius: 2px;
    @media (max-width: 768px) { display: none; }
`;

const ActiveLine = styled.div`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    height: 4px;
    background: ${GOLD_ACCENT};
    width: 40%;
    z-index: 2;
    border-radius: 2px;
    left: 0;
    max-width: calc(100% - 10px);
    @media (max-width: 768px) { display: none; }
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
        width: auto;
    }
`;

const Circle = styled.div`
    width: 18px;
    height: 18px;
    border-radius: 50%;
    margin-bottom: 10px;
    border: 2px solid ${({ active }) => (active ? GOLD_ACCENT : 'rgba(8,48,71,0.18)')};
    background: ${({ active }) => (active ? NEON_COLOR : 'transparent')};
    transition: all 0.3s ease;
`;

const StepLabel = styled.span`
    font-size: 0.82rem;
    font-weight: 600;
    color: ${({ active }) => (active ? TEXT_LIGHT : TEXT_MUTED)};
    text-align: center;
    transition: color 0.3s ease;
`;

// CHANGED TO "A" TAG FOR DOWNLOADING
const ProcessButton = styled.a`
    background-color: ${NEON_COLOR};
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
    gap: 10px;
    text-decoration: none;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(8,48,71,0.08);
    }
`;

/* ---------------- CAREERS SECTION STYLES ---------------- */
const CareersWrapper = styled.section`
    max-width: 1180px;
    margin: 40px auto 80px;
    padding: 0 24px;
    display: grid;
    grid-template-columns: 1.5fr 3fr;
    gap: 28px;
    width: 100%;
    box-sizing: border-box;

    @media (max-width: 1024px) {
        grid-template-columns: 1fr;
        gap: 30px;
        padding: 0 20px;
    }
`;

const CareersTextGroup = styled.div`
    h2 {
        font-size: 1.9rem;
        font-weight: 800;
        margin-top: 0;
        margin-bottom: 12px;
        color: ${NEON_COLOR};
        span { color: ${GOLD_ACCENT}; }
        @media (max-width: 640px) { font-size: 1.5rem; }
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
            color: ${TEXT_LIGHT};
            font-weight: 600;
            margin-bottom: 8px;
            font-size: 0.95rem;

            svg {
                color: ${GOLD_ACCENT};
                margin-right: 12px;
                font-size: 1.1rem;
            }
        }
    }
`;

const ApplyButton = styled.button`
    background-color: ${GOLD_ACCENT};
    color: #042027;
    border: none;
    padding: 12px 28px;
    border-radius: 8px;
    font-weight: 700;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.18s ease-in-out;
    box-shadow: 0 6px 18px rgba(212,175,55,0.12);

    &:hover { transform: translateY(-2px); }
`;

const BarChartContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    background: #ffffff;
    padding: 24px;
    border-radius: 12px;
    border: 1px solid ${SURFACE_BORDER};
    box-shadow: 0 10px 30px rgba(8,48,71,0.06);
    width: 100%;
    box-sizing: border-box;
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
        background-color: ${GOLD_ACCENT}; 
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

    &:first-child { border-top: 1px solid rgba(8,48,71,0.02); }
    h4 { color: ${TEXT_LIGHT}; font-size: 0.95rem; font-weight: 700; margin: 0 0 4px 0; }
    p { color: ${TEXT_MUTED}; font-size: 0.85rem; margin: 0; }
`;

/* ---------------- FOOTER COMPONENT ---------------- */
const FullFooter = styled.footer`
  background: rgba(255,255,255,0.9);
  padding: 60px 50px 20px;
  color: ${TEXT_MUTED};
  border-top: 1px solid ${BORDER_LIGHT};
  box-sizing: border-box;

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

  @media (max-width: 900px) {
    flex-wrap: wrap;
  }

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 30px;
  }
`;

const FooterColumn = styled.div`
  min-width: 200px;
  @media (max-width: 768px) { min-width: unset; flex: 1; }
  @media (max-width: 600px) { width: 100%; flex: none; }

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
    cursor: pointer;
    &:hover { color: ${NEON_COLOR}; }
  }
`;

const FooterLogo = styled(Logo)`
  font-size: 1.5rem;
  margin-bottom: 10px;
  gap: 0;
  span { font-size: 1em; }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 15px;
  a {
    width: 36px;
    height: 36px;
    border-radius: 999px;
    /* Soft Gold Background */
    background: rgba(212,169,55,0.15); 
    display: flex;
    align-items: center;
    justify-content: center;
    /* Gold Icon */
    color: ${GOLD_ACCENT}; 
    transition: background 0.3s, color 0.3s, box-shadow 0.3s, transform 0.2s;
    
    &:hover {
      /* Solid Gold on Hover */
      background: ${GOLD_ACCENT};
      color: #ffffff;
      box-shadow: 0 8px 20px rgba(212,169,55,0.3);
      transform: translateY(-3px);
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

/* ---------------- HELPER COMPONENTS ---------------- */
const AgileWorkflow = () => {
    const steps = ["Inquiry", "Analysis", "Proposal", "Team Alloc", "Development", "Review", "Feedback", "Delivery"];
    return (
        <WorkflowContainer>
            <WorkflowTitle>AGILE <span>WORKFLOW</span></WorkflowTitle>
            <WorkflowSubtitle>A streamlined, transparent process designed for speed and quality.</WorkflowSubtitle>
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
            
            {/* UPDATED: Download button pointing to public/AGILE_WORKFLOW.pdf */}
            <ProcessButton href="/AGILE_WORKFLOW.pdf" download="NEXORACREW_Agile_Workflow.pdf" target="_blank">
                <FontAwesomeIcon icon={faDownload} /> Download Process PDF
            </ProcessButton>
        </WorkflowContainer>
    );
};

const CareersSection = () => (
    <CareersWrapper>
        <CareersTextGroup>
            <h2>CAREERS @ <span>NEXORACREW</span></h2>
            <p>Transforming ideas into powerful digital products using modern technology, creativity, and AI. Where Ideas Meet Innovation.</p>
            <ul>
                <li><FontAwesomeIcon icon={faCalendarCheck} /> Real-world experience</li>
                <li><FontAwesomeIcon icon={faCalendarCheck} /> Mentorship from Seniors</li>
                <li><FontAwesomeIcon icon={faCalendarCheck} /> Official Certification</li>
                <li><FontAwesomeIcon icon={faCalendarCheck} /> Networking Opportunities</li>
            </ul>
            <ApplyButton onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSflR-eG2DJXiHOThlXgeToIivo95GKEyZa0dhJDJFD2WbrWlA/viewform', '_blank')}>Apply Now</ApplyButton>
        </CareersTextGroup>

        <BarChartContainer>
            
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
    </CareersWrapper>
);

/* ---------------- MAIN COMPONENT ---------------- */
const ProgressPage = ({ onNavigate = () => {} }) => {
    const canvasRef = useRef(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const safeGeneralData = {
        email: 'nexora.crew@gmail.com',
        phone: '+91 95976 46460',
        location: 'JJ College of Engineering, Trichy',
    };

    const navItems = ['home', 'about', 'services', 'projects', 'team', 'progress', 'blog', 'certificate', 'contact'];


    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: true });
        
        let DPR = Math.max(1, window.devicePixelRatio || 1);
        let width = Math.max(1, Math.floor(window.innerWidth));
        let height = Math.max(1, Math.floor(window.innerHeight));

        function resize() {
            DPR = Math.max(1, window.devicePixelRatio || 1);
            width = Math.max(1, Math.floor(window.innerWidth));
            height = Math.max(1, Math.floor(window.innerHeight));
            canvas.width = Math.floor(width * DPR);
            canvas.height = Math.floor(height * DPR);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        }
        resize();

        const count = 140;
        const stars = Array.from({ length: count }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            r: 1 + Math.random() * 2.2, // Slightly larger, soft glow
            dx: (Math.random() - 0.5) * 0.25, // Gentle float
            dy: 0.08 + Math.random() * 0.35, // Downward drift
            alpha: 0.15 + Math.random() * 0.35, // Visibility
        }));

        function onWindowResize() {
            resize();
            for (let s of stars) {
                s.x = Math.random() * width;
                s.y = Math.random() * height;
            }
        }
        window.addEventListener('resize', onWindowResize);

        let raf;
        const draw = () => {
            ctx.clearRect(0, 0, width, height);
            stars.forEach((s) => {
                s.x += s.dx; s.y += s.dy;
                if (s.y > height + 10) s.y = -10;
                if (s.x > width + 10) s.x = -10;
                if (s.x < -10) s.x = width + 10;

                // Pure Gold
                ctx.fillStyle = `rgba(212,169,55,${s.alpha})`; 

                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fill();
            });
            raf = requestAnimationFrame(draw);
        };
        draw();
        window.addEventListener('resize', resize);
        return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
    }, []);

    const handleNavigation = (route) => {
        if (onNavigate) onNavigate(route);
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            <GlobalStyle />
            <StarCanvas ref={canvasRef} aria-hidden />
            <PageWrapper>
                {/* HEADER */}
                <Header>
                    <Logo onClick={() => handleNavigation('home')}>
                        NEXORA<span className="gold">CREW</span>
                    </Logo>
                    <NavGroup>
                        {navItems.map((item) => (
                            <span 
                                key={item} 
                                onClick={() => handleNavigation(item)}
                                style={item === 'progress' ? { color: NEON_COLOR, fontWeight: 700 } : {}}
                            >
                                {item.charAt(0).toUpperCase() + item.slice(1)}
                            </span>
                        ))}
                    </NavGroup>
                    <MobileMenuButton onClick={() => setIsMobileMenuOpen(true)}>
                        <FontAwesomeIcon icon={faBars} />
                    </MobileMenuButton>
                </Header>

                <MobileNavMenu isOpen={isMobileMenuOpen}>
                    <button className="close-btn" onClick={() => setIsMobileMenuOpen(false)}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                    {navItems.map((item) => (
                        <span key={item} onClick={() => handleNavigation(item)} style={item === 'progress' ? { color: NEON_COLOR } : {}}>
                            {item.charAt(0).toUpperCase() + item.slice(1)}
                        </span>
                    ))}
                </MobileNavMenu>

                <ContentWrapper>
                    <Shell>
                        <AgileWorkflow />

                        <Title>STRATEGIC <span>ANALYSIS</span></Title>
                        <Grid>
                            <StrengthBox>
                                <HeaderRow>
                                    <IconCircle variant="strength"><FontAwesomeIcon icon={faBullseye} /></IconCircle>
                                    <BoxTitle>Strengths</BoxTitle>
                                </HeaderRow>
                                <BulletList>
                                    <li>Human-centered design approach</li>
                                    <li>Strong UI/UX + Development expertise</li>
                                    <li>Customized digital solutions (web, app, SaaS)</li>
                                    <li>Fast execution & modern workflows</li>
                                    <li>Innovation-focused team</li>
                                    <li>Quality-first development</li>
                                    <li>Clear brand identity</li>
                                </BulletList>
                            </StrengthBox>

                            <WeaknessBox>
                                <HeaderRow>
                                    <IconCircle variant="weakness"><FontAwesomeIcon icon={faTriangleExclamation} /></IconCircle>
                                    <BoxTitle>Weaknesses</BoxTitle>
                                </HeaderRow>
                                <BulletList>
                                    <li>Brand awareness still developing</li>
                                    <li>Limited portfolio compared to big agencies</li>
                                    <li>Small team size</li>
                                    <li>Scaling challenges</li>
                                    <li>Depends on digital marketing consistency</li>
                                </BulletList>
                            </WeaknessBox>

                            <OpportunityBox>
                                <HeaderRow>
                                    <IconCircle variant="opportunity"><FontAwesomeIcon icon={faBolt} /></IconCircle>
                                    <BoxTitle>Opportunities</BoxTitle>
                                </HeaderRow>
                                <BulletList>
                                    <li>High demand for websites, mobile apps & SaaS</li>
                                    <li>Global freelancing & outsourcing growth</li>
                                    <li>AI automation & tech integration</li>
                                    <li>Cloud technology demand increasing</li>
                                    <li>Social media boost</li>
                                    <li>Corporate branding expansion</li>
                                </BulletList>
                            </OpportunityBox>

                            <ThreatBox>
                                <HeaderRow>
                                    <IconCircle variant="threat"><FontAwesomeIcon icon={faUserShield} /></IconCircle>
                                    <BoxTitle>Threats</BoxTitle>
                                </HeaderRow>
                                <BulletList>
                                    <li>Heavy competition in IT sector</li>
                                    <li>Price competition from freelancers</li>
                                    <li>Fast-changing technologies</li>
                                    <li>Increasing client expectations</li>
                                    <li>Economic slowdowns</li>
                                </BulletList>
                            </ThreatBox>
                        </Grid>
                    </Shell>
                </ContentWrapper>

                {/* Careers Section - Moved out of Footer for standardization */}
                <CareersSection />

                {/* FOOTER */}
                <FullFooter>
                    <FooterGrid>
                        <FooterColumn style={{ minWidth: '300px' }}>
                            <FooterLogo onClick={() => handleNavigation('home')}>
                                NEXORA<span className="gold">CREW</span>
                            </FooterLogo>
                            <p>Transforming ideas into powerful digital products using modern technology, creativity, and AI. Where ideas meet innovation.</p>
                            <SocialIcons>
                                <a href="https://www.instagram.com/nexoracrew?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faInstagram} /></a>
                                <a href="https://www.linkedin.com/in/nexoracrew-%E2%80%8C-01842a396/" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faLinkedinIn} /></a>
                                <a href={`mailto:${safeGeneralData.email}`}><FontAwesomeIcon icon={faEnvelope} /></a>
                                <a href="https://wa.me/9597646460" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faWhatsapp} /></a>
                                <a href="https://www.youtube.com/@Nexora-crew" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faYoutube} /></a>
                            </SocialIcons>
                        </FooterColumn>

                        <FooterColumn>
                            <h4>Quick Links</h4>
                            <ul>
                                {navItems.map((item, i) => (
                                    <li key={i}><a onClick={() => handleNavigation(item)}>{item.charAt(0).toUpperCase() + item.slice(1)}</a></li>
                                ))}
                            </ul>
                        </FooterColumn>

                        <FooterColumn>
                            <h4>Services</h4>
                            <ul>
                                {['Web Development', 'Poster designing & logo making' , 'Content creation' , 'Digital marketing &SEO' , 'AI and automation' , 'Hosting & Support' , 'Printing &Branding solutions' , 'Enterprise networking &server architecture' , 'Bold branding&Immersive visual design' , 'Next gen web & mobile experience'].map((l, i) => (
                                    <li key={i}><a onClick={() => handleNavigation('services')}>{l}</a></li>
                                ))}
                            </ul>
                        </FooterColumn>

                        <FooterColumn>
                            <h4>Contact Info</h4>
                            <ul>
                                <li><a href="#map"><FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: GOLD_ACCENT }} /> Palakarai,Trichy.</a></li>
                                <li><a href={`mailto:${safeGeneralData.email}`}><FontAwesomeIcon icon={faEnvelope} style={{ color: GOLD_ACCENT }} /> {safeGeneralData.email}</a></li>
                                <li><a href={`tel:${safeGeneralData.phone}`}><FontAwesomeIcon icon={faPhone} style={{ color: GOLD_ACCENT }} /> +91 9597646460</a></li>
                            </ul>
                        </FooterColumn>
                    </FooterGrid>

                    <Copyright>© 2025 Nexoracrew. All Rights Reserved.</Copyright>
                </FullFooter>
            </PageWrapper>
        </>
    );
};

export default ProgressPage;