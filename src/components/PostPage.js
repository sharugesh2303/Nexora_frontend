// src/components/PostPage.jsx
import React, { useEffect, useRef, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
  faBars,
  faTimes,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import {
  faInstagram,
  faLinkedinIn,
  faWhatsapp,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

/* THEME CONSTANTS */
const NEON_COLOR = "#123165";
const GOLD_ACCENT = "#D4A937";
const TEXT_LIGHT = "#111827";
const TEXT_MUTED = "#6B7280";
const BORDER_LIGHT = "rgba(15,23,42,0.08)";

/* ANIMATIONS */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: translateY(0); }
`;

/* GLOBAL STYLE */
const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    overflow-x: hidden;
    font-family: 'Poppins', sans-serif;

    /* GLOW BACKGROUND */
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

/* STAR CANVAS */
const StarCanvas = styled.canvas`
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
`;

/* Styled FA icon */
const FAIcon = styled(FontAwesomeIcon)`
  color: ${GOLD_ACCENT};
  display: inline-block;
  vertical-align: middle;
`;

/* LAYOUT */
const Page = styled.div`
  position: relative;
  z-index: 1;
  min-height: 100vh;
  width: 100%;
  max-width: 100vw;
  background: transparent;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
`;

/* HEADER */
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
  z-index: 1100;
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

/* MOBILE MENU BUTTON - NEON COLOR */
const MobileMenuButton = styled.button`
  display: none;
  @media (max-width: 1024px) {
    display: block;
    background: none;
    border: none;
    color: ${NEON_COLOR}; /* Neon Blue for Hamburger */
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
  background: #ffffff;
  z-index: 1200;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 80px;
  transform: translateX(${(p) => (p.isOpen ? "0" : "100%")});
  transition: transform 0.28s ease-in-out;
  box-shadow: -4px 0 20px rgba(15, 23, 42, 0.12);

  .close-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    background: none;
    border: none;
    font-size: 2rem;
    cursor: pointer;
    color: ${TEXT_LIGHT};
  }
  span {
    font-size: 1.3rem;
    margin: 14px 0;
    color: ${TEXT_MUTED};
    cursor: pointer;
  }
`;

/* --- POST SPECIFIC COMPONENTS --- */

const ArticleContainer = styled.article`
  width: 100%;
  max-width: 950px;
  margin: 0 auto;
  padding: 60px 20px 100px;
  animation: ${fadeUp} 0.6s ease forwards;
  box-sizing: border-box;
`;

const PostHeader = styled.div`
  margin-bottom: 40px;
  text-align: left;
`;

const PostImageWrap = styled.div`
  width: 100%;
  max-height: 60vh;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 32px;
  box-shadow: 0 10px 40px rgba(15,23,42,0.06);
  border: 1px solid ${BORDER_LIGHT};
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HeaderImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const PostTitle = styled.h1`
  font-size: 2.8rem;
  color: ${NEON_COLOR};
  font-weight: 800;
  margin: 0 0 16px 0;
  line-height: 1.15;
  @media (max-width: 768px) { font-size: 2rem; }
`;

const PostMeta = styled.div`
  display: flex;
  gap: 20px;
  color: ${TEXT_MUTED};
  font-size: 0.95rem;
  align-items: center;
  border-bottom: 1px solid ${BORDER_LIGHT};
  padding-bottom: 24px;
  margin-bottom: 32px;

  span {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
`;

/* CONTENT BOX */
const ContentBox = styled.div`
  margin-top: 20px;
  background: #fff;
  border-radius: 12px;
  padding: 40px 48px;
  border: 1px solid ${BORDER_LIGHT};
  box-shadow: 0 8px 24px rgba(2,6,23,0.03);
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;

  /* Corner accent similar to Project Detail Page */
  &::before {
    content: '';
    position: absolute;
    top: -1px;
    left: -1px;
    width: 24px;
    height: 24px;
    border-top: 3px solid ${GOLD_ACCENT};
    border-left: 3px solid ${GOLD_ACCENT};
    border-top-left-radius: 12px;
  }

  &:hover {
    box-shadow: 0 20px 50px rgba(18, 49, 101, 0.08);
    transform: translateY(-3px);
  }

  /* Typography within the box */
  color: ${TEXT_LIGHT};
  line-height: 1.9;
  font-size: 1.1rem;
  white-space: pre-wrap;

  p { margin-bottom: 24px; color: #374151; }
  h2 { margin: 40px 0 16px; color: ${NEON_COLOR}; font-size: 1.8rem; font-weight: 700; border-bottom: 1px solid ${BORDER_LIGHT}; padding-bottom: 8px; }
  h3 { margin: 30px 0 14px; color: ${NEON_COLOR}; font-size: 1.4rem; font-weight: 600; }
  ul, ol { margin-bottom: 24px; padding-left: 20px; color: #374151; }
  li { margin-bottom: 10px; padding-left: 6px; }
  a { color: ${GOLD_ACCENT}; text-decoration: underline; font-weight: 500; }
  
  blockquote {
    border-left: 4px solid ${GOLD_ACCENT};
    background: linear-gradient(90deg, rgba(212,169,55,0.08), transparent);
    padding: 20px 24px;
    border-radius: 0 8px 8px 0;
    font-style: italic;
    color: ${NEON_COLOR};
    margin: 30px 0;
    font-weight: 500;
  }

  @media (max-width: 768px) {
    padding: 24px 20px;
    font-size: 1rem;
  }
`;

/* FOOTER */
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

/* --- COMPONENT LOGIC --- */

const PostPage = ({ onNavigate = () => {}, posts, generalData = {} }) => {
  const { id } = useParams();
  const canvasRef = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navItems = ['home', 'about', 'services', 'projects', 'team', 'progress', 'blog', 'certificate', 'contact'];

  const safeGeneralData = {
    email: generalData?.email || 'nexora.crew@gmail.com',
    phone: generalData?.phone || '+91 95976 46460',
    location: generalData?.location || 'JJ College of Engineering, Trichy',
  };

  /* STAR CANVAS EFFECT */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });

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
    window.addEventListener("resize", onWindowResize);

    let rafId = 0;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (let s of stars) {
        s.x += s.dx;
        s.y += s.dy;
        if (s.y > height + 10) s.y = -10;
        if (s.x > width + 10) s.x = -10;
        if (s.x < -10) s.x = width + 10;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212,169,55,${s.alpha})`;
        ctx.fill();
      }
      rafId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onWindowResize);
    };
  }, []);

  const handleNavigation = (route) => {
    onNavigate(route);
    setIsMobileMenuOpen(false);
  };

  /* DATA FETCHING LOGIC */
  const safePosts = posts || [];
  const post = safePosts.find(p => p._id === id);

  if (!posts || posts.length === 0) {
    return (
      <>
        <GlobalStyle />
        <StarCanvas ref={canvasRef} />
        <div style={{ paddingTop: 140, textAlign: 'center', color: TEXT_MUTED }}>
           <h2>Loading Post...</h2>
        </div>
      </>
    );
  }

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <>
      <GlobalStyle />
      <StarCanvas ref={canvasRef} />

      <Page>
        {/* HEADER */}
        <Header>
          <Logo onClick={() => handleNavigation("home")}>
            NEXORA<span className="gold">CREW</span>
          </Logo>

          <NavGroup>
            {navItems.map((item) => (
              <span
                key={item}
                className={`navItem ${item === "blog" ? "active" : ""}`}
                onClick={() => handleNavigation(item)}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </span>
            ))}
          </NavGroup>

          {/* Mobile Menu Button - Neon Color */}
          <MobileMenuButton onClick={() => setIsMobileMenuOpen(true)} aria-label="Open menu">
            <FAIcon icon={faBars} style={{ color: NEON_COLOR }} />
          </MobileMenuButton>
        </Header>

        <MobileNavMenu isOpen={isMobileMenuOpen}>
          <button className="close-btn" onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu">
            <FAIcon icon={faTimes} style={{ color: TEXT_LIGHT }} />
          </button>
          {navItems.map((item) => (
            <span key={`mob-${item}`} onClick={() => handleNavigation(item)} style={item === "blog" ? { color: NEON_COLOR } : {}}>
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </span>
          ))}
        </MobileNavMenu>

        <ArticleContainer>
          <PostHeader>
            <PostTitle>{post.title}</PostTitle>
            <PostMeta>
              <span>
                <FAIcon icon={faUser} />
                {post.author}
              </span>
              <span>
                <FAIcon icon={faCalendarAlt} />
                {new Date(post.date).toLocaleDateString("en-US", {
                    year: 'numeric', month: 'long', day: 'numeric'
                })}
              </span>
            </PostMeta>

            {post.headerImage && (
                <PostImageWrap>
                    <HeaderImage src={post.headerImage} alt={post.title} />
                </PostImageWrap>
            )}
          </PostHeader>

          {/* New Boxed Content */}
          <ContentBox>
             {post.content}
          </ContentBox>
        </ArticleContainer>

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
                    <FAIcon icon={faMapMarkerAlt} style={{ color: GOLD_ACCENT }} /> Palakarai,Trichy.
                  </a>
                </li>
                <li>
                  <a href={`mailto:${safeGeneralData.email}`}>
                    <FAIcon icon={faEnvelope} style={{ color: GOLD_ACCENT }} /> {safeGeneralData.email}
                  </a>
                </li>
                <li>
                  <a href={`tel:${safeGeneralData.phone}`}>
                    <FAIcon icon={faPhone} style={{ color: GOLD_ACCENT }} /> +91 9597646460
                  </a>
                </li>
              </ul>
            </FooterColumn>
          </FooterGrid>

          <Copyright>
            © 2025 Nexoracrew. All Rights Reserved.
          </Copyright>
        </FullFooter>
      </Page>
    </>
  );
};

export default PostPage;