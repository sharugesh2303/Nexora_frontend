// src/components/TeamPage.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
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

/* THEME CONSTANTS */
const NEON_COLOR = "#123165"; // primary navy
const TEXT_LIGHT = "#111827"; // Dark text for white bg
const TEXT_MUTED = "#6B7280";
const BORDER_LIGHT = "rgba(15,23,42,0.08)";
const GOLD_ACCENT = "#D4A937";

/* KEYFRAMES & ANIMATIONS */
const rollIn = keyframes`
  from { opacity: 0; transform: translateY(30px) scale(0.95); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

/* GLOBAL STYLES */
const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    overflow-x: hidden;
    font-family: 'Poppins', sans-serif;
    /* THE GLOW EFFECT BACKGROUND */
    background:
      radial-gradient(circle at 0% 0%, #fff9e8 0, #ffffff 35%, transparent 55%),
      linear-gradient(180deg, #ffffff 0%, #f5f7fb 40%, #e5edf7 100%);
    color: ${TEXT_LIGHT};
  }
  #root { width: 100%; overflow-x: hidden; }
  .animate-in { opacity: 0; transform: translateY(20px); animation: fadeSlide 0.8s ease forwards; }
  @keyframes fadeSlide { to { opacity: 1; transform: translateY(0); } }
`;

/* STAR CANVAS BACKGROUND */
const StarCanvas = styled.canvas`
  position: fixed; inset: 0; width: 100vw; height: 100vh; z-index: 0; pointer-events: none;
`;

/* Styled FA icon (gold) - Used for decorative/contact icons */
const FAIcon = styled(FontAwesomeIcon)`
  color: ${GOLD_ACCENT};
  display: inline-block;
  vertical-align: middle;
`;

/* LAYOUT */
const PageWrapper = styled.div`
  position: relative; z-index: 1; min-height: 100vh; width: 100%; max-width: 100vw;
  background: transparent; overflow-x: hidden;
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

const MobileMenuButton = styled.button`
  display: none;
  @media (max-width: 1024px) {
    display: block;
    background: none;
    border: none;
    color: ${NEON_COLOR}; /* This sets the hamburger icon color to NEON */
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

/* HERO */
const HeroTeam = styled.section`
  padding: 140px 36px 40px;
  max-width: 1200px;
  margin: 0 auto;
  text-align: left;
  box-sizing: border-box;

  @media (max-width: 780px) {
    padding: 80px 20px 30px;
    text-align: left;
  }
`;
const HeroTitle = styled.h1`
  font-size: 3.6rem;
  font-weight: 800;
  margin-bottom: 16px;
  line-height: 1.1;
  color: ${NEON_COLOR};
  span {
    color: ${GOLD_ACCENT};
  }
  @media (max-width: 780px) {
    font-size: 2.2rem;
  }
`;
const HeroParagraph = styled.p`
  max-width: 760px;
  color: ${TEXT_MUTED};
  font-size: 1.05rem;
  line-height: 1.7;
  @media (max-width: 780px) {
    font-size: 1rem;
    max-width: 100%;
  }
`;

/* TEAM GRID */
const TeamContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 36px 80px;
  box-sizing: border-box;
  @media (max-width: 780px) {
    padding: 10px 20px 60px;
  }
`;
const SectionHeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 60px;
  margin-bottom: 30px;
  animation: ${rollIn} 0.6s ease forwards;
  @media (max-width: 480px) {
    margin-top: 40px;
    margin-bottom: 20px;
  }
`;
const SectionBar = styled.div`
  width: 5px;
  height: 32px;
  border-radius: 999px;
  background: linear-gradient(180deg, ${GOLD_ACCENT} 0%, #b2882b 100%);
`;
const SectionTitle = styled.h2`
  margin: 0;
  font-size: 1.8rem;
  letter-spacing: 0.02em;
  color: ${NEON_COLOR};
  font-weight: 800;
  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const MembersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  width: 100%;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;


const MemberCard = styled.div`
  width: 260px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border-radius: 18px;
  padding: 20px;
  border: 1px solid ${BORDER_LIGHT};
  transition: 0.3s ease;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-sizing: border-box;

  @media (max-width: 600px) {
    width: 100%;
    max-width: 340px;
  }

  &:hover {
    transform: translateY(-8px);
    border-color: ${GOLD_ACCENT};
    box-shadow: 0 20px 40px rgba(212, 169, 55, 0.15);
  }
`;

const ImageWrapper = styled.div`
  width: 100%;
  aspect-ratio: 1/1;
  border-radius: 14px;
  overflow: hidden;
  margin-bottom: 18px;
  background: #f8f9fa;
  border: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  ${MemberCard}:hover & img {
    transform: scale(1.05);
  }
`;

const MemberName = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${TEXT_LIGHT};
  margin: 0;
  @media (max-width: 480px) {
    font-size: 1.15rem;
  }
`;

const SubgroupBlock = styled.div`
  margin-top: 20px;
  padding-left: 20px;
  border-left: 2px solid ${BORDER_LIGHT};
  @media (max-width: 480px) {
    padding-left: 10px;
    border-left-width: 3px;
  }
`;
const SubgroupHeader = styled.h4`
  font-size: 1.1rem;
  color: ${TEXT_MUTED};
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
  &::before {
    content: "";
    display: block;
    width: 6px;
    height: 6px;
    background: ${GOLD_ACCENT};
    border-radius: 50%;
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

/* LOGIC UTILS */
const parseNumeric = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

function extractLabelFrom(obj) {
  if (!obj || typeof obj !== "object") return null;
  const keys = [
    "subgroupLabel",
    "subgroup_label",
    "subgroupName",
    "subgroup_name",
    "subgroupTitle",
    "subgroup_title",
    "subGroupName",
    "sub_group",
    "subgroupNameDisplay",
    "label",
    "name",
    "title",
    "subgroup",
  ];
  for (const k of keys) {
    if (k in obj) {
      const v = obj[k];
      if (typeof v === "string" && v.trim().length > 0) return v.trim();
    }
  }
  return null;
}

function buildFixedRoleSubgroupMap(fixedRoles = []) {
  const map = new Map();
  for (const fr of fixedRoles || []) {
    const gId = parseNumeric(fr.group);
    const sId = parseNumeric(fr.subGroup ?? fr.subgroup);
    if (gId !== null && sId !== null) {
      const label = extractLabelFrom(fr) || (typeof fr.name === "string" && fr.name.trim() ? fr.name.trim() : null);
      if (label) {
        map.set(`${gId}_${sId}`, label);
      }
    }
  }
  return map;
}

function groupByDbFields(teamData = [], fixedRoles = []) {
  const groupsObj = {};
  const fixedMap = buildFixedRoleSubgroupMap(fixedRoles);

  teamData.forEach((member) => {
    let gId = parseNumeric(member.group);
    let sId = parseNumeric(member.subgroup);

    if (gId === null) {
      const foundRole = (fixedRoles || []).find((fr) => String(fr.name).trim().toLowerCase() === String(member.role || "").trim().toLowerCase());
      if (foundRole) {
        gId = parseNumeric(foundRole.group);
        sId = parseNumeric(foundRole.subGroup ?? foundRole.subgroup) ?? sId;
      }
    }

    if (gId === null) gId = 999;
    if (sId === null) sId = 0;

    if (!groupsObj[gId]) {
      let calculatedLabel = "";
      if (gId === 999) calculatedLabel = "TEAM MEMBERS";
      else calculatedLabel = member.role ? String(member.role).toUpperCase() : "GROUP " + gId;

      groupsObj[gId] = {
        id: gId,
        label: calculatedLabel,
        mainMembers: [],
        subgroupsObj: {}, 
      };
    }

    if (sId === 0) {
      groupsObj[gId].mainMembers.push(member);
    } else {
      if (!groupsObj[gId].subgroupsObj[sId]) {
        groupsObj[gId].subgroupsObj[sId] = {
          id: sId,
          explicitLabel: null,
          members: [],
        };
      }

      groupsObj[gId].subgroupsObj[sId].members.push(member);
    }
  });

  for (const gKey of Object.keys(groupsObj)) {
    const gEntry = groupsObj[gKey];
    for (const sKey of Object.keys(gEntry.subgroupsObj)) {
      const sEntry = gEntry.subgroupsObj[sKey];
      const mapKey = `${gEntry.id}_${sEntry.id}`;

      if (fixedMap.has(mapKey)) {
        sEntry.explicitLabel = fixedMap.get(mapKey);
        continue;
      }

      let found = null;
      for (const m of sEntry.members) {
        const lbl = extractLabelFrom(m);
        if (lbl) {
          found = lbl;
          break;
        }
      }
      if (found) {
        sEntry.explicitLabel = found;
      } else {
        sEntry.explicitLabel = `Subgroup ${sEntry.id}`;
      }
    }
  }

  return Object.values(groupsObj)
    .sort((a, b) => a.id - b.id)
    .map((g) => {
      const subgroups = Object.values(g.subgroupsObj)
        .sort((a, b) => a.id - b.id)
        .map((s) => ({
          id: s.id,
          label: s.explicitLabel,
          members: s.members,
        }));

      return {
        ...g,
        subgroups,
      };
    });
}

/* MAIN COMPONENT */
const TeamPage = ({ onNavigate = () => {}, teamData = [], fixedRoles = [], generalData = {} }) => {
  const canvasRef = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const safeGeneralData = {
    email: generalData?.email || "nexora.crew@gmail.com",
    phone: generalData?.phone || "+91 95976 46460",
    location: generalData?.location || "JJ College of Engineering, Trichy",
  };

  const navItems = ['home', 'about', 'services', 'projects', 'team', 'progress', 'blog', 'certificate', 'contact'];

  const grouped = useMemo(() => groupByDbFields(teamData, fixedRoles), [teamData, fixedRoles]);
  // ─────────────────────────────────────────
// FORCE PRIORITY ORDER + MAKE ROWS OF 4
// ─────────────────────────────────────────
const priority = [
  "FOUNDER & CEO",
  "CO CEO",
  "HR",
  "CTO",
  "LEAD DEVELOPER",
  "LEAD DESIGNER",
  "LEAD R&D",
  "LEAD AI AUTOMATION",
  "SOCIAL MEDIA HANDLING",
  "SEO",
];

const sortedTeam = [...teamData].sort((a, b) => {
  const aIndex = priority.indexOf((a.role || "").toUpperCase());
  const bIndex = priority.indexOf((b.role || "").toUpperCase());
  return aIndex - bIndex;
});

const rows = [];
for (let i = 0; i < sortedTeam.length; i += 4) {
  rows.push(sortedTeam.slice(i, i + 4));
}


  /* STAR CANVAS logic */
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

  return (
    <>
      <GlobalStyle />
      <StarCanvas ref={canvasRef} />

      <PageWrapper>
        {/* HEADER */}
        <Header>
          <Logo onClick={() => handleNavigation("home")}>
            NEXORA<span className="gold">CREW</span>
          </Logo>

          <NavGroup>
            {navItems.map((item) => (
              <span
                key={item}
                className={`navItem ${item === "team" ? "active" : ""}`}
                onClick={() => handleNavigation(item)}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </span>
            ))}
          </NavGroup>

          {/* Uses standard FontAwesomeIcon to inherit NEON_COLOR from button */}
          <MobileMenuButton onClick={() => setIsMobileMenuOpen(true)} aria-label="Open menu">
            <FontAwesomeIcon icon={faBars} />
          </MobileMenuButton>
        </Header>

        {/* MOBILE MENU */}
        <MobileNavMenu isOpen={isMobileMenuOpen}>
          <button className="close-btn" onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu">
            <FontAwesomeIcon icon={faTimes} />
          </button>

          {navItems.map((item) => (
            <span key={`mob-${item}`} onClick={() => handleNavigation(item)} style={item === "team" ? { color: NEON_COLOR } : {}}>
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </span>
          ))}
        </MobileNavMenu>

        <HeroTeam>
          <div className="animate-in">
            <HeroTitle>
              Meet Our <span>Team</span>
            </HeroTitle>
            <HeroParagraph className="animate-in" style={{ animationDelay: "0.2s" }}>
              The brilliant minds and creative souls behind Nexoracrew. We are a diverse group of developers, designers, and innovators.
            </HeroParagraph>
          </div>
        </HeroTeam>

        <TeamContainer>
          {grouped.length === 0 && (
            <HeroParagraph style={{ textAlign: "center", marginTop: "50px" }}>No team members found.</HeroParagraph>
          )}

          {rows.map((row, rIndex) => (
  <MembersGrid key={rIndex}>
    {row.map((m, i) => (
      <MemberCard key={i}>
  <p style={{
    margin: "0 0 14px",
    fontSize: "1.1rem",
    fontWeight: 800,
    color: "#123165",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: "0.6px"
  }}>
    {m.role}
  </p>

  <ImageWrapper>
    <img
      src={m.img || "https://via.placeholder.com/300"}
      alt={m.name}
    />
  </ImageWrapper>

  <MemberName>{m.name}</MemberName>
</MemberCard>

    ))}
  </MembersGrid>
))}

        </TeamContainer>

        <div style={{ background: "rgba(255,255,255,0.7)", padding: "60px 20px", textAlign: "center", marginTop: "40px", borderTop: `1px solid ${BORDER_LIGHT}` }}>
          <h2 style={{ color: NEON_COLOR, fontSize: "2rem", marginBottom: "10px", fontWeight: 800 }}>
            Want to <span style={{ color: GOLD_ACCENT }}>Join Us?</span>
          </h2>
          <p style={{ color: TEXT_MUTED, maxWidth: "600px", margin: "0 auto 30px" }}>
            We are always looking for passionate talent to help us build the future.
          </p>
          <button
            onClick={() => handleNavigation("contact")}
            style={{
              padding: "14px 32px",
              background: `linear-gradient(135deg, ${NEON_COLOR}, ${GOLD_ACCENT})`,
              border: "none",
              borderRadius: 999,
              color: "#ffffff",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 14px 40px rgba(0,0,0,0.1)",
              fontSize: "1.05rem",
            }}
          >
            Contact Us
          </button>
        </div>

        {/* FOOTER */}
        <FullFooter>
          <FooterGrid>
            <FooterColumn style={{ minWidth: "300px" }}>
              <FooterLogo onClick={() => handleNavigation("home")}>
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
                  <li key={i}>
                    <a onClick={() => handleNavigation(item)}>{item.charAt(0).toUpperCase() + item.slice(1)}</a>
                  </li>
                ))}
              </ul>
            </FooterColumn>

            <FooterColumn>
              <h4>Services</h4>
              <ul>
                {[
                  "Web Development",
                  "Poster designing & logo making",
                  "Content creation",
                  "Digital marketing &SEO",
                  "AI and automation",
                  "Hosting & Support",
                  "Printing &Branding solutions",
                  "Enterprise networking &server architecture",
                  "Bold branding&Immersive visual design",
                  "Next gen web & mobile experience",
                ].map((l, i) => (
                  <li key={i}>
                    <a onClick={() => handleNavigation("services")}>{l}</a>
                  </li>
                ))}
              </ul>
            </FooterColumn>

            <FooterColumn>
              <h4>Contact Info</h4>
              <ul>
                <li>
                  <a href="#map">
                    <FAIcon icon={faMapMarkerAlt} /> Palakarai,Trichy.
                  </a>
                </li>
                <li>
                  <a href={`mailto:${safeGeneralData.email}`}>
                    <FAIcon icon={faEnvelope} /> {safeGeneralData.email}
                  </a>
                </li>
                <li>
                  <a href={`tel:${safeGeneralData.phone}`}>
                    <FAIcon icon={faPhone} /> +91 9597646460
                  </a>
                </li>
              </ul>
            </FooterColumn>
          </FooterGrid>

          <Copyright>© 2025 Nexoracrew. All Rights Reserved.</Copyright>
        </FullFooter>
      </PageWrapper>
    </>
  );
};

export default TeamPage;