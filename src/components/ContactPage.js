// src/components/ContactPage.jsx
import React, { useEffect, useRef, useState } from "react";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faTimes,
  faEnvelope,
  faMapMarkerAlt,
  faPhone,
  faPaperPlane,
  faCalendarCheck,
} from "@fortawesome/free-solid-svg-icons";
import {
  faInstagram,
  faLinkedinIn,
  faWhatsapp,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

/* =========================================
   API CONFIG
   ========================================= */
const DEPLOYED_BASE_URL = process.env.REACT_APP_API_BASE_URL; 

const MESSAGE_API_URL = DEPLOYED_BASE_URL
  ? `${DEPLOYED_BASE_URL}/api/messages`
  : "http://localhost:5000/api/messages";

const SCHEDULE_API_URL = DEPLOYED_BASE_URL
  ? `${DEPLOYED_BASE_URL}/api/schedule`
  : "http://localhost:5000/api/schedule";

/* =========================================
   THEME CONSTANTS
   ========================================= */
const NEON_COLOR = '#123165';
const TEXT_LIGHT = '#111827';
const TEXT_MUTED = '#6B7280';
const BORDER_LIGHT = 'rgba(15,23,42,0.08)';
const GOLD_ACCENT = '#D4A937';
const CARD_BG = 'rgba(255, 255, 255, 0.85)';
const INPUT_BG = '#F9FAFB';

/* =========================================
   KEYFRAMES
   ========================================= */
const rollIn = keyframes`
    from { opacity: 0; transform: translateY(30px) scale(0.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
`;

/* =========================================
   GLOBAL STYLES
   ========================================= */
const GlobalStyle = createGlobalStyle`
    html, body {
        margin: 0;
        padding: 0;
        width: 100%;
        overflow-x: hidden;
        font-family: 'Poppins', sans-serif;
        
        /* PREMIUM GLOW BACKGROUND */
        background: 
            radial-gradient(circle at 0% 0%, #fff9e8 0, #ffffff 35%, transparent 55%),
            linear-gradient(180deg, #ffffff 0%, #f5f7fb 40%, #e5edf7 100%);
            
        color: ${TEXT_LIGHT};
    }
    #root { width: 100%; overflow-x: hidden; }
    *, *::before, *::after { box-sizing: border-box; }
`;

/* =========================================
   STAR CANVAS BACKGROUND
   ========================================= */
const StarCanvas = styled.canvas`
    position: fixed; inset: 0; width: 100vw; height: 100vh; z-index: 0; pointer-events: none;
`;

/* Styled FA icon (for decorative/gold icons) */
const FAIcon = styled(FontAwesomeIcon)`
  color: ${GOLD_ACCENT};
  display: inline-block;
  vertical-align: middle;
`;

/* =========================================
   LAYOUT COMPONENTS (HEADER)
   ========================================= */
const PageWrapper = styled.div`
    position: relative; z-index: 1; min-height: 100vh; background: transparent;
`;

/* HEADER - MATCHING OTHER PAGES */
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

  span.navItem {
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
  span.navItem:hover { color: ${NEON_COLOR}; }
  span.navItem::after {
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
  span.navItem:hover::after { width: 100%; }
  span.navItem.active { color: ${NEON_COLOR}; }

  @media (max-width: 1024px) { display: none; }
`;

/* MOBILE MENU BUTTON - NEON COLOR */
const MobileMenuButton = styled.button`
  display: none;
  @media (max-width: 1024px) {
    display: block;
    background: none;
    border: none;
    color: ${NEON_COLOR}; /* Neon Blue for Hamburger */
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

/* =========================================
   CONTACT SECTION STYLES
   ========================================= */
const ContactSection = styled.section`
    padding: 100px 48px; width: 100%; text-align: left;
    max-width: 1200px; margin: 0 auto;
    @media (max-width: 780px) { padding: 80px 24px; }
`;

const SectionTitle = styled.h2`
    font-size: 3rem; margin-bottom: 10px; color: ${NEON_COLOR}; font-weight: 800;
    span { color: ${GOLD_ACCENT}; }
    @media (max-width: 780px) { font-size: 2.4rem; }
`;

const SectionSubtitle = styled.p`
    color: ${TEXT_MUTED}; font-size: 1.15rem; margin-bottom: 50px; max-width: 600px;
`;

const Grid = styled.div`
    display: grid; grid-template-columns: 1fr 1.5fr; gap: 40px;
    @media (max-width: 980px) { grid-template-columns: 1fr; }
`;

const Card = styled.div`
    background: ${CARD_BG}; backdrop-filter: blur(10px);
    border-radius: 20px; padding: 36px; border: 1px solid ${BORDER_LIGHT};
    box-shadow: 0 10px 30px rgba(0,0,0,0.05); animation: ${rollIn} 0.5s ease forwards;
    display: flex; flex-direction: column; gap: 24px;
`;

const InfoItem = styled.div`
    display: flex; gap: 16px; align-items: flex-start;
    .icon { color: ${GOLD_ACCENT}; font-size: 1.4rem; margin-top: 3px; }
    div { display: flex; flex-direction: column; }
    strong { color: ${NEON_COLOR}; font-size: 1.1rem; margin-bottom: 4px; }
    small { color: ${TEXT_MUTED}; font-size: 1rem; }
`;

/* =========================================
   FORM ELEMENTS
   ========================================= */
const ModeSwitch = styled.div`
    display: flex; background: #F3F4F6; border-radius: 999px; padding: 4px;
    margin-bottom: 24px; border: 1px solid ${BORDER_LIGHT};
`;

const ModeButton = styled.button`
    flex: 1; border: none; border-radius: 999px; padding: 10px;
    font-size: 0.95rem; font-weight: 600; cursor: pointer;
    background: ${({ active }) => active ? `linear-gradient(90deg, ${NEON_COLOR}, ${GOLD_ACCENT})` : "transparent"};
    color: ${({ active }) => (active ? "#fff" : TEXT_MUTED)};
    transition: all 0.2s ease;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    &:hover { color: ${({ active }) => (active ? "#fff" : NEON_COLOR)}; }
`;

const Form = styled.form`
    display: grid; gap: 18px;
`;

const Label = styled.label`
    font-size: 0.95rem; color: ${TEXT_MUTED}; font-weight: 500; margin-bottom: 6px; display: block;
`;

const InputField = styled.input`
    width: 100%; background: ${INPUT_BG}; border: 1px solid ${BORDER_LIGHT};
    color: ${TEXT_LIGHT}; padding: 14px 16px; border-radius: 12px; outline: none;
    font-size: 1rem; transition: all 0.2s;
    &:focus { border-color: ${NEON_COLOR}; background: #fff; box-shadow: 0 0 0 4px rgba(18,49,101,0.05); }
`;

const TextArea = styled.textarea`
    width: 100%; background: ${INPUT_BG}; border: 1px solid ${BORDER_LIGHT};
    color: ${TEXT_LIGHT}; padding: 14px 16px; border-radius: 12px; outline: none;
    font-size: 1rem; min-height: 140px; resize: vertical; font-family: 'Poppins', sans-serif;
    &:focus { border-color: ${NEON_COLOR}; background: #fff; box-shadow: 0 0 0 4px rgba(18,49,101,0.05); }
`;

const SubmitButton = styled.button`
    background: linear-gradient(135deg, ${NEON_COLOR}, ${GOLD_ACCENT});
    color: #fff; border: none; padding: 14px; border-radius: 12px;
    font-weight: 700; font-size: 1.1rem; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    transition: transform 0.2s, box-shadow 0.2s;
    &:hover { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(18,49,101,0.2); }
    &:disabled { opacity: 0.7; cursor: not-allowed; }
`;

const StatusMessage = styled.p`
    text-align: center; font-weight: 600; margin-top: 10px;
    color: ${({ type }) => (type === "error" ? "#EF4444" : "#10B981")};
`;

/* =========================================
   FOOTER - MATCHING OTHER PAGES
   ========================================= */
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

/* GOLDEN SOCIAL ICONS */
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

/* =========================================
   MAIN COMPONENT
   ========================================= */
const ContactPage = ({ onNavigate, generalData }) => {
    const canvasRef = useRef(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mode, setMode] = useState("contact");
    const [sending, setSending] = useState(false);
    const [status, setStatus] = useState({ type: "", text: "" });

    // Contact Form State
    const [contactForm, setContactForm] = useState({ name: "", email: "", mobile: "", message: "" });
    // Schedule Form State
    const [scheduleForm, setScheduleForm] = useState({
        name: "", companyName: "", role: "", mobile: "", email: "", message: "", meetingDate: "", meetingTime: ""
    });

    const safeData = generalData || { 
        email: 'nexora.crew@gmail.com', phone: '+91 95976 46460', location: 'JJ College of Engineering, Trichy' 
    };
    const navItems = ['home', 'about', 'services', 'projects', 'team', 'progress', 'blog', 'contact'];
    const today = new Date().toISOString().split("T")[0];

    // --- GOLD PARTICLE ANIMATION ---
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
            r: 1 + Math.random() * 2.2,
            dx: (Math.random() - 0.5) * 0.25,
            dy: 0.08 + Math.random() * 0.35,
            alpha: 0.15 + Math.random() * 0.35,
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
            for (let s of stars) {
                s.x += s.dx; s.y += s.dy;
                if (s.y > height + 10) s.y = -10;
                if (s.x > width + 10) s.x = -10;
                if (s.x < -10) s.x = width + 10;
                
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(212,169,55,${s.alpha})`;
                ctx.fill();
            }
            raf = requestAnimationFrame(draw);
        };
        draw();
        
        return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onWindowResize); };
    }, []);

    const handleNavigate = (route) => { onNavigate?.(route); setIsMobileMenuOpen(false); };

    // --- HANDLERS ---
    const onContactChange = (e) => setContactForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const onScheduleChange = (e) => setScheduleForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    // --- SUBMIT CONTACT FORM ---
    const submitContact = async (e) => {
        e.preventDefault(); 
        setSending(true); 
        setStatus({ type: "", text: "Sending..." });
        
        try {
            await axios.post(MESSAGE_API_URL, contactForm);
            setStatus({ type: "success", text: "✅ Message sent successfully!" });
            setContactForm({ name: "", email: "", mobile: "", message: "" });
        } catch (err) {
            console.error("Submission Error:", err);
            const errMsg = err.response?.data?.message || "❌ Failed to send message. Please check connection.";
            setStatus({ type: "error", text: errMsg });
        } finally { 
            setSending(false); 
        }
    };

    // --- SUBMIT SCHEDULE FORM ---
    const submitSchedule = async (e) => {
        e.preventDefault(); 
        setSending(true); 
        setStatus({ type: "", text: "Sending..." });
        try {
            await axios.post(SCHEDULE_API_URL, scheduleForm);
            setStatus({ type: "success", text: "✅ Request submitted! We'll confirm shortly." });
            setScheduleForm({ name: "", companyName: "", role: "", mobile: "", email: "", message: "", meetingDate: "", meetingTime: "" });
        } catch (err) {
            console.error("Schedule Error:", err);
            setStatus({ type: "error", text: "❌ Failed to schedule. Please try again." });
        } finally { 
            setSending(false); 
        }
    };

    return (
        <>
            <GlobalStyle />
            <StarCanvas ref={canvasRef} />
            <PageWrapper>
                {/* HEADER */}
                <Header>
                    <Logo onClick={() => handleNavigate('home')}>
                        NEXORA<span className="gold">CREW</span>
                    </Logo>
                    <NavGroup>
                        {navItems.map((item) => (
                            <span
                                key={item}
                                className={`navItem ${item === "contact" ? "active" : ""}`}
                                onClick={() => handleNavigate(item)}
                            >
                                {item.charAt(0).toUpperCase() + item.slice(1)}
                            </span>
                        ))}
                    </NavGroup>
                    
                    {/* Updated MobileMenuButton with NEON color */}
                    <MobileMenuButton onClick={() => setIsMobileMenuOpen(true)}>
                        <FontAwesomeIcon icon={faBars} />
                    </MobileMenuButton>
                </Header>

                {/* MOBILE NAV */}
                <MobileNavMenu isOpen={isMobileMenuOpen}>
                    <button className="close-btn" onClick={() => setIsMobileMenuOpen(false)}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                    {navItems.map((item) => (
                        <span key={item} onClick={() => handleNavigate(item)} style={item === 'contact' ? { color: NEON_COLOR } : {}}>
                            {item.charAt(0).toUpperCase() + item.slice(1)}
                        </span>
                    ))}
                </MobileNavMenu>

                {/* MAIN CONTENT */}
                <ContactSection>
                    <SectionTitle>Let’s <span>Connect</span></SectionTitle>
                    <SectionSubtitle>
                        Reach out for a quote, a collaboration, or just to say hello. We are always ready to build something amazing.
                    </SectionSubtitle>

                    <Grid>
                        {/* LEFT: INFO CARD */}
                        <Card>
                            <h3 style={{ color: NEON_COLOR, margin: 0 }}>Get In Touch</h3>
                            <InfoItem>
                                <FAIcon icon={faEnvelope} className="icon" />
                                <div><strong>Email</strong><small>{safeData.email}</small></div>
                            </InfoItem>
                            <InfoItem>
                                <FAIcon icon={faPhone} className="icon" />
                                <div><strong>Phone</strong><small>{safeData.phone}</small></div>
                            </InfoItem>
                            <InfoItem>
                                <FAIcon icon={faMapMarkerAlt} className="icon" />
                                <div><strong>Location</strong><small>Palakarai, Tiruchirappalli</small></div>
                            </InfoItem>
                        </Card>

                        {/* RIGHT: INTERACTIVE FORM CARD */}
                        <Card>
                            <ModeSwitch>
                                <ModeButton type="button" active={mode === "contact"} onClick={() => { setMode("contact"); setStatus({ type: "", text: "" }); }}>
                                    Contact
                                </ModeButton>
                                <ModeButton type="button" active={mode === "schedule"} onClick={() => { setMode("schedule"); setStatus({ type: "", text: "" }); }}>
                                    <FAIcon icon={faCalendarCheck} /> Schedule Meeting
                                </ModeButton>
                            </ModeSwitch>

                            {mode === "contact" ? (
                                <Form onSubmit={submitContact}>
                                    <div><Label>Your Name</Label><InputField name="name" placeholder="John Doe" value={contactForm.name} onChange={onContactChange} required /></div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                        <div><Label>Email</Label><InputField type="email" name="email" placeholder="you@example.com" value={contactForm.email} onChange={onContactChange} required /></div>
                                        <div>
                                            <Label>Mobile</Label>
                                            <InputField name="mobile" placeholder="+91..." value={contactForm.mobile} onChange={onContactChange} required />
                                        </div>
                                    </div>
                                    <div><Label>Message</Label><TextArea name="message" placeholder="Tell us about your project..." value={contactForm.message} onChange={onContactChange} required /></div>
                                    <SubmitButton type="submit" disabled={sending}>{sending ? "Sending..." : "Send Message"} <FAIcon icon={faPaperPlane} /></SubmitButton>
                                </Form>
                            ) : (
                                <Form onSubmit={submitSchedule}>
                                    <div><Label>Your Name *</Label><InputField name="name" value={scheduleForm.name} onChange={onScheduleChange} required /></div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                        <div><Label>Company Name *</Label><InputField name="companyName" value={scheduleForm.companyName} onChange={onScheduleChange} required /></div>
                                        <div><Label>Role</Label><InputField name="role" value={scheduleForm.role} onChange={onScheduleChange} /></div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                        <div><Label>Email *</Label><InputField type="email" name="email" value={scheduleForm.email} onChange={onScheduleChange} required /></div>
                                        <div><Label>Mobile</Label><InputField name="mobile" value={scheduleForm.mobile} onChange={onScheduleChange} /></div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                        <div><Label>Date *</Label><InputField type="date" name="meetingDate" min={today} value={scheduleForm.meetingDate} onChange={onScheduleChange} required /></div>
                                        <div><Label>Time *</Label><InputField type="time" name="meetingTime" value={scheduleForm.meetingTime} onChange={onScheduleChange} required /></div>
                                    </div>
                                    <div><Label>Topic</Label><TextArea name="message" placeholder="What would you like to discuss?" value={scheduleForm.message} onChange={onScheduleChange} style={{ minHeight: '80px' }} /></div>
                                    <SubmitButton type="submit" disabled={sending}>{sending ? "Booking..." : "Submit Request"} <FAIcon icon={faCalendarCheck} /></SubmitButton>
                                </Form>
                            )}
                            {status.text && <StatusMessage type={status.type}>{status.text}</StatusMessage>}
                        </Card>
                    </Grid>
                </ContactSection>

                {/* FOOTER */}
                <FullFooter>
                    <FooterGrid>
                        <FooterColumn style={{ minWidth: '300px' }}>
                            <FooterLogo onClick={() => handleNavigate('home')}>
                                NEXORA<span className="gold">CREW</span>
                            </FooterLogo>
                            <p>
                                Transforming ideas into powerful digital products using modern
                                technology, creativity, and AI. Where ideas meet innovation.
                            </p>
                            <SocialIcons>
                                <a href="https://www.instagram.com/nexoracrew?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noreferrer">
                                    <FontAwesomeIcon icon={faInstagram} />
                                </a>
                                <a href="https://www.linkedin.com/in/nexoracrew-%E2%80%8C-01842a396/" target="_blank" rel="noreferrer">
                                    <FontAwesomeIcon icon={faLinkedinIn} />
                                </a>
                                <a href={`mailto:${safeData.email}`}>
                                    <FontAwesomeIcon icon={faEnvelope} />
                                </a>
                                <a href="https://wa.me/9597646460" target="_blank" rel="noopener noreferrer">
                                    <FontAwesomeIcon icon={faWhatsapp} />
                                </a>
                                <a href="https://www.youtube.com/@Nexora-crew" target="_blank" rel="noopener noreferrer">
                                    <FontAwesomeIcon icon={faYoutube} />
                                </a>
                            </SocialIcons>
                        </FooterColumn>

                        <FooterColumn>
                            <h4>Quick Links</h4>
                            <ul>
                                {navItems.map((item, i) => (
                                    <li key={i}>
                                        <a onClick={() => handleNavigate(item)}>{item.charAt(0).toUpperCase() + item.slice(1)}</a>
                                    </li>
                                ))}
                            </ul>
                        </FooterColumn>

                        <FooterColumn>
                            <h4>Services</h4>
                            <ul>
                                {['Web Development', 'Poster designing & logo making' , 'Content creation' , 'Digital marketing &SEO' , 'AI and automation' , 'Hosting & Support' , 'Printing &Branding solutions' , 'Enterprise networking &server architecture' , 'Bold branding&Immersive visual design' , 'Next gen web & mobile experience'].map((l, i) => (
                                    <li key={i}>
                                        <a onClick={() => handleNavigate('services')}>{l}</a>
                                    </li>
                                ))}
                            </ul>
                        </FooterColumn>

                        <FooterColumn>
                            <h4>Contact Info</h4>
                            <ul>
                                <li>
                                    <a href="#map">
                                        <FAIcon icon={faMapMarkerAlt} style={{ color: GOLD_ACCENT }} /> {safeData.location}
                                    </a>
                                </li>
                                <li>
                                    <a href={`mailto:${safeData.email}`}>
                                        <FAIcon icon={faEnvelope} style={{ color: GOLD_ACCENT }} /> {safeData.email}
                                    </a>
                                </li>
                                <li>
                                    <a href={`tel:${safeData.phone}`}>
                                        <FAIcon icon={faPhone} style={{ color: GOLD_ACCENT }} /> {safeData.phone}
                                    </a>
                                </li>
                            </ul>
                        </FooterColumn>
                    </FooterGrid>

                    <Copyright>
                        © 2025 Nexoracrew. All Rights Reserved.
                    </Copyright>
                </FullFooter>
            </PageWrapper>
        </>
    );
};

export default ContactPage;