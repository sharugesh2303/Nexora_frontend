import React, { useEffect, useRef, useState } from "react";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars, faTimes, faEnvelope, faMapMarkerAlt, faPhone,
  faBullseye, faEye, faRocket, faPencilAlt, faCalendar, faServer, faCheckCircle, faUsers
} from "@fortawesome/free-solid-svg-icons";
import { faInstagram, faLinkedinIn, faWhatsapp, faYoutube } from "@fortawesome/free-brands-svg-icons";

/* =========================================
   THEME CONSTANTS
   ========================================= */
const NEON_COLOR = '#123165';       
const TEXT_LIGHT = '#111827';       
const TEXT_MUTED = '#4B5563';       
const BORDER_LIGHT = '#e2e8f0';        
const GOLD_ACCENT = '#D4A937';

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
        background: 
            radial-gradient(circle at 0% 0%, #fff9e8 0, #ffffff 35%, transparent 55%),
            linear-gradient(180deg, #ffffff 0%, #f5f7fb 40%, #e5edf7 100%);
        color: ${TEXT_LIGHT};
    }
    #root { width: 100%; overflow-x: hidden; }
    *, *::before, *::after { box-sizing: border-box; }

    .animate-in {
        opacity: 0;
        transform: translateY(20px);
        animation: fadeSlide 0.8s ease forwards;
    }
    @keyframes fadeSlide { to { opacity: 1; transform: translateY(0); } }
`;

/* =========================================
   STAR CANVAS BACKGROUND
   ========================================= */
const StarCanvas = styled.canvas`
    position: fixed; inset: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none;
`;

/* =========================================
   LAYOUT COMPONENTS (MATCHED TO HOMEPAGE)
   ========================================= */
const PageWrapper = styled.div`
    position: relative; z-index: 1; min-height: 100vh; background: transparent;
`;

/* HEADER - Matched HomePage exactly */
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
  z-index: 1000;
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
  background: #FFFFFF;
  z-index: 1100;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 80px;
  transform: translateX(${props => (props.isOpen ? '0' : '100%')});
  transition: transform 0.3s ease-in-out;
  box-shadow: -4px 0 20px rgba(15,23,42,0.15);

  .close-btn {
    position: absolute;
    top: 20px; right: 20px;
    background: none;
    border: none;
    color: ${TEXT_LIGHT};
    font-size: 2rem;
    cursor: pointer;
  }

  span {
    font-size: 1.3rem;
    margin: 15px 0;
    cursor: pointer;
    color: ${TEXT_MUTED};
    &:hover { color: ${NEON_COLOR}; }
  }
`;

/* =========================================
   BODY SECTIONS
   ========================================= */
const HeroAbout = styled.section`
    padding: 180px 60px 100px; width: 100%; margin: 0; text-align: left;
    @media (max-width: 780px) { padding: 140px 30px 60px; }
`;

const HeroTitle = styled.h1`
    font-size: 5.5rem; 
    font-weight: 800; margin-bottom: 30px; line-height: 1.1; color: ${NEON_COLOR}; text-align: left;
    span { color: ${GOLD_ACCENT}; }
    @media (max-width: 1200px) { font-size: 4.5rem; }
    @media (max-width: 780px) { font-size: 3.5rem; }
`;

const HeroParagraph = styled.p`
    max-width: 950px; color: ${TEXT_MUTED};
    font-size: 1.5rem; 
    line-height: 1.8; margin: 0; text-align: left;
    @media (max-width: 780px) { font-size: 1.25rem; }
`;

const MetricsGrid = styled.div`
    display: flex; flex-wrap: wrap; justify-content: flex-start; gap: 40px; margin-top: 70px; width: 100%;
`;

const MetricCard = styled.div`
    background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(10px);
    border-radius: 24px; padding: 40px 36px; border: 1px solid ${BORDER_LIGHT};
    box-shadow: 0 10px 30px rgba(0,0,0,0.05); animation: ${rollIn} 0.5s ease forwards;
    display: flex; flex-direction: column; align-items: flex-start; gap: 15px; min-width: 260px;
    
    @media (max-width: 600px) { width: 100%; min-width: unset; }

    .icon-box {
        width: 70px; height: 70px; border-radius: 20px;
        display: flex; align-items: center; justify-content: center;
        background: linear-gradient(135deg, rgba(18,49,101,0.05), rgba(212,169,55,0.15));
        color: ${GOLD_ACCENT}; 
        font-size: 2.2rem; margin-bottom: 10px;
    }
    .value { color: ${TEXT_LIGHT}; font-size: 2.2rem; font-weight: 800; margin: 0; }
    .label { color: ${TEXT_MUTED}; font-size: 1.25rem; margin: 0; font-weight: 500; }
    
    &:hover { transform: translateY(-5px); box-shadow: 0 15px 40px rgba(0,0,0,0.08); border-color: ${GOLD_ACCENT}; }
`;

const Section = styled.section`
    padding: 100px 60px; width: 100%; margin: 0; text-align: left;
    @media (max-width: 780px) { padding: 70px 30px; }
`;

const SectionHeader = styled.h2`
    font-size: 3.8rem; 
    margin-bottom: 20px; color: ${NEON_COLOR}; font-weight: 800; text-align: left;
    span { color: ${GOLD_ACCENT}; }
    @media (max-width: 780px) { font-size: 2.8rem; }
`;

const SectionSubtitle = styled.p`
    color: ${TEXT_MUTED}; max-width: 1100px;
    font-size: 1.5rem; 
    line-height: 1.6; margin: 0 0 60px 0; text-align: left;
`;

const MVJGrid = styled.div`
    display: flex; flex-wrap: wrap; justify-content: flex-start; gap: 40px; width: 100%;
`;

const MVJCard = styled.div`
    background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px);
    border-radius: 24px; padding: 45px; border: 1px solid ${BORDER_LIGHT};
    transition: 0.3s ease; box-shadow: 0 10px 30px rgba(0,0,0,0.05);
    flex: 1; min-width: 320px; max-width: 500px;
    display: flex; flex-direction: column; align-items: flex-start; text-align: left;

    @media (max-width: 600px) { width: 100%; min-width: unset; max-width: 100%; }

    &:hover { transform: translateY(-8px); border-color: ${GOLD_ACCENT}; box-shadow: 0 20px 50px rgba(0,0,0,0.08); }

    .icon-box {
        width: 85px; height: 85px; border-radius: 24px;
        background: linear-gradient(135deg, rgba(18,49,101,0.05), rgba(212,169,55,0.15));
        display: flex; justify-content: center; align-items: center;
        margin-bottom: 25px; color: ${GOLD_ACCENT}; font-size: 2.5rem;
    }
    h3 { font-size: 2rem; color: ${NEON_COLOR}; font-weight: 700; margin: 0 0 15px 0; }
    p { color: ${TEXT_MUTED}; line-height: 1.7; font-size: 1.25rem; white-space: pre-line; margin: 0; }
`;

const CtaSection = styled.div`
    background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(8px);
    padding: 120px 60px; text-align: left; border-top: 1px solid ${BORDER_LIGHT};
    @media (max-width: 780px) { padding: 90px 30px; }
`;

const CtaHeading = styled.h2`
    color: ${NEON_COLOR}; font-size: 3.5rem; margin-bottom: 25px; font-weight: 800;
    span { color: ${GOLD_ACCENT}; }
    @media (max-width: 600px) { font-size: 2.5rem; }
`;

const CtaButton = styled.button`
    padding: 20px 50px; 
    background: linear-gradient(135deg, ${NEON_COLOR}, ${GOLD_ACCENT});
    border: none; border-radius: 999px; color: #ffffff; font-weight: 700; cursor: pointer;
    box-shadow: 0 14px 40px rgba(0,0,0,0.1); font-size: 1.35rem; margin-top: 35px; transition: transform 0.2s;
    &:hover { transform: translateY(-3px); box-shadow: 0 20px 50px rgba(0,0,0,0.15); }
`;

/* =========================================
   FOOTER (MATCHED TO HOMEPAGE)
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
   ICONS & UTILS
   ========================================= */
const SECTION_ICONS = {
    Mission: faBullseye, Vision: faEye, Journey: faRocket, Custom: faPencilAlt, Text: faPencilAlt, default: faPencilAlt,
};
const getSectionIcon = (type) => SECTION_ICONS[type] || SECTION_ICONS.default;

/* =========================================
   MAIN COMPONENT
   ========================================= */
const AboutPage = ({ onNavigate = () => {}, aboutData = {} }) => {
    const canvasRef = useRef(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            
            // Re-draw white background over canvas for consistent theme
            ctx.save();
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);
            ctx.restore();

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

    const handleNavigation = (route) => { onNavigate(route); setIsMobileMenuOpen(false); };

    const safeAboutData = aboutData || {};
    const initialSections = [
        { type: 'Mission', title: 'Our Mission', body: safeAboutData.mission || 'Our mission is to help businesses grow through powerful digital solutions. We aim to design intuitive user experiences and build high-performance platforms.' },
        { type: 'Vision', title: 'Our Vision', body: safeAboutData.vision || 'To become a leading force in digital innovation by creating meaningful, human-centered technology that transforms businesses.' },
        { type: 'Journey', title: 'Our Journey', body: safeAboutData.journey || 'We started as a small student team and grew into a focused digital product studio, blending technology, creativity, and AI.' },
    ];
    const mvjSections = initialSections.filter((s) => s.body);
    const customBlocks = Array.isArray(safeAboutData.sections) ? safeAboutData.sections.filter((s) => s.type === 'Custom' || s.type === 'Text') : [];

    const metricData = [
        { icon: faCalendar, label: 'Founded', value: '25 Sep 2025' },
        { icon: faServer, label: 'Incubation Access', value: 'Nov 2025' },
        { icon: faCheckCircle, label: 'Projects Done', value: 'Major 2+' },
        { icon: faUsers, label: 'Interns', value: '30+' },
    ];

    // UPDATED NAV ITEMS - Including 'certificate'
    const navItems = ['home', 'about', 'services', 'projects', 'team', 'progress', 'blog', 'certificate', 'contact'];
    const safeGeneralData = { email: 'nexora.crew@gmail.com', phone: '+91 95976 46460', location: 'JJ College of Engineering, Trichy' };

    return (
        <>
            <GlobalStyle />
            <StarCanvas ref={canvasRef} />
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
                                style={item === 'about' ? { color: NEON_COLOR } : {}}
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
                        <span 
                            key={item} 
                            onClick={() => handleNavigation(item)} 
                            style={item === 'about' ? { color: NEON_COLOR } : {}}
                        >
                            {item.charAt(0).toUpperCase() + item.slice(1)}
                        </span>
                    ))}
                </MobileNavMenu>

                {/* CONTENT */}
                <HeroAbout>
                    <div className="animate-in">
                        <HeroTitle>Who We <span>Are</span></HeroTitle>
                        <HeroParagraph className="animate-in" style={{ animationDelay: '0.2s' }}>
                            Nexoracrew is an MSME-registered student startup from JJ College of Engineering & Technology, Trichy. We don’t just write code; we transform raw ideas into powerful, polished digital products using modern technology, thoughtful design, and Artificial Intelligence.
                        </HeroParagraph>
                    </div>
                    <MetricsGrid>
                        {metricData.map((metric, i) => (
                            <MetricCard key={i} className="animate-in" style={{ animationDelay: `${0.4 + i * 0.1}s` }}>
                                <div className="icon-box"><FontAwesomeIcon icon={metric.icon} /></div>
                                <p className="value">{metric.value}</p>
                                <p className="label">{metric.label}</p>
                            </MetricCard>
                        ))}
                    </MetricsGrid>
                </HeroAbout>

                <hr style={{ border: `1px solid ${BORDER_LIGHT}`, maxWidth: 1400, margin: '60px auto' }} />

                <Section>
                    <SectionHeader>Our <span>Philosophy</span></SectionHeader>
                    <SectionSubtitle>These core values guide every decision we make, from the smallest code commit to major collaborations.</SectionSubtitle>
                    <MVJGrid>
                        {mvjSections.map((section, i) => (
                            <MVJCard key={i} className="animate-in" style={{ animationDelay: `${0.3 + i * 0.15}s` }}>
                                <div className="icon-box"><FontAwesomeIcon icon={getSectionIcon(section.type)} /></div>
                                <h3>{section.title}</h3>
                                <p>{section.body}</p>
                            </MVJCard>
                        ))}
                    </MVJGrid>
                </Section>

                {customBlocks.map((block, idx) => (
                    <Section key={idx}>
                        <SectionHeader>{block.title}</SectionHeader>
                        <p style={{ color: TEXT_MUTED, fontSize: '1.4rem', lineHeight: '1.8' }}>{block.body}</p>
                    </Section>
                ))}

                <CtaSection>
                    <CtaHeading>Ready to <span>Innovate?</span></CtaHeading>
                    <p style={{ color: TEXT_MUTED, maxWidth: '1000px', fontSize: '1.5rem' }}>Let's build something remarkable together.</p>
                    <CtaButton onClick={() => handleNavigation('contact')}>Let’s Collaborate</CtaButton>
                </CtaSection>

                {/* FOOTER */}
                <FullFooter>
                    <FooterGrid>
                        <FooterColumn style={{ minWidth: '300px' }}>
                            <FooterLogo onClick={() => handleNavigation('home')}>
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
                                <a href={`mailto:${safeGeneralData.email}`}>
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
                                        <a onClick={() => handleNavigation(item)}>{item.charAt(0).toUpperCase() + item.slice(1)}</a>
                                    </li>
                                ))}
                            </ul>
                        </FooterColumn>

                        <FooterColumn>
                            <h4>Services</h4>
                            <ul>
                                {['Web Development', 'Poster designing & logo making' , 'Content creation' , 'Digital marketing &SEO' , 'AI and automation' , 'Hosting & Support' , 'Printing &Branding solutions' , 'Enterprise networking &server architecture' , 'Bold branding&Immersive visual design' , 'Next gen web & mobile experience'].map((l, i) => (
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
                                        <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: GOLD_ACCENT }} /> Palakarai,Trichy.
                                    </a>
                                </li>
                                <li>
                                    <a href={`mailto:${safeGeneralData.email}`}>
                                        <FontAwesomeIcon icon={faEnvelope} style={{ color: GOLD_ACCENT }} /> {safeGeneralData.email}
                                    </a>
                                </li>
                                <li>
                                    <a href={`tel:${safeGeneralData.phone}`}>
                                        <FontAwesomeIcon icon={faPhone} style={{ color: GOLD_ACCENT }} /> +91 9597646460
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

export default AboutPage;