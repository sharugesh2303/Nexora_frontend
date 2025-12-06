// src/components/ProjectsPage.js
import React, { useEffect, useMemo, useRef, useState } from "react";
import styled, { createGlobalStyle, css, keyframes } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarCheck } from "@fortawesome/free-solid-svg-icons";

/* =========== CONFIG =========== */
const API_BASE = process.env.REACT_APP_API_BASE ?? "";
const PROJECTS_API = `${API_BASE}/api/projects`;
const TAGS_API = `${API_BASE}/api/tags`;

/* =========== THEME / STYLES =========== */
const NEON = "#00e0b3";
const ACCENT = "#1ddc9f";
const NAVY_BG = "#071025";
const MID_NAVY = "#0B1724";
const LIGHT_TEXT = "#D6E2F0";
const MUTED_TEXT = "#9AA6B3";
const BORDER = "rgba(255,255,255,0.06)";

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const pulseGlow = keyframes`
  0%,100% { text-shadow: 0 0 8px ${NEON}, 0 0 18px rgba(0,224,179,0.14); }
  50%    { text-shadow: 0 0 14px ${NEON}, 0 0 28px rgba(0,224,179,0.24); }
`;

/* subtle outer halo pulse */
const pulseOutline = keyframes`
  0% { box-shadow: 0 8px 30px rgba(29,220,159,0.06), 0 0 6px rgba(29,220,159,0.04); }
  50% { box-shadow: 0 12px 44px rgba(29,220,159,0.09), 0 0 12px rgba(29,220,159,0.07); }
  100% { box-shadow: 0 8px 30px rgba(29,220,159,0.06), 0 0 6px rgba(29,220,159,0.04); }
`;

/* active pulse */
const pulseActive = keyframes`
  0% { box-shadow: 0 18px 44px rgba(29,220,159,0.18), 0 0 28px rgba(29,220,159,0.12); }
  50% { box-shadow: 0 28px 64px rgba(29,220,159,0.26), 0 0 48px rgba(29,220,159,0.18); }
  100% { box-shadow: 0 18px 44px rgba(29,220,159,0.18), 0 0 28px rgba(29,220,159,0.12); }
`;

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Poppins', system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
    background: ${NAVY_BG};
    color: ${LIGHT_TEXT};
    -webkit-font-smoothing:antialiased;
    -moz-osx-font-smoothing:grayscale;
    overflow-x: hidden;
  }
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
  background: radial-gradient(circle at 15% 10%, #071022 0%, #081226 18%, #071020 45%, #02040a 100%);
  display: block;
`;

/* Layout & Components */
const Page = styled.div`
  position: relative;
  z-index: 2;
  min-height: 100vh;
  display:flex;
  flex-direction:column;
`;

/* Header updated to match Home/About/Services */
const Header = styled.header`
  display: flex;
  align-items: center;
  gap: 40px;
  padding: 14px 48px;
  position: sticky;
  top: 0;
  width: 100%;
  background: rgba(7,16,38,0.65);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255,255,255,0.04);
  z-index: 10;

  @media (max-width: 768px) {
    padding: 12px 20px;
    gap: 24px;
    flex-wrap: wrap;
  }
`;

const Logo = styled.h1`
  color:${NEON};
  margin:0;
  font-weight:800;
  font-size:1.8rem;
  cursor:pointer;
  letter-spacing: 1px;
  animation: ${css`${pulseGlow} 2.8s infinite alternate`};
`;

/* Nav group like other pages, next to logo on left */
const NavGroup = styled.nav`
  display:flex;
  gap:22px;
  align-items:center;
  margin-right:auto;

  span {
    color:${MUTED_TEXT};
    cursor:pointer;
    font-weight:500;
    position:relative;
    transition:0.3s ease;
    padding:6px 4px;

    &:hover {
      color:${NEON};
      text-shadow:0 0 10px ${NEON};
    }

    &:after {
      content:'';
      position:absolute;
      left:0; bottom:-2px;
      width:0;
      height:2px;
      background:${NEON};
      transition:0.3s;
      border-radius:4px;
    }
    &:hover:after { width:100%; }
  }

  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 12px;
  }
`;

const Intro = styled.section`
  padding:130px 20px 40px;
  width:100%;
  max-width:1200px;
  margin:0 auto;
  z-index:3;
  text-align:center;
`;

const IntroTitle = styled.h2`
  font-size:2.4rem;
  margin:0 0 8px;
  color:${LIGHT_TEXT};
  span { color:${NEON}; }
  @media(max-width:768px){ font-size:1.9rem; }
`;

const IntroSubtitle = styled.p`
  color:${MUTED_TEXT};
  margin:6px 0 0;
  max-width:820px;
  margin-left:auto;
  margin-right:auto;
`;

const FilterBar = styled.div`
  display:flex;
  justify-content:center;
  gap:12px;
  flex-wrap:wrap;
  margin-top:28px;
  z-index:3;
`;

const FilterButton = styled.button`
  background: ${props => (props.$active ? `linear-gradient(90deg, ${NEON}, ${ACCENT})` : "transparent")};
  color: ${props => (props.$active ? "#072022" : LIGHT_TEXT)};
  border: ${props => (props.$active ? "none" : `1px solid ${BORDER}`)};
  padding:8px 14px;
  border-radius:999px;
  font-weight:700;
  cursor:pointer;
  transition: all .18s ease;
  &:hover { transform: translateY(-3px); color: ${NEON}; border-color: ${NEON}; }
`;

const ProjectGrid = styled(motion.div)`
  width:100%;
  max-width:1200px;
  margin:36px auto 72px;
  padding: 0 20px;
  display:grid;
  grid-template-columns: repeat(3, 1fr);
  gap:28px;
  z-index:3;
  @media(max-width:992px){ grid-template-columns: repeat(2,1fr); }
  @media(max-width:768px){ grid-template-columns: 1fr; }
`;

/* Project card with solid background & halo like Services */
const ProjectCard = styled(motion.div)`
  position: relative;
  background: ${MID_NAVY};
  border-radius: 14px;
  overflow: hidden;
  border: 2px solid ${ACCENT};
  box-shadow: 0 16px 38px rgba(2,6,23,0.55);
  display:flex;
  flex-direction:column;
  cursor:pointer;
  transition: transform .28s, box-shadow .28s, border-color .28s, background .18s;
  min-height: 360px;

  &::after {
    content: '';
    position: absolute;
    inset: -8px;
    border-radius: 18px;
    pointer-events: none;
    box-shadow:
      0 12px 28px rgba(29,220,159,0.18),
      0 0 16px rgba(29,220,159,0.12);
    z-index: 0;
    animation: ${pulseOutline} 3.6s ease-in-out infinite;
  }

  &:hover {
    transform: translateY(-10px);
    border-color: ${NEON};
    box-shadow: 0 30px 64px rgba(29,220,159,0.18);
    &::after {
      box-shadow:
        0 28px 66px rgba(29,220,159,0.28),
        0 0 58px rgba(29,220,159,0.20);
      animation: ${pulseActive} 2.0s ease-in-out infinite;
    }
  }

  @media(max-width:992px) { min-height: 320px; }
  @media(max-width:480px) { min-height: 260px; &::after { inset: -6px; } }
`;

const CardImage = styled.div`
  height: 220px;
  background:#071026;
  position:relative;
  img{ width:100%; height:100%; object-fit:cover; display:block; transition: transform .5s ease; }
  ${ProjectCard}:hover & img { transform: scale(1.05); }
`;

const CardContent = styled.div`
  padding:22px;
  flex:1;
  display:flex;
  flex-direction:column;
`;

const CardTitle = styled.h3`
  color:${LIGHT_TEXT};
  margin:0 0 8px;
  font-size:1.2rem;
`;

const CardDescription = styled.p`
  color:${MUTED_TEXT};
  margin:0 0 12px;
  line-height:1.5;
  min-height:44px;
  font-size:0.95rem;
`;

const TagContainer = styled.div`
  display:flex;
  gap:8px;
  flex-wrap:wrap;
  margin-top:auto;
`;

const Tag = styled.span`
  background: rgba(0,224,179,0.06);
  color:${LIGHT_TEXT};
  padding:6px 10px;
  border-radius:8px;
  font-weight:700;
  font-size:0.78rem;
  border:1px solid rgba(0,224,179,0.08);
`;

const Footer = styled.footer`
  padding:36px 20px;
  text-align:center;
  color:${MUTED_TEXT};
  margin-top:auto;
  z-index:3;
  border-top: 1px solid rgba(255,255,255,0.02);
`;

/* =========== Canvas hook =========== */
const useStarCanvas = (canvasRef) => {
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "0";
    canvas.style.display = "block";

    const ctx = canvas.getContext("2d", { alpha: true });

    let dpr = Math.max(window.devicePixelRatio || 1, 1);
    let w = (canvas.width = Math.floor(window.innerWidth * dpr));
    let h = (canvas.height = Math.floor(window.innerHeight * dpr));
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.scale(dpr, dpr);

    let lw = window.innerWidth;
    let lh = window.innerHeight;

    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * lw,
      y: Math.random() * lh,
      baseR: 0.5 + Math.random() * 1.4,
      dx: (Math.random() - 0.5) * 0.3,
      dy: 0.2 + Math.random() * 0.5,
      alpha: 0.4 + Math.random() * 0.6,
      twSpeed: 0.002 + Math.random() * 0.01,
      twPhase: Math.random() * Math.PI * 2,
      glowStrength: 3 + Math.random() * 3,
    }));

    const orbs = Array.from({ length: 4 }, (_, i) => ({
      x: Math.random() * lw,
      y: Math.random() * lh * 0.6,
      radius: 60 + Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.06,
      color: i % 2 === 0 ? "rgba(0,224,179,0.06)" : "rgba(98,0,255,0.04)",
    }));

    let meteors = [];
    function spawnMeteor() {
      const startX = Math.random() < 0.5 ? -50 : lw + 50;
      const startY = Math.random() * lh * 0.5;
      const dir = startX < 0 ? 1 : -1;
      meteors.push({
        x: startX,
        y: startY,
        vx: dir * (4 + Math.random() * 6),
        vy: 1 + Math.random() * 2,
        length: 80 + Math.random() * 140,
        life: 0,
        maxLife: 60 + Math.floor(Math.random() * 40),
      });
    }

    let meteorTimer = 0;
    const meteorIntervalBase = 420;

    const resize = () => {
      dpr = Math.max(window.devicePixelRatio || 1, 1);
      lw = window.innerWidth;
      lh = window.innerHeight;
      canvas.width = Math.floor(lw * dpr);
      canvas.height = Math.floor(lh * dpr);
      canvas.style.width = `${lw}px`;
      canvas.style.height = `${lh}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    window.addEventListener("resize", resize);

    function draw() {
      ctx.clearRect(0, 0, lw, lh);

      const gBg = ctx.createLinearGradient(0, 0, 0, lh);
      gBg.addColorStop(0, "#071025");
      gBg.addColorStop(1, "#02040a");
      ctx.fillStyle = gBg;
      ctx.fillRect(0, 0, lw, lh);

      orbs.forEach((orb) => {
        orb.x += orb.vx;
        orb.y += orb.vy;
        if (orb.x < -200) orb.x = lw + 200;
        if (orb.x > lw + 200) orb.x = -200;
        if (orb.y < -200) orb.y = lh + 200;
        if (orb.y > lh + 200) orb.y = -200;
        const g = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
        g.addColorStop(0, orb.color);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.globalCompositeOperation = "lighter";
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.globalCompositeOperation = "source-over";
      });

      stars.forEach((s) => {
        s.twPhase += s.twSpeed;
        const tw = 0.5 + Math.sin(s.twPhase) * 0.5;
        const radius = s.baseR * (0.8 + tw * 1.5);
        const glowR = radius * s.glowStrength;

        s.x += s.dx;
        s.y += s.dy;
        if (s.y > lh + 10) s.y = -10;
        if (s.x > lw + 10) s.x = -10;
        if (s.x < -10) s.x = lw + 10;

        const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, glowR);
        grad.addColorStop(0, `rgba(255,255,255,${0.9 * s.alpha})`);
        grad.addColorStop(0.15, `rgba(0,224,179,${0.6 * s.alpha})`);
        grad.addColorStop(0.35, `rgba(0,224,179,${0.18 * s.alpha})`);
        grad.addColorStop(1, "rgba(0,0,0,0)");

        ctx.globalCompositeOperation = "lighter";
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
        ctx.globalCompositeOperation = "source-over";
      });

      meteorTimer += 1;
      if (meteorTimer > meteorIntervalBase + Math.random() * 800) {
        spawnMeteor();
        meteorTimer = 0;
      }

      meteors = meteors.filter((m) => m.life < m.maxLife);
      meteors.forEach((m) => {
        ctx.globalCompositeOperation = "lighter";
        const trailGrad = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * m.length, m.y - m.vy * m.length);
        trailGrad.addColorStop(0, "rgba(255,255,255,0.95)");
        trailGrad.addColorStop(1, "rgba(0,224,179,0.02)");
        ctx.strokeStyle = trailGrad;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x - m.vx * m.length, m.y - m.vy * m.length);
        ctx.stroke();
        ctx.closePath();

        ctx.fillStyle = "rgba(255,255,255,1)";
        ctx.beginPath();
        ctx.arc(m.x, m.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.globalCompositeOperation = "source-over";

        m.x += m.vx;
        m.y += m.vy;
        m.life++;
      });

      rafRef.current = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
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

  useStarCanvas(canvasRef);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const [projRes, tagRes] = await Promise.all([axios.get(PROJECTS_API), axios.get(TAGS_API)]);
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

  if (loading) {
    return (
      <>
        <GlobalStyle />
        <StarCanvas ref={canvasRef} />
        <div style={{ textAlign: "center", paddingTop: 160, position: 'relative', zIndex: 3 }}>
          <div style={{ fontSize: 20, color: NEON }}>Loading projects…</div>
        </div>
      </>
    );
  }

  return (
    <>
      <GlobalStyle />
      <StarCanvas ref={canvasRef} />

      <Page>
        <Header>
          <Logo onClick={() => onNavigate && onNavigate("home")}>NEXORA</Logo>
          <NavGroup>
            <span onClick={() => onNavigate && onNavigate("home")}>Home</span>
            <span onClick={() => onNavigate && onNavigate("about")}>About</span>
            <span onClick={() => onNavigate && onNavigate("services")}>Services</span>
            <span
              onClick={() => onNavigate && onNavigate("projects")}
              style={{ color: NEON }}
            >
              Projects
            </span>
            <span onClick={() => onNavigate && onNavigate("blog")}>Blog</span>
            <span onClick={() => onNavigate && onNavigate("contact")}>Contact</span>

            <span
              onClick={() => onNavigate && onNavigate("schedule")}
              style={{ color: NEON, display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <FontAwesomeIcon icon={faCalendarCheck} />
              <span>Schedule Meeting</span>
            </span>
          </NavGroup>
        </Header>

        <Intro className="animate-in" style={{ animationDelay: "0.05s" }}>
          <IntroTitle>
            Our <span>Projects</span>
          </IntroTitle>
          <IntroSubtitle>
            A collection of our work demonstrating creative and technical excellence.
          </IntroSubtitle>

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
                onClick={() => onNavigate && onNavigate(`projects/${project._id || project.id}`)}
                layout
                initial={{ y: 18, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 18, opacity: 0 }}
                transition={{ duration: 0.36 }}
              >
                <CardImage>
                  <img
                    src={
                      project.imageUrl ||
                      "https://via.placeholder.com/800x450/1ddc9f/081026?text=Project+Image"
                    }
                    alt={project.title || "Project"}
                  />
                </CardImage>
                <CardContent>
                  <CardTitle>{project.title || "Untitled Project"}</CardTitle>
                  <CardDescription>
                    {project.description
                      ? project.description.length > 130
                        ? `${project.description.substring(0, 130)}...`
                        : project.description
                      : ""}
                  </CardDescription>
                  <TagContainer>
                    {(project.tags || []).map(t => (
                      <Tag key={`${project._id || project.id}-${t}`}>{t}</Tag>
                    ))}
                  </TagContainer>
                </CardContent>
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
                  background: NEON,
                  color: "#062028",
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

        <Footer>&copy; NEXORACREW Team, Palakarai, Tiruchirappalli, Tamil Nadu.</Footer>
      </Page>
    </>
  );
};

export default ProjectsPage;
