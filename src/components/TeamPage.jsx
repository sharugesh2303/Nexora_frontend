import React, { useEffect, useMemo, useRef, useState } from "react";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

/* THEME */
const BG = "#ffffff";
const NAVY = "#012a4a";
const GOLD = "#d4af37";
const TEXT = "#021a40";
const MUTED = "#5b6d7a";
const BORDER = "rgba(1,42,74,0.08)";

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

/* STYLES */
const Page = styled.div`min-height:100vh;display:flex;flex-direction:column;background:linear-gradient(180deg, ${BG} 0%, #fbfdff 100%);`;

const Header = styled.header`
  position: sticky; top: 0; z-index: 30; display:flex; align-items:center; padding:14px 40px; gap:32px;
  background: rgba(255,255,255,0.9); backdrop-filter: blur(6px); border-bottom:1px solid ${BORDER};
  box-shadow:0 6px 18px rgba(2,42,74,0.04);
  @media(max-width:768px){ padding:10px 18px; gap:16px; }
`;
const BrandRow = styled.div`display:flex;align-items:center;gap:10px;cursor:pointer;`;
const BrandLogo = styled.div`width:36px;height:36px;border-radius:9px;background:linear-gradient(135deg, ${NAVY} 0%, #0a3a63 60%);display:flex;align-items:center;justify-content:center;font-weight:800;color:${BG};font-size:.95rem;box-shadow:0 6px 18px rgba(2,42,74,0.08);`;
const BrandText = styled.div`font-weight:800;letter-spacing:.04em;font-size:1rem;color:${TEXT};span{color:${GOLD}}`;

const Nav = styled.nav`
  display:flex;gap:18px;margin:0 auto;
  @media(max-width:900px){ position:fixed; inset:64px 0 auto auto; right:0; width:100%; max-width:320px; background:#fff; border-left:1px solid ${BORDER}; border-bottom:1px solid ${BORDER}; padding:16px; flex-direction:column; transform: ${({open})=>open?"translateX(0)":"translateX(100%)"}; transition:transform .25s; z-index:40; box-shadow:0 18px 40px rgba(2,42,74,0.06); }
`;
const NavItem = styled.button`
  position:relative; background:transparent; border:0; color:${({$active})=>$active?NAVY:MUTED}; font-weight:700; font-size:.9rem; cursor:pointer;
  padding:8px 12px; border-radius:999px; letter-spacing:.04em; text-transform:uppercase; display:inline-flex; align-items:center; gap:8px;
  &:hover{ color:${NAVY}; background: rgba(1,42,74,0.03); transform: translateY(-1px); }
  &::after{ content:""; position:absolute; left:12px; right:12px; bottom:-8px; height:3px; background:${GOLD}; border-radius:999px; transform: scaleX(${({$active})=>$active?1:0}); transform-origin:center; transition:transform .25s; }
`;
const MobileToggle = styled.button`display:none;border:0;background:transparent;color:${NAVY};font-size:1.25rem;cursor:pointer;@media(max-width:900px){display:inline-flex}`;

const fadeUp = keyframes`from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}`;

/* --- LAYOUT: Full Width Alignment --- */
const Main = styled.main`
  flex: 1;
  width: 100%;
  padding: 44px 40px 72px; /* Matches Header padding-left (40px) */
  @media(max-width:768px){ padding:28px 16px 50px; }
`;

const Intro = styled.div`text-align:left;margin-bottom:36px;animation:${fadeUp} .6s ease both;`;
const IntroHeading = styled.h1`margin:0 0 8px 0;font-size:clamp(1.8rem,2.6vw,2.4rem);letter-spacing:.04em;color:${NAVY};`;
const IntroSub = styled.p`margin:0;color:${MUTED};font-size:.96rem;`;

const TeamSection = styled.section`margin-bottom:48px;animation:${fadeUp} .6s ease both;`;

// Header Row (Aligned with Border Edge)
const SectionHeaderRow = styled.div`display:flex;align-items:center;gap:12px;margin-bottom:20px;`;
const SectionBar = styled.div`width:4px;height:22px;border-radius:999px;background:linear-gradient(180deg, ${GOLD} 0%, #b2882b 100%);box-shadow:0 6px 18px rgba(210,175,55,0.14);`;
const SectionTitle = styled.h2`margin:0;font-size:.95rem;letter-spacing:.12em;text-transform:uppercase;color:${NAVY};`;

// Subgroups
const SubgroupContainer = styled.div`margin-top: 10px; margin-left: 16px; border-left: 2px solid ${BORDER}; padding-left: 20px; padding-bottom: 10px;`;
const SubgroupTitle = styled.h3`margin:12px 0 10px 0;font-size:0.85rem;color:${MUTED};font-weight:700;letter-spacing:.08em;text-transform:uppercase; display:flex; align-items:center; gap:8px; &::before{ content:''; display:block; width:6px; height:6px; background:${GOLD}; border-radius:50%; }`;

// Members Grid (Aligned Left, Wrapped)
const MembersRow = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 30px;
  padding: 10px 0; /* Zero left padding ensures strict alignment */
  justify-content: flex-start;
`;

const MemberTile = styled.div`
  width: 200px;
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* Text aligns left */
  gap: 12px;
`;

const TileImageWrapper = styled.div`
  width: 100%;
  height: 200px;
  border-radius: 12px; /* Rectangular Box */
  overflow: hidden;
  border: 1px solid rgba(0,0,0,0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
  transition: transform 0.3s ease;
  &:hover { transform: translateY(-5px); }
`;

const TileImage = styled.img`width:100%;height:100%;object-fit:cover;display:block;transform: scale(${p => p.scale || 1}) translate(${p => p.x || 0}%, ${p => p.y || 0}%);`;
const TileName = styled.div`font-weight:700;color:${NAVY};text-align:left;font-size:1rem;`;

/* --- HELPER: Parse numeric values safely --- */
const parseNumeric = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

/* --- LOGIC: STRICT DB GROUPING (No Hardcoded Names) --- */
function groupByDbFields(teamData = [], fixedRoles = []) {
  const groupsObj = {};

  teamData.forEach(member => {
    // 1. Get Group ID directly from Data
    let gId = parseNumeric(member.group);
    let sId = parseNumeric(member.subgroup);

    // 2. Optional Fallback: Check fixedRoles only if DB is empty
    if (gId === null) {
      const foundRole = fixedRoles.find(fr => fr.name === member.role);
      if (foundRole) {
        gId = parseNumeric(foundRole.group);
        sId = parseNumeric(foundRole.subGroup ?? foundRole.subgroup);
      }
    }

    // 3. Default to "Group 999" (Team Members) if still missing
    if (gId === null) gId = 999; 
    if (sId === null) sId = 0;

    // 4. Create Group Bucket
    if (!groupsObj[gId]) {
      
      let calculatedLabel = "";

      if (gId === 999) {
          calculatedLabel = "TEAM MEMBERS";
      } else {
          // USE ROLE NAME AS GROUP TITLE
          calculatedLabel = member.role ? member.role.toUpperCase() : "GROUP " + gId;
      }

      groupsObj[gId] = {
        id: gId,
        label: calculatedLabel,
        mainMembers: [],
        subgroupsObj: {}
      };
    }

    // 5. Add Member to Main or Subgroup
    if (sId === 0) {
      groupsObj[gId].mainMembers.push(member);
    } else {
      if (!groupsObj[gId].subgroupsObj[sId]) {
        groupsObj[gId].subgroupsObj[sId] = {
          id: sId,
          label: `Subgroup ${sId}`,
          members: []
        };
      }
      groupsObj[gId].subgroupsObj[sId].members.push(member);
    }
  });

  // 6. Sort Groups Ascending (1, 2, 3...)
  return Object.values(groupsObj)
    .sort((a, b) => a.id - b.id)
    .map(g => ({
      ...g,
      subgroups: Object.values(g.subgroupsObj).sort((a, b) => a.id - b.id)
    }));
}

/* PAGE COMPONENT */
const TeamPage = ({ onNavigate = () => {}, teamData = [], fixedRoles = [] }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const mainRef = useRef(null);

  useEffect(() => {
    if (mainRef.current && "scrollTop" in mainRef.current) mainRef.current.scrollTop = 0;
  }, []);

  const grouped = useMemo(() => groupByDbFields(teamData, fixedRoles), [teamData, fixedRoles]);

  const handleNav = (route) => { onNavigate(route); setMenuOpen(false); };

  return (
    <>
      <GlobalStyle />
      <Page>
        <Header>
          <BrandRow onClick={() => handleNav("home")}>
            <BrandLogo>N</BrandLogo>
            <BrandText>NEXORA<span>CREW</span></BrandText>
          </BrandRow>

          <Nav open={menuOpen}>
            <NavItem onClick={() => handleNav("home")}>Home</NavItem>
            <NavItem onClick={() => handleNav("about")}>About</NavItem>
            <NavItem onClick={() => handleNav("services")}>Services</NavItem>
            <NavItem onClick={() => handleNav("projects")}>Projects</NavItem>
            <NavItem onClick={() => handleNav("blog")}>Blog</NavItem>
            <NavItem $active onClick={() => handleNav("team")}>Team</NavItem>
            <NavItem onClick={() => handleNav("contact")}>Contact</NavItem>
          </Nav>

          <MobileToggle aria-label="Toggle navigation menu" onClick={() => setMenuOpen(s => !s)}>
            <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
          </MobileToggle>
        </Header>

        <Main ref={mainRef}>
          <Intro>
            <IntroHeading>Our Team</IntroHeading>
            <IntroSub>The brilliant minds behind Nexora.</IntroSub>
          </Intro>

          {grouped.map((group) => (
            <TeamSection key={`group-${group.id}`}>
              {/* Header */}
              <SectionHeaderRow>
                <SectionBar />
                <SectionTitle>{group.label}</SectionTitle>
              </SectionHeaderRow>

              {/* Members Grid */}
              {group.mainMembers && group.mainMembers.length > 0 && (
                <MembersRow>
                  {group.mainMembers.map((m, i) => (
                    <MemberTile key={`${m._id}-m${i}`}>
                      <TileImageWrapper>
                        <TileImage 
                          src={m.img || "https://via.placeholder.com/320x320/ffffff/e6eef8?text=Member"} 
                          alt={m.name} 
                          scale={m.imgScale} x={m.imgOffsetX} y={m.imgOffsetY}
                        />
                      </TileImageWrapper>
                      <TileName>{m.name}</TileName>
                    </MemberTile>
                  ))}
                </MembersRow>
              )}

              {/* Subgroups */}
              {group.subgroups && group.subgroups.length > 0 && group.subgroups.map((sub) => (
                <SubgroupContainer key={`g${group.id}-s${sub.id}`}>
                  <SubgroupTitle>{sub.label}</SubgroupTitle>
                  {sub.members && sub.members.length > 0 ? (
                    <MembersRow>
                      {sub.members.map((m, i) => (
                        <MemberTile key={`${m._id}-s${sub.id}-m${i}`}>
                          <TileImageWrapper>
                            <TileImage 
                              src={m.img || "https://via.placeholder.com/320x320/ffffff/e6eef8?text=Member"} 
                              alt={m.name}
                              scale={m.imgScale} x={m.imgOffsetX} y={m.imgOffsetY} 
                            />
                          </TileImageWrapper>
                          <TileName>{m.name}</TileName>
                        </MemberTile>
                      ))}
                    </MembersRow>
                  ) : null}
                </SubgroupContainer>
              ))}
            </TeamSection>
          ))}

          {grouped.length === 0 && <IntroSub>No team members added yet.</IntroSub>}
        </Main>
      </Page>
    </>
  );
};

export default TeamPage;