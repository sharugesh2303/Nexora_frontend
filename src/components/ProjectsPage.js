import React, { useState, useMemo, useRef, useEffect } from 'react';
import styled, { createGlobalStyle, css, keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// --- THEME TOKENS (navy + neon) ---
const NEON = '#00e0b3';
const ACCENT = '#1ddc9f';
const NAVY_BG = '#071025';
const MID_NAVY = '#0B1724';
// FIX: Removed CARD_BG as it was unused
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

/* ---------- GLOBAL STYLE ---------- */
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
    pointer-events: none;
    display: block;
    background: radial-gradient(circle at 15% 10%, #071022 0%, #081226 18%, #071020 45%, #02040a 100%);
`;

/* ---------- LAYOUT & COMPONENTS ---------- */
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
    /* FIX: Changed <a> styles to <span> styles */
    span { color: ${MUTED_TEXT}; font-weight:600; cursor: pointer; text-decoration:none; }
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

/* Filter Bar */
const FilterBar = styled.div`
    display:flex;
    justify-content:center;
    gap:12px;
    flex-wrap:wrap;
    margin-top:28px;
    z-index:3;
`;

const FilterButton = styled.button`
    background: ${props => props.$active ? `linear-gradient(90deg, ${NEON}, ${ACCENT})` : 'transparent'};
    color: ${props => props.$active ? MID_NAVY : LIGHT_TEXT};
    border: ${props => props.$active ? 'none' : `1px solid ${BORDER}`};
    padding: 8px 14px;
    border-radius: 999px;
    font-weight: 700;
    cursor: pointer;
    transition: all .18s ease;
    box-shadow: ${props => props.$active ? '0 8px 28px rgba(0,224,179,0.12)' : 'none'};
    &:hover {
        transform: translateY(-3px);
        color: ${NEON};
        border-color: ${NEON};
    }
`;

/* Project Grid */
const ProjectGrid = styled(motion.div)`
    width:100%;
    max-width: 1200px;
    margin: 36px auto 72px;
    padding: 0 20px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 28px;
    z-index: 3;

    @media (max-width: 992px) { grid-template-columns: repeat(2, 1fr); }
    @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const ProjectCard = styled(motion.div)`
    background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.04));
    border-radius: 14px;
    overflow: hidden;
    border: 1px solid ${BORDER};
    box-shadow: 0 12px 30px rgba(2,6,23,0.55);
    cursor: pointer;
    transition: transform .28s ease, box-shadow .28s ease, border-color .28s ease;
    display:flex;
    flex-direction:column;

    &:hover {
        transform: translateY(-10px);
        border-color: ${NEON};
        box-shadow: 0 22px 46px rgba(0,224,179,0.12);
    }
`;

const CardImage = styled.div`
    height: 220px;
    background: #071026;
    img { width:100%; height:100%; object-fit:cover; display:block; transition: transform .5s ease; }
    ${ProjectCard}:hover & img { transform: scale(1.05); }
`;

const CardContent = styled.div`
    padding: 18px 18px 22px;
    flex:1;
`;

const CardTitle = styled.h3`
    color: ${LIGHT_TEXT};
    margin: 0 0 6px;
    font-size: 1.1rem;
`;
const CardDescription = styled.p`
    color: ${MUTED_TEXT};
    margin: 0 0 12px;
    line-height: 1.5;
    min-height: 44px;
    font-size: 0.95rem;
`;
const TagContainer = styled.div`
    display:flex;
    gap:8px;
    flex-wrap:wrap;
    margin-top:auto;
`;
const Tag = styled.span`
    background: rgba(0,224,179,0.06);
    color: ${LIGHT_TEXT};
    padding: 6px 10px;
    border-radius: 8px;
    font-weight:700;
    font-size:0.78rem;
    border:1px solid rgba(0,224,179,0.08);
`;

/* Footer */
const Footer = styled.footer`
    padding: 36px 20px;
    text-align:center;
    color: ${MUTED_TEXT};
    margin-top: auto;
    z-index: 3;
    border-top: 1px solid rgba(255,255,255,0.02);
`;

/* ---------- STAR CANVAS HOOK (same engine used across pages) ---------- */
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

/* ---------- MAIN COMPONENT ---------- */
const ProjectsPage = ({ onNavigate, projects }) => {
    const [activeFilter, setActiveFilter] = useState('All');
    const canvasRef = useRef(null);
    // Use the custom hook
    useStarCanvas(canvasRef);

    // FIX: Memoize safeProjects initialization to stabilize dependencies
    const safeProjects = useMemo(() => {
        return projects || [
            { _id: '1', title: 'College Portal Redesign', description: 'A massive project involving complete overhaul of the college’s information and enrollment system using React and Node.js.', tags: ['Web App', 'UI/UX'], imageUrl: 'https://via.placeholder.com/800x450/1ddc9f/081026?text=College+Portal' },
            { _id: '2', title: 'AI Recommendation Engine', description: 'Developed a custom machine learning model for personalized product recommendations based on user behavior data.', tags: ['AI', 'Python'], imageUrl: 'https://via.placeholder.com/800x450/3081ff/081026?text=AI+Engine' },
            { _id: '3', title: 'NEXORA Brand Identity', description: 'Our comprehensive branding project, covering logo, style guide, and core messaging for the startup.', tags: ['Branding', 'Design'], imageUrl: 'https://via.placeholder.com/800x450/00e0b3/081026?text=NEXORA+Brand' },
            { _id: '4', title: 'Mobile E-Commerce App', description: 'Cross-platform mobile application development using React Native for a local retail chain.', tags: ['Mobile', 'Web App'], imageUrl: 'https://via.placeholder.com/800x450/ff914d/081026?text=Mobile+App' },
        ];
    }, [projects]);

    const allTags = useMemo(() => {
        const tags = new Set();
        safeProjects.forEach(p => p.tags.forEach(tag => { if (tag.toLowerCase() !== 'all') tags.add(tag); }));
        return ['All', ...Array.from(tags)];
    }, [safeProjects]);

    const filteredProjects = useMemo(() => {
        if (activeFilter === 'All') return safeProjects;
        return safeProjects.filter(p => p.tags.includes(activeFilter));
    }, [activeFilter, safeProjects]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
    };
    const itemVariants = { hidden: { y: 18, opacity: 0 }, visible: { y: 0, opacity: 1 } };

    return (
        <>
            <GlobalStyle />
            <StarCanvas ref={canvasRef} />

            <Page>
                <Header>
                    <Logo onClick={() => onNavigate('home')} className="neon-text-shadow">NEXORA</Logo>
                    <Nav>
                        {/* FIX: Changed <a> tags to <span> for click handlers without href */}
                        <span onClick={() => onNavigate('home')}>Home</span>
                        <span onClick={() => onNavigate('about')}>About</span>
                        <span onClick={() => onNavigate('services')}>Services</span>
                        <span className="active" onClick={() => onNavigate('projects')}>Projects</span>
                        <span onClick={() => onNavigate('blog')}>Blog</span>
                        <span onClick={() => onNavigate('contact')}>Contact</span>
                    </Nav>
                </Header>

                <Intro className="animate-in" style={{ animationDelay: '0.05s' }}>
                    <IntroTitle>Our <span>Projects</span></IntroTitle>
                    <IntroSubtitle>A collection of our work demonstrating creative and technical excellence.</IntroSubtitle>

                    <FilterBar>
                        {allTags.map(tag => (
                            <FilterButton key={tag} $active={activeFilter === tag} onClick={() => setActiveFilter(tag)}>
                                {tag}
                            </FilterButton>
                        ))}
                    </FilterBar>
                </Intro>

                <ProjectGrid
                    layout
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <AnimatePresence>
                        {filteredProjects.map((project) => (
                            <ProjectCard
                                key={project._id}
                                onClick={() => onNavigate(`projects/${project._id}`)}
                                layout
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                transition={{ duration: 0.36 }}
                            >
                                <CardImage>
                                    <img src={project.imageUrl || 'https://via.placeholder.com/800x450/1ddc9f/081026?text=Project+Image'} alt={project.title} />
                                </CardImage>
                                <CardContent>
                                    <CardTitle>{project.title}</CardTitle>
                                    <CardDescription>{project.description.length > 130 ? `${project.description.substring(0, 130)}...` : project.description}</CardDescription>
                                    <TagContainer>
                                        {project.tags.map(t => <Tag key={t}>{t}</Tag>)}
                                    </TagContainer>
                                </CardContent>
                            </ProjectCard>
                        ))}
                    </AnimatePresence>
                </ProjectGrid>

                {filteredProjects.length === 0 && (
                    <div style={{ textAlign: 'center', color: MUTED_TEXT, marginTop: 20 }}>
                        No projects found for this filter.
                    </div>
                )}

                <Footer>&copy;  NEXORACREW Team, Palakarai,Tiruchirappalli, Tamil Nadu.</Footer>
            </Page>
        </>
    );
};

export default ProjectsPage;
