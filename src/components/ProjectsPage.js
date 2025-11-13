// src/components/ProjectsPage.js
import React, { useEffect, useMemo, useRef, useState } from "react";
import styled, { createGlobalStyle, css, keyframes } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

/* =========== CONFIG =========== */
// set your API base here or via .env (REACT_APP_API_BASE)
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";
const PROJECTS_API = `${API_BASE}/api/projects`;
const TAGS_API = `${API_BASE}/api/tags`;

/* =========== THEME / STYLES =========== */
const NEON = "#00e0b3";
const ACCENT = "#1ddc9f";
const NAVY_BG = "#071025";
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

/* Canvas backgound */
const StarCanvas = styled.canvas`
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  background: radial-gradient(circle at 15% 10%, #071022 0%, #081226 18%, #071020 45%, #02040a 100%);
`;

/* Layout */
const Page = styled.div` position: relative; z-index: 2; min-height: 100vh; display:flex; flex-direction:column; `;
const Header = styled.header` display:flex; justify-content:space-between; align-items:center; padding:18px 40px; position:fixed; top:0; left:0; right:0; z-index:6; background:transparent; `;
const Logo = styled.h1` color:${NEON}; margin:0; font-weight:800; font-size:1.05rem; cursor:pointer; animation: ${css`${pulseGlow} 2.8s infinite alternate`}; `;
const Nav = styled.nav` display:flex; gap:16px; span { color:${MUTED_TEXT}; cursor:pointer; } span.active { color:${NEON}; } `;

const Intro = styled.section` padding:130px 20px 40px; width:100%; max-width:1200px; margin:0 auto; z-index:3; text-align:center; `;
const IntroTitle = styled.h2` font-size:2.4rem; margin:0 0 8px; color:${LIGHT_TEXT}; span { color:${NEON}; } @media(max-width:768px){ font-size:1.9rem; } `;
const IntroSubtitle = styled.p` color:${MUTED_TEXT}; margin:6px 0 0; max-width:820px; margin-left:auto; margin-right:auto; `;

const FilterBar = styled.div` display:flex; justify-content:center; gap:12px; flex-wrap:wrap; margin-top:28px; z-index:3; `;
const FilterButton = styled.button`
  background: ${props => (props.$active ? `linear-gradient(90deg, ${NEON}, ${ACCENT})` : "transparent")};
  color: ${props => (props.$active ? "#072022" : LIGHT_TEXT)};
  border: ${props => (props.$active ? "none" : `1px solid ${BORDER}`)};
  padding:8px 14px; border-radius:999px; font-weight:700; cursor:pointer; transition: all .18s ease;
  &:hover { transform: translateY(-3px); color: ${NEON}; border-color: ${NEON}; }
`;

const ProjectGrid = styled(motion.div)`
  width:100%; max-width:1200px; margin:36px auto 72px; padding: 0 20px;
  display:grid; grid-template-columns: repeat(3, 1fr); gap:28px; z-index:3;
  @media(max-width:992px){ grid-template-columns: repeat(2,1fr); } @media(max-width:768px){ grid-template-columns: 1fr; }
`;

const ProjectCard = styled(motion.div)`
  background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.04));
  border-radius: 14px; overflow:hidden; border:1px solid ${BORDER}; box-shadow:0 12px 30px rgba(2,6,23,0.55);
  display:flex; flex-direction:column; cursor:pointer; transition: transform .28s, box-shadow .28s, border-color .28s;
  &:hover { transform: translateY(-10px); border-color: ${NEON}; box-shadow: 0 22px 46px rgba(0,224,179,0.12); }
`;

const CardImage = styled.div` height:220px; background:#071026; img{ width:100%; height:100%; object-fit:cover; display:block; transition: transform .5s ease; } ${ProjectCard}:hover & img { transform: scale(1.05); } `;
const CardContent = styled.div` padding:18px 18px 22px; flex:1; `;
const CardTitle = styled.h3` color:${LIGHT_TEXT}; margin:0 0 6px; font-size:1.1rem; `;
const CardDescription = styled.p` color:${MUTED_TEXT}; margin:0 0 12px; line-height:1.5; min-height:44px; font-size:0.95rem; `;
const TagContainer = styled.div` display:flex; gap:8px; flex-wrap:wrap; margin-top:auto; `;
const Tag = styled.span` background: rgba(0,224,179,0.06); color:${LIGHT_TEXT}; padding:6px 10px; border-radius:8px; font-weight:700; font-size:0.78rem; border:1px solid rgba(0,224,179,0.08); `;

const Footer = styled.footer` padding:36px 20px; text-align:center; color:${MUTED_TEXT}; margin-top:auto; z-index:3; border-top: 1px solid rgba(255,255,255,0.02); `;

/* =========== STAR CANVAS HOOK =========== */
/* same canvas engine as before, stable and independent */
const useStarCanvas = (canvasRef) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      baseR: 0.5 + Math.random() * 1.4,
      dx: (Math.random() - 0.5) * 0.3,
      dy: 0.2 + Math.random() * 0.5,
      alpha: 0.4 + Math.random() * 0.6,
      twSpeed: 0.002 + Math.random() * 0.01,
      twPhase: Math.random() * Math.PI * 2,
      glowStrength: 3 + Math.random() * 3,
    }));

    const orbs = Array.from({ length: 4 }, (_, i) => ({
      x: Math.random() * w,
      y: Math.random() * h * 0.6,
      radius: 60 + Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.06,
      color: i % 2 === 0 ? "rgba(0,224,179,0.06)" : "rgba(98,0,255,0.04)",
    }));

    let meteors = [];
    function spawnMeteor() {
      const startX = Math.random() < 0.5 ? -50 : w + 50;
      const startY = Math.random() * h * 0.5;
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

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resize);

    let raf = null;
    function draw() {
      ctx.clearRect(0, 0, w, h);

      const gBg = ctx.createLinearGradient(0, 0, 0, h);
      gBg.addColorStop(0, "#071025");
      gBg.addColorStop(1, "#02040a");
      ctx.fillStyle = gBg;
      ctx.fillRect(0, 0, w, h);

      orbs.forEach((orb) => {
        orb.x += orb.vx;
        orb.y += orb.vy;
        if (orb.x < -200) orb.x = w + 200;
        if (orb.x > w + 200) orb.x = -200;
        if (orb.y < -200) orb.y = h + 200;
        if (orb.y > h + 200) orb.y = -200;
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
        if (s.y > h + 10) s.y = -10;
        if (s.x > w + 10) s.x = -10;
        if (s.x < -10) s.x = w + 10;

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

      raf = requestAnimationFrame(draw);
    }

    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [canvasRef]);
};

/* =========== ProjectsPage Component =========== */
const ProjectsPage = ({ onNavigate }) => {
  const [projects, setProjects] = useState([]);
  const [tags, setTags] = useState([]); // from /api/tags
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
        // request both endpoints in parallel
        const [projRes, tagRes] = await Promise.all([axios.get(PROJECTS_API), axios.get(TAGS_API)]);

        const tagList = Array.isArray(tagRes.data) ? tagRes.data : [];
        // map id -> name for quick lookup (ObjectId strings -> names)
        const idToName = {};
        tagList.forEach((t) => {
          if (t && t._id) idToName[String(t._id)] = String(t.name || t._id);
        });

        // Normalize projects' tags to names (works for: ['React','...'], ['<ObjectId>'], [{_id,name}, ...])
        const normalizedProjects = (Array.isArray(projRes.data) ? projRes.data : []).map((p) => {
          const rawTags = Array.isArray(p.tags) ? p.tags : [];
          const names = rawTags
            .map((t) => {
              // string name
              if (typeof t === "string") {
                // if it looks like an ObjectId and exists in tag map, map it
                if (idToName[t]) return idToName[t];
                return t;
              }

              // object case
              if (typeof t === "object" && t !== null) {
                if (t.name) return t.name;
                if (t._id && idToName[String(t._id)]) return idToName[String(t._id)];
                if (t._id) return String(t._id);
              }

              return null;
            })
            .filter(Boolean);

          // dedupe while preserving string names
          const uniqueNames = Array.from(new Set(names));
          return { ...p, tags: uniqueNames };
        });

        if (mounted) {
          setTags(tagList.map((t) => ({ _id: t._id, name: String(t.name || t._id) })));
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
    return () => {
      mounted = false;
    };
  }, []);

  // derive filter list from projects (names)
  const allTagsForFilter = useMemo(() => {
    const s = new Set();
    projects.forEach((p) => (p.tags || []).forEach((t) => s.add(t)));
    return ["All", ...Array.from(s)];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (activeFilter === "All") return projects;
    return projects.filter((p) => Array.isArray(p.tags) && p.tags.includes(activeFilter));
  }, [projects, activeFilter]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const itemVariants = { hidden: { y: 18, opacity: 0 }, visible: { y: 0, opacity: 1 } };

  if (loading) {
    return (
      <>
        <GlobalStyle />
        <div style={{ textAlign: "center", paddingTop: 160 }}>
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
          <Logo onClick={() => onNavigate && onNavigate("home")} className="neon-text-shadow">
            NEXORA
          </Logo>
          <Nav>
            <span onClick={() => onNavigate && onNavigate("home")}>Home</span>
            <span onClick={() => onNavigate && onNavigate("about")}>About</span>
            <span onClick={() => onNavigate && onNavigate("services")}>Services</span>
            <span className="active" onClick={() => onNavigate && onNavigate("projects")}>
              Projects
            </span>
            <span onClick={() => onNavigate && onNavigate("blog")}>Blog</span>
            <span onClick={() => onNavigate && onNavigate("contact")}>Contact</span>
          </Nav>
        </Header>

        <Intro className="animate-in" style={{ animationDelay: "0.05s" }}>
          <IntroTitle>
            Our <span>Projects</span>
          </IntroTitle>
          <IntroSubtitle>A collection of our work demonstrating creative and technical excellence.</IntroSubtitle>

          <FilterBar>
            {allTagsForFilter.map((t) => (
              <FilterButton key={t} $active={activeFilter === t} onClick={() => setActiveFilter(t)}>
                {t}
              </FilterButton>
            ))}
          </FilterBar>
        </Intro>

        <ProjectGrid layout variants={containerVariants} initial="hidden" animate="visible">
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project._id}
                onClick={() => onNavigate && onNavigate(`projects/${project._id}`)}
                layout
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{ duration: 0.36 }}
              >
                <CardImage>
                  <img src={project.imageUrl || "https://via.placeholder.com/800x450/1ddc9f/081026?text=Project+Image"} alt={project.title} />
                </CardImage>
                <CardContent>
                  <CardTitle>{project.title}</CardTitle>
                  <CardDescription>
                    {project.description ? (project.description.length > 130 ? `${project.description.substring(0, 130)}...` : project.description) : ""}
                  </CardDescription>
                  <TagContainer>
                    {(project.tags || []).map((t) => (
                      <Tag key={`${project._id}-${t}`}>{t}</Tag>
                    ))}
                  </TagContainer>
                </CardContent>
              </ProjectCard>
            ))}
          </AnimatePresence>
        </ProjectGrid>

        {filteredProjects.length === 0 && (
          <div style={{ textAlign: "center", color: MUTED_TEXT, marginTop: 20 }}>No projects found for this filter.</div>
        )}

        {error && (
          <div style={{ textAlign: "center", color: "#ff8b8b", marginTop: 8 }}>
            {error}
            <div style={{ marginTop: 8 }}>
              <button
                onClick={() => {
                  setError("");
                  setLoading(true);
                  // small refresh by reloading the page data:
                  axios
                    .get(PROJECTS_API)
                    .then((r) => {
                      const raw = Array.isArray(r.data) ? r.data : [];
                      setProjects(raw);
                      setLoading(false);
                    })
                    .catch(() => {
                      setLoading(false);
                      setError("Retry failed. Check backend logs or network.");
                    });
                }}
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
