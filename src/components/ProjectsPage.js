// src/components/ProjectsPage.js
import React, { useEffect, useMemo, useRef, useState } from "react";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faBars, 
  faTimes, 
  faEnvelope, 
  faMapMarkerAlt, 
  faPhone 
} from "@fortawesome/free-solid-svg-icons";
import { 
  faInstagram, 
  faLinkedinIn, 
  faWhatsapp, 
  faYoutube 
} from "@fortawesome/free-brands-svg-icons";

/* =========================================
   THEME CONSTANTS
   ========================================= */
const NEON_COLOR = '#123165';          // primary navy
const TEXT_LIGHT = '#111827';
const TEXT_MUTED = '#6B7280';
const BORDER_LIGHT = 'rgba(15,23,42,0.08)';
const GOLD_ACCENT = '#D4A937';

/* =========================================
   KEYFRAMES & ANIMATIONS
   ========================================= */
const rollIn = keyframes`
    from { opacity: 0; transform: translateY(30px) scale(0.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
`;

/* =========================================
   GLOBAL STYLES
   ========================================= */
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

    #root { width: 100%; overflow-x: hidden; }
    *, *::before, *::after { box-sizing: border-box; }

    .animate-in {
        opacity: 0;
        transform: translateY(20px);
        animation: fadeSlide 0.8s ease forwards;
    }
    @keyframes fadeSlide { to { opacity: 1; transform: translateY(0); } }
`;

/* =========================================
   STAR CANVAS BACKGROUND
   ========================================= */
const StarCanvas = styled.canvas`
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    z-index: 0; 
    pointer-events: none;
`;

/* =========================================
   LAYOUT & SHARED COMPONENTS
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
  z-index: 100;
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
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: #ffffff;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 80px;
  transform: translateX(${props => (props.isOpen ? '0' : '100%')});
  transition: transform 0.3s ease-in-out;
  box-shadow: -4px 0 20px rgba(15,23,42,0.15);

  .close-btn {
    position: absolute;
    top: 20px; right: 20px;
    background: none;
    border: none;
    color: ${TEXT_LIGHT};
    font-size: 2rem;
    cursor: pointer;
  }

  span {
    font-size: 1.3rem;
    margin: 15px 0;
    cursor: pointer;
    color: ${TEXT_MUTED};
    &:hover { color: ${NEON_COLOR}; }
  }
`;

/* =========================================
   INTRO AREA
   ========================================= */
const Intro = styled.section`
    padding: 120px 20px 36px;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    z-index: 3;
    text-align: center;
    @media (max-width: 768px) { padding: 60px 20px 20px; }
`;

const IntroTitle = styled.h2`
    font-size: 2.4rem;
    margin: 0 0 8px;
    color: ${NEON_COLOR};
    font-weight: 800;
    span { color: ${GOLD_ACCENT}; }
    @media (max-width: 480px) { font-size: 1.75rem; }
`;

const IntroSubtitle = styled.p`
    color: ${TEXT_MUTED};
    margin: 6px 0 0;
    max-width: 820px;
    margin-left: auto; margin-right: auto;
    font-size: 1rem; line-height: 1.6;
    @media (max-width: 480px) { font-size: 0.95rem; }
`;

const FilterBar = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 28px;
  z-index: 3;
`;

const FilterButton = styled.button`
  background: ${props => (props.$active ? `linear-gradient(90deg, ${NEON_COLOR}, ${GOLD_ACCENT})` : "transparent")};
  color: ${props => (props.$active ? "#ffffff" : TEXT_LIGHT)};
  border: ${props => (props.$active ? "none" : `1px solid ${BORDER_LIGHT}`)};
  padding: 8px 16px; border-radius: 999px; font-weight: 700; cursor: pointer; transition: all .18s ease; font-size: 0.9rem;
  &:hover { transform: translateY(-2px); color: ${NEON_COLOR}; border-color: ${NEON_COLOR}; }
  @media (max-width: 480px) { padding: 6px 12px; font-size: 0.85rem; }
`;

/* =========================================
   PROJECT GRID
   ========================================= */
const ProjectGrid = styled(motion.div)`
  width: 100%;
  max-width: 1200px;
  margin: 36px auto 72px;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 35px;
  z-index: 3;
  @media (max-width: 992px) { grid-template-columns: repeat(2, 1fr); gap: 25px; }
  @media (max-width: 650px) { grid-template-columns: 1fr; gap: 30px; }
`;

const ProjectCard = styled(motion.div)`
  position: relative; background: #fff; border-radius: 20px; overflow: hidden; display:flex; justify-content:center; align-items:center;
  cursor: pointer; transition: transform 0.3s ease, box-shadow 0.3s ease;
  min-height: 380px; width: 100%; box-shadow: 0 10px 30px rgba(0,0,0,0.05);

  &::before {
    content: '';
    position: absolute;
    width: 200%;
    height: 200%;
    background: conic-gradient( transparent 0deg, transparent 90deg, ${GOLD_ACCENT} 130deg, ${NEON_COLOR} 180deg, ${GOLD_ACCENT} 230deg, transparent 270deg );
    animation: rotate 6s linear infinite;
    opacity: 0.25;
    transition: opacity 0.3s ease;
  }
  @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

  &:hover { transform: translateY(-8px); box-shadow: 0 20px 60px rgba(18, 49, 101, 0.18); }
  &:hover::before { opacity: 1; animation-duration: 3s; }

  @media(max-width: 992px) { min-height: 360px; }
  @media(max-width: 480px) { min-height: auto; transform: none !important; }
`;

const CardInterior = styled.div`
  position: absolute; inset: 3px; background: #fff; border-radius: 18px; z-index: 1; overflow: hidden; display:flex; flex-direction:column;
  @media(max-width:480px){ position: relative; inset: auto; width: calc(100% - 6px); margin: 3px; }
`;

const CardImage = styled.div`
  height: 200px; background: ${BORDER_LIGHT}; position: relative; overflow: hidden;
  img { width:100%; height:100%; object-fit:cover; display:block; transition: transform .5s ease; }
  ${ProjectCard}:hover & img { transform: scale(1.05); }
  @media(max-width:480px){ height: 180px; }
`;

const CardContent = styled.div`
  padding: 18px 20px; flex:1; display:flex; flex-direction:column; background: #fff;
`;

const CardTitle = styled.h3`
  color: ${TEXT_LIGHT}; margin: 0 0 8px; font-size: 1.1rem; font-weight:700; line-height:1.3;
`;

const CardDescription = styled.p`
  color: ${TEXT_MUTED}; margin: 0 0 12px; line-height:1.5; font-size:0.95rem; min-height:44px;
  @media(max-width:480px){ min-height: auto; }
`;

const TagContainer = styled.div` display:flex; gap:8px; flex-wrap:wrap; margin-top:auto; `;
const Tag = styled.span`
  background: rgba(18,49,101,0.05);
  color: ${NEON_COLOR};
  padding: 6px 10px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.75rem;
  border: 1px solid rgba(18,49,101,0.1);
`;

/* =========================================
   FOOTER - MATCHING OTHER PAGES
   ========================================= */
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
    text-align:center; font-size:0.8rem; padding-top:30px; border-top:1px solid ${BORDER_LIGHT}; margin-top:50px;
`;

/* =========================================
   STAR CANVAS HOOK
   ========================================= */
const useStarCanvas = (canvasRef) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
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

        ctx.fillStyle = `rgba(212,169,55,${s.alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [canvasRef]);
};

/* =========================================
   MAIN ProjectsPage COMPONENT
   ========================================= */
const API_BASE = process.env.REACT_APP_API_BASE ?? "";
const PROJECTS_API = `${API_BASE}/api/projects`;
const TAGS_API = `${API_BASE}/api/tags`;

const ProjectsPage = ({ onNavigate }) => {
  const [projects, setProjects] = useState([]);
  const [tags, setTags] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const canvasRef = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = ['home', 'about', 'services', 'projects', 'team', 'progress', 'blog', 'contact'];
  useStarCanvas(canvasRef);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true); setError("");
      try {
        const [projRes, tagRes] = await Promise.all([
          axios.get(PROJECTS_API).catch(() => ({ data: [] })),
          axios.get(TAGS_API).catch(() => ({ data: [] }))
        ]);
        const projData = projRes.data;
        const tagData = Array.isArray(tagRes.data) ? tagRes.data : [];

        const projectsList = Array.isArray(projData) ? projData : (projData.items || []);

        const normalizedProjects = (projectsList || []).map((p) => ({
          ...p,
          tags: Array.isArray(p.tags)
            ? p.tags.map(t => (typeof t === "object" && t !== null ? (t.name || t._id || String(t)) : String(t))).filter(Boolean)
            : []
        }));

        if (mounted) {
          setTags(tagData.map(t => ({ _id: t._id, name: String(t.name || t._id) })));
          setProjects(normalizedProjects);
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to load projects/tags:", err);
        if (mounted) { setError("Failed to load projects. Check backend or network."); setLoading(false); }
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const allTagsForFilter = useMemo(() => {
    if (Array.isArray(tags) && tags.length > 0) {
      const names = Array.from(new Set(tags.map(t => String(t.name || t._id))));
      return ["All", ...names];
    }
    const s = new Set();
    projects.forEach(p => (p.tags || []).forEach(t => s.add(t)));
    return ["All", ...Array.from(s)];
  }, [projects, tags]);

  const filteredProjects = useMemo(() => {
    if (activeFilter === "All") return projects;
    return projects.filter(p => Array.isArray(p.tags) && p.tags.includes(activeFilter));
  }, [projects, activeFilter]);

  const handleNavigation = (route) => { if (onNavigate) onNavigate(route); setIsMobileMenuOpen(false); };

  const safeGeneralData = {
    email: 'nexora.crew@gmail.com',
    phone: '+91 95976 46460',
    location: 'JJ College of Engineering, Trichy'
  };

  if (loading) {
    return (
      <>
        <GlobalStyle />
        <StarCanvas ref={canvasRef} />
        <div style={{ textAlign: "center", paddingTop: 160, position: 'relative', zIndex: 3 }}>
          <div style={{ fontSize: 20, color: NEON_COLOR }}>Loading projects…</div>
        </div>
      </>
    );
  }

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
              <span key={item} onClick={() => handleNavigation(item)} style={item === 'projects' ? { color: NEON_COLOR } : {}}>
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
            <span key={item} onClick={() => handleNavigation(item)} style={item === 'projects' ? { color: NEON_COLOR } : {}}>
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </span>
          ))}
        </MobileNavMenu>

        {/* INTRO */}
        <Intro className="animate-in" style={{ animationDelay: "0.05s" }}>
          <IntroTitle>Our <span>Projects</span></IntroTitle>
          <IntroSubtitle>A collection of our work demonstrating creative and technical excellence.</IntroSubtitle>

          <FilterBar>
            {allTagsForFilter.map(t => (
              <FilterButton key={t} $active={activeFilter === t} onClick={() => setActiveFilter(t)}>{t}</FilterButton>
            ))}
          </FilterBar>
        </Intro>

        {/* PROJECT GRID */}
        <ProjectGrid layout>
          <AnimatePresence>
            {filteredProjects.map(project => (
              <ProjectCard
                key={project._id || project.id || project.title}
                onClick={() => handleNavigation(`projects/${project._id || project.id}`)}
                layout initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 18, opacity: 0 }} transition={{ duration: 0.36 }}
              >
                <CardInterior>
                  <CardImage>
                    <img src={project.imageUrl || "https://via.placeholder.com/1200x700/efe7d3/aaa?text=Project+Image"} alt={project.title || "Project"} />
                  </CardImage>

                  <CardContent>
                    <CardTitle>{project.title || "Untitled Project"}</CardTitle>
                    <CardDescription>
                      {project.description
                        ? project.description.length > 140
                          ? `${project.description.substring(0, 140)}...`
                          : project.description
                        : ""}
                    </CardDescription>

                    <TagContainer>
                      {(project.tags || []).map(t => <Tag key={`${project._id || project.id}-${t}`}>{t}</Tag>)}
                    </TagContainer>
                  </CardContent>
                </CardInterior>
              </ProjectCard>
            ))}
          </AnimatePresence>
        </ProjectGrid>

        {filteredProjects.length === 0 && (
          <div style={{ textAlign: "center", color: TEXT_MUTED, marginTop: 20 }}>
            No projects found for this filter.
          </div>
        )}

        {error && (
          <div style={{ textAlign: "center", color: "#ff8b8b", marginTop: 8 }}>
            {error}
            <div style={{ marginTop: 8 }}>
              <button onClick={() => window.location.reload()} style={{ marginTop: 6, background: NEON_COLOR, color: "#fff", border: "none", padding: "8px 12px", borderRadius: 6, cursor: "pointer" }}>
                Retry
              </button>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <FullFooter>
          <FooterGrid>
            <FooterColumn style={{ minWidth: '300px' }}>
              <FooterLogo onClick={() => handleNavigation('home')}>
                NEXORA<span className="gold">CREW</span>
              </FooterLogo>
              <p>Transforming ideas into powerful digital products using modern technology, creativity, and AI. Where ideas meet innovation.</p>
              <SocialIcons>
                <a href="https://www.instagram.com/nexoracrew?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faInstagram} /></a>
                <a href="https://www.linkedin.com/in/nexoracrew-%E2%80%8C-01842a396/" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faLinkedinIn} /></a>
                <a href={`mailto:${safeGeneralData.email}`}><FontAwesomeIcon icon={faEnvelope} /></a>
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
              <ul>{['Web Development', 'Poster designing & logo making' , 'Content creation' , 'Digital marketing &SEO' , 'AI and automation' , 'Hosting & Support' , 'Printing &Branding solutions' , 'Enterprise networking &server architecture' , 'Bold branding&Immersive visual design' , 'Next gen web & mobile experience'].map((l, i) => <li key={i}><a onClick={() => handleNavigation('services')}>{l}</a></li>)}</ul>
            </FooterColumn>

            <FooterColumn>
              <h4>Contact Info</h4>
              <ul>
                <li><a href="#map"><FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: GOLD_ACCENT }} /> Palakarai,Trichy</a></li>
                <li><a href={`mailto:${safeGeneralData.email}`}><FontAwesomeIcon icon={faEnvelope} style={{ color: GOLD_ACCENT }} /> {safeGeneralData.email}</a></li>
                <li><a href={`tel:${safeGeneralData.phone}`}><FontAwesomeIcon icon={faPhone} style={{ color: GOLD_ACCENT }} /> +91 9597646460</a></li>
              </ul>
            </FooterColumn>
          </FooterGrid>

          <Copyright>© 2025 Nexoracrew. All Rights Reserved.</Copyright>
        </FullFooter>
      </PageWrapper>
    </>
  );
};

export default ProjectsPage;