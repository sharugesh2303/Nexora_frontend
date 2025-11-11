import React, { useEffect, useRef } from 'react';
import styled, { createGlobalStyle, keyframes, css } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

// --- THEME TOKENS ---
const NEON = '#00e0b3';
const ACCENT = '#1ddc9f';
const NAVY_BG = '#071025';
const MID_NAVY = '#0B1724';
const LIGHT_TEXT = '#D6E2F0';
const MUTED_TEXT = '#9AA6B3';
const BORDER = 'rgba(255,255,255,0.06)';
// FIX: Removed CARD_BG as it was unused and caused ESLint errors.

// --- KEYFRAMES & GLOBAL ---
const fadeUp = keyframes`
    from { opacity: 0; transform: translateY(18px); }
    to { opacity: 1; transform: translateY(0); }
`;
const pulseGlow = keyframes`
    0%,100% { text-shadow: 0 0 8px ${NEON}, 0 0 18px rgba(0,224,179,0.14); }
    50% { text-shadow: 0 0 14px ${NEON}, 0 0 28px rgba(0,224,179,0.24); }
`;

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

/* ---------- STAR CANVAS ---------- */
const StarCanvas = styled.canvas`
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none; /* Add pointer-events none to prevent blocking clicks */
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
    font-size: 2.6rem;
    margin: 0 0 8px;
    color: ${LIGHT_TEXT};
    span { color: ${NEON}; }
    @media (max-width: 768px) { font-size: 2rem; }
`;

const IntroSubtitle = styled.p`
    color: ${MUTED_TEXT};
    margin: 6px 0 0;
    max-width: 820px;
    margin-left: auto;
    margin-right: auto;
`;

/* Grid */
const PostGrid = styled.div`
    width: 100%;
    max-width: 1200px;
    margin: 40px auto 80px;
    padding: 0 20px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 36px;
    z-index: 3;
`;

/* Card */
const PostCard = styled.article`
    background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.06));
    border-radius: 14px;
    overflow: hidden;
    border: 1px solid ${BORDER};
    box-shadow: 0 12px 30px rgba(2,6,23,0.6);
    transition: transform .32s ease, box-shadow .32s ease, border-color .32s ease;
    transform-origin: center;
    animation: ${css`${fadeUp} 0.85s ease forwards`};
    opacity: 0;

    &:hover {
        transform: translateY(-10px);
        box-shadow: 0 22px 46px rgba(0,224,179,0.12);
        border-color: ${NEON};
    }
`;

/* Vertical image wrapper: 4:7 aspect => padding-top: 175% */
const ImageWrapper = styled.div`
    position: relative;
    width: 100%;
    padding-top: 175%; /* 7 / 4 * 100 = 175% */
    overflow: hidden;
    background: ${MID_NAVY};
`;

const PostImage = styled.img`
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover; 
    object-position: center center;
    transition: transform 0.45s ease;
    display: block;
    transform-origin: center;
    &:hover { transform: scale(1.03); }
`;

/* Content */
const CardBody = styled.div`
    padding: 18px 20px 22px;
`;

const Meta = styled.div`
    display:flex;
    justify-content:space-between;
    align-items:center;
    color: ${MUTED_TEXT};
    font-size: 0.95rem;
    margin-bottom: 10px;
    svg { color: ${NEON}; margin-right: 8px; }
`;

const Title = styled.h3`
    color: ${LIGHT_TEXT};
    font-size: 1.15rem;
    margin: 0 0 8px;
`;

const Summary = styled.p`
    color: ${MUTED_TEXT};
    margin: 0 0 14px;
    line-height: 1.6;
`;

/* Read more element (Changed from <a> to <span> for A11Y compliance) */
const ReadMore = styled.span`
    display:inline-flex;
    align-items:center;
    gap:8px;
    padding: 9px 14px;
    background: linear-gradient(90deg, ${NEON}, ${ACCENT});
    color: ${MID_NAVY};
    border-radius: 10px;
    font-weight: 700;
    text-decoration: none;
    box-shadow: 0 10px 32px rgba(0,224,179,0.12);
    transition: transform .16s ease;
    cursor: pointer; /* Added cursor pointer */
    &:hover { transform: translateY(-3px); }
`;

/* Footer */
const Footer = styled.footer`
    padding: 36px 20px;
    text-align:center;
    color: ${MUTED_TEXT};
    border-top: 1px solid rgba(255,255,255,0.02);
    margin-top: auto;
`;

/* ---------- COMPONENT ---------- */
const BlogPage = ({ onNavigate = () => {}, posts }) => {
    const canvasRef = useRef(null);
    const rafRef = useRef(null);

    // --- Star Canvas Logic (Simplified into a reusable hook pattern) ---
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: true });

        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const stars = Array.from({ length: 160 }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            baseR: 0.6 + Math.random() * 1.6,
            dx: (Math.random() - 0.5) * 0.35,
            dy: 0.2 + Math.random() * 0.6,
            alpha: 0.4 + Math.random() * 0.6,
            twSpeed: 0.002 + Math.random() * 0.01,
            twPhase: Math.random() * Math.PI * 2,
            glowStrength: 3 + Math.random() * 5,
        }));

        const orbs = Array.from({ length: 6 }, (_, i) => ({
            x: Math.random() * width,
            y: Math.random() * height * 0.6,
            radius: 60 + Math.random() * 120,
            vx: (Math.random() - 0.5) * 0.15,
            vy: (Math.random() - 0.5) * 0.08,
            color: i % 2 === 0 ? 'rgba(0,224,179,0.06)' : 'rgba(98,0,255,0.04)'
        }));

        let meteors = [];
        function spawnMeteor() {
            const startX = Math.random() < 0.5 ? -50 : width + 50;
            const startY = Math.random() * height * 0.5;
            const dir = startX < 0 ? 1 : -1;
            meteors.push({
                x: startX,
                y: startY,
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

        function draw() {
            ctx.clearRect(0, 0, width, height);

            const gBg = ctx.createLinearGradient(0, 0, 0, height);
            gBg.addColorStop(0, '#071025');
            gBg.addColorStop(1, '#02040a');
            ctx.fillStyle = gBg;
            ctx.fillRect(0, 0, width, height);

            orbs.forEach((orb) => {
                orb.x += orb.vx;
                orb.y += orb.vy;
                if (orb.x < -200) orb.x = width + 200;
                if (orb.x > width + 200) orb.x = -200;
                if (orb.y < -200) orb.y = height + 200;
                if (orb.y > height + 200) orb.y = -200;

                const g = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
                g.addColorStop(0, orb.color);
                g.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.globalCompositeOperation = 'lighter';
                ctx.fillStyle = g;
                ctx.beginPath();
                ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.closePath();
                ctx.globalCompositeOperation = 'source-over';
            });

            stars.forEach((s) => {
                s.twPhase += s.twSpeed;
                const tw = 0.5 + Math.sin(s.twPhase) * 0.5;
                const radius = s.baseR * (0.8 + tw * 1.5);
                const glowR = radius * s.glowStrength;

                s.x += s.dx;
                s.y += s.dy;
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
                ctx.beginPath();
                ctx.arc(s.x, s.y, glowR, 0, Math.PI * 2);
                ctx.fill();
                ctx.closePath();

                ctx.fillStyle = `rgba(255,255,255,${0.95 * s.alpha})`;
                ctx.beginPath();
                ctx.arc(s.x, s.y, radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.closePath();

                ctx.globalCompositeOperation = 'source-over';
            });

            meteorTimer += 1;
            if (meteorTimer > meteorIntervalBase + Math.random() * 600) {
                spawnMeteor();
                meteorTimer = 0;
            }
            meteors = meteors.filter(m => m.life < m.maxLife);
            meteors.forEach((m) => {
                ctx.globalCompositeOperation = 'lighter';
                const trailGrad = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * m.length, m.y - m.vy * m.length);
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
                ctx.beginPath();
                ctx.arc(m.x, m.y, 2.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.closePath();
                ctx.globalCompositeOperation = 'source-over';

                m.x += m.vx;
                m.y += m.vy;
                m.life++;
            });

            rafRef.current = requestAnimationFrame(draw);
        }

        draw();

        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener('resize', onResize);
        };
    }, []);

    // keep original content structure, default posts when none passed
    const getPostsData = () => {
        if (posts && posts.length > 0) return posts;
        return [
            {
                _id: '1',
                title: 'Grand Inauguration: A Step Towards a Digital Future',
                summary: 'Exciting insights from the grand launch of NEXORA, marking our journey into innovative technology solutions.',
                author: 'NEXORA Admin',
                date: '2025-11-09T00:00:00.000Z',
                headerImage: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop'
            },
            {
                _id: '2',
                title: '5 Web Development Trends for 2025',
                summary: 'Stay ahead of the curve with our expert predictions on the evolving landscape of web development.',
                author: 'Tech Guru',
                date: '2025-11-01T00:00:00.000Z',
                headerImage: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop'
            },
            {
                _id: '3',
                title: 'The Rise of AI in Content Creation',
                summary: 'Explore how artificial intelligence is revolutionizing content strategies and production workflows.',
                author: 'AI Insights',
                date: '2025-10-15T00:00:00.000Z',
                headerImage: 'https://images.unsplash.com/photo-1558229987-9b7e7161b9e2?q=80&w=1974&auto=format&fit=crop'
            }
        ];
    };

    const safePosts = getPostsData();

    return (
        <>
            <GlobalStyle />
            <StarCanvas ref={canvasRef} />

            <Page>
                <Header>
                    <Logo onClick={() => onNavigate('home')} className="neon-text-shadow">NEXORA</Logo>
                    <Nav>
                        {/* FIX: Replaced problematic <a> tags with <span> or custom elements */}
                        <span onClick={() => onNavigate('home')}>Home</span>
                        <span onClick={() => onNavigate('about')}>About</span>
                        <span onClick={() => onNavigate('services')}>Services</span>
                        <span onClick={() => onNavigate('projects')}>Projects</span>
                        <span className="active" onClick={() => onNavigate('blog')}>Blog</span>
                        <span onClick={() => onNavigate('contact')}>Contact</span>
                    </Nav>
                </Header>

                <Intro className="animate-in" style={{ animationDelay: '0.05s' }}>
                    <IntroTitle>Our <span>Blog</span></IntroTitle>
                    <IntroSubtitle>Updates, insights, and stories from the NEXORA team.</IntroSubtitle>
                </Intro>

                <PostGrid>
                    {safePosts.map((post, idx) => (
                        <PostCard key={post._id} className="animate-in" style={{ animationDelay: `${0.12 * idx + 0.25}s` }}>
                            <ImageWrapper>
                                <PostImage src={post.headerImage} alt={post.title} />
                            </ImageWrapper>

                            <CardBody>
                                <Meta>
                                    <span>By {post.author}</span>
                                    <span>
                                        <FontAwesomeIcon icon={faCalendarAlt} />
                                        {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </span>
                                </Meta>

                                <Title>{post.title}</Title>
                                <Summary>{post.summary}</Summary>

                                {/* FIX: Replaced <ReadMore href="#"> with functional onClick and removed e.preventDefault() */}
                                <ReadMore onClick={() => onNavigate(`blog/${post._id}`)}>
                                    Read More →
                                </ReadMore>
                            </CardBody>
                        </PostCard>
                    ))}
                </PostGrid>

                <Footer>
                    &copy; 2025 Crafted with care by NEXORA Team, JJ College.
                </Footer>
            </Page>
        </>
    );
};

export default BlogPage;