import React, { useEffect, useMemo, useRef, useState } from "react";
import styled, { createGlobalStyle, keyframes } from "styled-components";
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
const TEXT_LIGHT = '#111827';          // Dark text for white bg
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
    html, body, #root { height: 100%; }

    body {
        margin: 0;
        font-family: 'Poppins', sans-serif;
        background: #ffffff; /* Pure White Background */
        color: ${TEXT_LIGHT};
        overflow-x: hidden;
    }

    .animate-in {
        opacity: 0;
        transform: translateY(20px);
        animation: fadeSlide 0.8s ease forwards;
    }

    @keyframes fadeSlide {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

/* =========================================
   STAR CANVAS BACKGROUND
   ========================================= */
const StarCanvas = styled.canvas`
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
`;

/* =========================================
   LAYOUT COMPONENTS
   ========================================= */
const PageWrapper = styled.div`
    position: relative;
    z-index: 1;
    min-height: 100vh;
    background: #ffffff;
`;

const Header = styled.header`
    display: flex;
    align-items: center;
    gap: 40px;
    padding: 14px 48px;
    position: sticky;
    top: 0;
    width: 100%;
    background: rgba(255,255,255,0.98);
    border-bottom: 1px solid ${BORDER_LIGHT};
    z-index: 100;

    @media (max-width: 780px) {
        padding: 12px 20px;
        gap: 18px;
    }
`;

const Logo = styled.h1`
    color: ${NEON_COLOR};
    font-size: 1.8rem;
    font-weight: 800;
    cursor: pointer;
    letter-spacing: 1px;
    text-shadow: 0 0 8px rgba(18,49,101,0.1);
`;

const NavGroup = styled.div`
    display: flex;
    gap: 22px;
    align-items: center;
    margin-right: auto;

    @media (max-width: 1024px) {
        display: none;
    }

    span {
        color: ${TEXT_MUTED};
        cursor: pointer;
        font-weight: 500;
        position: relative;
        transition: 0.3s ease;
        padding: 6px 4px;

        &:hover {
            color: ${NEON_COLOR};
        }

        &:after {
            content: '';
            position: absolute;
            left: 0;
            bottom: -2px;
            width: 0;
            height: 2px;
            background: ${GOLD_ACCENT};
            transition: 0.3s;
            border-radius: 4px;
        }
        &:hover:after {
            width: 100%;
        }
    }
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
        margin-left: auto;
    }
`;

const MobileNavMenu = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
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
        top: 20px;
        right: 20px;
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

        &:hover {
            color: ${NEON_COLOR};
        }
    }
`;

/* =========================================
   HERO SECTION
   ========================================= */
const HeroTeam = styled.section`
    padding: 140px 36px 40px;
    max-width: 1200px;
    margin: 0 auto;
    text-align: left;

    @media (max-width: 780px) {
        padding: 120px 20px 30px;
        text-align: center;
    }
`;

const HeroTitle = styled.h1`
    font-size: 3.6rem;
    font-weight: 800;
    margin-bottom: 16px;
    line-height: 1.05;
    
    /* Simple solid color, no glow/shadow */
    color: ${NEON_COLOR}; 

    span {
        color: ${GOLD_ACCENT};
    }

    @media (max-width: 780px) {
        font-size: 2.6rem;
    }
`;

const HeroParagraph = styled.p`
    max-width: 760px;
    color: ${TEXT_MUTED};
    font-size: 1.05rem;
    line-height: 1.7;

    @media (max-width: 780px) {
        margin-left: auto;
        margin-right: auto;
        font-size: 1rem;
    }
`;

/* =========================================
   TEAM GRID STYLES
   ========================================= */
const TeamContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px 36px 80px;
    @media (max-width: 780px) {
        padding: 20px 20px 60px;
    }
`;

const SectionHeaderRow = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 60px;
    margin-bottom: 30px;
    animation: ${rollIn} 0.6s ease forwards;
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
    letter-spacing: .02em;
    color: ${NEON_COLOR}; 
    font-weight: 800;
`;

const MembersGrid = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start; /* Strict Left Alignment */
    gap: 30px;
`;

const MemberCard = styled.div`
    width: 260px; /* Fixed width */
    background: #ffffff;
    border-radius: 18px;
    padding: 20px;
    border: 1px solid ${BORDER_LIGHT};
    transition: 0.3s ease;
    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    /* Subtle hover lift */
    &:hover {
        transform: translateY(-8px);
        border-color: ${GOLD_ACCENT};
        box-shadow: 0 20px 40px rgba(0,0,0,0.08);
    }
`;

const ImageWrapper = styled.div`
    width: 100%;
    aspect-ratio: 1/1;
    border-radius: 14px;
    overflow: hidden;
    margin-bottom: 18px;
    background: #f8f9fa;
    border: 1px solid rgba(0,0,0,0.05);
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
`;

const SubgroupBlock = styled.div`
    margin-top: 20px;
    padding-left: 20px;
    border-left: 2px solid ${BORDER_LIGHT};
`;

const SubgroupHeader = styled.h4`
    font-size: 1.1rem;
    color: ${TEXT_MUTED};
    margin-bottom: 15px;
    display: flex; 
    align-items: center; 
    gap: 8px;
    
    &::before { 
        content: ''; 
        display: block; 
        width: 6px; 
        height: 6px; 
        background: ${GOLD_ACCENT}; 
        border-radius: 50%; 
    }
`;

/* =========================================
   FOOTER STYLES
   ========================================= */
const FullFooter = styled.footer`
    background: #ffffff;
    padding: 60px 50px 20px;
    color: ${TEXT_MUTED};
    border-top: 1px solid ${BORDER_LIGHT};

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

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 20px;
    }
`;

const FooterColumn = styled.div`
    min-width: 200px;
    @media (max-width: 768px) {
        min-width: unset;
        width: 100%;
        margin-bottom: 10px;
    }

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
    p {
        font-size: 0.9rem;
        line-height: 1.6;
        margin: 0 0 10px 0;
    }
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
        &:hover {
            color: ${NEON_COLOR};
        }
    }
`;

const FooterLogo = styled(Logo)`
    font-size: 1.5rem;
    margin-bottom: 10px;
`;

const SocialIcons = styled.div`
    display: flex;
    gap: 15px;
    margin-top: 15px;

    a {
        width: 32px;
        height: 32px;
        border-radius: 999px;
        background: #f3f4f6;
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${NEON_COLOR};
        transition: background 0.3s, color 0.3s, box-shadow 0.3s;

        &:hover {
            background: linear-gradient(135deg, ${NEON_COLOR}, ${GOLD_ACCENT});
            color: #ffffff;
            box-shadow: 0 8px 20px rgba(15,23,42,0.2);
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
   LOGIC UTILS
   ========================================= */
const parseNumeric = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
};

function groupByDbFields(teamData = [], fixedRoles = []) {
    const groupsObj = {};

    teamData.forEach(member => {
        let gId = parseNumeric(member.group);
        let sId = parseNumeric(member.subgroup);

        if (gId === null) {
            const foundRole = fixedRoles.find(fr => fr.name === member.role);
            if (foundRole) {
                gId = parseNumeric(foundRole.group);
                sId = parseNumeric(foundRole.subGroup ?? foundRole.subgroup);
            }
        }

        if (gId === null) gId = 999; 
        if (sId === null) sId = 0;

        if (!groupsObj[gId]) {
            let calculatedLabel = "";
            if (gId === 999) calculatedLabel = "TEAM MEMBERS";
            else calculatedLabel = member.role ? member.role.toUpperCase() : "GROUP " + gId;

            groupsObj[gId] = {
                id: gId,
                label: calculatedLabel,
                mainMembers: [],
                subgroupsObj: {}
            };
        }

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

    return Object.values(groupsObj)
        .sort((a, b) => a.id - b.id)
        .map(g => ({
            ...g,
            subgroups: Object.values(g.subgroupsObj).sort((a, b) => a.id - b.id)
        }));
}

/* =========================================
   MAIN COMPONENT
   ========================================= */
const TeamPage = ({ onNavigate = () => {}, teamData = [], fixedRoles = [], generalData = {} }) => {
    const canvasRef = useRef(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    /* Gold particle animation in background */
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
    }, []);

    const handleNavigation = (route) => {
        onNavigate(route);
        setIsMobileMenuOpen(false);
    };

    const grouped = useMemo(() => groupByDbFields(teamData, fixedRoles), [teamData, fixedRoles]);

    const safeGeneralData = {
        email: generalData?.email || 'nexora.crew@gmail.com',
        phone: generalData?.phone || '+91 95976 46460',
        location: generalData?.location || 'JJ College of Engineering, Trichy',
    };

    const navItems = ['home', 'about', 'services', 'projects', 'team', 'progress', 'blog', 'contact'];

    return (
        <>
            <GlobalStyle />
            <StarCanvas ref={canvasRef} />
            <PageWrapper>
                {/* HEADER */}
                <Header>
                    <Logo onClick={() => handleNavigation('home')}>NEXORACREW</Logo>
                    <NavGroup>
                        {navItems.map((item) => (
                            <span
                                key={item}
                                onClick={() => handleNavigation(item)}
                                style={item === 'team' ? { color: NEON_COLOR } : {}}
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
                            style={item === 'team' ? { color: NEON_COLOR } : {}}
                        >
                            {item.charAt(0).toUpperCase() + item.slice(1)}
                        </span>
                    ))}
                </MobileNavMenu>

                {/* HERO */}
                <HeroTeam>
                    <div className="animate-in">
                        <HeroTitle>
                            Meet Our <span>Team</span>
                        </HeroTitle>
                        <HeroParagraph className="animate-in" style={{ animationDelay: '0.2s' }}>
                            The brilliant minds and creative souls behind Nexora. We are a diverse group of developers, designers, and innovators.
                        </HeroParagraph>
                    </div>
                </HeroTeam>

                {/* TEAM GRID */}
                <TeamContainer>
                    {grouped.map((group, gIdx) => (
                        <div key={`group-${group.id}`}>
                            {/* Group Title */}
                            <SectionHeaderRow>
                                <SectionBar />
                                <SectionTitle>{group.label}</SectionTitle>
                            </SectionHeaderRow>

                            {/* Main Members */}
                            {group.mainMembers && group.mainMembers.length > 0 && (
                                <MembersGrid>
                                    {group.mainMembers.map((m, i) => (
                                        <MemberCard 
                                            key={`${m._id}-m${i}`} 
                                            className="animate-in" 
                                            style={{ animationDelay: `${0.1 * i}s` }}
                                        >
                                            <ImageWrapper>
                                                <img 
                                                    src={m.img || "https://via.placeholder.com/320x320/ffffff/e6eef8?text=Member"} 
                                                    alt={m.name} 
                                                    style={{ transform: `scale(${m.imgScale || 1}) translate(${m.imgOffsetX || 0}%, ${m.imgOffsetY || 0}%)` }}
                                                />
                                            </ImageWrapper>
                                            <MemberName>{m.name}</MemberName>
                                        </MemberCard>
                                    ))}
                                </MembersGrid>
                            )}

                            {/* Subgroups */}
                            {group.subgroups && group.subgroups.map((sub) => (
                                <SubgroupBlock key={`g${group.id}-s${sub.id}`}>
                                    <SubgroupHeader>{sub.label}</SubgroupHeader>
                                    <MembersGrid>
                                        {sub.members.map((m, i) => (
                                            <MemberCard 
                                                key={`${m._id}-s${sub.id}-m${i}`}
                                                className="animate-in" 
                                                style={{ animationDelay: `${0.1 * i}s` }}
                                            >
                                                <ImageWrapper>
                                                    <img 
                                                        src={m.img || "https://via.placeholder.com/320x320/ffffff/e6eef8?text=Member"} 
                                                        alt={m.name}
                                                        style={{ transform: `scale(${m.imgScale || 1}) translate(${m.imgOffsetX || 0}%, ${m.imgOffsetY || 0}%)` }}
                                                    />
                                                </ImageWrapper>
                                                <MemberName>{m.name}</MemberName>
                                            </MemberCard>
                                        ))}
                                    </MembersGrid>
                                </SubgroupBlock>
                            ))}
                        </div>
                    ))}

                    {grouped.length === 0 && (
                        <HeroParagraph style={{ textAlign: 'center', marginTop: '50px' }}>
                            No team members found.
                        </HeroParagraph>
                    )}
                </TeamContainer>

                {/* JOIN US CTA */}
                <div style={{ background: '#ffffff', padding: '60px 20px', textAlign: 'center', marginTop: '40px', borderTop: `1px solid ${BORDER_LIGHT}` }}>
                    <h2 style={{ color: NEON_COLOR, fontSize: '2rem', marginBottom: '10px', fontWeight: 800 }}>
                        Want to <span style={{ color: GOLD_ACCENT }}>Join Us?</span>
                    </h2>
                    <p style={{ color: TEXT_MUTED, maxWidth: '600px', margin: '0 auto 30px' }}>
                        We are always looking for passionate talent to help us build the future.
                    </p>
                    <button
                        onClick={() => handleNavigation('contact')}
                        style={{
                            padding: '14px 32px',
                            background: `linear-gradient(135deg, ${NEON_COLOR}, ${GOLD_ACCENT})`,
                            border: 'none',
                            borderRadius: 999,
                            color: '#ffffff',
                            fontWeight: 700,
                            cursor: 'pointer',
                            boxShadow: '0 14px 40px rgba(0,0,0,0.1)',
                            fontSize: '1.05rem',
                        }}
                    >
                        Contact Us
                    </button>
                </div>

                {/* FOOTER */}
                <FullFooter>
                    <FooterGrid>
                        <FooterColumn style={{ minWidth: '300px' }}>
                            <FooterLogo onClick={() => handleNavigation('home')}>
                                NEXORACREW
                            </FooterLogo>
                            <p>
                                Transforming ideas into powerful digital products using modern
                                technology, creativity, and AI. Where ideas meet innovation.
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
                                    'Web Development', 'AI Solutions', 'SEO & Growth', 
                                    'Branding & Design', 'Server Architecture'
                                ].map((l, i) => (
                                    <li key={i}>
                                        <a onClick={() => handleNavigation('services')}>{l}</a>
                                    </li>
                                ))}
                            </ul>
                        </FooterColumn>

                        <FooterColumn>
                            <h4>Contact Info</h4>
                            <ul>
                                <li>
                                    <a href="#map">
                                        <FontAwesomeIcon icon={faMapMarkerAlt} /> {safeGeneralData.location}
                                    </a>
                                </li>
                                <li>
                                    <a href={`mailto:${safeGeneralData.email}`}>
                                        <FontAwesomeIcon icon={faEnvelope} /> {safeGeneralData.email}
                                    </a>
                                </li>
                                <li>
                                    <a href={`tel:${safeGeneralData.phone}`}>
                                        <FontAwesomeIcon icon={faPhone} /> {safeGeneralData.phone}
                                    </a>
                                </li>
                            </ul>
                        </FooterColumn>
                    </FooterGrid>

                    <Copyright>
                        © 2025 Nexoracrew. All Rights Reserved.
                    </Copyright>
                </FullFooter>
            </PageWrapper>
        </>
    );
};

export default TeamPage;