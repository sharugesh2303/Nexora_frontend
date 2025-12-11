// src/components/TeamPage.jsx
import React, { useEffect, useRef, useMemo, useState } from "react";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

/* THEME - white background, navy primary, gold accents */
const BG = "#ffffff"; // page background
const NAVY = "#012a4a"; // primary/navy color
const GOLD = "#d4af37"; // gold accent
const TEXT = "#021a40"; // dark text
const MUTED = "#5b6d7a"; // muted (cool gray-blue)
const BORDER = "rgba(1,42,74,0.08)"; // subtle navy border

/* GLOBAL */
const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }
  html, body, #root {
    margin: 0;
    padding: 0;
    min-height: 100%;
    font-family: 'Poppins', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: ${BG};
    color: ${TEXT};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;

/* LAYOUT */
const Page = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, ${BG} 0%, #fbfdff 100%);
`;

/* HEADER / NAV (matches other pages) */
const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  padding: 14px 40px;
  gap: 32px;
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(6px);
  border-bottom: 1px solid ${BORDER};
  box-shadow: 0 6px 18px rgba(2, 42, 74, 0.04);

  @media (max-width: 768px) {
    padding: 10px 18px;
    gap: 16px;
  }
`;

const BrandRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
`;

const BrandLogo = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 9px;
  background: linear-gradient(135deg, ${NAVY} 0%, #0a3a63 60%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  color: ${BG};
  font-size: 0.95rem;
  box-shadow: 0 6px 18px rgba(2, 42, 74, 0.08);
`;

const BrandText = styled.div`
  font-weight: 800;
  letter-spacing: 0.04em;
  font-size: 1rem;
  color: ${TEXT};

  span {
    color: ${GOLD};
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 18px;
  margin: 0 auto;

  @media (max-width: 900px) {
    position: fixed;
    inset: 64px 0 auto auto;
    right: 0;
    width: 100%;
    max-width: 320px;
    background: #ffffff;
    border-left: 1px solid ${BORDER};
    border-bottom: 1px solid ${BORDER};
    padding: 16px;
    flex-direction: column;
    transform: ${({ open }) => (open ? "translateX(0)" : "translateX(100%)")};
    transition: transform 0.25s ease;
    z-index: 40;
    box-shadow: 0 18px 40px rgba(2, 42, 74, 0.06);
  }
`;

const NavItem = styled.button`
  position: relative;
  background: transparent;
  border: 0;
  color: ${({ $active }) => ($active ? NAVY : MUTED)};
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 999px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  transition: color 0.18s ease, background 0.18s ease, transform 0.12s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:hover {
    color: ${NAVY};
    background: rgba(1,42,74,0.03);
    transform: translateY(-1px);
  }

  &::after {
    content: "";
    position: absolute;
    left: 12px;
    right: 12px;
    bottom: -8px;
    height: 3px;
    background: ${GOLD};
    border-radius: 999px;
    transform: scaleX(${({ $active }) => ($active ? 1 : 0)});
    transform-origin: center;
    transition: transform 0.25s ease;
  }
`;

const MobileToggle = styled.button`
  display: none;
  border: 0;
  background: transparent;
  color: ${NAVY};
  font-size: 1.25rem;
  cursor: pointer;

  @media (max-width: 900px) {
    display: inline-flex;
  }
`;

/* MAIN CONTENT */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Main = styled.main`
  flex: 1;
  padding: 44px 40px 72px;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 28px 16px 50px;
  }
`;

const Intro = styled.div`
  text-align: center;
  margin-bottom: 36px;
  animation: ${fadeUp} 0.6s ease both;
`;

const IntroHeading = styled.h1`
  margin: 0 0 8px 0;
  font-size: clamp(1.8rem, 2.6vw, 2.4rem);
  letter-spacing: 0.04em;
  color: ${NAVY};
`;

const IntroSub = styled.p`
  margin: 0;
  color: ${MUTED};
  font-size: 0.96rem;
`;

/* TEAM SECTION */
const TeamSection = styled.section`
  margin-bottom: 48px;
  animation: ${fadeUp} 0.6s ease both;
`;

const SectionHeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
`;

const SectionBar = styled.div`
  width: 4px;
  height: 22px;
  border-radius: 999px;
  background: linear-gradient(180deg, ${GOLD} 0%, #b2882b 100%);
  box-shadow: 0 6px 18px rgba(210,175,55,0.14);
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-size: 0.95rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${NAVY};
`;

/* GRID & CARDS */
/* MemberCard now has a clear navy outline/frame */
const MembersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 26px;

  @media (max-width: 600px) {
    gap: 20px;
  }
`;

const MemberCard = styled.div`
  position: relative; /* for outer frame pseudo */
  background: #ffffff;
  border-radius: 14px;
  padding: 12px;
  border: 1px solid rgba(1,42,74,0.10); /* subtle primary border */
  box-shadow: 0 10px 30px rgba(2,42,74,0.04);
  display: flex;
  flex-direction: column;
  transition: transform 0.18s ease, box-shadow 0.18s ease;

  /* outer navy outline frame */
  &::before {
    content: "";
    position: absolute;
    inset: -10px; /* space for the outline frame */
    border-radius: 18px;
    pointer-events: none;
    border: 2px solid rgba(1,42,74,0.06); /* faint navy outline */
    opacity: 1;
    transition: transform 0.22s ease, opacity 0.22s ease;
  }

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 22px 50px rgba(2,42,74,0.08);
  }

  &:hover::before {
    transform: scale(1.02);
    opacity: 1;
  }
`;

const MemberImageWrapper = styled.div`
  width: 100%;
  aspect-ratio: 4 / 5;
  border-radius: 12px;
  overflow: hidden;
  background: linear-gradient(180deg, #f6f8fb 0%, #ffffff 100%);
  margin-bottom: 12px;
  border: 1px solid rgba(1,42,74,0.04);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MemberImage = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
`;

const MemberName = styled.div`
  font-weight: 700;
  font-size: 0.98rem;
  margin-bottom: 4px;
  color: ${NAVY};
`;

const MemberRole = styled.div`
  font-size: 0.82rem;
  color: ${MUTED};
`;

/* small badge for role corner (optional) */
const RoleBadge = styled.span`
  display: inline-block;
  margin-left: 8px;
  padding: 4px 8px;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(212,175,55,0.12), rgba(212,175,55,0.06));
  color: ${GOLD};
  font-weight: 700;
  font-size: 0.72rem;
  border: 1px solid rgba(212,175,55,0.14);
`;

/* UTIL: grouping team by fixed roles */
function groupTeamByRoles(teamData = [], fixedRoles = []) {
  const roleMeta = fixedRoles.reduce((acc, r) => {
    acc[r.name] = r;
    return acc;
  }, {});

  const groups = {};

  teamData.forEach((member) => {
    const meta = roleMeta[member.role] || {};
    const groupId = meta.group != null ? meta.group : 999;

    if (!groups[groupId]) {
      groups[groupId] = { groupId, members: [] };
    }
    groups[groupId].members.push(member);
  });

  const labelMap = {
    1: "Leadership Team",
    2: "Development Team",
    3: "Design Team",
    4: "Content Team",
    5: "Project Management",
    // CHANGED: previously "Other" -> now "Master Minds"
    999: "Master Minds",
  };

  return Object.values(groups)
    .sort((a, b) => a.groupId - b.groupId)
    .map((g) => ({ ...g, label: labelMap[g.groupId] || "Team" }));
}

/* PAGE COMPONENT */
const TeamPage = ({ onNavigate = () => {}, teamData = [], fixedRoles = [] }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const mainRef = useRef(null);

  // keep scroll at top on mount
  useEffect(() => {
    if (!mainRef.current) return;
    mainRef.current.scrollTop = 0;
  }, []);

  const grouped = useMemo(
    () => groupTeamByRoles(teamData, fixedRoles),
    [teamData, fixedRoles]
  );

  const handleNav = (route) => {
    onNavigate(route);
    setMenuOpen(false);
  };

  return (
    <>
      <GlobalStyle />
      <Page>
        <Header>
          <BrandRow onClick={() => handleNav("home")}>
            <BrandLogo>N</BrandLogo>
            <BrandText>
              NEXORA<span>CREW</span>
            </BrandText>
          </BrandRow>

          <Nav open={menuOpen}>
            <NavItem onClick={() => handleNav("home")}>Home</NavItem>
            <NavItem onClick={() => handleNav("about")}>About</NavItem>
            <NavItem onClick={() => handleNav("services")}>Services</NavItem>
            <NavItem onClick={() => handleNav("projects")}>Projects</NavItem>
            <NavItem onClick={() => handleNav("blog")}>Blog</NavItem>
            {/* TEAM between Blog and Contact */}
            <NavItem $active onClick={() => handleNav("team")}>
              Team
            </NavItem>
            <NavItem onClick={() => handleNav("contact")}>Contact</NavItem>
          </Nav>

          <MobileToggle
            aria-label="Toggle navigation menu"
            onClick={() => setMenuOpen((s) => !s)}
          >
            <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
          </MobileToggle>
        </Header>

        <Main ref={mainRef}>
          <Intro>
            <IntroHeading>Our Team</IntroHeading>
            <IntroSub>The brilliant minds behind Nexora.</IntroSub>
          </Intro>

          {grouped.map((group) => (
            <TeamSection key={group.groupId}>
              <SectionHeaderRow>
                <SectionBar />
                <SectionTitle>{group.label}</SectionTitle>
              </SectionHeaderRow>

              <MembersGrid>
                {group.members.map((member, idx) => (
                  <MemberCard key={`${member._id || member.name}-${idx}`}>
                    <MemberImageWrapper>
                      <MemberImage
                        src={
                          member.img ||
                          "https://via.placeholder.com/400x500/ffffff/e6eef8?text=Team+Member"
                        }
                        alt={member.name}
                      />
                    </MemberImageWrapper>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div>
                        <MemberName>{member.name}</MemberName>
                        <MemberRole>{member.role}</MemberRole>
                      </div>
                      {/* optional small gold badge for special roles */}
                      {member.badge && <RoleBadge>{member.badge}</RoleBadge>}
                    </div>
                  </MemberCard>
                ))}
              </MembersGrid>
            </TeamSection>
          ))}

          {grouped.length === 0 && (
            <IntroSub>No team members added yet in the admin panel.</IntroSub>
          )}
        </Main>
      </Page>
    </>
  );
};

export default TeamPage;
