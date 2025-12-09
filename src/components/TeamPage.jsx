// src/components/TeamPage.jsx
import React, { useEffect, useRef, useMemo, useState } from "react";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

/* THEME */
const NEON = "#00ffc6";
const BG = "#020817";
const LIGHT = "#e5f0ff";
const MUTED = "#9aa8b8";
const BORDER = "rgba(255,255,255,0.08)";

/* GLOBAL */
const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }
  html, body, #root {
    margin: 0;
    padding: 0;
    min-height: 100%;
    font-family: 'Poppins', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: ${BG};
    color: ${LIGHT};
  }
`;

/* LAYOUT */
const Page = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: radial-gradient(circle at 0 0, #0b1220 0, #020617 40%, #020617 100%);
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
  background: rgba(2, 8, 23, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);

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
  width: 34px;
  height: 34px;
  border-radius: 12px;
  background: radial-gradient(circle at 30% 20%, #38bdf8 0, #1d4ed8 50%, #020617 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  color: white;
  font-size: 0.9rem;
`;

const BrandText = styled.div`
  font-weight: 800;
  letter-spacing: 0.06em;
  font-size: 1rem;
  span {
    color: ${NEON};
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 18px;
  margin: 0 auto;

  @media (max-width: 900px) {
    position: fixed;
    inset: 56px 0 auto auto;
    right: 0;
    width: 100%;
    max-width: 320px;
    background: rgba(15,23,42,0.98);
    border-left: 1px solid rgba(148,163,184,0.35);
    border-bottom: 1px solid rgba(148,163,184,0.35);
    padding: 16px;
    flex-direction: column;
    transform: ${({ open }) => (open ? "translateX(0)" : "translateX(100%)")};
    transition: transform 0.25s ease;
    z-index: 40;
  }
`;

const NavItem = styled.button`
  position: relative;
  background: transparent;
  border: 0;
  color: ${({ $active }) => ($active ? NEON : MUTED)};
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 999px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  transition: color 0.2s ease, background 0.2s ease, transform 0.15s ease;

  &:hover {
    color: ${NEON};
    background: rgba(148,163,184,0.12);
    transform: translateY(-1px);
  }

  &::after {
    content: "";
    position: absolute;
    left: 12px;
    right: 12px;
    bottom: -2px;
    height: 2px;
    background: ${NEON};
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
  color: ${NEON};
  font-size: 1.3rem;
  cursor: pointer;
  @media (max-width: 900px) {
    display: inline-flex;
  }
`;

/* MAIN CONTENT */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Main = styled.main`
  flex: 1;
  padding: 40px 40px 60px;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 28px 16px 50px;
  }
`;

const Intro = styled.div`
  text-align: center;
  margin-bottom: 32px;
  animation: ${fadeUp} 0.6s ease both;
`;

const IntroHeading = styled.h1`
  margin: 0 0 6px 0;
  font-size: clamp(1.8rem, 2.5vw, 2.2rem);
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const IntroSub = styled.p`
  margin: 0;
  color: ${MUTED};
  font-size: 0.95rem;
`;

/* TEAM SECTION */
const TeamSection = styled.section`
  margin-bottom: 44px;
  animation: ${fadeUp} 0.6s ease both;
`;

const SectionHeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const SectionBar = styled.div`
  width: 3px;
  height: 20px;
  border-radius: 999px;
  background: ${NEON};
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-size: 0.95rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
`;

const MembersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 26px;

  @media (max-width: 600px) {
    gap: 20px;
  }
`;

const MemberCard = styled.div`
  background: rgba(15,23,42,0.95);
  border-radius: 18px;
  padding: 14px 14px 16px;
  border: 1px solid rgba(148,163,184,0.28);
  box-shadow: 0 18px 45px rgba(15,23,42,0.8);
  display: flex;
  flex-direction: column;
`;

const MemberImageWrapper = styled.div`
  width: 100%;
  aspect-ratio: 4 / 5; /* keeps all cards same height like your reference */
  border-radius: 14px;
  overflow: hidden;
  background: #020617;
  margin-bottom: 12px;
`;

const MemberImage = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
`;

const MemberName = styled.div`
  font-weight: 600;
  font-size: 0.98rem;
  margin-bottom: 2px;
`;

const MemberRole = styled.div`
  font-size: 0.8rem;
  color: ${MUTED};
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
    999: "Other",
  };

  return Object.values(groups)
    .sort((a, b) => a.groupId - b.groupId)
    .map((g) => ({
      ...g,
      label: labelMap[g.groupId] || "Team",
    }));
}

/* PAGE COMPONENT */
const TeamPage = ({ onNavigate = () => {}, teamData = [], fixedRoles = [] }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const mainRef = useRef(null);

  // simple star-ish subtle background glow on mount
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
                          "https://via.placeholder.com/400x500/020617/94a3b8?text=Team+Member"
                        }
                        alt={member.name}
                      />
                    </MemberImageWrapper>

                    <MemberName>{member.name}</MemberName>
                    <MemberRole>{member.role}</MemberRole>
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
