// src/components/BlogPage.jsx
import React, { useEffect, useRef, useState } from 'react';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt,
  faMapMarkerAlt,
  faPhone,
  faEnvelope as faEnvelopeSolid,
  faBars,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faLinkedin, faWhatsapp, faYoutube } from '@fortawesome/free-brands-svg-icons';

/* =========================
   THEME CONSTANTS
   ========================= */
const NAVY = '#123165';
const GOLD = '#D4A937';
const ACCENT = '#0b3b58';
const BG_WHITE = '#FFFFFF';
const LIGHT_TEXT = '#111827';
const MUTED_TEXT = '#6B7280';
const BORDER = '#e2e8f0';

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
    background: ${BG_WHITE}; /* Permanent pure white background */
    color: ${LIGHT_TEXT};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }

  /* ensure no default background on html elements */
  * { background-repeat: no-repeat; }
`;

/* =========================
   STAR CANVAS — sits behind content
   (kept — draws gold stars on top of pure white)
   ========================= */
const StarCanvas = styled.canvas`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
  background: transparent; /* transparent so the page remains pure white */
`;

/* =========================
   LAYOUT & HEADER
   ========================= */
const Page = styled.div`
  position: relative;
  z-index: 2;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${BG_WHITE}; /* Page layer solid white */
`;

/* Header: switched to solid white (no glass/transparency) */
const Header = styled.header`
  display: flex;
  align-items: center;
  gap: 40px;
  padding: 14px 48px;
  position: sticky;
  top: 0;
  width: 100%;
  background: ${BG_WHITE}; /* solid white */
  border-bottom: 1px solid ${BORDER};
  z-index: 1000;
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
  gap: 0px;
  @media (max-width: 480px) { font-size: 1.5rem; }
`;
const LogoN = styled.span` color: ${NAVY}; `;
const LogoCrew = styled.span` color: ${GOLD}; `;

const NavGroup = styled.nav`
  display: flex;
  gap: 22px;
  align-items: center;
  margin-right: auto;

  span.navItem {
    color: ${MUTED_TEXT};
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

  span.navItem:hover { color: ${NAVY}; }

  span.navItem::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -2px;
    width: 0;
    height: 2px;
    background: ${GOLD};
    transition: 0.3s;
    border-radius: 4px;
  }
  span.navItem:hover::after { width: 100%; }

  span.navItem.active { color: ${NAVY}; font-weight: 600; }

  @media (max-width: 1024px) { display: none; }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${NAVY};
  font-size: 1.5rem;
  cursor: pointer;
  @media (max-width: 1024px) { display: block; }
`;

const MobileNavMenu = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: ${BG_WHITE};
  z-index: 1100;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 80px;
  transform: translateX(${props => (props.$isOpen ? '0' : '100%')});
  transition: transform 0.3s ease-in-out;
  box-shadow: -4px 0 20px rgba(15,23,42,0.08);

  .close-btn {
    position: absolute;
    top: 20px; right: 20px;
    background: none;
    border: none;
    color: ${LIGHT_TEXT};
    font-size: 2rem;
    cursor: pointer;
  }

  span {
    font-size: 1.3rem;
    margin: 15px 0;
    cursor: pointer;
    color: ${MUTED_TEXT};
    &:hover { color: ${NAVY}; }
  }
`;

/* =========================
   BLOG CONTENT STYLES
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
  font-weight: 800;
  span { color: ${GOLD}; }
  @media (max-width: 768px) { font-size: 1.9rem; }
`;
const IntroSubtitle = styled.p`
  color: ${MUTED_TEXT};
  margin: 6px 0 0;
  max-width: 820px;
  margin-left: auto;
  margin-right: auto;
  font-size: 1.1rem;
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
  box-shadow: 0 10px 30px rgba(15,23,42,0.04);
  transition: transform .28s ease, box-shadow .28s ease, border-color .28s ease;
  transform-origin: center;
  animation: ${fadeUp} 0.6s ease forwards;
  opacity: 0;
  margin: 0;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 30px 50px rgba(15,23,42,0.08);
    border-color: ${GOLD};
  }

  @media (max-width: 480px) { max-width: 320px; }
`;

const ImageWrapper = styled.div`
  width: 100%;
  aspect-ratio: 16 / 9;
  position: relative;
  background: ${ACCENT};
  overflow: hidden;
  border-bottom: 1px solid ${BORDER};
`;
const PostImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.45s ease;
  &:hover { transform: scale(1.05); }
`;

const CardBody = styled.div` padding: 18px 20px 22px; `;
const Meta = styled.div`
  display:flex;
  justify-content:space-between;
  align-items:center;
  color: ${MUTED_TEXT};
  font-size: 0.85rem;
  margin-bottom: 10px;
  svg { color: ${NAVY}; margin-right: 6px; }
`;
const Title = styled.h3` color: ${LIGHT_TEXT}; font-size: 1.2rem; font-weight: 700; margin: 0 0 8px; `;
const Summary = styled.p` color: ${MUTED_TEXT}; margin: 0 0 14px; line-height: 1.6; font-size: 0.95rem;`;
const ReadMore = styled.span`
  display:inline-flex;
  align-items:center;
  gap:8px;
  padding: 8px 16px;
  background: linear-gradient(135deg, ${NAVY}, ${ACCENT});
  color: #fff;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: transform .12s ease, box-shadow .12s ease;
  box-shadow: 0 6px 14px rgba(18,49,101,0.2);
  &:hover { transform: translateY(-2px); box-shadow: 0 10px 24px rgba(18,49,101,0.3); }
`;

/* =========================
   FOOTER
   ========================= */
const FooterWrap = styled.footer`
  padding: 60px 20px;
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
    gap: 40px;
  }
`;

const FooterCol = styled.div`
  h4 {
    color: ${LIGHT_TEXT};
    font-size: 1.1rem;
    margin-bottom: 20px;
    font-weight: 700;
    position: relative;
    display: inline-block;
  }
  h4:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -5px;
    width: 30px;
    height: 2px;
    background: ${GOLD};
  }
`;

const FooterBrandTitle = styled.div`
  font-weight: 800;
  font-size: 1.5rem;
  color: ${NAVY};
  display: inline-flex;
  align-items: center;
  gap: 0;
  margin-bottom: 15px;
`;

const SocialRow = styled.div`
  display:flex;
  gap: 12px;
  align-items:center;
  margin-top: 20px;
`;

const SocialIcon = styled.a`
  display:inline-flex;
  align-items:center;
  justify-content:center;
  width:36px;
  height:36px;
  border-radius:50%;
  background: #fff;
  border: 1px solid ${BORDER};
  color: ${NAVY};
  transition: all 0.3s ease;
  &:hover { 
    background: ${NAVY}; 
    color: #fff; 
    border-color: ${NAVY};
    transform: translateY(-3px);
  }
`;

const FooterList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  li { margin-bottom: 10px; }
  li a {
    color: ${MUTED_TEXT};
    text-decoration: none;
    font-size: 0.95rem;
    transition: color 0.2s;
    cursor: pointer;
  }
  li a:hover { color: ${NAVY}; }
`;

const ContactInfo = styled.div`
  display:flex;
  flex-direction:column;
  gap: 15px;
  font-size: 0.95rem;

  div.item { display:flex; gap:12px; align-items:flex-start; }
  svg { color: ${GOLD}; margin-top: 4px; }
  strong { color: ${NAVY}; display:block; font-weight:600; }
`;

/* =========================
   COMPONENT
   ========================= */
const BlogPage = ({ onNavigate = () => {}, posts }) => {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems =['home', 'about', 'services', 'projects', 'team', 'progress', 'blog', 'contact'];

  // CANVAS: Gold stars (kept) — canvas is transparent so page is permanently white
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });

    // DPR handling for crispness
    const DPR = Math.max(1, window.devicePixelRatio || 1);
    function resize() {
      canvas.width = Math.floor(window.innerWidth * DPR);
      canvas.height = Math.floor(window.innerHeight * DPR);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    resize();

    let width = window.innerWidth;
    let height = window.innerHeight;

    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      baseR: 0.6 + Math.random() * 1.6,
      dx: (Math.random() - 0.5) * 0.35,
      dy: 0.2 + Math.random() * 0.6,
      alpha: 0.2 + Math.random() * 0.6,
    }));

    function onResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      resize();
    }
    window.addEventListener('resize', onResize);

    function draw() {
      ctx.clearRect(0, 0, width, height);
      // Only draw gold points — canvas background left transparent so white page shows through
      stars.forEach((s) => {
        s.x += s.dx;
        s.y += s.dy;
        if (s.y > height + 10) s.y = -10;
        if (s.x > width + 10) s.x = -10;
        if (s.x < -10) s.x = width + 10;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.baseR, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 169, 55, ${s.alpha})`; // GOLD
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

  // --- MOCK DATA ---
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

  const handleNavigation = (route) => {
    onNavigate(route);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <GlobalStyle />
      <StarCanvas ref={canvasRef} />

      <Page>
        {/* HEADER */}
        <Header>
          <Logo onClick={() => handleNavigation('home')}>
            <LogoN>NEXORA</LogoN>
            <LogoCrew>CREW</LogoCrew>
          </Logo>

          <NavGroup>
            {navItems.map((item) => (
              <span
                key={item}
                className={`navItem ${item === 'blog' ? 'active' : ''}`}
                onClick={() => handleNavigation(item)}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </span>
            ))}
          </NavGroup>

          <MobileMenuButton onClick={() => setIsMobileMenuOpen(true)} aria-label="Open menu">
            <FontAwesomeIcon icon={faBars} />
          </MobileMenuButton>
        </Header>

        {/* MOBILE MENU */}
        <MobileNavMenu $isOpen={isMobileMenuOpen}>
          <button className="close-btn" onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu">
            <FontAwesomeIcon icon={faTimes} />
          </button>

          {navItems.map((item) => (
            <span
              key={`mob-${item}`}
              onClick={() => handleNavigation(item)}
              style={item === 'blog' ? { color: NAVY } : {}}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </span>
          ))}
        </MobileNavMenu>

        {/* MAIN CONTENT */}
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
                  <span>{post.author}</span>
                  <span>
                    <FontAwesomeIcon icon={faCalendarAlt} />
                    {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </Meta>

                <Title>{post.title}</Title>
                <Summary>{post.summary}</Summary>

                <ReadMore onClick={() => handleNavigation(`blog/${post._id}`)}>
                  Read More →
                </ReadMore>
              </CardBody>
            </PostCard>
          ))}
        </PostGrid>

        {/* FOOTER */}
        <FooterWrap>
          <FooterInner>
            <FooterCol>
              <FooterBrandTitle>
                <LogoN>NEXORA</LogoN>
                <LogoCrew>CREW</LogoCrew>
              </FooterBrandTitle>
              <div style={{ maxWidth: 360, color: MUTED_TEXT, lineHeight: 1.6 }}>
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
            </FooterCol>

            <FooterCol>
              <h4>Quick Links</h4>
              <FooterList>
                {navItems.slice(0, 6).map(item => (
                   <li key={item}><a onClick={() => handleNavigation(item)}>{item.charAt(0).toUpperCase() + item.slice(1)}</a></li>
                ))}
              </FooterList>
            </FooterCol>

            <FooterCol>
              <h4>Services</h4>
              <FooterList>
                <li>Web Development</li>
                <li>Poster designing & logo making</li>
                <li>Content creation</li>
                <li>Digital marketing & SEO</li>
                <li>AI and automation</li>
                <li>Hosting & Support</li>
              </FooterList>
            </FooterCol>

            <FooterCol>
              <h4>Contact Info</h4>
              <ContactInfo>
                <div className="item">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                  <div>
                    <strong>JJCET</strong>
                    <div style={{ color: MUTED_TEXT }}>Palakarai, Tiruchirappalli</div>
                  </div>
                </div>
                <div className="item">
                  <FontAwesomeIcon icon={faEnvelopeSolid} />
                  <div>
                    <strong>Email</strong>
                    <div style={{ color: MUTED_TEXT }}>nexoracrew@email.com</div>
                  </div>
                </div>
                <div className="item">
                  <FontAwesomeIcon icon={faPhone} />
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
