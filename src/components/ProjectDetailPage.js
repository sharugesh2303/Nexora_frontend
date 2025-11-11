import React, { useEffect, useRef } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import styled, { createGlobalStyle, keyframes, css } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';

// ---------------- THEME TOKENS ----------------
const NEON = '#00e0b3';
const ACCENT = '#1ddc9f';
const NAVY_BG = '#071025';
const MID_NAVY = '#0B1724';
// FIX: Removed unused constant PANEL
const LIGHT_TEXT = '#D6E2F0';
const MUTED_TEXT = '#9AA6B3';
const BORDER = 'rgba(255,255,255,0.06)';

// ---------------- KEYFRAMES ----------------
const fadeUp = keyframes`
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
`;
const neonPulse = keyframes`
    0%,100% { text-shadow: 0 0 8px ${NEON}, 0 0 18px rgba(0,224,179,0.12); }
    50% { text-shadow: 0 0 14px ${NEON}, 0 0 28px rgba(0,224,179,0.22); }
`;

// ---------------- GLOBAL STYLE ----------------
const GlobalStyle = createGlobalStyle`
    body {
        margin: 0;
        font-family: 'Poppins', sans-serif;
        background: ${NAVY_BG};
        color: ${LIGHT_TEXT};
        -webkit-font-smoothing:antialiased;
        -moz-osx-font-smoothing:grayscale;
    }
    .neon-text-shadow {
        text-shadow: 0 0 6px ${NEON}, 0 0 12px rgba(0,224,179,0.12);
    }
    .animate-in { opacity: 0; animation: ${css`${fadeUp} 0.85s ease forwards`}; }
`;

// ---------------- STAR CANVAS ----------------
const StarCanvas = styled.canvas`
    position: fixed;
    inset: 0;
    z-index: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    display: block;
    background: radial-gradient(circle at 15% 10%, #071022 0%, #081226 18%, #071020 45%, #02040a 100%);
`;

// re-usable star engine (same look as homepage/projects)
const useStarCanvas = (canvasRef) => {
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: true });

        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const stars = Array.from({ length: 130 }, () => ({
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

        const orbs = Array.from({ length: 4 }, (_, i) => ({
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

        const onResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', onResize);

        let raf = null;
        function draw() {
            ctx.clearRect(0, 0, width, height);

            // subtle vertical gradient
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

// ---------------- STYLED COMPONENTS (layout) ----------------
const Container = styled.div`
    position: relative;
    z-index: 2;
    max-width: 1100px;
    margin: 0 auto;
    padding: 120px 20px 60px;
`;

const HeaderBar = styled.header`
    display:flex;
    justify-content:space-between;
    align-items:center;
    padding: 18px 36px;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 6;
    background: transparent;
`;

const LogoTitle = styled.h1`
    color: ${NEON};
    margin: 0;
    font-weight: 800;
    cursor: pointer;
    font-size: 1rem;
    animation: ${css`${neonPulse} 2.6s infinite alternate`};
`;

const Nav = styled.div`
    display:flex;
    gap: 16px;
    /* FIX: Styles applied to span children */
    span { 
        color: ${MUTED_TEXT}; 
        font-weight:600; 
        cursor:pointer; 
        text-decoration:none; 
    }
    span:hover { color: ${NEON}; }
`;

/* Project Header */
const ProjectHeader = styled.div`
    margin-top: 6px;
    display:flex;
    flex-direction:column;
    gap: 20px;
    align-items: stretch;
    text-align: left;
`;

const HeaderImageWrap = styled.div`
    width: 100%;
    max-height: 80vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(180deg, rgba(255,255,255,0.012), rgba(0,0,0,0.06));
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid ${BORDER};
`;

const HeaderImage = styled.img`
    width: auto;
    height: 72vh; 
    max-width: 100%;
    object-fit: contain; 
    display: block;
    margin: 0 auto;
`;

/* Title / Tags */
const ProjectTitle = styled.h1`
    font-size: 2.6rem;
    margin: 6px 0 6px;
    color: ${LIGHT_TEXT};
    line-height: 1.05;
    @media (max-width: 768px) { font-size: 1.9rem; }
`;

const TagContainer = styled.div`
    display:flex;
    gap:10px;
    flex-wrap:wrap;
    margin-top: 8px;
`;

const Tag = styled.span`
    background: linear-gradient(90deg, rgba(0,224,179,0.12), rgba(98,0,255,0.04));
    color: ${LIGHT_TEXT};
    padding: 6px 10px;
    border-radius: 8px;
    font-weight:700;
    font-size: 0.85rem;
    border: 1px solid rgba(0,224,179,0.08);
`;

/* Content */
const ProjectContent = styled.div`
    margin-top: 28px;
    color: ${MUTED_TEXT};
    font-size: 1.05rem;
    line-height: 1.8;
    white-space: pre-wrap;
`;

/* Button */
const ProjectLink = styled.a`
    display:inline-flex;
    align-items:center;
    gap:10px;
    margin-top: 26px;
    background: linear-gradient(90deg, ${NEON}, ${ACCENT});
    color: ${MID_NAVY};
    padding: 12px 18px;
    border-radius: 10px;
    font-weight: 800;
    text-decoration: none;
    box-shadow: 0 10px 30px rgba(0,224,179,0.12);
    transition: transform .16s ease, box-shadow .16s ease;
    &:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,224,179,0.18); }
`;

/* Footer */
const Footer = styled.footer`
    margin-top: 48px;
    padding: 28px 0 60px;
    text-align:center;
    color: ${MUTED_TEXT};
    border-top: 1px solid rgba(255,255,255,0.02);
`;

// ---------------- MAIN COMPONENT ----------------
const ProjectDetailPage = ({ onNavigate, projects }) => {
    const { id } = useParams();
    const canvasRef = useRef(null);
    useStarCanvas(canvasRef);

    const safeProjects = Array.isArray(projects) ? projects : [];
    
    // Show Loading state if projects data hasn't loaded yet
    if (!projects || projects.length === 0) {
        return (
            <>
                <GlobalStyle />
                <StarCanvas ref={canvasRef} />
                <div style={{ paddingTop: 140, textAlign: 'center', color: LIGHT_TEXT }}>
                    <h2>Loading Project...</h2>
                </div>
            </>
        );
    }

    const project = safeProjects.find(p => p._id === id);
    if (!project) return <Navigate to="/projects" replace />;

    return (
        <>
            <GlobalStyle />
            <StarCanvas ref={canvasRef} />

            <HeaderBar>
                <LogoTitle onClick={() => onNavigate('home')} className="neon-text-shadow">NEXORA</LogoTitle>
                <Nav>
                    {/* FIX: Changed <a> to <span> for A11Y compliance */}
                    <span onClick={() => onNavigate('home')}>Home</span>
                    <span onClick={() => onNavigate('about')}>About</span>
                    <span onClick={() => onNavigate('services')}>Services</span>
                    <span onClick={() => onNavigate('projects')}>Projects</span>
                    <span onClick={() => onNavigate('blog')}>Blog</span>
                    <span onClick={() => onNavigate('contact')}>Contact</span>
                </Nav>
            </HeaderBar>

            <Container className="animate-in" style={{ animationDelay: '0.06s' }}>
                <ProjectHeader>
                    {project.imageUrl && (
                        <HeaderImageWrap>
                            <HeaderImage src={project.imageUrl} alt={project.title} />
                        </HeaderImageWrap>
                    )}

                    <div>
                        <ProjectTitle>{project.title}</ProjectTitle>
                        <TagContainer>
                            {(project.tags || []).map(t => <Tag key={t}>{t}</Tag>)}
                        </TagContainer>
                    </div>

                    <ProjectContent>
                        {project.description}

                        {project.projectUrl && (
                            <div>
                                <ProjectLink href={project.projectUrl} target="_blank" rel="noopener noreferrer">
                                    <FontAwesomeIcon icon={faLink} />
                                    View Project (GitHub)
                                </ProjectLink>
                            </div>
                        )}
                    </ProjectContent>
                </ProjectHeader>

                <Footer>&copy; 2025 Crafted with care by NEXORA Team, JJ College.</Footer>
            </Container>
        </>
    );
};

export default ProjectDetailPage;