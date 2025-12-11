// src/components/BlogPage.jsx
import React, { useEffect, useRef, useState } from 'react';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faMapMarkerAlt, faPhone, faEnvelope as faEnvelopeSolid } from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faLinkedin, faWhatsapp, faYoutube } from '@fortawesome/free-brands-svg-icons';

/* =========================
   THEME
   (white background, navy + gold accents)
   ========================= */
const NAVY = '#012a4a';
const GOLD = '#d4af37';
const ACCENT = '#0b3b58';
const BG_WHITE = '#ffffff';
const LIGHT_TEXT = '#0f2640';
const MUTED_TEXT = '#6f7b86';
const BORDER = 'rgba(1,42,74,0.08)';

/* =========================
   ANIMATIONS & GLOBAL STYLES
   ========================= */
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
  canvas { display: none; } /* keep canvas logic but hide visual by default */
`;

/* ---------- (hidden) star canvas (kept for logic parity) ---------- */
const StarCanvas = styled.canvas`
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  display: none;
`;

/* =========================
   LAYOUT & NAV
   ========================= */
const Page = styled.div`
  position: relative;
  z-index: 2;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

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
const LogoCrew = styled.span` color: ${GOLD}; font-weight:900;`;

/* Nav group */
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

/* Progress button (just the word) */
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
  &:hover { background: rgba(1,42,74,0.03); transform: translateY(-1px); }
`;

/* =========================
   HERO / INTRO
   ========================= */
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

/* =========================
   GRID / CARDS
   ========================= */
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

/* =========================
   FOOTER (4-column layout similar to screenshot)
   - NEXORACREW where CREW is gold
   ========================= */
const FooterWrap = styled.footer`
  padding: 40px 20px;
  background: ${BG_WHITE};
  border-top: 1px solid ${BORDER};
  color: ${MUTED_TEXT};
`;

const FooterInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 180px 1fr 220px;
  gap: 28px;
  align-items: start;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const FooterCol = styled.div``;

const FooterBrand = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const FooterBrandTitle = styled.div`
  font-weight: 800;
  font-size: 1.25rem;
  color: ${NAVY};
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

const SocialRow = styled.div`
  display:flex;
  gap: 10px;
  align-items:center;
`;

const SocialIcon = styled.a`
  display:inline-flex;
  align-items:center;
  justify-content:center;
  width:34px;
  height:34px;
  border-radius:8px;
  background: #fff;
  border: 1px solid rgba(2,36,60,0.06);
  color: ${NAVY};
  text-decoration:none;
  font-size: 14px;
  transition: transform .12s ease, box-shadow .12s ease;
  &:hover { transform: translateY(-3px); box-shadow: 0 6px 14px rgba(2,36,60,0.06); }
`;

const FooterList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 8px 0 0 0;
  color: ${MUTED_TEXT};

  li { margin-bottom: 10px; }
  li a {
    color: ${MUTED_TEXT};
    text-decoration: none;
    font-weight: 500;
    cursor: pointer;
  }
  li a:hover { color: ${NAVY}; }
`;

const ServicesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 8px 0 0 0;
  color: ${MUTED_TEXT};
  li { margin-bottom: 8px; font-size: 0.95rem; }
`;

const ContactInfo = styled.div`
  color: ${MUTED_TEXT};
  display:flex;
  flex-direction:column;
  gap:8px;

  div { display:flex; gap:10px; align-items:flex-start; }
  strong { color: ${NAVY}; display:block; margin-bottom:4px; font-weight:700; }
`;

/* =========================
   COMPONENT
   ========================= */
const BlogPage = ({ onNavigate = () => {}, posts }) => {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const [progressPct] = useState(68);

  // canvas drawing logic preserved (canvas hidden via CSS)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      baseR: 0.6 + Math.random() * 1.6,
      dx: (Math.random() - 0.5) * 0.35,
      dy: 0.2 + Math.random() * 0.6,
      alpha: 0.4 + Math.random() * 0.6,
      twSpeed: 0.002 + Math.random() * 0.01,
      twPhase: Math.random() * Math.PI * 2,
    }));

    function onResize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', onResize);

    function draw() {
      ctx.clearRect(0, 0, width, height);
      // subtle background gradient for drawing (won't show because canvas hidden)
      const gBg = ctx.createLinearGradient(0, 0, 0, height);
      gBg.addColorStop(0, '#ffffff');
      gBg.addColorStop(1, '#ffffff');
      ctx.fillStyle = gBg;
      ctx.fillRect(0, 0, width, height);

      stars.forEach((s) => {
        s.x += s.dx;
        s.y += s.dy;
        if (s.y > height + 10) s.y = -10;
        if (s.x > width + 10) s.x = -10;
        if (s.x < -10) s.x = width + 10;
        const r = s.baseR * (0.8 + Math.sin(s.twPhase) * 0.5);
        s.twPhase += s.twSpeed;
        ctx.beginPath();
        ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(1,42,74,${0.08 * s.alpha})`;
        ctx.fill();
      });

      rafRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // fallback posts
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

            <span className="navItem" onClick={() => onNavigate('team')}>Team</span>

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

        {/* Footer: 4-column layout */}
        <FooterWrap>
          <FooterInner>
            {/* Column 1: Brand & short text + social icons */}
            <FooterCol>
              <FooterBrand>
                <FooterBrandTitle>
                  <LogoN>NEXORA</LogoN>
                  <LogoCrew>CREW</LogoCrew>
                </FooterBrandTitle>
                <div style={{ maxWidth: 360, color: MUTED_TEXT }}>
                  Transforming ideas into powerful digital products using modern
                  technology, creativity, and AI.
                </div>

                <SocialRow>
                  <SocialIcon href="#" aria-label="Instagram"><FontAwesomeIcon icon={faInstagram} /></SocialIcon>
                  <SocialIcon href="#" aria-label="LinkedIn"><FontAwesomeIcon icon={faLinkedin} /></SocialIcon>
                  <SocialIcon href="mailto:nexoracrew@email.com" aria-label="Email"><FontAwesomeIcon icon={faEnvelopeSolid} /></SocialIcon>
                  <SocialIcon href="#" aria-label="WhatsApp"><FontAwesomeIcon icon={faWhatsapp} /></SocialIcon>
                  <SocialIcon href="#" aria-label="YouTube"><FontAwesomeIcon icon={faYoutube} /></SocialIcon>
                </SocialRow>
              </FooterBrand>
            </FooterCol>

            {/* Column 2: Quick links */}
            <FooterCol>
              <strong style={{ color: NAVY, display: "block", marginBottom: 8 }}>
                Quick Links
              </strong>
              <FooterList>
                <li><a onClick={() => onNavigate('home')}>Home</a></li>
                <li><a onClick={() => onNavigate('about')}>About</a></li>
                <li><a onClick={() => onNavigate('projects')}>Projects</a></li>
                <li><a onClick={() => onNavigate('team')}>Team</a></li>
                <li><a onClick={() => onNavigate('progress')}>Progress</a></li>
                <li><a onClick={() => onNavigate('blog')}>Blog</a></li>
                <li><a onClick={() => onNavigate('contact')}>Contact</a></li>
              </FooterList>
            </FooterCol>

            {/* Column 3: Services */}
            <FooterCol>
              <strong style={{ color: NAVY, display: "block", marginBottom: 8 }}>
                Services
              </strong>
              <ServicesList>
                <li>Web Development</li>
                <li>Poster designing & logo making</li>
                <li>Content creation</li>
                <li>Digital marketing & SEO</li>
                <li>AI and automation</li>
                <li>Hosting & Support</li>
                <li>Printing & Branding solutions</li>
              </ServicesList>
            </FooterCol>

            {/* Column 4: Contact Info */}
            <FooterCol>
              <strong style={{ color: NAVY, display: "block", marginBottom: 8 }}>
                Contact Info
              </strong>
              <ContactInfo>
                <div>
                  <div style={{ color: GOLD, marginTop: 2 }}><FontAwesomeIcon icon={faMapMarkerAlt} /></div>
                  <div>
                    <strong>JJCET</strong>
                    <div style={{ color: MUTED_TEXT }}>Palakarai, Tiruchirappalli</div>
                  </div>
                </div>

                <div>
                  <div style={{ color: GOLD, marginTop: 2 }}><FontAwesomeIcon icon={faEnvelopeSolid} /></div>
                  <div>
                    <strong>Email</strong>
                    <div style={{ color: MUTED_TEXT }}>nexoracrew@email.com</div>
                  </div>
                </div>

                <div>
                  <div style={{ color: GOLD, marginTop: 2 }}><FontAwesomeIcon icon={faPhone} /></div>
                  <div>
                    <strong>Phone</strong>
                    <div style={{ color: MUTED_TEXT }}>+91 95976 46460</div>
                  </div>
                </div>
              </ContactInfo>
            </FooterCol>
          </FooterInner>
        </FooterWrap>
      </Page>
    </>
  );
};

export default BlogPage;
