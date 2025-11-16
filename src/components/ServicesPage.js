// src/components/ServicesPage.js
import React, { useEffect, useRef, useState } from 'react';
import styled, { createGlobalStyle, keyframes, css } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarCheck, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

/**
 * API base detection:
 * supports REACT_APP_API_BASE and REACT_APP_API_BASE_URL (Vercel)
 * local -> http://localhost:5000; production -> env or fallback
 */
const ENV_API_A = process.env.REACT_APP_API_BASE || '';
const ENV_API_B = process.env.REACT_APP_API_BASE_URL || '';
const ENV_API = ENV_API_A || ENV_API_B || '';
const isLocalhost =
  window.location.hostname === 'localhost' ||
  window.location.hostname.startsWith('192.168.') ||
  window.location.hostname.startsWith('10.');

// optional fallback for quick patch - replace with your production API if desired
const DEFAULT_REMOTE_API = 'https://evil-gypsy-sharugesh-06d0c56b.koyeb.app';
const API_BASE = isLocalhost ? (ENV_API || 'http://localhost:5000') : (ENV_API || DEFAULT_REMOTE_API);

console.info('[ServicesPage] API_BASE =', API_BASE);

/* ---------------- THEME / KEYFRAMES ---------------- */
const NEON = '#00e0b3';
const ACCENT = '#1ddc9f';
const NAVY_BG = '#071025';
const MID_NAVY = '#0B1724';
const LIGHT_TEXT = '#D6E2F0';
const MUTED_TEXT = '#9AA6B3';
const BORDER_DARK = '#0e2430';
const HEADER_HEIGHT = '72px';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: translateY(0); }
`;
const floatMicro = keyframes`
  0% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-8px) rotate(0.8deg); }
  100% { transform: translateY(0) rotate(0deg); }
`;
const pulseOutline = keyframes`
  0% { box-shadow: 0 8px 26px rgba(29,220,159,0.06), 0 0 6px rgba(29,220,159,0.04); }
  50% { box-shadow: 0 12px 42px rgba(29,220,159,0.10), 0 0 12px rgba(29,220,159,0.07); }
  100% { box-shadow: 0 8px 26px rgba(29,220,159,0.06), 0 0 6px rgba(29,220,159,0.04); }
`;
const pulseActive = keyframes`
  0% { box-shadow: 0 18px 44px rgba(29,220,159,0.18), 0 0 28px rgba(29,220,159,0.12); }
  50% { box-shadow: 0 28px 64px rgba(29,220,159,0.26), 0 0 48px rgba(29,220,159,0.18); }
  100% { box-shadow: 0 18px 44px rgba(29,220,159,0.18), 0 0 28px rgba(29,220,159,0.12); }
`;

/* ---------------- GLOBAL STYLE ---------------- */
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Poppins', sans-serif;
    background: ${NAVY_BG};
    color: ${LIGHT_TEXT};
    overflow-x: hidden;
  }
  .neon-text-shadow { text-shadow: 0 0 12px ${NEON}, 0 0 22px rgba(0,224,179,0.12); }
  .animate-in { opacity: 0; animation: ${css`${fadeUp} 0.85s ease forwards`}; }
`;

/* ---------------- STAR CANVAS ---------------- */
const StarCanvas = styled.canvas`
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  display: block;
  background: radial-gradient(circle at 18% 12%, #071122 0%, #081226 18%, #071020 45%, #02040a 100%);
  pointer-events: none;
`;

/* ---------------- HEADER / NAV (now matches BlogPage behavior) ---------------- */
const Header = styled.header`
  display: flex;
  align-items: center;
  gap: 40px;
  padding: 14px 48px;
  position: fixed; /* fixed so it stays while dragging/scrolling */
  top: 0;
  width: 100%;
  height: ${HEADER_HEIGHT};
  line-height: ${HEADER_HEIGHT};
  background: rgba(7,16,38,0.65);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255,255,255,0.04);
  z-index: 10;
`;
const Logo = styled.h1`
  color: ${NEON};
  font-size: 1.8rem;
  font-weight: 800;
  cursor: pointer;
  letter-spacing: 1px;
  text-shadow: 0 0 12px ${NEON};
  margin: 0;
`;
const NavGroup = styled.div`
  display: flex;
  gap: 22px;
  align-items: center;
  margin-right: auto;

  span {
    color: ${MUTED_TEXT};
    cursor: pointer;
    font-weight: 500;
    position: relative;
    transition: 0.3s ease;
    padding: 6px 4px;
    white-space: nowrap;
  }

  span:hover {
    color: ${NEON};
    text-shadow: 0 0 10px ${NEON};
  }

  span:after {
    content: '';
    position: absolute;
    left: 0; bottom: -2px;
    width: 0;
    height: 2px;
    background: ${NEON};
    transition: 0.3s;
    border-radius: 4px;
  }

  span:hover:after { width: 100%; }

  .active {
    color: ${NEON};
    text-shadow: 0 0 8px ${NEON};
  }
`;

/* ---------------- PAGE / CONTENT ---------------- */
const Page = styled.div`
  position: relative;
  z-index: 3;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: ${HEADER_HEIGHT};
`;

/* ---------------- INTRO ---------------- */
const Intro = styled.section`
  padding: calc(${HEADER_HEIGHT} + 40px) 20px 40px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
`;
const IntroTitle = styled.h2`
  font-size: 2.6rem;
  font-weight: 800;
  margin: 0 0 12px;
  color: ${LIGHT_TEXT};
  span { color: ${NEON}; }
`;
const IntroSubtitle = styled.p`
  color: ${MUTED_TEXT};
  margin: 0 auto;
  max-width: 850px;
  font-size: 1.05rem;
`;

/* ---------------- SERVICES GRID & CARDS ---------------- */
const ServiceGrid = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 40px auto 90px;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 28px;
`;

const ServiceCard = styled.article`
  position: relative;
  background: ${MID_NAVY};
  border-radius: 18px;
  padding: 36px 28px;
  border: 2px solid rgba(29,220,159,0.20);
  box-shadow: 0 20px 40px rgba(2,6,23,0.55);
  transition: transform 0.32s ease, box-shadow 0.32s ease, border-color 0.32s ease;
  transform-style: preserve-3d;
  perspective: 900px;
  overflow: visible;
  animation: ${css`${fadeUp} 0.9s ease forwards`};

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 220px;
  gap: 12px;

  h3 {
    margin: 4px 0 0;
    font-size: 1.2rem;
    color: ${LIGHT_TEXT};
    transition: opacity 0.28s ease, transform 0.28s ease;
    z-index: 5;
  }

  .desc-overlay {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) scale(0.98);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.32s ease, transform 0.32s ease;
    z-index: 8;
    width: calc(100% - 56px);
    max-width: 420px;
    box-sizing: border-box;
    overflow: visible;
  }

  &:hover { transform: translateY(-8px) scale(1.02); box-shadow: 0 30px 60px rgba(29,220,159,0.15); }
  &:focus { outline: none; box-shadow: 0 30px 60px rgba(29,220,159,0.15); }

  &::after {
    content: '';
    position: absolute;
    inset: -6px;
    border-radius: 22px;
    pointer-events: none;
    box-shadow: 0 12px 32px rgba(29,220,159,0.10), 0 0 16px rgba(29,220,159,0.06);
    animation: ${pulseOutline} 4.4s infinite;
    z-index: 0;
  }

  &.active {
    background: linear-gradient(150deg, ${ACCENT} 0%, #19c38c 100%);
    border-color: transparent;
    transform: translateY(-8px) scale(1.03);
    &::after { box-shadow: 0 30px 70px rgba(29,220,159,0.26), 0 0 50px rgba(29,220,159,0.18); animation: ${pulseActive} 2.6s infinite; }
    .desc-overlay { pointer-events: auto; opacity: 1; transform: translate(-50%, -50%) scale(1); }
    h3 { opacity: 1; transform: translateY(0); z-index: 6; }
  }

  @media (max-width: 880px) {
    padding: 22px 18px;
    min-height: 200px;
    .desc-overlay { width: calc(100% - 36px); max-width: 360px; }
  }
`;

const DescPanel = styled.div`
  width: 100%;
  background: rgba(2,8,18,0.98);
  border-radius: 12px;
  padding: 18px 16px;
  border: 1px solid rgba(255,255,255,0.06);
  color: ${LIGHT_TEXT};
  backdrop-filter: blur(6px);
  box-shadow: 0 14px 34px rgba(0,0,0,0.6);
  text-align: center;
  animation: ${floatMicro} 7s ease-in-out infinite;
  box-sizing: border-box;
  overflow: visible;

  strong { font-size: 1.05rem; display:block; margin-bottom:10px; color: ${NEON}; }
  p { color: ${MUTED_TEXT}; margin: 0; line-height: 1.5; font-size: 0.96rem; }
`;

const PrimaryBtn = styled.button`
  display:inline-flex; align-items:center; gap:8px; padding:10px 14px; background: linear-gradient(90deg, ${NEON}, ${ACCENT});
  border: none; color: ${MID_NAVY}; font-weight: 700; border-radius: 10px; cursor: pointer; box-shadow: 0 12px 34px rgba(0,224,179,0.12);
  transition: transform 0.18s ease;
  font-size: 0.95rem;
  &:hover { transform: translateY(-3px) scale(1.03); }
`;

/* ---------------- FAQ & CTA (unchanged) ---------------- */
const FAQSection = styled.section`
  width: 100%;
  max-width: 1000px;
  margin: 50px auto 90px;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 24px;
  @media (max-width: 880px) { grid-template-columns: 1fr; }
`;
const FAQSidebar = styled.div`
  padding: 12px 6px;
  color: ${LIGHT_TEXT};
  h4 { margin: 6px 0 14px 0; color: ${NEON}; }
  .count { font-size: 1.05rem; color: ${LIGHT_TEXT}; margin-bottom: 16px; }
  .empty { color: ${MUTED_TEXT}; padding: 30px 10px; background:${MID_NAVY}; border-radius:8px; text-align:center; }
`;
const FAQMain = styled.div``;
const FAQList = styled.div` display:flex; flex-direction:column; gap:15px; margin-top:10px; `;
const FAQToggle = styled.button`
  display:flex; justify-content:space-between; align-items:center; width:100%;
  padding: 18px 24px; background: ${MID_NAVY}; color: ${LIGHT_TEXT}; border:1px solid rgba(255,255,255,0.08); border-radius:12px;
  text-align:left; font-size: 1.05rem; font-weight: 600; cursor: pointer; transition: 0.3s ease;
  &:hover { background: #111e2b; color: ${NEON}; }
  .icon { margin-left: 15px; transition: transform 0.3s ease; transform: rotate(${props => (props.$isOpen ? '180deg' : '0deg')}); }
`;
const FAQAnswer = styled.div`
  overflow: hidden; max-height: ${props => (props.$isOpen ? '500px' : '0')}; transition: max-height 0.4s ease-in-out;
  padding: ${props => (props.$isOpen ? '15px 24px' : '0 24px')}; background: rgba(11, 23, 36, 0.5);
  border-bottom-left-radius: 12px; border-bottom-right-radius: 12px;
  p { color: ${MUTED_TEXT}; margin: 0; padding-bottom: ${props => (props.$isOpen ? '10px' : '0')}; line-height: 1.6; }
`;
const FinalCta = styled.section`
  width: 100%;
  max-width: 1100px;
  margin: 50px auto 90px;
  padding: 32px;
  border-radius: 16px;
  background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(0,0,0,0.05));
  border: 1px solid ${BORDER_DARK};
  box-shadow: 0 14px 40px rgba(2,6,23,0.45);
  text-align:center;
`;
const CtaTitle = styled.h3` color:${LIGHT_TEXT}; font-size:1.7rem; margin:0 0 10px; `;
const CtaText = styled.p` color:${MUTED_TEXT}; margin:0 0 18px; `;
const Footer = styled.footer` padding: 40px 20px; text-align:center; color: ${MUTED_TEXT}; margin-top: auto; border-top: 1px solid rgba(255,255,255,0.05); `;

/* ---------------- STAR CANVAS HOOK ---------------- */
const useStarCanvas = (canvasRef) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    let width = canvas.width; let height = canvas.height;

    const stars = Array.from({ length: 140 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      baseR: 0.6 + Math.random() * 1.6,
      dx: (Math.random() - 0.5) * 0.35,
      dy: 0.2 + Math.random() * 0.6,
      alpha: 0.4 + Math.random() * 0.6,
      twSpeed: 0.002 + Math.random() * 0.01,
      twPhase: Math.random() * Math.PI * 2,
      glowStrength: 3 + Math.random() * 4,
    }));
    const orbs = Array.from({ length: 5 }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.6,
      radius: 60 + Math.random() * 110,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.06,
      color: i % 2 === 0 ? 'rgba(0,224,179,0.06)' : 'rgba(98,0,255,0.04)'
    }));
    let meteors = [];
    function spawnMeteor() {
      const startX = Math.random() < 0.5 ? -50 : width + 50;
      const startY = Math.random() * height * 0.5;
      const dir = startX < 0 ? 1 : -1;
      meteors.push({ x: startX, y: startY, vx: dir * (4 + Math.random() * 6), vy: 1 + Math.random() * 2, length: 80 + Math.random() * 140, life: 0, maxLife: 60 + Math.floor(Math.random() * 40) });
    }
    let meteorTimer = 0;
    const onResize = () => { resize(); width = canvas.width; height = canvas.height; };
    window.addEventListener('resize', onResize);
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const gBg = ctx.createLinearGradient(0, 0, 0, height);
      gBg.addColorStop(0, '#071025'); gBg.addColorStop(1, '#02040a');
      ctx.fillStyle = gBg; ctx.fillRect(0, 0, width, height);

      orbs.forEach((orb) => {
        orb.x += orb.vx; orb.y += orb.vy;
        if (orb.x < -200) orb.x = width + 200;
        if (orb.x > width + 200) orb.x = -200;
        if (orb.y < -200) orb.y = height + 200;
        if (orb.y > height + 200) orb.y = -200;
        const g = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
        g.addColorStop(0, orb.color); g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2); ctx.fill(); ctx.closePath();
        ctx.globalCompositeOperation = 'source-over';
      });

      stars.forEach((s) => {
        s.twPhase += s.twSpeed;
        const tw = 0.5 + Math.sin(s.twPhase) * 0.5;
        const radius = s.baseR * (0.8 + tw * 1.5);
        const glowR = radius * s.glowStrength;
        s.x += s.dx; s.y += s.dy;
        if (s.y > height + 10) s.y = -10;
        if (s.x > width + 10) s.x = -10;
        if (s.x < -10) s.x = width + 10;
        const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, glowR);
        grad.addColorStop(0, `rgba(255,255,255,${0.9 * s.alpha})`);
        grad.addColorStop(0.15, `rgba(0,224,179,${0.6 * s.alpha})`);
        grad.addColorStop(0.35, `rgba(0,224,179,${0.18 * s.alpha})`);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(s.x, s.y, glowR, 0, Math.PI * 2); ctx.fill(); ctx.closePath();
        ctx.fillStyle = `rgba(255,255,255,${0.95 * s.alpha})`; ctx.beginPath(); ctx.arc(s.x, s.y, radius, 0, Math.PI * 2); ctx.fill(); ctx.closePath();
        ctx.globalCompositeOperation = 'source-over';
      });

      meteorTimer++;
      if (meteorTimer > 420 + Math.random() * 800) { spawnMeteor(); meteorTimer = 0; }
      meteors = meteors.filter(m => m.life < m.maxLife);
      meteors.forEach((m) => {
        ctx.globalCompositeOperation = 'lighter';
        const trailGrad = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * m.length, m.y - m.vy * m.length);
        trailGrad.addColorStop(0, 'rgba(255,255,255,0.95)'); trailGrad.addColorStop(1, 'rgba(0,224,179,0.05)');
        ctx.strokeStyle = trailGrad; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(m.x - m.vx * m.length, m.y - m.vy * m.length); ctx.stroke(); ctx.closePath();
        ctx.fillStyle = 'rgba(255,255,255,1)'; ctx.beginPath(); ctx.arc(m.x, m.y, 2.5, 0, Math.PI * 2); ctx.fill(); ctx.closePath();
        ctx.globalCompositeOperation = 'source-over';
        m.x += m.vx; m.y += m.vy; m.life++;
      });

      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
  }, [canvasRef]);
};

/* ---------------- MAIN COMPONENT ---------------- */
const ServicesPage = ({ onNavigate = () => {}, servicesData }) => {
  const canvasRef = useRef(null);
  useStarCanvas(canvasRef);

  const [activeId, setActiveId] = useState(null);
  const [openFAQId, setOpenFAQId] = useState(null);
  const [faqs, setFaqs] = useState([]);

  const getServiceData = () => {
    if (servicesData && servicesData.length > 0) return servicesData;
    return [
      { _id: '1', title: 'Web Development', desc: 'Creation of responsive, high-performance websites and web applications.' },
      { _id: '2', title: 'AI & Automation', desc: 'Implementing custom AI solutions and automated workflows for business efficiency.' },
      { _id: '3', title: 'Content Strategy', desc: 'Crafting compelling, SEO-optimized content that drives engagement and conversions.' },
      { _id: '4', title: 'UI/UX Design', desc: 'Designing intuitive, attractive user interfaces for optimal customer experiences.' },
      { _id: '5', title: 'Branding Strategy', desc: 'Developing a cohesive brand identity, voice, and visual system.' },
      { _id: '6', title: 'Security Audits', desc: 'Professional security assessments to protect your digital assets.' },
    ];
  };
  const safeServicesData = getServiceData();

  const onEnter = (id) => setActiveId(id);
  const onLeave = () => setActiveId(null);
  const onToggleTouch = (id) => setActiveId(prev => (prev === id ? null : id));
  const toggleFAQ = (id) => setOpenFAQId(prevId => (prevId === id ? null : id));

  const fetchPublicFaqs = async () => {
    const log = (...args) => console.debug('[SERVICES:FAQ]', ...args);
    const tryFetch = async (path) => {
      const url = `${API_BASE}${path}`;
      log('trying', url);
      try {
        const res = await fetch(url, { credentials: 'same-origin' });
        log('status', res.status, 'content-type', res.headers.get('content-type'));
        const ct = (res.headers.get('content-type') || '').toLowerCase();
        const text = await res.text();
        if (!ct.includes('application/json')) {
          log('non-json response for', url, '-> first 400 chars:', text.slice(0, 400));
          return null;
        }
        try { return JSON.parse(text); } catch (parseErr) { log('json parse error for', url, parseErr); return null; }
      } catch (err) { log('fetch error for', url, err); return null; }
    };

    try {
      const r1 = await tryFetch('/api/content/faqs');
      if (Array.isArray(r1)) { setFaqs(r1); return; }
      if (r1 && Array.isArray(r1.data)) { setFaqs(r1.data); return; }

      const r2 = await tryFetch('/api/faqs');
      if (Array.isArray(r2)) { setFaqs(r2); return; }
      if (r2 && Array.isArray(r2.data)) { setFaqs(r2.data); return; }

      const r3 = await tryFetch('/api/content');
      const candidate = r3?.faqs || r3?.data?.faqs;
      if (Array.isArray(candidate)) { setFaqs(candidate); return; }

      setFaqs([]);
      console.info('[SERVICES:FAQ] No FAQs available from any endpoint.');
    } catch (err) {
      console.error('[SERVICES:FAQ] Unexpected error', err);
      setFaqs([]);
    }
  };

  useEffect(() => {
    fetchPublicFaqs();
    const handler = (e) => {
      if (e?.detail?.faqs && Array.isArray(e.detail.faqs)) setFaqs(e.detail.faqs);
      else fetchPublicFaqs();
    };
    window.addEventListener('faqs-updated', handler);
    return () => window.removeEventListener('faqs-updated', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <GlobalStyle />
      <StarCanvas ref={canvasRef} />

      <Header>
        <Logo onClick={() => onNavigate('home')}>NEXORA</Logo>
        <NavGroup>
          <span onClick={() => onNavigate('home')}>Home</span>
          <span onClick={() => onNavigate('about')}>About</span>
          <span onClick={() => onNavigate('services')} className="active">Services</span>
          <span onClick={() => onNavigate('projects')}>Projects</span>
          <span onClick={() => onNavigate('blog')}>Blog</span>
          <span onClick={() => onNavigate('contact')}>Contact</span>

          <span onClick={() => onNavigate('schedule')} style={{ color: NEON }}>
            <FontAwesomeIcon icon={faCalendarCheck} style={{ marginRight: 6 }} />
            Schedule Meeting
          </span>
        </NavGroup>
      </Header>

      <Page>
        <Intro className="animate-in" style={{ animationDelay: '0.05s' }}>
          <IntroTitle>Our <span>Services</span></IntroTitle>
          <IntroSubtitle>Comprehensive creative and technology solutions — student-driven, professionally delivered.</IntroSubtitle>
        </Intro>

        <ServiceGrid>
          {safeServicesData.map((service, i) => {
            const isActive = activeId === service._id;
            return (
              <ServiceCard
                key={service._id}
                className={`animate-in ${isActive ? 'active' : ''}`}
                style={{ animationDelay: `${0.12 * i + 0.25}s` }}
                onMouseEnter={() => onEnter(service._id)}
                onMouseLeave={onLeave}
                onFocus={() => onEnter(service._id)}
                onBlur={onLeave}
                onTouchStart={(e) => { e.stopPropagation(); onToggleTouch(service._id); }}
                tabIndex={0}
                aria-expanded={isActive}
                role="button"
                aria-label={`Service: ${service.title}`}
              >
                <h3 aria-hidden={false}>{service.title}</h3>
                <div className="desc-overlay" aria-hidden={!isActive} onClick={(e) => e.stopPropagation()}>
                  <DescPanel>
                    <strong>{service.title}</strong>
                    <p>{service.desc}</p>
                    <div style={{ marginTop: 12 }}>
                      <PrimaryBtn onClick={() => onNavigate('contact')}>Get Quote</PrimaryBtn>
                    </div>
                  </DescPanel>
                </div>
              </ServiceCard>
            );
          })}
        </ServiceGrid>

        <FAQSection>
          <FAQSidebar>
            {faqs.length === 0 ? (
              <div className="empty">
                No FAQ items yet.
                <div style={{ marginTop: 10, color: MUTED_TEXT, fontSize: '0.9rem' }}>
                  Admin can add FAQs in the Admin panel — they will appear here.
                </div>
              </div>
            ) : (
              <div style={{ color: MUTED_TEXT, fontSize: '0.95rem' }}></div>
            )}
          </FAQSidebar>

          <FAQMain>
            <IntroTitle style={{ fontSize: '1.8rem', marginBottom: '10px' }}>
              Frequently Asked <span>Questions</span>
            </IntroTitle>
            <IntroSubtitle>
              Find quick answers about our services, process, and commitment.
            </IntroSubtitle>

            {faqs.length > 0 && (
              <FAQList>
                {faqs.map((item, idx) => {
                  const id = item.id ?? item._id ?? `faq-${idx}`;
                  const isOpen = openFAQId === id;
                  return (
                    <div key={id} className="animate-in" style={{ animationDelay: `${0.12 * idx + 0.1}s` }}>
                      <FAQToggle $isOpen={isOpen} onClick={() => toggleFAQ(id)} aria-expanded={isOpen} aria-controls={`faq-answer-${id}`}>
                        {item.question}
                        <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} className="icon" />
                      </FAQToggle>
                      <FAQAnswer $isOpen={isOpen} id={`faq-answer-${id}`}>
                        <p>{item.answer}</p>
                      </FAQAnswer>
                    </div>
                  );
                })}
              </FAQList>
            )}
          </FAQMain>
        </FAQSection>

        <FinalCta className="animate-in" style={{ animationDelay: `${0.12 * safeServicesData.length + 1.5}s` }}>
          <CtaTitle>Ready to Bring Your Vision to Life?</CtaTitle>
          <CtaText>Let's discuss your project and build something remarkable together.</CtaText>
          <PrimaryBtn onClick={() => onNavigate('contact')}>Let's Collaborate</PrimaryBtn>
        </FinalCta>

        <Footer>
          &copy; NEXORACREW Team, Palakarai, Tiruchirappalli, Tamil Nadu
        </Footer>
      </Page>
    </>
  );
};

export default ServicesPage;
