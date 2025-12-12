// src/components/ProjectDetailPage.jsx
import React, { useEffect, useRef, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLink,
  faBars,
  faTimes,
  faEnvelope,
  faMapMarkerAlt,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import {
  faInstagram,
  faLinkedinIn,
  faWhatsapp,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

/* =========================================
   THEME CONSTANTS
   ========================================= */
const NEON_COLOR = "#123165"; // primary navy
const TEXT_LIGHT = "#111827";
const TEXT_MUTED = "#6B7280";
const BORDER_LIGHT = "rgba(15,23,42,0.08)";
const GOLD_ACCENT = "#D4A937";

/* =========================================
   KEYFRAMES & GLOBAL
   ========================================= */
const rotateBorder = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

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
  #root { width:100%; }
  *, *::before, *::after { box-sizing: border-box; }

  .animate-in { opacity: 0; transform: translateY(20px); animation: fadeSlide 0.8s ease forwards; }
  @keyframes fadeSlide { to { opacity: 1; transform: translateY(0); } }
`;

/* =========================================
   STAR CANVAS
   ========================================= */
const StarCanvas = styled.canvas`
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
`;

function useStarEffect(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    const DPR = window.devicePixelRatio || 1;

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

    const stars = Array.from({ length: 140 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 1 + Math.random() * 2.2,
      dx: (Math.random() - 0.5) * 0.25,
      dy: 0.08 + Math.random() * 0.35,
      alpha: 0.15 + Math.random() * 0.35,
      pulse: Math.random() * Math.PI * 2,
    }));

    function onResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      resize();
    }
    window.addEventListener("resize", onResize);

    let rafId = null;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      stars.forEach((s) => {
        s.x += s.dx;
        s.y += s.dy;
        s.pulse += 0.02;
        const a = s.alpha * (0.85 + 0.15 * Math.sin(s.pulse));

        if (s.y > height + 10) s.y = -10;
        if (s.x > width + 10) s.x = -10;
        if (s.x < -10) s.x = width + 10;

        // soft glow
        ctx.beginPath();
        ctx.fillStyle = `rgba(212,169,55,${0.18 * a})`;
        ctx.arc(s.x, s.y, s.r * 3.6, 0, Math.PI * 2);
        ctx.fill();

        // core
        ctx.beginPath();
        ctx.fillStyle = `rgba(212,169,55,${0.9 * a})`;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });

      rafId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
  }, [canvasRef]);
}

/* =========================================
   SHARED LAYOUT (HEADER / NAV / FOOTER)
   ========================================= */
const PageWrapper = styled.div`
  position: relative;
  z-index: 1;
  min-height: 100vh;
  width: 100%;
  max-width: 100vw;
  background: transparent;
  overflow-x: hidden;
`;

/* HEADER - MATCHING OTHER PAGES */
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
  background: #ffffff;
  z-index: 1100;
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

/* Project header image and content */
const Container = styled.div`
  position: relative; z-index: 2; max-width:1100px; margin:0 auto; padding: 120px 20px 60px;
`;

const HeaderImageWrap = styled.div`
  position: relative; width:100%; max-height:80vh; display:flex; align-items:center; justify-content:center;
  background: #fff; border-radius:12px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.05); padding:3px;
  &::before {
    content: '';
    position: absolute; top: -50%; left: -50%; width:200%; height:200%;
    background: conic-gradient(
      transparent 0deg,
      transparent 90deg,
      ${GOLD_ACCENT} 130deg,
      ${NEON_COLOR} 180deg,
      ${GOLD_ACCENT} 230deg,
      transparent 270deg
    );
    animation: ${rotateBorder} 4s linear infinite;
    opacity: 1; z-index:0;
  }
`;

const ImageInner = styled.div`
  width:100%; height:100%; background:#fff; border-radius:10px; overflow:hidden; z-index:1; position:relative;
  display:flex; align-items:center; justify-content:center;
`;

const HeaderImage = styled.img`
  width:auto; height:72vh; max-width:100%; object-fit:contain; display:block; margin:0 auto;
  @media(max-width:900px){ height:46vh; } @media(max-width:480px){ height:36vh; }
`;

const ProjectTitle = styled.h1`
  font-size:2.6rem; margin:18px 0 6px; color:${TEXT_LIGHT}; line-height:1.05;
  @media(max-width:768px){ font-size:1.9rem; }
`;

const TagContainer = styled.div` display:flex; gap:10px; flex-wrap:wrap; margin-top:8px; `;
const Tag = styled.span`
  background: linear-gradient(90deg, rgba(212,169,55,0.06), rgba(11,59,88,0.02));
  color: ${TEXT_LIGHT}; padding:6px 10px; border-radius:8px; font-weight:700; font-size:0.85rem;
  border: 1px solid rgba(212,169,55,0.08);
`;

const DescriptionBox = styled.div`
  margin-top:28px; background:#fff; border-radius:12px; padding:26px; border:1px solid ${BORDER_LIGHT};
  box-shadow:0 8px 24px rgba(2,6,23,0.03); transition: box-shadow 200ms, border-color 200ms, transform 140ms;
  position:relative; z-index:2;
  &:hover { transform: translateY(-4px); border-color: rgba(212,169,55,0.95); box-shadow:0 20px 60px rgba(212,169,55,0.12); }
  p, li, div { color: ${TEXT_LIGHT}; font-size:1.05rem; line-height:1.8; margin:0 0 12px 0; }
  ul { padding-left:20px; margin:8px 0 0 0; }
`;

const ProjectLink = styled.a`
  display:inline-flex; align-items:center; gap:10px; margin-top:18px;
  background: linear-gradient(90deg, ${NEON_COLOR}, ${GOLD_ACCENT}); color:#fff; padding:10px 16px; border-radius:10px;
  font-weight:700; text-decoration:none; box-shadow:0 10px 30px rgba(18,49,101,0.06);
  &:hover { transform: translateY(-4px); box-shadow:0 16px 40px rgba(18,49,101,0.12); }
`;

/* FOOTER - MATCHING OTHER PAGES */
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

/* GOLDEN SOCIAL ICONS */
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
   SANITIZER
   ========================================= */
function sanitizeHtml(str = "") {
  return String(str)
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/&lt;(\/?)(b|i|strong|em|br|p|ul|ol|li|a)([^&]*)&gt;/gi, (m, slash, tag, rest) => {
      if (tag.toLowerCase() === "a") {
        const hrefMatch = rest.match(/href\s*=\s*"(.*?)"/i) || rest.match(/href\s*=\s*'(.*?)'/i);
        const href = hrefMatch ? ` href="${hrefMatch[1].replace(/"/g, "")}"` : "";
        return `<${slash}${tag}${href}>`;
      }
      return `<${slash}${tag}>`;
    })
    .replace(/\n/g, "<br/>");
}

/* =========================================
   MAIN COMPONENT
   ========================================= */
const ProjectDetailPage = ({ onNavigate, projects }) => {
  const { id } = useParams();
  const canvasRef = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useStarEffect(canvasRef);

  const navItems = ['home','about','services','projects','team','progress','blog','contact'];
  const safeProjects = Array.isArray(projects) ? projects : [];

  const handleNavigation = (route) => {
    if (onNavigate) onNavigate(route);
    setIsMobileMenuOpen(false);
  };

  if (!projects || projects.length === 0) {
    return (
      <>
        <GlobalStyle />
        <StarCanvas ref={canvasRef} />
        <div style={{ paddingTop: 140, textAlign: 'center', color: TEXT_LIGHT }}>
          <h2>Loading project...</h2>
        </div>
      </>
    );
  }

  const project = safeProjects.find(p => String(p._id || p.id) === String(id));
  if (!project) return <Navigate to="/projects" replace />;

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
                style={item === 'projects' ? { color: NEON_COLOR } : {}}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </span>
            ))}
          </NavGroup>

          <MobileMenuButton onClick={() => setIsMobileMenuOpen(true)}>
            <FontAwesomeIcon icon={faBars} />
          </MobileMenuButton>
        </Header>

        {/* MOBILE MENU */}
        <MobileNavMenu isOpen={isMobileMenuOpen}>
          <button className="close-btn" onClick={() => setIsMobileMenuOpen(false)}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
          {navItems.map((item) => (
            <span
              key={item}
              onClick={() => handleNavigation(item)}
              style={item === 'projects' ? { color: NEON_COLOR } : {}}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </span>
          ))}
        </MobileNavMenu>

        {/* CONTENT */}
        <Container className="animate-in" style={{ animationDelay: '0.05s' }}>
          {project.imageUrl && (
            <HeaderImageWrap>
              <ImageInner>
                <HeaderImage src={project.imageUrl} alt={project.title || 'Project'} />
              </ImageInner>
            </HeaderImageWrap>
          )}

          <div>
            <ProjectTitle>{project.title || 'Untitled Project'}</ProjectTitle>
            <TagContainer>
              {(project.tags || []).map((t) => <Tag key={String(t)}>{t}</Tag>)}
            </TagContainer>
          </div>

          <DescriptionBox>
            {project.description ? (
              <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(project.description) }} />
            ) : (
              <p style={{ margin: 0, color: TEXT_MUTED }}>No description available for this project.</p>
            )}

            {project.projectUrl && (
              <ProjectLink href={project.projectUrl} target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faLink} />
                View Project
              </ProjectLink>
            )}
          </DescriptionBox>
        </Container>

        {/* FOOTER */}
        <FullFooter>
          <FooterGrid>
            <FooterColumn style={{ minWidth: '300px' }}>
              <FooterLogo onClick={() => handleNavigation('home')}>
                NEXORA<span className="gold">CREW</span>
              </FooterLogo>
              <p>
                Transforming ideas into powerful digital products using modern technology, creativity, and AI. Where ideas meet innovation.
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
                  <li key={i}><a onClick={() => handleNavigation(item)}>{item.charAt(0).toUpperCase() + item.slice(1)}</a></li>
                ))}
              </ul>
            </FooterColumn>

            <FooterColumn>
              <h4>Services</h4>
              <ul>
                {[
                  'Web Development',
                  'Poster designing & logo making',
                  'Content creation',
                  'Digital marketing &SEO',
                  'AI and automation',
                  'Hosting & Support',
                  'Printing &Branding solutions',
                  'Enterprise networking &server architecture',
                  'Bold branding&Immersive visual design',
                  'Next gen web & mobile experience'
                ].map((l, i) => (
                  <li key={i}><a onClick={() => handleNavigation('services')}>{l}</a></li>
                ))}
              </ul>
            </FooterColumn>

            <FooterColumn>
              <h4>Contact Info</h4>
              <ul>
                <li><a href="#map"><FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: GOLD_ACCENT }} /> {safeGeneralData.location}</a></li>
                <li><a href={`mailto:${safeGeneralData.email}`}><FontAwesomeIcon icon={faEnvelope} style={{ color: GOLD_ACCENT }} /> {safeGeneralData.email}</a></li>
                <li><a href={`tel:${safeGeneralData.phone}`}><FontAwesomeIcon icon={faPhone} style={{ color: GOLD_ACCENT }} /> {safeGeneralData.phone}</a></li>
              </ul>
            </FooterColumn>
          </FooterGrid>

          <Copyright>© 2025 Nexoracrew. All Rights Reserved.</Copyright>
        </FullFooter>
      </PageWrapper>
    </>
  );
};

export default ProjectDetailPage;