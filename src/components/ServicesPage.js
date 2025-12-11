import React, { useEffect, useRef, useState } from "react";
import styled, { createGlobalStyle, keyframes, css } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faBars, 
  faTimes, 
  faEnvelope, 
  faMapMarkerAlt, 
  faPhone,
  faArrowRight
} from "@fortawesome/free-solid-svg-icons";
import { 
  faInstagram, 
  faLinkedinIn, 
  faWhatsapp, 
  faYoutube 
} from "@fortawesome/free-brands-svg-icons";

/* =========================================
   THEME CONSTANTS
   ========================================= */
const NEON_COLOR = '#123165';          // Primary Navy
const TEXT_LIGHT = '#111827';          // Dark text for white bg
const TEXT_MUTED = '#6B7280';
const BORDER_LIGHT = 'rgba(15,23,42,0.08)';
const GOLD_ACCENT = '#D4A937';

/* =========================================
   KEYFRAMES
   ========================================= */
const rollIn = keyframes`
    from { opacity: 0; transform: translateY(30px) scale(0.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
`;

const rotateBorder = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
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

    .animate-in {
        opacity: 0;
        transform: translateY(20px);
        animation: fadeSlide 0.8s ease forwards;
    }

    @keyframes fadeSlide {
        to { opacity: 1; transform: translateY(0); }
    }
`;

/* =========================================
   STAR CANVAS BACKGROUND
   ========================================= */
const StarCanvas = styled.canvas`
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
`;

/* =========================================
   LAYOUT COMPONENTS
   ========================================= */
const PageWrapper = styled.div`
    position: relative;
    z-index: 1;
    min-height: 100vh;
    background: transparent;
`;

const Header = styled.header`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 48px; /* Reference padding for left alignment */
    position: sticky;
    top: 0;
    width: 100%;
    background: rgba(255,255,255,0.85);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid ${BORDER_LIGHT};
    z-index: 100;
    box-sizing: border-box;

    @media (max-width: 768px) {
        padding: 12px 20px;
    }
`;

const Logo = styled.h1`
    color: ${NEON_COLOR};
    font-size: 1.8rem;
    font-weight: 800;
    cursor: pointer;
    letter-spacing: 1px;
    margin: 0;
    white-space: nowrap;

    @media (max-width: 480px) { font-size: 1.4rem; }
`;

const NavGroup = styled.div`
    display: flex;
    gap: 22px;
    align-items: center;
    margin-right: auto;
    margin-left: 40px;

    @media (max-width: 1024px) { display: none; }

    span {
        color: ${TEXT_MUTED};
        cursor: pointer;
        font-weight: 500;
        position: relative;
        transition: 0.3s ease;
        padding: 6px 4px;
        &:hover { color: ${NEON_COLOR}; }
        &:after {
            content: ''; position: absolute; left: 0; bottom: -2px;
            width: 0; height: 2px; background: ${GOLD_ACCENT};
            transition: 0.3s; border-radius: 4px;
        }
        &:hover:after { width: 100%; }
    }
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
    top: 0; left: 0; width: 100%; height: 100%;
    background: #ffffff;
    z-index: 1000;
    display: flex; flex-direction: column; align-items: center; padding-top: 80px;
    transform: translateX(${props => (props.isOpen ? '0' : '100%')});
    transition: transform 0.3s ease-in-out;
    box-shadow: -4px 0 20px rgba(15,23,42,0.15);

    .close-btn {
        position: absolute; top: 20px; right: 20px;
        background: none; border: none;
        color: ${TEXT_LIGHT}; font-size: 2rem; cursor: pointer;
    }
    span {
        font-size: 1.3rem; margin: 15px 0; cursor: pointer; color: ${TEXT_MUTED};
        &:hover { color: ${NEON_COLOR}; }
    }
`;

/* =========================================
   HERO SECTION - STRICT LEFT ALIGNMENT
   ========================================= */
const HeroSection = styled.section`
    /* Left padding 48px to match Header exactly */
    padding: 140px 48px 60px; 
    width: 100%;
    text-align: left;
    box-sizing: border-box;

    @media (max-width: 780px) {
        padding: 100px 20px 40px; /* Aligns with mobile header padding */
        text-align: left;
    }
`;

const HeroTitle = styled.h1`
    font-size: 3.6rem;
    font-weight: 800;
    margin-bottom: 16px;
    line-height: 1.1;
    color: ${NEON_COLOR}; 
    margin-left: 0;

    span {
        color: ${GOLD_ACCENT};
    }

    @media (max-width: 780px) {
        font-size: 2.4rem;
    }
`;

const HeroParagraph = styled.p`
    max-width: 760px;
    color: ${TEXT_MUTED};
    font-size: 1.05rem;
    line-height: 1.7;
    margin: 0; /* Ensures it starts at the edge */

    @media (max-width: 780px) {
        font-size: 1rem;
        max-width: 100%;
    }
`;

/* =========================================
   SERVICE GRID - STRICT LEFT ALIGNMENT
   ========================================= */
const GridContainer = styled.div`
    width: 100%;
    /* Left padding 48px to match Header/Hero */
    padding: 0 48px 100px; 
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start; /* Start stacking from left */
    gap: 30px;
    box-sizing: border-box;

    @media (max-width: 780px) {
        padding: 0 20px 80px;
        justify-content: center; /* Center only on mobile */
    }
`;

const CardWrapper = styled.div`
    position: relative;
    width: 320px; /* Fixed width for consistent grid */
    height: 340px;
    border-radius: 20px;
    overflow: hidden;
    background: #ffffff;
    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: default;
    
    display: flex;
    justify-content: center;
    align-items: center;

    /* Rotating Border */
    &::before {
        content: '';
        position: absolute;
        width: 150%;
        height: 150%;
        background: conic-gradient(
            transparent 0deg, 
            transparent 90deg, 
            ${GOLD_ACCENT} 130deg, 
            ${NEON_COLOR} 180deg, 
            ${GOLD_ACCENT} 230deg, 
            transparent 270deg
        );
        animation: ${rotateBorder} 4s linear infinite;
        opacity: 0.3; 
        transition: opacity 0.3s ease;
    }

    &:hover {
        transform: translateY(-8px);
        box-shadow: 0 20px 60px rgba(18, 49, 101, 0.25);
    }

    &:hover::before {
        opacity: 1; 
        animation-duration: 2s; 
    }

    @media (max-width: 600px) {
        width: 100%;
    }
`;

const CardInterior = styled.div`
    position: absolute;
    inset: 3px;
    background: #ffffff;
    border-radius: 18px;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    overflow: hidden;
`;

const DefaultContent = styled.div`
    padding: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: transform 0.4s ease, opacity 0.4s ease;
    
    ${CardWrapper}:hover & {
        opacity: 0.1;
        transform: translateY(-20px);
    }
`;

const CardTitle = styled.h3`
    font-size: 1.8rem;
    font-weight: 800;
    color: ${NEON_COLOR};
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 1px;
`;

const HoverOverlay = styled.div`
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    background: linear-gradient(135deg, ${NEON_COLOR} 0%, #0a2145 100%);
    padding: 30px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    text-align: left;
    
    transform: translateY(100%);
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);

    ${CardWrapper}:hover & {
        transform: translateY(0);
    }
`;

const OverlayTitle = styled.h3`
    color: ${GOLD_ACCENT};
    font-size: 1.4rem;
    margin-bottom: 15px;
    font-weight: 700;
`;

const OverlayDesc = styled.p`
    color: rgba(255, 255, 255, 0.95);
    font-size: 0.95rem;
    line-height: 1.6;
    margin: 0;
`;

/* =========================================
   CTA SECTION
   ========================================= */
const CtaSection = styled.div`
    background: rgba(255,255,255,0.8);
    backdrop-filter: blur(10px);
    padding: 80px 20px;
    text-align: center;
    border-top: 1px solid ${BORDER_LIGHT};
`;

const CtaHeading = styled.h2`
    color: ${NEON_COLOR};
    font-size: 2.2rem;
    margin-bottom: 15px;
    font-weight: 800;
    span { color: ${GOLD_ACCENT}; }
    @media (max-width: 600px) { font-size: 1.8rem; }
`;

const CtaButton = styled.button`
    padding: 14px 36px;
    background: linear-gradient(135deg, ${NEON_COLOR}, ${GOLD_ACCENT});
    border: none;
    border-radius: 999px;
    color: #ffffff;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 14px 40px rgba(0,0,0,0.1);
    font-size: 1.05rem;
    margin-top: 25px;
    transition: transform 0.2s;
    &:hover { transform: translateY(-3px); box-shadow: 0 20px 50px rgba(0,0,0,0.15); }
`;

/* =========================================
   FOOTER STYLES
   ========================================= */
const FullFooter = styled.footer`
    background: rgba(255,255,255,0.95);
    padding: 60px 50px 20px;
    color: ${TEXT_MUTED};
    border-top: 1px solid ${BORDER_LIGHT};
    box-sizing: border-box;
    @media (max-width: 768px) { padding: 40px 20px 20px; }
`;

const FooterGrid = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    gap: 30px;
    @media (max-width: 900px) { flex-wrap: wrap; }
    @media (max-width: 600px) { flex-direction: column; align-items: flex-start; }
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
            content: ''; position: absolute; left: 0; bottom: -5px;
            width: 30px; height: 2px; background: ${GOLD_ACCENT};
        }
    }
    p { font-size: 0.9rem; line-height: 1.6; margin: 0 0 10px 0; }
    ul { list-style: none; padding: 0; margin: 0; }
    li { margin-bottom: 10px; }
    a, span {
        color: ${TEXT_MUTED}; text-decoration: none; font-size: 0.9rem;
        transition: color 0.3s; display: inline-flex; align-items: center; gap: 8px; cursor: pointer;
        &:hover { color: ${NEON_COLOR}; }
    }
`;

const FooterLogo = styled(Logo)` font-size: 1.5rem; margin-bottom: 10px; `;

const SocialIcons = styled.div`
    display: flex; gap: 15px; margin-top: 15px;
    a {
        width: 32px; height: 32px; border-radius: 999px; background: #f3f4f6;
        display: flex; align-items: center; justify-content: center;
        color: ${NEON_COLOR}; transition: background 0.3s, color 0.3s, box-shadow 0.3s;
        &:hover { background: linear-gradient(135deg, ${NEON_COLOR}, ${GOLD_ACCENT}); color: #ffffff; box-shadow: 0 8px 20px rgba(15,23,42,0.2); }
    }
`;

const Copyright = styled.div`
    text-align: center; font-size: 0.8rem; padding-top: 30px;
    border-top: 1px solid ${BORDER_LIGHT}; margin-top: 50px;
`;

/* =========================================
   MAIN COMPONENT
   ========================================= */
const ServicesPage = ({ onNavigate = () => {}, servicesData }) => {
    const canvasRef = useRef(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // --- Gold Particle Animation ---
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: true });
        const DPR = window.devicePixelRatio || 1;

        function resize() {
            canvas.width = window.innerWidth * DPR;
            canvas.height = window.innerHeight * DPR;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        }
        resize();

        const stars = Array.from({ length: 140 }, () => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            r: 1 + Math.random() * 2.2,
            dx: (Math.random() - 0.5) * 0.25,
            dy: 0.08 + Math.random() * 0.35,
            alpha: 0.15 + Math.random() * 0.35,
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

    const handleNavigation = (route) => {
        onNavigate(route);
        setIsMobileMenuOpen(false);
    };

    const getServiceData = () => {
        if (servicesData && servicesData.length > 0) return servicesData;
        return [
            { _id: '1', title: 'Web Development', desc: 'Custom, high-performance websites built with the latest technologies (MERN, React, etc.) tailored to your business needs.' },
            { _id: '2', title: 'AI & Automation', desc: 'Streamline your operations with intelligent automation and custom AI solutions that save time and reduce costs.' },
            { _id: '3', title: 'Content Strategy', desc: 'Engaging content and copy that speaks to your audience, optimized for SEO to drive organic traffic.' },
            { _id: '4', title: 'UI/UX Design', desc: 'User-centric designs that look beautiful and function flawlessly, ensuring a seamless experience for your customers.' },
            { _id: '5', title: 'Branding Strategy', desc: 'Developing a cohesive brand identity, voice, and visual system to stand out.' },
            { _id: '6', title: 'Security Audits', desc: 'Identify vulnerabilities and secure your digital infrastructure with our comprehensive security assessments.' },
        ];
    };

    const safeServicesData = getServiceData();
    const navItems = ['home', 'about', 'services', 'projects', 'team', 'progress', 'blog', 'contact'];
    
    const safeGeneralData = {
        email: 'nexora.crew@gmail.com',
        phone: '+91 95976 46460',
        location: 'JJ College of Engineering, Trichy',
    };

    return (
        <>
            <GlobalStyle />
            <StarCanvas ref={canvasRef} />
            <PageWrapper>
                <Header>
                    <Logo onClick={() => handleNavigation('home')}>NEXORACREW</Logo>
                    <NavGroup>
                        {navItems.map((item) => (
                            <span key={item} onClick={() => handleNavigation(item)} style={item === 'services' ? { color: NEON_COLOR } : {}}>
                                {item.charAt(0).toUpperCase() + item.slice(1)}
                            </span>
                        ))}
                    </NavGroup>
                    <MobileMenuButton onClick={() => setIsMobileMenuOpen(true)}>
                        <FontAwesomeIcon icon={faBars} />
                    </MobileMenuButton>
                </Header>

                <MobileNavMenu isOpen={isMobileMenuOpen}>
                    <button className="close-btn" onClick={() => setIsMobileMenuOpen(false)}><FontAwesomeIcon icon={faTimes} /></button>
                    {navItems.map((item) => (
                        <span key={item} onClick={() => handleNavigation(item)} style={item === 'services' ? { color: NEON_COLOR } : {}}>
                            {item.charAt(0).toUpperCase() + item.slice(1)}
                        </span>
                    ))}
                </MobileNavMenu>

                <HeroSection>
                    <div className="animate-in">
                        <HeroTitle>Our <span>Services</span></HeroTitle>
                        <HeroParagraph className="animate-in" style={{ animationDelay: '0.2s' }}>
                            Comprehensive creative and technology solutions — student-driven, professionally delivered. We transform ideas into reality.
                        </HeroParagraph>
                    </div>
                </HeroSection>

                <GridContainer>
                    {safeServicesData.map((service, i) => (
                        <CardWrapper 
                            key={service._id} 
                            className="animate-in" 
                            style={{ animationDelay: `${0.1 * i + 0.3}s` }}
                        >
                            <CardInterior>
                                <DefaultContent>
                                    <CardTitle>{service.title}</CardTitle>
                                </DefaultContent>

                                <HoverOverlay>
                                    <OverlayTitle>{service.title}</OverlayTitle>
                                    <OverlayDesc>{service.desc}</OverlayDesc>
                                </HoverOverlay>
                            </CardInterior>
                        </CardWrapper>
                    ))}
                </GridContainer>

                <CtaSection>
                    <CtaHeading>Ready to Bring Your <span>Vision to Life?</span></CtaHeading>
                    <p style={{ color: TEXT_MUTED, maxWidth: '600px', margin: '0 auto' }}>Let's discuss your project and build something remarkable together.</p>
                    <CtaButton onClick={() => handleNavigation('contact')}>Start a Project</CtaButton>
                </CtaSection>

                <FullFooter>
                    <FooterGrid>
                        <FooterColumn style={{ minWidth: '300px' }}>
                            <FooterLogo onClick={() => handleNavigation('home')}>NEXORACREW</FooterLogo>
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
                            <ul>{navItems.map((item, i) => <li key={i}><a onClick={() => handleNavigation(item)}>{item.charAt(0).toUpperCase() + item.slice(1)}</a></li>)}</ul>
                        </FooterColumn>
                        <FooterColumn>
                            <h4>Services</h4>
                            <ul>
                                {['Web Development', 'Poster designing & logo making' , 'Content creation' , 'Digital marketing &SEO' , 'AI and automation' , 'Hosting & Support' , 'Printing &Branding solutions' , 'Enterprise networking &server architecture' , 'Bold branding&Immersive visual design' , 'Next gen web & mobile experience'].map((l, i) => <li key={i}><a onClick={() => handleNavigation('services')}>{l}</a></li>)}
                            </ul>
                        </FooterColumn>
                        <FooterColumn>
                            <h4>Contact Info</h4>
                            <ul>
                                <li><a href="#map"><FontAwesomeIcon icon={faMapMarkerAlt} /> {safeGeneralData.location}</a></li>
                                <li><a href={`mailto:${safeGeneralData.email}`}><FontAwesomeIcon icon={faEnvelope} /> {safeGeneralData.email}</a></li>
                                <li><a href={`tel:${safeGeneralData.phone}`}><FontAwesomeIcon icon={faPhone} /> {safeGeneralData.phone}</a></li>
                            </ul>
                        </FooterColumn>
                    </FooterGrid>
                    <Copyright>© 2025 Nexoracrew. All Rights Reserved.</Copyright>
                </FullFooter>
            </PageWrapper>
        </>
    );
};

export default ServicesPage;