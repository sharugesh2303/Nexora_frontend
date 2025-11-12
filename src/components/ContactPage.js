import React, { useState, useEffect, useRef } from 'react';
import styled, { createGlobalStyle, keyframes, css } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faMapMarkerAlt, faPaperPlane, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

// =========================================================
// API CONFIGURATION FIX (SOLUTION APPLIED HERE)
// The endpoint is changed from /messages to /api/messages
// to match the backend router configuration in server.js.
// =========================================================
const DEPLOYED_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const API_URL = DEPLOYED_BASE_URL
  ? `${DEPLOYED_BASE_URL}/api/messages` // <--- FIX APPLIED
  : 'http://localhost:5000/api/messages'; // <--- FIX APPLIED


// --- THEME COLORS ---
const NEON = '#00ffc6';
const NAVY_BG = '#040b1a';
const LIGHT = '#e8f1ff';
const MUTED = '#9aa8b8';
const CARD_BG = 'rgba(10, 20, 40, 0.8)';
const BORDER = 'rgba(255, 255, 255, 0.08)';
const ACCENT = '#12f3d4';

// --- KEYFRAMES ---
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;
const glowPulse = keyframes`
  0%, 100% { text-shadow: 0 0 8px ${NEON}, 0 0 18px rgba(0,255,198,0.25); }
  50% { text-shadow: 0 0 18px ${NEON}, 0 0 32px rgba(0,255,198,0.35); }
`;

// --- GLOBAL STYLE (Ensuring root elements are transparent for fixed background) ---
const GlobalStyle = createGlobalStyle`
  * { box-sizing: border-box; }
  body, html, #root {
    margin: 0;
    font-family: 'Poppins', sans-serif;
    background: transparent !important; 
    color: ${LIGHT};
    overflow-x: hidden;
    scroll-behavior: smooth;
    height: 100%;
  }
`;

// --- STAR BACKGROUND (Fixed position) ---
const StarCanvas = styled.canvas`
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
`;

// --- PAGE WRAPPER (Scrolling content container with semi-transparent background) ---
const PageWrapper = styled.div`
  position: relative;
  z-index: 2;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: rgba(4, 11, 26, 0.92); /* Semi-transparent overlay to reveal stars behind */
`;

// --- HEADER (Fixed and Translucent) ---
const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 40px;
  background: rgba(4, 11, 26, 0.7);
  backdrop-filter: blur(6px);
  border-bottom: 1px solid rgba(255,255,255,0.05);
  position: fixed;
  width: 100%;
  z-index: 6;

  @media (max-width: 768px) {
    padding: 16px 22px;
  }
`;

const Logo = styled.h1`
  color: ${NEON};
  font-weight: 800;
  font-size: 1.3rem;
  cursor: pointer;
  animation: ${glowPulse} 3s infinite ease-in-out;
`;

// --- NAVIGATION ---
const NavLinks = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    position: fixed;
    inset: 0;
    background: rgba(4, 11, 26, 0.96);
    flex-direction: column;
    justify-content: center;
    transform: ${({ open }) => (open ? 'translateX(0)' : 'translateX(100%)')};
    transition: transform 0.4s ease;
    z-index: 5;
  }
`;

const NavItem = styled.span`
  color: ${MUTED};
  font-weight: 600;
  margin-left: 22px;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover { color: ${NEON}; transform: scale(1.05); }
  &.active { color: ${NEON}; text-shadow: 0 0 8px ${NEON}; }

  @media (max-width: 768px) {
    margin: 20px 0;
    font-size: 1.5rem;
  }
`;

const MobileMenuIcon = styled.div`
  display: none;
  font-size: 1.6rem;
  color: ${NEON};
  cursor: pointer;
  @media (max-width: 768px) { display: block; }
`;

// --- MAIN SECTION ---
const Section = styled.section`
  padding: 140px 24px 60px;
  max-width: 1100px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 2.8rem;
  margin-bottom: 12px;
  text-align: center;
  span { color: ${NEON}; }
  animation: ${fadeUp} 1s ease forwards;
`;

const Subtitle = styled.p`
  text-align: center;
  color: ${MUTED};
  margin-bottom: 36px;
  animation: ${fadeUp} 1s ease forwards;
  animation-delay: 0.15s;
`;

// --- GRID ---
const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  gap: 36px;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

// --- INFO CARD ---
const InfoCard = styled.div`
  background: ${CARD_BG};
  border: 1px solid ${BORDER};
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0,255,198,0.05);
  transition: all 0.3s ease;
  &:hover { border-color: ${NEON}; box-shadow: 0 16px 40px rgba(0,255,198,0.15); }
`;

const InfoTitle = styled.h3`
  color: ${NEON};
  margin-bottom: 10px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin: 14px 0;
  color: ${LIGHT};
  .icon {
    color: ${NEON};
    font-size: 1.2rem;
    min-width: 30px;
  }
  div span {
    font-weight: 700;
  }
  div small {
    display: block;
    color: ${MUTED};
    font-size: 0.95rem;
  }
`;

// --- FORM CARD ---
const FormCard = styled.div`
  background: ${CARD_BG};
  border: 1px solid ${BORDER};
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 10px 30px rgba(0,255,198,0.05);
  transition: all 0.3s ease;
  &:hover { border-color: ${NEON}; box-shadow: 0 16px 40px rgba(0,255,198,0.15); }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Input = styled.input`
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  color: ${LIGHT};
  padding: 12px 14px;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  &::placeholder { color: rgba(255,255,255,0.3); }
  &:focus { border-color: ${NEON}; box-shadow: 0 0 12px rgba(0,255,198,0.2); }
`;

const TextArea = styled.textarea`
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  color: ${LIGHT};
  padding: 12px 14px;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  resize: vertical;
  min-height: 140px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  &::placeholder { color: rgba(255,255,255,0.3); }
  &:focus { border-color: ${NEON}; box-shadow: 0 0 12px rgba(0,255,198,0.2); }
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(90deg, ${NEON}, ${ACCENT});
  color: #000;
  border: none;
  border-radius: 8px;
  padding: 12px 18px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s ease;
  &:hover { transform: translateY(-3px); box-shadow: 0 12px 28px rgba(0,255,198,0.3); }
`;

const StatusMessage = styled.p`
  margin-top: 8px;
  font-weight: 600;
  color: ${({ type }) => (type === 'error' ? '#ff6b6b' : NEON)};
`;

// --- FOOTER ---
const Footer = styled.footer`
  text-align: center;
  padding: 24px;
  color: ${MUTED};
  font-size: 0.95rem;
  margin-top: auto;
  border-top: 1px solid rgba(255,255,255,0.05);
`;

// =========================================================
// MAIN COMPONENT
// =========================================================
const ContactPage = ({ onNavigate, generalData }) => {
  const canvasRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', mobile: '', message: '' });
  const [formMessage, setFormMessage] = useState({ type: '', text: '' });

  // --- STAR BACKGROUND EFFECT ---
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    
    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: 0.3 + Math.random() * 0.4,
      alpha: 0.3 + Math.random() * 0.7
    }));

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = NAVY_BG;
      ctx.fillRect(0, 0, w, h);
      stars.forEach(s => {
        s.x += s.dx;
        s.y += s.dy;
        if (s.y > h) s.y = 0;
        if (s.x > w) s.x = 0;
        if (s.x < 0) s.x = w;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,255,198,${s.alpha})`;
        ctx.fill();
      });
      requestAnimationFrame(draw);
    };
    draw();
    
    const handleResize = () => {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- FORM HANDLERS ---
  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleSubmit = async e => {
    e.preventDefault();
    setFormMessage({ type: '', text: 'Sending...' });
    
    try {
      // API_URL now points correctly to /api/messages
      await axios.post(API_URL, formData);
      
      setFormMessage({ type: 'success', text: '✅ Message sent successfully!' });
      setFormData({ name: '', email: '', mobile: '', message: '' });
      
    } catch (err) {
      // 💡 Enhanced error handling to display more helpful messages
      let errorMessage = '❌ Failed to send. Please check network connection.';

      if (err.response) {
          if (err.response.status === 400 && err.response.data.errors) {
              // Express-validator error from backend
              errorMessage = `❌ Validation Error: ${err.response.data.errors[0].msg}`;
          } else if (err.response.status === 500) {
              errorMessage = '❌ Server Error (500). Database save failed.';
          } else if (err.response.status === 404 || err.response.status === 405) {
              errorMessage = '❌ Routing Error. Backend endpoint not found/allowed. (Check for /api prefix)';
          }
      }
      console.error('Form Submission Error:', err);
      setFormMessage({ type: 'error', text: errorMessage });
    }
  };

  const safeGeneralData = generalData || {};

  return (
    <>
      <GlobalStyle />
      <StarCanvas ref={canvasRef} />
      <PageWrapper>
        <Header>
          <Logo onClick={() => onNavigate('home')}>NEXORA</Logo>
          <NavLinks open={isMenuOpen}>
            <NavItem onClick={() => onNavigate('home')}>Home</NavItem>
            <NavItem onClick={() => onNavigate('about')}>About</NavItem>
            <NavItem onClick={() => onNavigate('services')}>Services</NavItem>
            <NavItem onClick={() => onNavigate('projects')}>Projects</NavItem>
            <NavItem onClick={() => onNavigate('blog')}>Blog</NavItem>
            <NavItem className="active" onClick={() => onNavigate('contact')}>Contact</NavItem>
          </NavLinks>
          <MobileMenuIcon onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
          </MobileMenuIcon>
        </Header>

        <Section>
          <Title>Let's <span>Connect</span></Title>
          <Subtitle>Have a project or idea? Reach out to collaborate!</Subtitle>

          <Grid>
            {/* LEFT INFO */}
            <InfoCard>
              <InfoTitle>Get In Touch</InfoTitle>
              <InfoItem>
                <FontAwesomeIcon icon={faEnvelope} className="icon" />
                <div>
                  <span>Email</span>
                  <small>{safeGeneralData.email || 'nexora.crew@gmail.com'}</small>
                </div>
              </InfoItem>
              <InfoItem>
                <FontAwesomeIcon icon={faPhone} className="icon" />
                <div>
                  <span>Phone</span>
                  <small>{safeGeneralData.phone || '+91 95976 46460'}</small>
                </div>
              </InfoItem>
              <InfoItem>
                <FontAwesomeIcon icon={faMapMarkerAlt} className="icon" />
                <div>
                  <span>Location</span>
                  <small>Tiruchirappalli, Tamil Nadu</small>
                </div>
              </InfoItem>
            </InfoCard>

            {/* RIGHT FORM */}
            <FormCard>
              <Form onSubmit={handleSubmit}>
                <Input name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
                <Input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required />
                <Input name="mobile" placeholder="Mobile Number" value={formData.mobile} onChange={handleChange} required />
                <TextArea name="message" placeholder="Your Message..." value={formData.message} onChange={handleChange} required />
                <Button type="submit">
                  <FontAwesomeIcon icon={faPaperPlane} /> Send Message
                </Button>
                {formMessage.text && (
                  <StatusMessage type={formMessage.type}>{formMessage.text}</StatusMessage>
                )}
              </Form>
            </FormCard>
          </Grid>
        </Section>

        <Footer>
          © 2025 NEXORA Crew — Crafted with passion ✨
        </Footer>
      </PageWrapper>
    </>
  );
};

export default ContactPage;