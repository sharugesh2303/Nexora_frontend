// src/components/ProjectsPage.js
import React, { useEffect, useMemo, useRef, useState } from "react";
import styled, { createGlobalStyle, css, keyframes } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

/* =========== CONFIG =========== */
const API_BASE = process.env.REACT_APP_API_BASE ?? "";
const PROJECTS_API = `${API_BASE}/api/projects`;
const TAGS_API = `${API_BASE}/api/tags`;

/* =========== THEME / STYLES =========== */
const NAVY = "#123165";
const GOLD = "#D4A937";
const ACCENT = "#0b3b58";
const WHITE = "#FFFFFF";
const LIGHT_TEXT = "#111827";
const MUTED_TEXT = "#6B7280";
const BORDER = "#e2e8f0";

/* Animations */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const rotateBorder = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

/* Global style */
const GlobalStyle = createGlobalStyle`
  html, body, #root { height: 100%; background: ${WHITE}; }
  body {
    margin: 0;
    font-family: 'Poppins', sans-serif;
    background: ${WHITE};
    color: ${LIGHT_TEXT};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden; /* Crucial for mobile to prevent scrollbars from animations */
  }
  * { box-sizing: border-box; }

  .animate-in { opacity: 0; animation: ${css`${fadeUp} 0.85s ease forwards`}; }
`;

/* Canvas background */
const StarCanvas = styled.canvas`
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  background: transparent;
`;

/* Layout */
const Page = styled.div`
  position: relative;
  z-index: 2;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${WHITE};
  overflow-x: hidden; /* Double safety for mobile overflow */
`;

/* =========================
   HEADER (Responsive Fixes)
   ========================= */
const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between; /* Ensures Logo Left, Menu Right */
  gap: 20px;
  padding: 14px 48px;
  position: sticky;
  top: 0;
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(5px);
  border-bottom: 1px solid ${BORDER};
  z-index: 1000;

  @media (max-width: 768px) {
    padding: 14px 20px; /* Reduced padding for mobile */
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
  white-space: nowrap;
  
  @media (max-width: 480px) { font-size: 1.4rem; }
`;

const LogoN = styled.span` color: ${NAVY}; `;
const LogoCrew = styled.span` color: ${GOLD}; `;

const NavGroup = styled.nav`
  display: flex;
  gap: 22px;
  align-items: center;
  margin-right: auto;
  margin-left: 40px; /* Space from logo */

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
  
  span.active { color: ${NAVY}; font-weight: 600; }

  @media (max-width: 1024px) { display: none; }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${NAVY};
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
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
  box-shadow: -4px 0 20px rgba(15,23,42,0.15);

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
   INTRO SECTION (Responsive Fixes)
   ========================= */
const Intro = styled.section`
  padding: 120px 20px 36px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  z-index: 3;
  text-align: center;

  /* Fix: Reduce top padding on mobile */
  @media (max-width: 768px) {
    padding: 60px 20px 20px;
  }
`;

const IntroTitle = styled.h2`
  font-size: 2.4rem;
  margin: 0 0 8px;
  color: ${NAVY};
  font-weight: 800;
  span { color: ${GOLD}; }
  
  @media (max-width: 768px) { font-size: 2rem; }
  @media (max-width: 480px) { font-size: 1.75rem; }
`;

const IntroSubtitle = styled.p`
  color: ${MUTED_TEXT};
  margin: 6px 0 0;
  max-width: 820px;
  margin-left: auto;
  margin-right: auto;
  font-size: 1rem;
  line-height: 1.6;
  
  @media (max-width: 480px) { font-size: 0.95rem; }
`;

/* Filter bar */
const FilterBar = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap; /* Allows wrapping on mobile */
  margin-top: 28px;
  z-index: 3;
`;

const FilterButton = styled.button`
  background: ${props => (props.$active ? `linear-gradient(90deg, ${NAVY}, ${ACCENT})` : "transparent")};
  color: ${props => (props.$active ? "#ffffff" : LIGHT_TEXT)};
  border: ${props => (props.$active ? "none" : `1px solid ${BORDER}`)};
  padding: 8px 16px;
  border-radius: 999px;
  font-weight: 700;
  cursor: pointer;
  transition: all .18s ease;
  font-size: 0.9rem;
  
  &:hover { transform: translateY(-2px); color: ${NAVY}; border-color: ${NAVY}; }
  
  /* Mobile tweak */
  @media (max-width: 480px) {
    padding: 6px 12px;
    font-size: 0.85rem;
  }
`;

/* =========================
   PROJECT GRID (Mobile Grid Fix)
   ========================= */
const ProjectGrid = styled(motion.div)`
  width: 100%;
  max-width: 1200px;
  margin: 36px auto 72px;
  padding: 0 20px; /* Essential side padding */
  display: grid;
  
  /* Desktop: 3 Columns */
  grid-template-columns: repeat(3, 1fr);
  gap: 35px;
  z-index: 3;

  /* Tablet: 2 Columns */
  @media (max-width: 992px) { 
    grid-template-columns: repeat(2, 1fr); 
    gap: 25px;
  }

  /* Mobile: FORCE 1 Column */
  @media (max-width: 650px) { 
    grid-template-columns: 1fr; 
    gap: 30px; 
  }
`;

/* =========================
   PROJECT CARD
   ========================= */
const ProjectCard = styled(motion.div)`
  position: relative;
  background: ${WHITE};
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  /* Desktop Min-Height */
  min-height: 380px;
  width: 100%; /* Ensure it fits the grid cell */
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);

  /* ROTATING BORDER LOGIC */
  &::before {
    content: '';
    position: absolute;
    width: 200%; /* Oversized to rotate covering corners */
    height: 200%;
    /* The Navy and Gold Conic Gradient */
    background: conic-gradient(
      transparent 0deg,
      transparent 90deg,
      ${GOLD} 130deg,
      ${NAVY} 180deg,
      ${GOLD} 230deg,
      transparent 270deg
    );
    animation: ${rotateBorder} 4s linear infinite;
    opacity: 0.3; 
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 60px rgba(18, 49, 101, 0.25);
  }

  &:hover::before {
    opacity: 1; 
    animation-duration: 2s; 
  }

  /* Tablet */
  @media(max-width: 992px) { 
    min-height: 360px; 
  }

  /* Mobile: Auto height so text isn't cut off */
  @media(max-width: 480px) { 
    min-height: auto; 
    transform: none !important; /* Disable hover movement on touch */
  }
`;

const CardInterior = styled.div`
  position: absolute;
  inset: 3px; /* The border width */
  background: ${WHITE};
  border-radius: 18px; 
  z-index: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  
  /* Mobile: Static positioning to allow content to flow naturally */
  @media(max-width: 480px) {
    position: relative;
    inset: auto;
    width: calc(100% - 6px);
    margin: 3px;
  }
`;

const CardImage = styled.div`
  height: 200px;
  background: ${BORDER};
  position: relative;
  overflow: hidden;
  
  img { 
    width: 100%; 
    height: 100%; 
    object-fit: cover; 
    display: block; 
    transition: transform .5s ease; 
  }
  ${ProjectCard}:hover & img { transform: scale(1.05); }

  /* Mobile Image height adjustment */
  @media (max-width: 480px) {
    height: 180px;
  }
`;

const CardContent = styled.div`
  padding: 18px 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  background: ${WHITE};
`;

const CardTitle = styled.h3`
  color: ${LIGHT_TEXT};
  margin: 0 0 8px;
  font-size: 1.1rem;
  font-weight: 700;
  line-height: 1.3;
`;

const CardDescription = styled.p`
  color: ${MUTED_TEXT};
  margin: 0 0 12px;
  line-height: 1.5;
  font-size: 0.95rem;
  min-height: 44px; /* Alignment on desktop */
  
  @media (max-width: 480px) {
    min-height: auto; /* Remove min-height on mobile */
  }
`;

const TagContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: auto;
`;

const Tag = styled.span`
  background: rgba(18,49,101,0.05);
  color: ${NAVY};
  padding: 6px 10px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.75rem;
  border: 1px solid rgba(18,49,101,0.1);
`;

/* Footer */
const FooterWrap = styled.footer`
  padding: 40px 20px;
  background: ${WHITE};
  border-top: 1px solid ${BORDER};
  color: ${MUTED_TEXT};
  z-index: 3;
`;

const FooterInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: center;

  @media (max-width: 780px) {
    flex-direction: column;
    align-items: center;
    gap: 16px;
    text-align: center;
  }
`;

const FooterText = styled.div`
  color: ${MUTED_TEXT};
  font-size: 0.95rem;
`;

/* =========== Canvas Hook =========== */
const useStarCanvas = (canvasRef) => {
  const rafRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });

    const DPR = Math.max(1, window.devicePixelRatio || 1);

    function resize() {
      const w = Math.floor(window.innerWidth * DPR);
      const h = Math.floor(window.innerHeight * DPR);
      canvas.width = w;
      canvas.height = h;
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
      r: 0.8 + Math.random() * 1.8,
      dx: (Math.random() - 0.5) * 0.2,
      dy: 0.05 + Math.random() * 0.25,
      alpha: 0.08 + Math.random() * 0.28,
    }));

    function onResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      resize();
    }
    window.addEventListener("resize", onResize);

    function draw() {
      ctx.clearRect(0, 0, width, height);

      stars.forEach((s) => {
        s.x += s.dx;
        s.y += s.dy;
        if (s.y > height + 10) s.y = -10;
        if (s.x > width + 10) s.x = -10;
        if (s.x < -10) s.x = width + 10;

        ctx.fillStyle = `rgba(212,169,55,${0.6 * s.alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });

      rafRef.current = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, [canvasRef]);
};

/* =========== ProjectsPage Component =========== */
const ProjectsPage = ({ onNavigate }) => {
  const [projects, setProjects] = useState([]);
  const [tags, setTags] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const canvasRef = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Standard Nav Items
  const navItems = ['home', 'about', 'services', 'projects', 'team', 'progress', 'blog', 'contact'];

  useStarCanvas(canvasRef);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError("");
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
            ? p.tags
                .map(t => (typeof t === "object" && t !== null ? (t.name || t._id || String(t)) : String(t)))
                .filter(Boolean)
            : []
        }));

        if (mounted) {
          setTags(tagData.map(t => ({ _id: t._id, name: String(t.name || t._id) })));
          setProjects(normalizedProjects);
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to load projects/tags:", err);
        if (mounted) {
          setError("Failed to load projects. Check backend or network.");
          setLoading(false);
        }
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

  const handleNavigation = (route) => {
    if (onNavigate) onNavigate(route);
    setIsMobileMenuOpen(false);
  };

  if (loading) {
    return (
      <>
        <GlobalStyle />
        <StarCanvas ref={canvasRef} />
        <div style={{ textAlign: "center", paddingTop: 160, position: 'relative', zIndex: 3 }}>
          <div style={{ fontSize: 20, color: NAVY }}>Loading projects…</div>
        </div>
      </>
    );
  }

  return (
    <>
      <GlobalStyle />
      <StarCanvas ref={canvasRef} />

      <Page>
        {/* HEADER */}
        <Header>
          <Logo onClick={() => handleNavigation("home")}>
            <LogoN>NEXORA</LogoN>
            <LogoCrew>CREW</LogoCrew>
          </Logo>

          <NavGroup>
            {navItems.map((item) => (
              <span 
                key={item} 
                onClick={() => handleNavigation(item)}
                className={item === 'projects' ? 'active' : ''}
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
          
          {navItems.map(i => (
            <span 
              key={i} 
              onClick={() => handleNavigation(i)}
              style={i === 'projects' ? { color: NAVY, fontWeight: 700 } : {}}
            >
              {i.charAt(0).toUpperCase() + i.slice(1)}
            </span>
          ))}
        </MobileNavMenu>

        <Intro className="animate-in" style={{ animationDelay: "0.05s" }}>
          <IntroTitle>Our <span>Projects</span></IntroTitle>
          <IntroSubtitle>A collection of our work demonstrating creative and technical excellence.</IntroSubtitle>

          <FilterBar>
            {allTagsForFilter.map(t => (
              <FilterButton
                key={t}
                $active={activeFilter === t}
                onClick={() => setActiveFilter(t)}
              >
                {t}
              </FilterButton>
            ))}
          </FilterBar>
        </Intro>

        <ProjectGrid layout>
          <AnimatePresence>
            {filteredProjects.map(project => (
              <ProjectCard
                key={project._id || project.id || project.title}
                onClick={() => handleNavigation(`projects/${project._id || project.id}`)}
                layout
                initial={{ y: 18, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 18, opacity: 0 }}
                transition={{ duration: 0.36 }}
              >
                <CardInterior>
                  <CardImage>
                    <img
                      src={
                        project.imageUrl ||
                        "https://via.placeholder.com/1200x700/efe7d3/aaa?text=Project+Image"
                      }
                      alt={project.title || "Project"}
                    />
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
                      {(project.tags || []).map(t => (
                        <Tag key={`${project._id || project.id}-${t}`}>{t}</Tag>
                      ))}
                    </TagContainer>
                  </CardContent>
                </CardInterior>
              </ProjectCard>
            ))}
          </AnimatePresence>
        </ProjectGrid>

        {filteredProjects.length === 0 && (
          <div style={{ textAlign: "center", color: MUTED_TEXT, marginTop: 20 }}>
            No projects found for this filter.
          </div>
        )}

        {error && (
          <div style={{ textAlign: "center", color: "#ff8b8b", marginTop: 8 }}>
            {error}
            <div style={{ marginTop: 8 }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  marginTop: 6,
                  background: NAVY,
                  color: "#fff",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: 6,
                  cursor: "pointer",
                }}
              >
                Retry
              </button>
            </div>
          </div>
        )}

        <FooterWrap>
          <FooterInner>
            <FooterText>© {new Date().getFullYear()} Nexoracrew — Palakarai, Tiruchirappalli.</FooterText>
            <div style={{ display: "flex", gap: 12 }}>
              <a style={{ color: NAVY, textDecoration: 'none', fontWeight: 600, cursor: 'pointer' }} onClick={() => handleNavigation('contact')}>Contact</a>
              <a style={{ color: MUTED_TEXT, textDecoration: 'none', cursor: 'pointer' }} onClick={() => handleNavigation('about')}>About</a>
            </div>
          </FooterInner>
        </FooterWrap>
      </Page>
    </>
  );
};

export default ProjectsPage;