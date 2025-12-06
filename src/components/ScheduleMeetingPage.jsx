// src/components/ScheduleMeetingPage.jsx

import React, { useEffect, useRef, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarCheck,
  faCheckCircle,
  faExclamationTriangle,
  faSpinner,
  faBars,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';

// --- CONFIG ---
const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
const SCHEDULE_API_URL = `${API_BASE}/api/schedule`;

// --- THEME / TOKENS ---
const NEON = '#00e0b3';
const NAVY_BG = '#071025';
const PANEL_BG = '#0d1114';
const LIGHT_TEXT = '#E6F7F0';
const MUTED = '#9AA8B8';
const BORDER = 'rgba(255,255,255,0.04)';
const ACCENT = '#1ddc9f';

// --- GLOBAL STYLE ---
const GlobalStyle = createGlobalStyle`
  html, body, #root { height: 100%; }
  body {
    margin: 0;
    font-family: 'Poppins', sans-serif;
    background: radial-gradient(circle at 20% 10%, #0a132f 0%, #050817 40%, #01030a 100%);
    color: ${LIGHT_TEXT};
    -webkit-font-smoothing:antialiased;
    -moz-osx-font-smoothing:grayscale;
  }

  .neon-text-shadow { text-shadow: 0 0 12px ${NEON}, 0 0 22px rgba(0,224,179,0.12); }
`;

/* ---------------- HEADER / NAV ---------------- */
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
  border-bottom: 1px solid ${BORDER};
  z-index: 60;

  @media (max-width: 880px) {
    padding: 12px 18px;
    gap: 12px;
  }
`;

const Logo = styled.h1`
  color: ${NEON};
  font-size: 1.8rem;
  font-weight: 800;
  margin: 0;
  cursor: pointer;
  letter-spacing: 1px;
  text-shadow: 0 0 12px ${NEON};
`;

const NavGroup = styled.div`
  display: flex;
  gap: 22px;
  align-items: center;
  margin-right: auto;

  span {
    color: ${MUTED};
    cursor: pointer;
    font-weight: 500;
    position: relative;
    transition: 0.3s ease;
    padding: 6px 4px;
    display: inline-flex;
    align-items: center;
    gap: 8px;

    &:hover {
      color: ${NEON};
      text-shadow: 0 0 10px ${NEON};
    }

    /* default underline animation for normal items */
    &::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: -2px;
      width: 0;
      height: 2px;
      background: ${NEON};
      transition: width 0.3s;
      border-radius: 4px;
    }

    &:hover::after {
      width: 100%;
    }
  }

  .active {
    color: ${NEON};
    text-shadow: 0 0 10px ${NEON};
  }

  /* ✅ Special case: Schedule Meeting uses ::before, and we turn off ::after
     so it can NEVER get two lines */
  span.schedule-link::after {
    content: none;          /* disable default underline */
  }

  span.schedule-link::before {
    content: '';
    position: absolute;
    left: 0;
    bottom: -2px;
    width: 0;
    height: 2px;
    background: ${NEON};
    border-radius: 4px;
    transition: width 0.3s;
  }

  span.schedule-link:hover::before {
    width: 100%;
  }

  @media (max-width: 880px) {
    .hide-mobile {
      display: none;
    }
  }
`;

const MobileToggle = styled.button`
  display: none;
  border: 0;
  background: transparent;
  color: ${NEON};
  font-size: 1.25rem;
  cursor: pointer;

  @media (max-width: 880px) {
    display: inline-flex;
  }
`;

/* mobile slide-down nav */
const MobileNav = styled.div`
  display: none;
  @media (max-width: 880px) {
    display: ${({ open }) => (open ? 'block' : 'none')};
    position: absolute;
    top: 64px;
    left: 12px;
    right: 12px;
    z-index: 70;
    background: rgba(7,16,38,0.92);
    border-radius: 10px;
    padding: 12px;
    border: 1px solid ${BORDER};
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
  display: block;
`;

/* ---------------- FORM STYLES ---------------- */
const PageWrap = styled.div`
  min-height: 100vh;
  position: relative;
  z-index: 10;
  padding: 28px;
`;

const FormContainer = styled.div`
  max-width: 820px;
  margin: 48px auto 80px;
  padding: 28px;
  background: ${PANEL_BG};
  border: 1px solid rgba(255,255,255,0.04);
  border-radius: 12px;
  box-shadow: 0 12px 40px rgba(0,0,0,0.6);
`;

const FormGroup = styled.div`
  margin-bottom: 18px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
  color: ${MUTED};
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  background: #071022;
  border: 1px solid rgba(255,255,255,0.06);
  color: ${LIGHT_TEXT};
  border-radius: 8px;
  box-sizing: border-box;

  &:focus {
    border-color: ${NEON};
    outline: none;
    box-shadow: 0 0 12px rgba(0,224,179,0.08);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 110px;
  padding: 12px;
  background: #071022;
  border: 1px solid rgba(255,255,255,0.06);
  color: ${LIGHT_TEXT};
  border-radius: 8px;
  box-sizing: border-box;
  resize: vertical;

  &:focus {
    border-color: ${NEON};
    outline: none;
    box-shadow: 0 0 12px rgba(0,224,179,0.08);
  }
`;

const InputRow = styled.div`
  display: flex;
  gap: 12px;
  & > * {
    flex: 1;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  background: linear-gradient(90deg, ${NEON}, ${ACCENT});
  color: #062028;
  border: none;
  padding: 14px 16px;
  border-radius: 8px;
  font-weight: 800;
  font-size: 1rem;
  cursor: pointer;
  transition: transform .12s ease, box-shadow .12s ease;

  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 12px 28px rgba(0,224,179,0.12);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const StatusMessage = styled.div`
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  margin-top: 18px;
  font-weight: 700;
  color: ${props => (props.$type === 'success' ? '#082224' : '#fff')};
  background-color: ${props => (props.$type === 'success' ? '#00e0b3' : '#ff5c66')};
`;

/* ---------------- COMPONENT ---------------- */
const ScheduleMeetingPage = ({ onNavigate = () => {} }) => {
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    role: '',
    mobile: '',
    email: '',
    message: '',
    meetingDate: '',
    meetingTime: '',
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: null, message: '' });
  const [mobileOpen, setMobileOpen] = useState(false);

  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let DPR = Math.max(window.devicePixelRatio || 1, 1);
    function resize() {
      const w = Math.floor(window.innerWidth * DPR);
      const h = Math.floor(window.innerHeight * DPR);
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    resize();

    const width = () => canvas.clientWidth;
    const height = () => canvas.clientHeight;

    const stars = Array.from({ length: 140 }, () => ({
      x: Math.random() * width(),
      y: Math.random() * height(),
      baseR: 0.5 + Math.random() * 1.4,
      dx: (Math.random() - 0.5) * 0.35,
      dy: 0.15 + Math.random() * 0.6,
      alpha: 0.35 + Math.random() * 0.6,
      twSpeed: 0.002 + Math.random() * 0.01,
      twPhase: Math.random() * Math.PI * 2,
      glow: 3 + Math.random() * 4,
    }));

    const orbs = Array.from({ length: 5 }, (_, i) => ({
      x: Math.random() * width(),
      y: Math.random() * height() * 0.6,
      radius: 60 + Math.random() * 110,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.06,
      color: i % 2 === 0 ? 'rgba(0,224,179,0.06)' : 'rgba(98,0,255,0.04)',
    }));

    let meteors = [];
    function spawnMeteor() {
      const w = width(), h = height();
      const startX = Math.random() < 0.5 ? -50 : w + 50;
      const startY = Math.random() * h * 0.5;
      const dir = startX < 0 ? 1 : -1;
      meteors.push({
        x: startX, y: startY,
        vx: dir * (4 + Math.random() * 6),
        vy: 1 + Math.random() * 2,
        length: 80 + Math.random() * 140,
        life: 0, maxLife: 60 + Math.floor(Math.random() * 40),
      });
    }

    let meteorTimer = 0;
    const meteorBase = 420;

    function onResize() {
      DPR = Math.max(window.devicePixelRatio || 1, 1);
      resize();
    }
    window.addEventListener('resize', onResize);

    function draw() {
      const w = width();
      const h = height();

      ctx.clearRect(0, 0, w, h);

      const gBg = ctx.createLinearGradient(0, 0, 0, h);
      gBg.addColorStop(0, '#071025');
      gBg.addColorStop(1, '#02040a');
      ctx.fillStyle = gBg;
      ctx.fillRect(0, 0, w, h);

      orbs.forEach((orb) => {
        orb.x += orb.vx; orb.y += orb.vy;
        if (orb.x < -200) orb.x = w + 200;
        if (orb.x > w + 200) orb.x = -200;
        if (orb.y < -200) orb.y = h + 200;
        if (orb.y > h + 200) orb.y = -200;

        const g = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
        g.addColorStop(0, orb.color); g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2); ctx.fill(); ctx.closePath();
        ctx.globalCompositeOperation = 'source-over';
      });

      stars.forEach((s) => {
        s.twPhase += s.twSpeed;
        const tw = 0.5 + Math.sin(s.twPhase) * 0.5;
        const radius = s.baseR * (0.8 + tw * 1.5);
        const glowR = radius * s.glow;

        s.x += s.dx; s.y += s.dy;
        const w = width(), h = height();
        if (s.y > h + 10) s.y = -10;
        if (s.x > w + 10) s.x = -10;
        if (s.x < -10) s.x = w + 10;

        const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, glowR);
        grad.addColorStop(0, `rgba(255,255,255,${0.9 * s.alpha})`);
        grad.addColorStop(0.15, `rgba(0,224,179,${0.6 * s.alpha})`);
        grad.addColorStop(0.35, `rgba(0,224,179,${0.18 * s.alpha})`);
        grad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(s.x, s.y, glowR, 0, Math.PI * 2); ctx.fill(); ctx.closePath();

        ctx.fillStyle = `rgba(255,255,255,${0.95 * s.alpha})`;
        ctx.beginPath(); ctx.arc(s.x, s.y, radius, 0, Math.PI * 2); ctx.fill(); ctx.closePath();

        ctx.globalCompositeOperation = 'source-over';
      });

      meteorTimer += 1;
      if (meteorTimer > meteorBase + Math.random() * 800) {
        spawnMeteor();
        meteorTimer = 0;
      }

      meteors = meteors.filter(m => m.life < m.maxLife);
      meteors.forEach((m) => {
        ctx.globalCompositeOperation = 'lighter';
        const trailGrad = ctx.createLinearGradient(
          m.x, m.y, m.x - m.vx * m.length, m.y - m.vy * m.length
        );
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
        ctx.beginPath(); ctx.arc(m.x, m.y, 2.5, 0, Math.PI * 2); ctx.fill(); ctx.closePath();
        ctx.globalCompositeOperation = 'source-over';

        m.x += m.vx; m.y += m.vy; m.life++;
      });

      rafRef.current = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: '' });

    try {
      await axios.post(SCHEDULE_API_URL, formData);
      setStatus({
        type: 'success',
        message:
          'Success! Your meeting request has been submitted. We will contact you soon.',
      });
      setFormData({
        name: '',
        companyName: '',
        role: '',
        mobile: '',
        email: '',
        message: '',
        meetingDate: '',
        meetingTime: '',
      });
    } catch (error) {
      const msg =
        error?.response?.data?.msg || 'An error occurred. Please try again.';
      setStatus({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = !!(
    formData.name &&
    formData.companyName &&
    formData.email &&
    formData.meetingDate &&
    formData.meetingTime
  );
  const today = new Date().toISOString().split('T')[0];

  const navigateAndCloseMobile = (route) => {
    onNavigate(route);
    setMobileOpen(false);
  };

  return (
    <>
      <GlobalStyle />
      <StarCanvas ref={canvasRef} aria-hidden="true" />

      <Header>
        <Logo onClick={() => onNavigate('home')} className="neon-text-shadow">
          NEXORA
        </Logo>

        <NavGroup>
          <span onClick={() => onNavigate('home')}>Home</span>
          <span onClick={() => onNavigate('about')}>About</span>
          <span onClick={() => onNavigate('services')}>Services</span>
          <span onClick={() => onNavigate('projects')}>Projects</span>
          <span onClick={() => onNavigate('blog')}>Blog</span>
          <span onClick={() => onNavigate('contact')}>Contact</span>
          {/* ✅ schedule-link class so it uses single-line ::before underline */}
          <span
            className="schedule-link active"
            onClick={() => onNavigate('schedule')}
          >
            <FontAwesomeIcon icon={faCalendarCheck} />
            Schedule Meeting
          </span>
        </NavGroup>

        <MobileToggle
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((s) => !s)}
        >
          <FontAwesomeIcon icon={mobileOpen ? faTimes : faBars} />
        </MobileToggle>
      </Header>

      <MobileNav open={mobileOpen}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button
            style={mobileNavBtn()}
            onClick={() => navigateAndCloseMobile('home')}
          >
            Home
          </button>
          <button
            style={mobileNavBtn()}
            onClick={() => navigateAndCloseMobile('about')}
          >
            About
          </button>
          <button
            style={mobileNavBtn()}
            onClick={() => navigateAndCloseMobile('services')}
          >
            Services
          </button>
          <button
            style={mobileNavBtn()}
            onClick={() => navigateAndCloseMobile('projects')}
          >
            Projects
          </button>
          <button
            style={mobileNavBtn()}
            onClick={() => navigateAndCloseMobile('blog')}
          >
            Blog
          </button>
          <button
            style={mobileNavBtn()}
            onClick={() => navigateAndCloseMobile('contact')}
          >
            Contact
          </button>
          <button
            style={mobileNavBtn(true)}
            onClick={() => navigateAndCloseMobile('schedule')}
          >
            <FontAwesomeIcon icon={faCalendarCheck} />
            <span>Schedule Meeting</span>
          </button>
        </div>
      </MobileNav>

      <PageWrap>
        <FormContainer>
          <h2
            style={{
              color: NEON,
              textAlign: 'center',
              marginBottom: 18,
            }}
          >
            <FontAwesomeIcon icon={faCalendarCheck} style={{ marginRight: 10 }} />
            Schedule a Meeting
          </h2>

          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="name">Your Name *</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="companyName">Name of the Company *</Label>
              <Input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="role">Your Role in the Company</Label>
              <Input
                type="text"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="mobile">Mobile No.</Label>
              <Input
                type="tel"
                id="mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="email">Email ID *</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="message">
                What you want to talk about (Message)
              </Label>
              <TextArea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
              />
            </FormGroup>

            <InputRow>
              <FormGroup>
                <Label htmlFor="meetingDate">Date Choosing *</Label>
                <Input
                  type="date"
                  id="meetingDate"
                  name="meetingDate"
                  value={formData.meetingDate}
                  onChange={handleChange}
                  min={today}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="meetingTime">Time Deciding *</Label>
                <Input
                  type="time"
                  id="meetingTime"
                  name="meetingTime"
                  value={formData.meetingTime}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
            </InputRow>

            <SubmitButton type="submit" disabled={!isFormValid || loading}>
              {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Submit Request'}
            </SubmitButton>
          </form>

          {status.type === 'success' && (
            <StatusMessage $type="success">
              <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: 8 }} />
              {status.message}
            </StatusMessage>
          )}

          {status.type === 'error' && (
            <StatusMessage $type="error">
              <FontAwesomeIcon icon={faExclamationTriangle} style={{ marginRight: 8 }} />
              {status.message}
            </StatusMessage>
          )}
        </FormContainer>
      </PageWrap>
    </>
  );
};

export default ScheduleMeetingPage;

/* ---------------- Helpers for mobile nav buttons ---------------- */
function mobileNavBtn(active = false) {
  return {
    background: active ? `linear-gradient(90deg, ${NEON}, ${ACCENT})` : 'transparent',
    color: active ? '#062028' : MUTED,
    fontWeight: 800,
    padding: '10px 12px',
    borderRadius: 8,
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
  };
}
