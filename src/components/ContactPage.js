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
const DEPLOYED_BASE_URL = process.env.REACT_APP_API_BASE_URL; // e.g., https://your-backend.onrender.com

// Ensure these match your backend routes
const MESSAGE_API_URL = DEPLOYED_BASE_URL
  ? `${DEPLOYED_BASE_URL}/api/messages`
  : "http://localhost:5000/api/messages";

const SCHEDULE_API_URL = DEPLOYED_BASE_URL
  ? `${DEPLOYED_BASE_URL}/api/schedule`
  : "http://localhost:5000/api/schedule";

/* =========================================
   THEME CONSTANTS (MATCHING HOME PAGE)
   ========================================= */
const NEON_COLOR = '#123165';          // Primary Navy
const TEXT_LIGHT = '#111827';          // Dark text
const TEXT_MUTED = '#6B7280';
const BORDER_LIGHT = '#e2e8f0';        
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
   STAR CANVAS BACKGROUND (GOLD PARTICLES)
   ========================================= */
const StarCanvas = styled.canvas`
    position: fixed; inset: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none;
`;

/* =========================================
   LAYOUT COMPONENTS (HEADER)
   ========================================= */
const PageWrapper = styled.div`
    position: relative; z-index: 1; min-height: 100vh; background: transparent;
`;

const Header = styled.header`
    display: flex; align-items: center; gap: 40px; padding: 14px 48px;
    position: sticky; top: 0; width: 100%; background: #FFFFFF;
    border-bottom: 1px solid ${BORDER_LIGHT}; z-index: 1000;

    @media (max-width: 768px) { padding: 14px 20px; gap: 20px; justify-content: space-between; }
`;

const Logo = styled.h1`
    color: ${NEON_COLOR}; font-size: 1.8rem; font-weight: 800; cursor: pointer;
    letter-spacing: 1px; text-shadow: 0 0 8px rgba(18,49,101,0.1); margin: 0; white-space: nowrap;
    @media (max-width: 480px) { font-size: 1.5rem; }
`;

const NavGroup = styled.div`
    display: flex; gap: 22px; align-items: center; margin-right: auto;
    @media (max-width: 1024px) { display: none; }

    span {
        color: ${TEXT_MUTED}; cursor: pointer; font-weight: 500; position: relative;
        transition: 0.3s ease; padding: 6px 4px; font-size: 1rem;
        &:hover { color: ${NEON_COLOR}; }
        &:after {
            content: ''; position: absolute; left: 0; bottom: -2px; width: 0; height: 2px;
            background: ${GOLD_ACCENT}; transition: 0.3s; border-radius: 4px;
        }
        &:hover:after { width: 100%; }
    }
`;

const MobileMenuButton = styled.button`
    display: none; background: none; border: none; color: ${NEON_COLOR}; font-size: 1.5rem; cursor: pointer;
    @media (max-width: 1024px) { display: block; }
`;

const MobileNavMenu = styled.div`
    position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #FFFFFF;
    z-index: 1100; display: flex; flex-direction: column; align-items: center; padding-top: 80px;
    transform: translateX(${props => (props.isOpen ? '0' : '100%')});
    transition: transform 0.3s ease-in-out; box-shadow: -4px 0 20px rgba(15,23,42,0.15);

    .close-btn { position: absolute; top: 20px; right: 20px; background: none; border: none; color: ${TEXT_LIGHT}; font-size: 2rem; cursor: pointer; }
    span { font-size: 1.3rem; margin: 15px 0; cursor: pointer; color: ${TEXT_MUTED}; &:hover { color: ${NEON_COLOR}; } }
`;

/* =========================================
   CONTACT SECTION STYLES
   ========================================= */
const ContactSection = styled.section`
    padding: 100px 48px; width: 100%; text-align: left;
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
   FOOTER STYLES (MATCHING HOME)
   ========================================= */
const FullFooter = styled.footer`
    background: #FFFFFF; padding: 60px 50px 20px; color: ${TEXT_MUTED}; border-top: 1px solid ${BORDER_LIGHT};
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
        color: ${TEXT_LIGHT}; font-size: 1.1rem; margin-bottom: 20px; font-weight: 700; position: relative;
        &:after { content: ''; position: absolute; left: 0; bottom: -5px; width: 30px; height: 2px; background: ${GOLD_ACCENT}; }
    }
    p { font-size: 0.9rem; line-height: 1.6; margin: 0 0 10px 0; }
    ul { list-style: none; padding: 0; margin: 0; }
    li { margin-bottom: 10px; }
    a, span {
        color: ${TEXT_MUTED}; text-decoration: none; font-size: 0.9rem; transition: color 0.3s;
        display: inline-flex; align-items: center; gap: 8px; cursor: pointer;
        &:hover { color: ${NEON_COLOR}; }
    }
`;

const FooterLogo = styled(Logo)` font-size: 1.5rem; margin-bottom: 10px; `;

const SocialIcons = styled.div`
    display: flex; gap: 15px; margin-top: 15px;
    a {
        width: 30px; height: 30px; border-radius: 999px; background: #ffffff; border: 1px solid ${BORDER_LIGHT};
        display: flex; align-items: center; justify-content: center; color: ${NEON_COLOR}; transition: all 0.3s;
        &:hover { background: linear-gradient(135deg, ${NEON_COLOR}, ${GOLD_ACCENT}); color: #ffffff; border-color: transparent; }
    }
`;

const Copyright = styled.div`
    text-align: center; font-size: 0.8rem; padding-top: 30px; border-top: 1px solid ${BORDER_LIGHT}; margin-top: 50px;
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
        const DPR = window.devicePixelRatio || 1;
        function resize() {
            canvas.width = window.innerWidth * DPR; canvas.height = window.innerHeight * DPR;
            canvas.style.width = `${window.innerWidth}px`; canvas.style.height = `${window.innerHeight}px`;
            ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        }
        resize();
        const stars = Array.from({ length: 140 }, () => ({
            x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
            r: 1 + Math.random() * 2.2, dx: (Math.random() - 0.5) * 0.25, dy: 0.08 + Math.random() * 0.35, alpha: 0.15 + Math.random() * 0.35,
        }));
        let raf;
        const draw = () => {
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
            stars.forEach((s) => {
                s.x += s.dx; s.y += s.dy;
                if (s.y > window.innerHeight + 10) s.y = -10;
                if (s.x > window.innerWidth + 10) s.x = -10;
                if (s.x < -10) s.x = window.innerWidth + 10;
                ctx.fillStyle = `rgba(212,169,55,${s.alpha})`;
                ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
            });
            raf = requestAnimationFrame(draw);
        };
        draw();
        window.addEventListener('resize', resize);
        return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
    }, []);

    const handleNavigate = (route) => { onNavigate?.(route); setIsMobileMenuOpen(false); };

    // --- HANDLERS ---
    const onContactChange = (e) => setContactForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const onScheduleChange = (e) => setScheduleForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    // --- SUBMIT CONTACT FORM (WHATSAPP TRIGGER) ---
    const submitContact = async (e) => {
        e.preventDefault(); 
        setSending(true); 
        setStatus({ type: "", text: "Sending..." });
        
        try {
            console.log("Sending Contact Data:", contactForm); // DEBUG: Check if mobile is here
            
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
                    <Logo onClick={() => handleNavigate('home')}>NEXORACREW</Logo>
                    <NavGroup>
                        {navItems.map((item) => (
                            <span key={item} onClick={() => handleNavigate(item)} style={item === 'contact' ? { color: NEON_COLOR } : {}}>
                                {item.charAt(0).toUpperCase() + item.slice(1)}
                            </span>
                        ))}
                    </NavGroup>
                    <MobileMenuButton onClick={() => setIsMobileMenuOpen(true)}>
                        <FontAwesomeIcon icon={faBars} />
                    </MobileMenuButton>
                </Header>

                {/* MOBILE NAV */}
                <MobileNavMenu isOpen={isMobileMenuOpen}>
                    <button className="close-btn" onClick={() => setIsMobileMenuOpen(false)}><FontAwesomeIcon icon={faTimes} /></button>
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
                                <FontAwesomeIcon icon={faEnvelope} className="icon" />
                                <div><strong>Email</strong><small>{safeData.email}</small></div>
                            </InfoItem>
                            <InfoItem>
                                <FontAwesomeIcon icon={faPhone} className="icon" />
                                <div><strong>Phone</strong><small>{safeData.phone}</small></div>
                            </InfoItem>
                            <InfoItem>
                                <FontAwesomeIcon icon={faMapMarkerAlt} className="icon" />
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
                                    <FontAwesomeIcon icon={faCalendarCheck} /> Schedule Meeting
                                </ModeButton>
                            </ModeSwitch>

                            {mode === "contact" ? (
                                <Form onSubmit={submitContact}>
                                    <div><Label>Your Name</Label><InputField name="name" placeholder="John Doe" value={contactForm.name} onChange={onContactChange} required /></div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                        <div><Label>Email</Label><InputField type="email" name="email" placeholder="you@example.com" value={contactForm.email} onChange={onContactChange} required /></div>
                                        <div>
                                            <Label>Mobile</Label>
                                            {/* IMPORTANT: This field maps to 'mobile' in backend for WhatsApp */}
                                            <InputField name="mobile" placeholder="+91..." value={contactForm.mobile} onChange={onContactChange} required />
                                        </div>
                                    </div>
                                    <div><Label>Message</Label><TextArea name="message" placeholder="Tell us about your project..." value={contactForm.message} onChange={onContactChange} required /></div>
                                    <SubmitButton type="submit" disabled={sending}>{sending ? "Sending..." : "Send Message"} <FontAwesomeIcon icon={faPaperPlane} /></SubmitButton>
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
                                    <SubmitButton type="submit" disabled={sending}>{sending ? "Booking..." : "Submit Request"} <FontAwesomeIcon icon={faCalendarCheck} /></SubmitButton>
                                </Form>
                            )}
                            {status.text && <StatusMessage type={status.type}>{status.text}</StatusMessage>}
                        </Card>
                    </Grid>
                </ContactSection>

                {/* FOOTER */}
                <FullFooter>
                    <FooterGrid>
                        <FooterColumn style={{ minWidth: '200px' }}>
                            <FooterLogo onClick={() => handleNavigate('home')}>NEXORACREW</FooterLogo>
                            <p>Transforming ideas into powerful digital products using modern technology, creativity, and AI.</p>
                            <SocialIcons>
                                <a href="https://instagram.com" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faInstagram} /></a>
                                <a href="https://linkedin.com" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faLinkedinIn} /></a>
                                <a href={`mailto:${safeData.email}`}><FontAwesomeIcon icon={faEnvelope} /></a>
                                <a href="https://wa.me/919597646460" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faWhatsapp} /></a>
                                <a href="https://youtube.com" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faYoutube} /></a>
                            </SocialIcons>
                        </FooterColumn>
                        <FooterColumn>
                            <h4>Quick Links</h4>
                            <ul>{navItems.map((item, i) => <li key={i}><a onClick={() => handleNavigate(item)}>{item.charAt(0).toUpperCase() + item.slice(1)}</a></li>)}</ul>
                        </FooterColumn>
                        <FooterColumn>
                            <h4>Services</h4>
                            <ul>{['Web Development', 'Poster designing & logo making', 'Content creation', 'Digital marketing & SEO', 'AI and automation', 'Hosting & Support', 'Printing & Branding solutions'].map((l, i) => <li key={i}><a onClick={() => handleNavigate('services')}>{l}</a></li>)}</ul>
                        </FooterColumn>
                        <FooterColumn>
                            <h4>Contact Info</h4>
                            <ul>
                                <li><a href="#map"><FontAwesomeIcon icon={faMapMarkerAlt} /> {safeData.location}</a></li>
                                <li><a href={`mailto:${safeData.email}`}><FontAwesomeIcon icon={faEnvelope} /> {safeData.email}</a></li>
                                <li><a href={`tel:${safeData.phone}`}><FontAwesomeIcon icon={faPhone} /> {safeData.phone}</a></li>
                            </ul>
                        </FooterColumn>
                    </FooterGrid>
                    <Copyright>© 2025 Nexoracrew. All Rights Reserved.</Copyright>
                </FullFooter>
            </PageWrapper>
        </>
    );
};

export default ContactPage;