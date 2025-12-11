// src/components/BlogPage.jsx
import React, { useEffect, useRef, useState } from 'react';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

// THEME
const NAVY = '#012a4a';
const GOLD = '#d4af37';
const ACCENT = '#0b3b58';
const BG_WHITE = '#ffffff';
const LIGHT_TEXT = '#0f2640';
const MUTED_TEXT = '#6f7b86';
const BORDER = 'rgba(1,42,74,0.08)';

// KEYFRAMES & GLOBAL
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: translateY(0); }
`;

const GlobalStyle = createGlobalStyle`
  html, body, #root { height: 100%; background: ${BG_WHITE}; }
  body {
    margin: 0;
    font-family: 'Poppins', sans-serif;
    background: ${BG_WHITE};
    color: ${LIGHT_TEXT};
    -webkit-font-smoothing:antialiased;
    -moz-osx-font-smoothing:grayscale;
    overflow-x: hidden;
  }

  /* hide the canvas visual — canvas logic is still present but hidden */
  canvas { display: none; }
`;

/* ---------- (hidden) star canvas kept for potential future use ---------- */
const StarCanvas = styled.canvas`
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  display: none;
`;

/* LAYOUT */
const Page = styled.div`
  position: relative;
  z-index: 2;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

/* Header */
const Header = styled.header`
  display: flex;
  align-items: center;
  gap: 28px;
  padding: 14px 48px;
  position: sticky;
  top: 0;
  width: 100%;
  background: ${BG_WHITE};
  border-bottom: 1px solid rgba(2,36,60,0.04);
  z-index: 10;

  @media (max-width: 768px) {
    padding: 12px 20px;
    gap: 18px;
    flex-wrap: wrap;
  }
`;

/* Logo (NEXORA navy + CREW gold) */
const Logo = styled.h1`
  margin: 0;
  font-weight: 900;
  font-size: 1.6rem;
  cursor: pointer;
  letter-spacing: 0.0px;
  display: inline-flex;
  align-items: center;
  gap: 0px;
`;
const LogoN = styled.span` color: ${NAVY}; `;
const LogoCrew = styled.span` color: ${GOLD}; `;

/* Nav */
const NavGroup = styled.nav`
  display:flex;
  gap: 20px;
  align-items:center;
  margin-right:auto;

  span.navItem {
    color: ${MUTED_TEXT};
    font-weight: 600;
    cursor: pointer;
    position: relative;
    padding: 6px 6px;
    transition: color 0.2s ease, transform 0.12s ease;
    border-radius: 6px;
    font-size: 0.95rem;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  span.navItem:hover { color: ${NAVY}; transform: translateY(-1px); }
  span.navItem.active { color: ${NAVY}; font-weight: 700; }

  /* subtle hover underline */
  span.navItem::after{
    content: '';
    position: absolute;
    left: 12%;
    bottom: -6px;
    width: 0;
    height: 3px;
    background: ${GOLD};
    transition: width .22s ease;
    border-radius: 4px;
  }
  span.navItem:hover::after { width: 76%; }

  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 12px;
  }
`;

/* Progress text control (clickable) — no percentage line, only the word "Progress" */
const NavProgressText = styled.button`
  background: transparent;
  border: 0;
  color: ${NAVY};
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  padding: 6px 8px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;

  &:hover {
    background: rgba(1,42,74,0.03);
    transform: translateY(-1px);
  }

  &:focus {
    outline: 2px solid rgba(1,42,74,0.08);
    box-shadow: 0 2px 8px rgba(1,42,74,0.06);
  }
`;

/* Intro */
const Intro = styled.section`
  padding: 84px 20px 20px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  z-index: 3;
  text-align: center;
  animation: ${fadeUp} 0.5s ease forwards;
  opacity: 0;
`;
const IntroTitle = styled.h2`
  font-size: 2.4rem;
  margin: 0 0 8px;
  color: ${NAVY};
  span { color: ${GOLD}; }
  @media (max-width: 768px) { font-size: 1.9rem; }
`;
const IntroSubtitle = styled.p`
  color: ${MUTED_TEXT};
  margin: 6px 0 0;
  max-width: 820px;
  margin-left: auto;
  margin-right: auto;
`;

/* Grid & Card */
const PostGrid = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 36px auto 80px;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 28px;
  z-index: 3;
  justify-items: center;
`;

const PostCard = styled.article`
  width: 100%;
  max-width: 360px;
  background: ${BG_WHITE};
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid ${BORDER};
  box-shadow: 0 10px 30px rgba(2,6,23,0.04);
  transition: transform .28s ease, box-shadow .28s ease, border-color .28s ease;
  transform-origin: center;
  animation: ${fadeUp} 0.6s ease forwards;
  opacity: 0;
  margin: 0;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 30px 50px rgba(2,36,60,0.06);
    border-color: ${GOLD};
  }

  @media (max-width: 480px) { max-width: 320px; }
`;

const ImageWrapper = styled.div`
  width: 100%;
  aspect-ratio: 9 / 16;
  position: relative;
  background: ${ACCENT};
  overflow: hidden;
  border-bottom: 1px solid rgba(2,36,60,0.04);
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
  &:hover { transform: scale(1.03); }
`;

/* Content */
const CardBody = styled.div` padding: 18px 20px 22px; `;
const Meta = styled.div`
  display:flex;
  justify-content:space-between;
  align-items:center;
  color: ${MUTED_TEXT};
  font-size: 0.9rem;
  margin-bottom: 10px;
  svg { color: ${NAVY}; margin-right: 8px; }
`;
const Title = styled.h3` color: ${NAVY}; font-size: 1.15rem; margin: 0 0 8px; `;
const Summary = styled.p` color: ${MUTED_TEXT}; margin: 0 0 14px; line-height: 1.6; `;
const ReadMore = styled.span`
  display:inline-flex;
  align-items:center;
  gap:8px;
  padding: 9px 14px;
  background: linear-gradient(90deg, ${GOLD}, ${ACCENT});
  color: ${NAVY};
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: transform .12s ease, box-shadow .12s ease;
  box-shadow: 0 6px 14px rgba(2,36,60,0.04);
  &:hover { transform: translateY(-3px); box-shadow: 0 10px 24px rgba(2,36,60,0.06); }
`;

/* Footer */
const Footer = styled.footer`
  padding: 36px 20px;
  text-align:center;
  color: ${MUTED_TEXT};
  border-top: 1px solid rgba(2,36,60,0.02);
  margin-top: auto;
`;

/* COMPONENT */
const BlogPage = ({ onNavigate = () => {}, posts }) => {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  // purely visual progress percentage can be set or derived later
  const [progressPct] = useState(68);

  // KEEP canvas animation logic (canvas is hidden by CSS)
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

        ctx.fillStyle = 'rgba(255,255,255,1)';
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

  // posts fallback
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

  const safePosts = (getPostsData() || []).slice().sort((a, b) => {
    const da = a && a.date ? new Date(a.date).getTime() : 0;
    const db = b && b.date ? new Date(b.date).getTime() : 0;
    return da - db;
  });

  return (
    <>
      <GlobalStyle />
      <StarCanvas ref={canvasRef} />

      <Page>
        <Header>
          <Logo onClick={() => onNavigate('home')}>
            <LogoN>NEXORA</LogoN>
            <LogoCrew>CREW</LogoCrew>
          </Logo>

          <NavGroup>
            <span className="navItem" onClick={() => onNavigate('home')}>Home</span>
            <span className="navItem" onClick={() => onNavigate('about')}>About</span>
            <span className="navItem" onClick={() => onNavigate('services')}>Services</span>
            <span className="navItem" onClick={() => onNavigate('projects')}>Projects</span>
            <span className="navItem active" onClick={() => onNavigate('blog')} style={{ color: NAVY }}>Blog</span>

            {/* Team nav item */}
            <span className="navItem" onClick={() => onNavigate('team')}>Team</span>

            {/* Progress word (clickable) - no percentage/line */}
            <NavProgressText onClick={() => onNavigate('progress')} aria-label="Open progress page">
              Progress
            </NavProgressText>

            <span className="navItem" onClick={() => onNavigate('contact')}>Contact</span>
          </NavGroup>
        </Header>

        <Intro>
          <IntroTitle>Our <span>Blog</span></IntroTitle>
          <IntroSubtitle>Updates, insights, and stories from the NEXORACREW team.</IntroSubtitle>
        </Intro>

        <PostGrid>
          {safePosts.map((post, idx) => (
            <PostCard key={post._id} style={{ animationDelay: `${0.12 * idx + 0.12}s` }}>
              <ImageWrapper>
                <PostImage src={post.headerImage} alt={post.title} width="1080" height="1920" />
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

                <ReadMore onClick={() => onNavigate(`blog/${post._id}`)}>
                  Read More →
                </ReadMore>
              </CardBody>
            </PostCard>
          ))}
        </PostGrid>

        <Footer>
          &copy; NEXORACREW Team, Palakarai, Tiruchirappalli, Tamil Nadu
        </Footer>
      </Page>
    </>
  );
};

export default BlogPage;
