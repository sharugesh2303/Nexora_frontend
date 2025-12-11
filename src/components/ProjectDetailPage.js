// src/components/ProjectDetailPage.jsx
import React, { useEffect, useRef, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import styled, { createGlobalStyle, keyframes, css } from "styled-components";
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
   THEME / KEYFRAMES / GLOBAL
   ========================================= */
const NAVY = "#123165";
const GOLD = "#D4A937";
const ACCENT = "#0b3b58";
const WHITE = "#FFFFFF";
const LIGHT_TEXT = "#111827";
const MUTED_TEXT = "#6B7280";
const BORDER = "#e2e8f0";

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const rotateBorder = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const GlobalStyle = createGlobalStyle`
  html, body, #root { height: 100%; background: ${WHITE}; }
  body {
    margin: 0;
    font-family: 'Poppins', sans-serif;
    background: ${WHITE};
    color: ${LIGHT_TEXT};
    -webkit-font-smoothing:antialiased;
    -moz-osx-font-smoothing:grayscale;
    overflow-x: hidden;
  }

  .animate-in { opacity: 0; animation: ${css`${fadeUp} 0.85s ease forwards`}; }
`;

/* =========================================
   STAR CANVAS (exact warm gold star effect from ServicesPage)
   ========================================= */
const StarCanvas = styled.canvas`
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  background: transparent;
`;

/* Star engine (copied logic from ServicesPage) */
const useStarCanvas = (canvasRef) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    const DPR = window.devicePixelRatio || 1;

    function resize() {
      canvas.width = window.innerWidth * DPR;
      canvas.height = window.innerHeight * DPR;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    resize();

    const stars = Array.from({ length: 140 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: 1 + Math.random() * 2.2,
      dx: (Math.random() - 0.5) * 0.25,
      dy: 0.08 + Math.random() * 0.35,
      alpha: 0.15 + Math.random() * 0.35,
    }));

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      stars.forEach((s) => {
        s.x += s.dx;
        s.y += s.dy;
        if (s.y > window.innerHeight + 10) s.y = -10;
        if (s.x > window.innerWidth + 10) s.x = -10;
        if (s.x < -10) s.x = window.innerWidth + 10;
        ctx.fillStyle = `rgba(212,169,55,${s.alpha})`; // gold glow color
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [canvasRef]);
};

/* =========================================
   LAYOUT / UI (header, image, description, footer)
   ========================================= */

const Page = styled.div`
  position: relative;
  z-index: 2;
  min-height: 100vh;
  display:flex;
  flex-direction:column;
  background: ${WHITE};
`;

/* Header (same visual language as Services/Projects pages) */
const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  padding: 14px 48px;
  position: sticky;
  top: 0;
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(5px);
  border-bottom: 1px solid ${BORDER};
  z-index: 1000;
  @media (max-width: 768px) {
    padding: 14px 20px;
    gap: 20px;
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
  margin-left: 40px;

  span {
    color: ${MUTED_TEXT};
    cursor: pointer;
    font-weight: 500;
    position: relative;
    padding: 6px 4px;
    transition: 0.3s ease;
    font-size: 1rem;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  span:hover { color: ${NAVY}; }

  span::after {
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

  span:hover::after { width: 100%; }

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
  background: ${WHITE};
  z-index: 1100;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 80px;
  transform: translateX(${props => (props.$isOpen ? '0' : '100%')});
  transition: transform 0.3s ease-in-out;
  box-shadow: 0 8px 20px rgba(2,6,23,0.06);

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

/* Content container */
const Container = styled.div`
  position: relative;
  z-index: 2;
  max-width: 1100px;
  margin: 0 auto;
  padding: 120px 20px 60px;
`;

/* Header image with rotating conic border (keeps same accent) */
const HeaderImageWrap = styled.div`
  position: relative;
  width: 100%;
  max-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${WHITE};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  padding: 3px;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: conic-gradient(
      transparent 0deg,
      transparent 90deg,
      ${GOLD} 130deg,
      ${NAVY} 180deg,
      ${GOLD} 230deg,
      transparent 270deg
    );
    animation: ${rotateBorder} 4s linear infinite;
    opacity: 1;
    z-index: 0;
  }
`;

const ImageInner = styled.div`
  width: 100%;
  height: 100%;
  background: ${WHITE};
  border-radius: 10px;
  overflow: hidden;
  z-index: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HeaderImage = styled.img`
  width: auto;
  height: 72vh;
  max-width: 100%;
  object-fit: contain;
  display: block;
  margin: 0 auto;

  @media (max-width: 900px) { height: 46vh; }
  @media (max-width: 480px) { height: 36vh; }
`;

/* Title / tags / description */
const ProjectTitle = styled.h1`
  font-size: 2.6rem;
  margin: 18px 0 6px;
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
  background: linear-gradient(90deg, rgba(212,169,55,0.06), rgba(11,59,88,0.02));
  color: ${LIGHT_TEXT};
  padding: 6px 10px;
  border-radius: 8px;
  font-weight:700;
  font-size: 0.85rem;
  border: 1px solid rgba(212,169,55,0.08);
`;

const DescriptionBox = styled.div`
  margin-top: 28px;
  background: ${WHITE};
  border-radius: 12px;
  padding: 26px;
  border: 1px solid ${BORDER};
  box-shadow: 0 8px 24px rgba(2,6,23,0.03);
  transition: box-shadow 200ms ease, border-color 200ms ease, transform 140ms ease;
  position: relative;
  z-index: 2;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(212,169,55,0.95);
    box-shadow: 0 20px 60px rgba(212,169,55,0.12);
  }

  p, li, div {
    color: ${LIGHT_TEXT};
    font-size: 1.05rem;
    line-height: 1.8;
    margin: 0 0 12px 0;
  }

  ul { padding-left: 20px; margin: 8px 0 0 0; }
`;

const ProjectLink = styled.a`
  display:inline-flex;
  align-items:center;
  gap:10px;
  margin-top: 18px;
  background: linear-gradient(90deg, ${NAVY}, ${ACCENT});
  color: ${WHITE};
  padding: 10px 16px;
  border-radius: 10px;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 10px 30px rgba(18,49,101,0.06);
  transition: transform .16s ease, box-shadow .16s ease;
  &:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(18,49,101,0.12); }
`;

/* =========================================
   FOOTER (exact copy from ServicesPage)
   ========================================= */
const FullFooter = styled.footer`
  background: rgba(255,255,255,0.95);
  padding: 60px 50px 20px;
  color: ${MUTED_TEXT};
  border-top: 1px solid rgba(15,23,42,0.08);
  box-sizing: border-box;
  @media (max-width: 768px) { padding: 40px 20px 20px; }
`;

const FooterGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  gap: 30px;
  @media (max-width: 900px) { flex-wrap: wrap; }
  @media (max-width: 600px) { flex-direction: column; align-items: flex-start; }
`;

const FooterColumn = styled.div`
  min-width: 200px;
  @media (max-width: 768px) { min-width: unset; flex: 1; }
  @media (max-width: 600px) { width: 100%; flex: none; }

  h4 {
    color: ${LIGHT_TEXT};
    font-size: 1.1rem;
    margin-bottom: 20px;
    font-weight: 700;
    position: relative;
    &:after {
      content: ''; position: absolute; left: 0; bottom: -5px;
      width: 30px; height: 2px; background: ${GOLD};
    }
  }
  p { font-size: 0.9rem; line-height: 1.6; margin: 0 0 10px 0; }
  ul { list-style: none; padding: 0; margin: 0; }
  li { margin-bottom: 10px; }
  a, span {
    color: ${MUTED_TEXT}; text-decoration: none; font-size: 0.9rem;
    transition: color 0.3s; display: inline-flex; align-items: center; gap: 8px; cursor: pointer;
    &:hover { color: ${NAVY}; }
  }
`;

const FooterLogo = styled(Logo)` font-size: 1.5rem; margin-bottom: 10px; `;

const SocialIcons = styled.div`
  display: flex; gap: 15px; margin-top: 15px;
  a {
    width: 32px; height: 32px; border-radius: 999px; background: #f3f4f6;
    display: flex; align-items: center; justify-content: center;
    color: ${NAVY}; transition: background 0.3s, color 0.3s, box-shadow 0.3s;
    &:hover { background: linear-gradient(135deg, ${NAVY}, ${GOLD}); color: #ffffff; box-shadow: 0 8px 20px rgba(15,23,42,0.2); }
  }
`;

const Copyright = styled.div`
  text-align: center; font-size: 0.8rem; padding-top: 30px;
  border-top: 1px solid rgba(15,23,42,0.08); margin-top: 50px;
`;

/* =========================================
   MAIN Component
   ========================================= */
const ProjectDetailPage = ({ onNavigate, projects }) => {
  const { id } = useParams();
  const canvasRef = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useStarCanvas(canvasRef);

  const navItems = ['home', 'about', 'services', 'projects', 'team', 'progress', 'blog', 'contact'];
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
        <div style={{ paddingTop: 140, textAlign: 'center', color: LIGHT_TEXT }}>
          <h2>Loading Project...</h2>
        </div>
      </>
    );
  }

  const project = safeProjects.find(p => (p._id || p.id) === id);
  if (!project) return <Navigate to="/projects" replace />;

  return (
    <>
      <GlobalStyle />
      <StarCanvas ref={canvasRef} />

      <Page>
        <Header>
          <Logo onClick={() => handleNavigation('home')}><LogoN>NEXORA</LogoN><LogoCrew>CREW</LogoCrew></Logo>

          <NavGroup>
            {navItems.map(item => (
              <span key={item} onClick={() => handleNavigation(item)} className={item === 'projects' ? 'active' : ''}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </span>
            ))}
          </NavGroup>

          <MobileMenuButton onClick={() => setIsMobileMenuOpen(true)} aria-label="Open menu">
            <FontAwesomeIcon icon={faBars} />
          </MobileMenuButton>
        </Header>

        <MobileNavMenu $isOpen={isMobileMenuOpen}>
          <button className="close-btn" onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu">
            <FontAwesomeIcon icon={faTimes} />
          </button>
          {navItems.map(i => (
            <span key={i} onClick={() => handleNavigation(i)} style={i === 'projects' ? { color: NAVY, fontWeight: 700 } : {}}>
              {i.charAt(0).toUpperCase() + i.slice(1)}
            </span>
          ))}
        </MobileNavMenu>

        <Container className="animate-in" style={{ animationDelay: '0.05s' }}>
          {project.imageUrl && (
            <HeaderImageWrap>
              <ImageInner>
                <HeaderImage src={project.imageUrl} alt={project.title} />
              </ImageInner>
            </HeaderImageWrap>
          )}

          <div>
            <ProjectTitle>{project.title}</ProjectTitle>
            <TagContainer>
              {(project.tags || []).map((t) => <Tag key={String(t)}>{t}</Tag>)}
            </TagContainer>
          </div>

          <DescriptionBox>
            {project.description ? (
              <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(project.description) }} />
            ) : (
              <p style={{ margin: 0, color: MUTED_TEXT }}>No description available for this project.</p>
            )}

            {project.projectUrl && (
              <ProjectLink href={project.projectUrl} target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faLink} />
                View Project
              </ProjectLink>
            )}
          </DescriptionBox>
        </Container>

        {/* footer (exact look from ServicesPage) */}
        <FullFooter>
          <FooterGrid>
            <FooterColumn style={{ minWidth: '300px' }}>
              <FooterLogo onClick={() => handleNavigation('home')}>NEXORACREW</FooterLogo>
              <p>Transforming ideas into powerful digital products using modern technology, creativity, and AI. Where ideas meet innovation.</p>
              <SocialIcons>
                <a href="https://www.instagram.com/nexoracrew?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faInstagram} /></a>
                <a href="https://www.linkedin.com/in/nexoracrew-%E2%80%8C-01842a396/" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faLinkedinIn} /></a>
                <a href={`mailto:nexora.crew@gmail.com`}><FontAwesomeIcon icon={faEnvelope} /></a>
                <a href="https://wa.me/9597646460" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faWhatsapp} /></a>
                <a href="https://www.youtube.com/@Nexora-crew" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faYoutube} /></a>
              </SocialIcons>
            </FooterColumn>

            <FooterColumn>
              <h4>Quick Links</h4>
              <ul>{navItems.map((item, i) => <li key={i}><a onClick={() => handleNavigation(item)}>{item.charAt(0).toUpperCase() + item.slice(1)}</a></li>)}</ul>
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
                ].map((l, i) => <li key={i}><a onClick={() => handleNavigation('services')}>{l}</a></li>)}
              </ul>
            </FooterColumn>

            <FooterColumn>
              <h4>Contact Info</h4>
              <ul>
                <li><a href="#map"><FontAwesomeIcon icon={faMapMarkerAlt} /> JJ College of Engineering, Trichy</a></li>
                <li><a href={`mailto:nexora.crew@gmail.com`}><FontAwesomeIcon icon={faEnvelope} /> nexora.crew@gmail.com</a></li>
                <li><a href={`tel:+919597646460`}><FontAwesomeIcon icon={faPhone} /> +91 95976 46460</a></li>
              </ul>
            </FooterColumn>
          </FooterGrid>
          <Copyright>© {new Date().getFullYear()} Nexoracrew. All Rights Reserved.</Copyright>
        </FullFooter>
      </Page>
    </>
  );
};

/* light sanitizer (keeps only safe small tags, allow href on <a>) */
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

export default ProjectDetailPage;
