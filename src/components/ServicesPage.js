// ServicesPage.js
import React, { useEffect, useRef } from 'react';
import styled, { createGlobalStyle, keyframes, css } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faDesktop, faRobot, faFilePdf, faCommentDots, 
    faBullhorn, faCode, faBrain, faVideo, faShieldHalved, 
    faFileContract, faQuestionCircle
} from '@fortawesome/free-solid-svg-icons';

// --- THEME TOKENS (navy + neon) ---
const NEON = '#00e0b3';
const ACCENT = '#1ddc9f';
const NAVY_BG = '#071025';
const MID_NAVY = '#0B1724';
const LIGHT_TEXT = '#D6E2F0';
const MUTED_TEXT = '#9AA6B3';
const BORDER = 'rgba(255,255,255,0.06)';

// --- KEYFRAMES ---
const fadeUp = keyframes`
    from { opacity: 0; transform: translateY(18px); }
    to { opacity: 1; transform: translateY(0); }
`;
const pulseGlow = keyframes`
    0%,100% { text-shadow: 0 0 8px ${NEON}, 0 0 18px rgba(0,224,179,0.14); }
    50% { text-shadow: 0 0 14px ${NEON}, 0 0 28px rgba(0,224,179,0.24); }
`;

// --- GLOBAL STYLE ---
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
    .neon-text-shadow { text-shadow: 0 0 6px ${NEON}, 0 0 12px rgba(0,224,179,0.12); }
    .animate-in { opacity: 0; animation: ${css`${fadeUp} 0.85s ease forwards`}; }
`;

/* ---------- STAR CANVAS (full page) ---------- */
const StarCanvas = styled.canvas`
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    display: block;
    background: radial-gradient(circle at 15% 10%, #071022 0%, #081226 18%, #071020 45%, #02040a 100%);
`;

/* ---------- LAYOUT ---------- */
const Page = styled.div`
    position: relative;
    z-index: 2;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
`;

/* Header */
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
    color: ${NEON};
    margin: 0;
    font-weight: 800;
    font-size: 1.05rem;
    cursor: pointer;
    ${css`text-shadow: 0 0 10px ${NEON}, 0 0 22px rgba(0,224,179,0.12);`}
    animation: ${css`${pulseGlow} 2.8s infinite alternate`};
`;

const Nav = styled.nav`
    display:flex;
    gap: 18px;
    span { 
        color: ${MUTED_TEXT}; 
        font-weight:600; 
        cursor: pointer; 
        text-decoration:none; 
    }
    span.active { color: ${NEON}; text-shadow: 0 0 8px rgba(0,224,179,0.12); }
`;

/* Intro */
const Intro = styled.section`
    padding: 130px 20px 40px;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    z-index: 3;
    text-align: center;
`;

const IntroTitle = styled.h2`
    font-size: 2.4rem;
    margin: 0 0 8px;
    color: ${LIGHT_TEXT};
    span { color: ${NEON}; }
    @media (max-width: 768px) { font-size: 1.9rem; }
`;

const IntroSubtitle = styled.p`
    color: ${MUTED_TEXT};
    margin: 6px 0 0;
    max-width: 820px;
    margin-left: auto;
    margin-right: auto;
`;

/* Services Grid */
const ServiceGrid = styled.div`
    width: 100%;
    max-width: 1200px;
    margin: 40px auto 80px;
    padding: 0 20px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 28px;
    z-index: 3;
`;

/* Card */
const ServiceCard = styled.article`
    background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.06));
    border-radius: 14px;
    padding: 28px;
    border: 1px solid ${BORDER};
    box-shadow: 0 12px 30px rgba(2,6,23,0.55);
    transition: transform .32s ease, box-shadow .32s ease, border-color .32s ease;
    transform-origin: center;
    overflow: hidden;
    animation: ${css`${fadeUp} 0.9s ease forwards`};

    &:hover {
        transform: translateY(-10px);
        box-shadow: 0 22px 46px rgba(0,224,179,0.12);
        border-color: ${NEON};
    }

    .icon-box {
        display:inline-flex;
        align-items:center;
        justify-content:center;
        width:64px;
        height:64px;
        border-radius:12px;
        background: linear-gradient(90deg, rgba(0,224,179,0.06), rgba(29,220,159,0.03));
        color: ${NEON};
        font-size: 1.6rem;
        margin-bottom: 18px;
        filter: drop-shadow(0 0 6px rgba(0,224,179,0.08));
    }

    h3 {
        color: ${LIGHT_TEXT};
        margin: 0 0 8px;
        font-size: 1.15rem;
    }
    p {
        color: ${MUTED_TEXT};
        margin: 0 0 18px;
        line-height: 1.6;
    }
`;

/* CTA */
const FinalCta = styled.section`
    width: 100%;
    max-width: 1100px;
    margin: 40px auto 80px;
    padding: 28px;
    border-radius: 14px;
    background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.04));
    border: 1px solid ${BORDER};
    box-shadow: 0 12px 30px rgba(2,6,23,0.4);
    text-align:center;
    z-index: 3;
`;

const CtaTitle = styled.h3`
    color: ${LIGHT_TEXT};
    font-size: 1.6rem;
    margin: 0 0 8px;
`;

const CtaText = styled.p`
    color: ${MUTED_TEXT};
    margin: 0 0 16px;
`;

const PrimaryBtn = styled.button`
    display:inline-flex;
    align-items:center;
    gap:8px;
    padding: 10px 16px;
    background: linear-gradient(90deg, ${NEON}, ${ACCENT});
    border: none;
    color: ${MID_NAVY};
    font-weight: 700;
    border-radius: 10px;
    cursor: pointer;
    box-shadow: 0 10px 32px rgba(0,224,179,0.12);
    transition: transform .16s ease;
    &:hover { transform: translateY(-3px); }
`;

/* Footer */
const Footer = styled.footer`
    padding: 36px 20px;
    text-align:center;
    color: ${MUTED_TEXT};
    margin-top: auto;
    border-top: 1px solid rgba(255,255,255,0.02);
`;

/* Icon map */
const iconMap = {
    faBullhorn: faBullhorn, faCode: faCode, faRobot: faRobot, faFileContract: faFileContract,
    faCommentDots: faCommentDots, faDesktop: faDesktop, faShieldHalved: faShieldHalved,
    faBrain: faBrain, faVideo: faVideo, faFilePdf: faFilePdf, default: faQuestionCircle
};
const getServiceIcon = (iconName) => iconMap[iconName] || iconMap.default;

/* ---------- STAR CANVAS HOOK (Defined outside the component) ---------- */
const useStarCanvas = (canvasRef) => {
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: true });

        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

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
            meteors.push({
                x: startX, y: startY,
                vx: dir * (4 + Math.random() * 6),
                vy: 1 + Math.random() * 2,
                length: 80 + Math.random() * 140,
                life: 0,
                maxLife: 60 + Math.floor(Math.random() * 40)
            });
        }

        let meteorTimer = 0;
        const meteorIntervalBase = 420;

        const onResize = () => { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; };
        window.addEventListener('resize', onResize);

        let raf = null;
        function draw() {
            ctx.clearRect(0, 0, width, height);

            const gBg = ctx.createLinearGradient(0, 0, 0, height);
            gBg.addColorStop(0, '#071025');
            gBg.addColorStop(1, '#02040a');
            ctx.fillStyle = gBg;
            ctx.fillRect(0, 0, width, height);

            orbs.forEach((orb) => {
                orb.x += orb.vx; orb.y += orb.vy;
                if (orb.x < -200) orb.x = width + 200;
                if (orb.x > width + 200) orb.x = -200;
                if (orb.y < -200) orb.y = height + 200;
                if (orb.y > height + 200) orb.y = -200;
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

                ctx.globalCompositeOperation = 'lighter';
                ctx.fillStyle = grad;
                ctx.beginPath(); ctx.arc(s.x, s.y, glowR, 0, Math.PI * 2); ctx.fill(); ctx.closePath();

                ctx.fillStyle = `rgba(255,255,255,${0.95 * s.alpha})`;
                ctx.beginPath(); ctx.arc(s.x, s.y, radius, 0, Math.PI * 2); ctx.fill(); ctx.closePath();
                ctx.globalCompositeOperation = 'source-over';
            });

            meteorTimer += 1;
            if (meteorTimer > meteorIntervalBase + Math.random() * 800) { spawnMeteor(); meteorTimer = 0; }
            meteors = meteors.filter(m => m.life < m.maxLife);
            meteors.forEach((m) => {
                ctx.globalCompositeOperation = 'lighter';
                const trailGrad = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * m.length, m.y - m.vy * m.length);
                trailGrad.addColorStop(0, 'rgba(255,255,255,0.95)');
                trailGrad.addColorStop(1, 'rgba(0,224,179,0.02)');
                ctx.strokeStyle = trailGrad; ctx.lineWidth = 2.5;
                ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(m.x - m.vx * m.length, m.y - m.vy * m.length); ctx.stroke(); ctx.closePath();
                ctx.fillStyle = 'rgba(255,255,255,1)'; ctx.beginPath(); ctx.arc(m.x, m.y, 2.5, 0, Math.PI * 2); ctx.fill(); ctx.closePath();
                ctx.globalCompositeOperation = 'source-over';
                m.x += m.vx; m.y += m.vy; m.life++;
            });

            raf = requestAnimationFrame(draw);
        }

        draw();

        return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
    }, [canvasRef]);
};

/* ---------- MAIN COMPONENT ---------- */
const ServicesPage = ({ onNavigate = () => {}, servicesData }) => {
    const canvasRef = useRef(null);
    // 1. Hook is defined outside and correctly called here.
    useStarCanvas(canvasRef);

    const getServiceData = () => {
        if (servicesData && servicesData.length > 0) return servicesData;
        return [
            { _id: '1', title: 'Web Development', desc: 'Creation of responsive, high-performance websites and web applications.', icon: 'faCode' },
            { _id: '2', title: 'AI & Automation', desc: 'Implementing custom AI solutions and automated workflows for business efficiency.', icon: 'faRobot' },
            { _id: '3', title: 'Content Strategy', desc: 'Crafting compelling, SEO-optimized content that drives engagement and conversions.', icon: 'faCommentDots' },
            { _id: '4', title: 'UI/UX Design', desc: 'Designing intuitive, attractive user interfaces for optimal customer experiences.', icon: 'faDesktop' },
            { _id: '5', title: 'Branding Strategy', desc: 'Developing a cohesive brand identity, voice, and visual system.', icon: 'faBullhorn' },
            { _id: '6', title: 'Security Audits', desc: 'Professional security assessments to protect your digital assets.', icon: 'faShieldHalved' },
        ];
    };

    const safeServicesData = getServiceData();

    return (
        <>
            <GlobalStyle />
            <StarCanvas ref={canvasRef} />

            <Page>
                <Header>
                    <Logo onClick={() => onNavigate('home')} className="neon-text-shadow">NEXORA</Logo>
                    <Nav>
                        {/* 2. Using <span> for navigation clicks */}
                        <span onClick={() => onNavigate('home')}>Home</span>
                        <span onClick={() => onNavigate('about')}>About</span>
                        <span className="active" onClick={() => onNavigate('services')}>Services</span>
                        <span onClick={() => onNavigate('projects')}>Projects</span>
                        <span onClick={() => onNavigate('blog')}>Blog</span>
                        <span onClick={() => onNavigate('contact')}>Contact</span>
                    </Nav>
                </Header>

                <Intro className="animate-in" style={{ animationDelay: '0.05s' }}>
                    <IntroTitle>Our <span>Services</span></IntroTitle>
                    <IntroSubtitle>Comprehensive creative and technology solutions — student-driven, professionally delivered.</IntroSubtitle>
                </Intro>

                <ServiceGrid>
                    {safeServicesData.map((service, i) => (
                        <ServiceCard key={service._id} className="animate-in" style={{ animationDelay: `${0.12 * i + 0.25}s` }}>
                            <div className="icon-box">
                                <FontAwesomeIcon icon={getServiceIcon(service.icon)} />
                            </div>
                            <h3>{service.title}</h3>
                            <p>{service.desc}</p>
                            <PrimaryBtn onClick={() => onNavigate('contact')}>Get Quote</PrimaryBtn>
                        </ServiceCard>
                    ))}
                </ServiceGrid>

                <FinalCta className="animate-in" style={{ animationDelay: `${0.12 * safeServicesData.length + 0.5}s` }}>
                    <CtaTitle>Ready to Bring Your Vision to Life?</CtaTitle>
                    <CtaText>Let's discuss your project and build something remarkable together.</CtaText>
                    <PrimaryBtn onClick={() => onNavigate('contact')}>Let's Collaborate</PrimaryBtn>
                </FinalCta>

                <Footer>&copy; NEXORACREW Team, Palakarai,Tiruchirappalli, Tamil Nadu</Footer>
            </Page>
        </>
    );
};

export default ServicesPage;