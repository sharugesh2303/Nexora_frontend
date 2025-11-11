import React, { useState, useEffect, useRef } from 'react';
import styled, { createGlobalStyle, keyframes, css } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faMapMarkerAlt, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

// --- API URL (Kept for completeness, though functional API call is mocked) ---
const API_URL = 'http://localhost:5000/api/messages';

// --- THEME TOKENS (Navy + Neon to match Home) ---
const NEON_COLOR = '#00e0b3';
const NAVY_BG = '#071025';
// FIX: Removed unused constant MID_NAVY and CARD_BG
const LIGHT_TEXT = '#D6E2F0';
const MUTED_TEXT = '#9AA6B3';
const ACCENT_LIGHT = '#1ddc9f';
const BORDER_LIGHT = 'rgba(255,255,255,0.06)';

// --- KEYFRAMES ---
const fadeUp = keyframes`
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
`;
const glowPulse = keyframes`
    0%,100% { text-shadow: 0 0 8px ${NEON_COLOR}, 0 0 18px rgba(0,224,179,0.18); }
    50% { text-shadow: 0 0 14px ${NEON_COLOR}, 0 0 28px rgba(0,224,179,0.28); }
`;

// --- GLOBAL STYLES ---
const GlobalStyle = createGlobalStyle`
    body {
        margin: 0;
        font-family: 'Poppins', sans-serif;
        background: ${NAVY_BG};
        color: ${LIGHT_TEXT};
        -webkit-font-smoothing:antialiased;
        -moz-osx-font-smoothing:grayscale;
        overflow-x: hidden;
    }
    .neon-text-shadow { text-shadow: 0 0 6px ${NEON_COLOR}, 0 0 18px rgba(0,224,179,0.18); }
    .animate-in { opacity: 0; animation: ${css`${fadeUp} 0.9s ease forwards`}; }
`;

/* ---------- STAR CANVAS (VISIBLE & LAYERED) ---------- */
const StarCanvas = styled.canvas`
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 0; /* behind content but visible */
    pointer-events: none;
    display: block;
    background: radial-gradient(circle at 15% 10%, #071022 0%, #081226 18%, #071020 45%, #05060a 100%);
`;

/* ---------- LAYOUT ---------- */
const PageWrapper = styled.div`
    position: relative;
    z-index: 2; /* above the canvas */
    min-height: 100vh;
    display: flex;
    flex-direction: column;
`;

/* Header (matches Home style) */
const Header = styled.header`
    display:flex;
    justify-content:space-between;
    align-items:center;
    padding: 18px 40px;
    background: transparent;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 6;
`;

const Logo = styled.h1`
    color: ${NEON_COLOR};
    margin: 0;
    font-weight: 800;
    font-size: 1.1rem;
    cursor: pointer;
    ${css`text-shadow: 0 0 10px ${NEON_COLOR}, 0 0 20px rgba(0,224,179,0.12);`}
    animation: ${css`${glowPulse} 2.5s infinite alternate`};
`;

// FIX: Changed from styled.a to styled.span to fix A11Y errors
const NavItem = styled.span` 
    color: ${MUTED_TEXT};
    text-decoration: none;
    margin-left: 18px;
    font-weight: 600;
    cursor: pointer;
    &:hover { color: ${NEON_COLOR}; text-shadow: 0 0 8px rgba(0,224,179,0.12); }
    &.active { color: ${NEON_COLOR}; }
`;

/* Main section similar content but with navy theme */
const Section = styled.section`
    padding: 120px 24px 60px;
    width: 100%;
    max-width: 1100px;
    margin: 0 auto;
    z-index: 3;
`;

/* Title + subtext */
const MainTitle = styled.h1`
    font-size: 2.8rem;
    margin: 0 0 8px;
    color: ${LIGHT_TEXT};
    span { color: ${NEON_COLOR}; }
    filter: drop-shadow(0 0 3px rgba(0,224,179,0.08));
    @media (max-width: 768px) { font-size: 2rem; text-align:center; }
`;

const SubText = styled.p`
    color: ${MUTED_TEXT};
    margin: 8px 0 28px;
    max-width: 820px;
    line-height: 1.6;
`;

/* Contact grid card (left info, right form) */
const ContactGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1.4fr;
    gap: 32px;
    margin-top: 28px;
    align-items: start;

    @media (max-width: 900px) {
        grid-template-columns: 1fr;
    }
`;

/* Left info (card style) */
const InfoCard = styled.div`
    background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.06));
    border-radius: 12px;
    padding: 22px;
    border: 1px solid ${BORDER_LIGHT};
    box-shadow: 0 12px 30px rgba(0,0,0,0.6);
    color: ${LIGHT_TEXT};
    transform-origin: center;
    animation: ${css`${fadeUp} 0.9s ease forwards`};
    opacity: 0;
    animation-delay: 0.12s;
`;

const InfoTitle = styled.h3`
    margin: 0 0 10px;
    color: ${LIGHT_TEXT};
`;

const InfoText = styled.p`
    margin: 0 0 16px;
    color: ${MUTED_TEXT};
    line-height: 1.5;
`;

const ContactInfoItem = styled.div`
    display:flex;
    gap: 14px;
    align-items:flex-start;
    margin-bottom: 14px;

    .icon-box {
        color: ${NEON_COLOR};
        font-size: 1.2rem;
        min-width: 36px;
    }

    div > span { display:block; font-weight:700; color: ${LIGHT_TEXT}; }
    div > small { display:block; color: ${MUTED_TEXT}; font-size:0.92rem; margin-top:3px; }
`;

/* Right: Form card (keeps inputs & flow as your original but restyled) */
const FormCard = styled.div`
    background: rgba(15, 34, 48, 0.9); /* Using a similar dark blue/navy tone here */
    border-radius: 12px;
    padding: 20px;
    border: 1px solid ${BORDER_LIGHT};
    box-shadow: 0 12px 36px rgba(2,6,23,0.6);
    animation: ${css`${fadeUp} 0.95s ease forwards`};
    opacity: 0;
    animation-delay: 0.18s;
`;

const ContactForm = styled.form`
    display:flex;
    flex-direction: column;
    gap: 12px;
`;

const FormInput = styled.input`
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.04);
    color: ${LIGHT_TEXT};
    padding: 12px 14px;
    border-radius: 8px;
    outline: none;
    font-size: 1rem;
    &::placeholder { color: rgba(214,226,240,0.25); }
    &:focus { border-color: ${NEON_COLOR}; box-shadow: 0 8px 30px rgba(0,224,179,0.06); }
`;

const FormTextArea = styled.textarea`
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.04);
    color: ${LIGHT_TEXT};
    padding: 12px 14px;
    border-radius: 8px;
    min-height: 150px;
    resize: vertical;
    font-size: 1rem;
    &::placeholder { color: rgba(214,226,240,0.25); }
    &:focus { border-color: ${NEON_COLOR}; box-shadow: 0 8px 30px rgba(0,224,179,0.06); }
`;

const SubmitButton = styled.button`
    display:inline-flex;
    align-items:center;
    gap: 10px;
    justify-content:center;
    background: linear-gradient(90deg, ${NEON_COLOR}, ${ACCENT_LIGHT});
    color: rgba(11, 23, 36, 1); /* Using the darkest navy for contrast */
    border: none;
    padding: 12px 16px;
    border-radius: 10px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 12px 30px rgba(0,224,179,0.14);
    transition: transform .14s ease, box-shadow .14s ease;
    &:hover { transform: translateY(-4px); box-shadow: 0 18px 44px rgba(0,224,179,0.2); }
`;

/* Status message */
const FormMessage = styled.p`
    margin: 8px 0 0;
    font-weight: 700;
    color: ${props => (props.type === 'error' ? '#ff6b6b' : NEON_COLOR)};
`;

/* Footer keeps navy look */
const Footer = styled.footer`
    margin-top: 48px;
    padding: 28px 20px;
    text-align:center;
    color: ${MUTED_TEXT};
    border-top: 1px solid rgba(255,255,255,0.02);
`;

/* ---------- COMPONENT ---------- */
const ContactPage = ({ onNavigate, generalData }) => {
    const canvasRef = useRef(null);
    const rafRef = useRef(null);

    const [formData, setFormData] = useState({ name: '', email: '', mobile: '', message: '' });
    const [formMessage, setFormMessage] = useState({ type: '', text: '' });

    const safeGeneralData = generalData || {};
    const defaultPhoneNumber = '+91 95976 46460';

    // Star canvas effect (same visible, drifting stars used on homepage)
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: true });

        let w = (canvas.width = window.innerWidth);
        let h = (canvas.height = window.innerHeight);

        const stars = Array.from({ length: 150 }, () => ({
            x: Math.random() * w,
            y: Math.random() * h,
            baseR: 0.6 + Math.random() * 1.6,
            r: 0,
            dx: (Math.random() - 0.5) * 0.35,
            dy: 0.2 + Math.random() * 0.6,
            alpha: 0.4 + Math.random() * 0.6,
            twSpeed: 0.002 + Math.random() * 0.01,
            twPhase: Math.random() * Math.PI * 2,
            glow: 3 + Math.random() * 5
        }));

        function onResize() {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', onResize);

        function draw() {
            ctx.clearRect(0, 0, w, h);

            // subtle vertical gradient
            const g = ctx.createLinearGradient(0, 0, 0, h);
            g.addColorStop(0, '#071025');
            g.addColorStop(1, '#02040a');
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, w, h);

            // draw stars with glow
            ctx.globalCompositeOperation = 'lighter';
            stars.forEach(s => {
                s.twPhase += s.twSpeed;
                const twinkle = 0.5 + Math.sin(s.twPhase) * 0.5; // 0..1
                const radius = s.baseR * (0.8 + twinkle * 1.4);
                const glowR = radius * s.glow;

                // move
                s.x += s.dx;
                s.y += s.dy;
                if (s.y > h + 10) s.y = -10;
                if (s.x > w + 10) s.x = -10;
                if (s.x < -10) s.x = w + 10;

                const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, glowR);
                grad.addColorStop(0, `rgba(255,255,255,${0.9 * s.alpha})`);
                grad.addColorStop(0.15, `rgba(0,224,179,${0.6 * s.alpha})`);
                grad.addColorStop(0.35, `rgba(0,224,179,${0.16 * s.alpha})`);
                grad.addColorStop(1, 'rgba(0,0,0,0)');

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
            });
            ctx.globalCompositeOperation = 'source-over';

            rafRef.current = requestAnimationFrame(draw);
        }

        draw();
        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener('resize', onResize);
        };
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormMessage({ type: 'info', text: 'Sending...' });

        try {
            // Replace mock network delay with actual API call
            await axios.post(API_URL, formData); 
            
            setFormMessage({ type: 'success', text: 'Success! Your message has been sent. We will get back to you shortly.' });
            setFormData({ name: '', email: '', mobile: '', message: '' });
        } catch (err) {
            console.error('Form submit error:', err);
            setFormMessage({ type: 'error', text: 'An error occurred. Please verify all fields and check your API server.' });
        }
    };

    return (
        <>
            <GlobalStyle />
            <StarCanvas ref={canvasRef} />

            <PageWrapper>
                <Header>
                    <Logo onClick={() => onNavigate('home')} className="neon-text-shadow">NEXORA</Logo>
                    <div>
                        <NavItem onClick={() => onNavigate('home')}>Home</NavItem>
                        <NavItem onClick={() => onNavigate('about')}>About</NavItem>
                        <NavItem onClick={() => onNavigate('services')}>Services</NavItem>
                        <NavItem onClick={() => onNavigate('projects')}>Projects</NavItem>
                        <NavItem onClick={() => onNavigate('blog')}>Blog</NavItem>
                        <NavItem className="active" onClick={() => onNavigate('contact')}>Contact</NavItem>
                    </div>
                </Header>

                <Section>
                    <MainTitle className="animate-in" style={{ animationDelay: '0.05s' }}>
                        Let's <span>Collaborate</span>
                    </MainTitle>

                    <SubText className="animate-in" style={{ animationDelay: '0.12s' }}>
                        Have a project in mind? Get in touch with us and let's create something amazing together.
                    </SubText>

                    <ContactGrid className="animate-in" style={{ animationDelay: '0.2s' }}>
                        {/* LEFT SIDEBAR: Contact Info */}
                        <InfoCard>
                            <InfoTitle>Get In Touch</InfoTitle>
                            <InfoText>
                                Whether you need design, development, or AI solutions, we're here to help. Reach out and let us know about your project.
                            </InfoText>

                            <div style={{ marginTop: 6 }}>
                                <ContactInfoItem>
                                    <FontAwesomeIcon icon={faEnvelope} className="icon-box" />
                                    <div>
                                        <span>Email</span>
                                        <small>{safeGeneralData.email || 'info@nexora.com'}</small>
                                    </div>
                                </ContactInfoItem>

                                <ContactInfoItem>
                                    <FontAwesomeIcon icon={faPhone} className="icon-box" />
                                    <div>
                                        <span>Phone</span>
                                        <small>{safeGeneralData.phone || defaultPhoneNumber}</small>
                                    </div>
                                </ContactInfoItem>

                                <ContactInfoItem>
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="icon-box" />
                                    <div>
                                        <span>Location</span>
                                        <small>{safeGeneralData.location || 'Coimbatore, India'}</small>
                                    </div>
                                </ContactInfoItem>
                            </div>
                        </InfoCard>

                        {/* RIGHT SIDE: Contact Form */}
                        <FormCard>
                            <ContactForm onSubmit={handleSubmit}>
                                <FormInput
                                    type="text"
                                    name="name"
                                    placeholder="Your Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                                <FormInput
                                    type="email"
                                    name="email"
                                    placeholder="Your Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                                <FormInput
                                    type="tel"
                                    name="mobile"
                                    placeholder="Mobile Number"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    required
                                />
                                <FormTextArea
                                    name="message"
                                    placeholder="Tell us about your project..."
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                />
                                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 6 }}>
                                    <SubmitButton type="submit">
                                        Send Message <FontAwesomeIcon icon={faPaperPlane} />
                                    </SubmitButton>
                                    <div style={{ color: MUTED_TEXT, fontSize: 13 }}>
                                        Or reach us at <span style={{ color: NEON_COLOR, fontWeight: 700 }}>nexora.crew@gmail.com</span>
                                    </div>
                                </div>

                                {formMessage.text && (
                                    <FormMessage type={formMessage.type} style={{ marginTop: 12 }}>
                                        {formMessage.text}
                                    </FormMessage>
                                )}
                            </ContactForm>
                        </FormCard>
                    </ContactGrid>
                </Section>

                <Footer>
                    &copy; 2025 Crafted with care by NEXORA Team, JJ College.
                </Footer>
            </PageWrapper>
        </>
    );
};

export default ContactPage;