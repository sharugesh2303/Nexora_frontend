import React, { useMemo, useEffect, useRef } from 'react';
import styled, { createGlobalStyle, keyframes, css } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBullseye, faEye, faRocket, faPencilAlt,
    faGlobe, faLink, faAddressCard
} from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faGithub, faInstagram, faTwitter, faFacebook } from '@fortawesome/free-brands-svg-icons';

/* ---------------- THEME ---------------- */
const NEON_COLOR = '#00e0b3';
const NAVY_BG = '#071025';
const PANEL_BG = '#0F172A';
const TEXT_LIGHT = '#E6F0F2';
const TEXT_MUTED = '#9AA8B8';
const BORDER_LIGHT = 'rgba(255,255,255,0.04)';

/* ---------------- KEYFRAMES ---------------- */
const slideInUp = keyframes`
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
`;
const softGlow = keyframes`
    0% { box-shadow: 0 0 0 rgba(0,224,179,0); }
    50% { box-shadow: 0 0 14px rgba(0,224,179,0.14); }
    100% { box-shadow: 0 0 0 rgba(0,224,179,0); }
`;

/* ---------------- GLOBAL STYLE ---------------- */
const GlobalStyle = createGlobalStyle`
    html,body,#root { height: 100%; }
    body {
        margin: 0;
        font-family: 'Poppins', sans-serif;
        background: ${NAVY_BG};
        color: ${TEXT_LIGHT};
        -webkit-font-smoothing:antialiased;
        -moz-osx-font-smoothing:grayscale;
    }
    .neon-text-shadow {
        text-shadow: 0 0 8px ${NEON_COLOR}, 0 0 20px rgba(0,224,179,0.12);
    }
    .animate-in {
        opacity: 0;
        animation: ${css`${slideInUp} 0.8s cubic-bezier(0.25,0.46,0.45,0.94) forwards`};
    }
`;

/* ---------------- STAR CANVAS ---------------- */
const StarCanvas = styled.canvas`
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
    display: block;
    background: radial-gradient(circle at 12% 6%, #07102a 0%, #061022 22%, #040512 60%, #01020a 100%);
`;

/* ---------------- LAYOUT ---------------- */
const PageWrapper = styled.div`
    position: relative;
    z-index: 1;
    min-height: 100vh;
`;

/* Header */
const Header = styled.header`
    display:flex; justify-content:space-between; align-items:center;
    padding: 12px 36px;
    position: sticky; top: 0; left: 0; width: 100%;
    background: linear-gradient(180deg, rgba(7,16,38,0.78), rgba(7,16,38,0.18));
    border-bottom: 1px solid ${BORDER_LIGHT};
    z-index: 3;
    backdrop-filter: blur(6px);
`;
const Logo = styled.h1`
    color: ${NEON_COLOR}; font-size: 1.6rem; margin:0; cursor:pointer;
    ${css`text-shadow: 0 0 8px ${NEON_COLOR}, 0 0 18px rgba(0,224,179,0.1);`}
`;
const NavGroup = styled.div` display:flex; gap:18px; align-items:center; `;
const NavItem = styled.a`
    color: ${TEXT_MUTED}; text-decoration:none; cursor:pointer;
    &:hover { color: ${NEON_COLOR}; }
`;

/* Hero */
const HeroAbout = styled.section`
    padding: 120px 36px 40px;
    max-width: 1200px; margin: 0 auto;
    text-align: left;
    @media (max-width: 780px) { padding: 90px 20px; text-align:center; }
`;
const HeroTitle = styled.h1`
    font-size: 3.4rem; margin: 0 0 12px; line-height:1.02; color: ${TEXT_LIGHT};
    span { color: ${NEON_COLOR}; }
    &.glow { animation: ${css`${softGlow} 2.4s ease-in-out infinite`}; }
    @media (max-width:780px){ font-size:2rem; }
`;
const HeroParagraph = styled.p`
    color: ${TEXT_MUTED}; max-width: 840px; margin: 0 0 8px;
`;

/* Section */
const Section = styled.section`
    padding: 48px 36px; max-width: 1200px; margin: 0 auto;
    @media (max-width:780px){ padding: 36px 20px; }
`;
const SectionHeader = styled.h2`
    font-size: 2.2rem; margin: 0 0 6px; color: ${TEXT_LIGHT};
    span { color: ${NEON_COLOR}; }
`;
const SectionSubtitle = styled.p`
    color: ${TEXT_MUTED}; margin-bottom: 18px; max-width: 900px;
`;

/* MVJ card */
const MVJGrid = styled.div`
    display:grid;
    grid-template-columns: repeat(auto-fit, minmax(260px,1fr));
    gap: 20px;
    margin-top: 18px;
`;
const MVJCard = styled.div`
    background: ${PANEL_BG};
    border-radius: 12px; padding: 22px; border: 1px solid ${BORDER_LIGHT};
    transition: transform .22s ease, border-color .22s ease, box-shadow .22s ease;
    box-shadow: 0 8px 32px rgba(0,0,0,0.6);
    &:hover { transform: translateY(-8px); border-color: ${NEON_COLOR}; box-shadow: 0 20px 60px rgba(0,224,179,0.06); }
    .icon-box { width:60px; height:60px; border-radius:50%; display:flex; align-items:center; justify-content:center; margin-bottom:12px; border: 1px solid rgba(255,255,255,0.03); background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.06)); }
    h3 { margin: 0 0 8px; color: ${TEXT_LIGHT}; font-size:1rem; }
    p { margin:0; color: ${TEXT_MUTED}; font-size:0.95rem; line-height:1.5; }
`;

/* Team */
const TeamContainer = styled.div`
    margin-top: 18px;
    display:flex; flex-direction:column; gap: 22px;
`;

// Define size constants for easier modification
// ALL MEMBERS WILL NOW USE THIS SIZE
const MEMBER_CIRCLE_SIZE = '280px'; 


/* ------------------ UPDATED TeamMemberCard STYLES ------------------ */
const TeamMemberCard = styled.div`
    background: transparent;
    border: none;
    box-shadow: none;

    transition: transform .22s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    position: relative;

    // Adjust top padding based on the single, larger circle size
    padding-top: calc(${MEMBER_CIRCLE_SIZE} / 2 + 10px);
    margin-top: calc(${MEMBER_CIRCLE_SIZE} / 2);
    
    max-width: 420px; // A suitable max-width for individual cards
    margin-left: auto;
    margin-right: auto;

    &:hover { transform: none; }

    .image-wrapper {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translate(-50%, -50%);

        // Apply the single, larger size to all circles
        width: ${MEMBER_CIRCLE_SIZE};
        height: ${MEMBER_CIRCLE_SIZE};
        border-radius: 50%;
        overflow: hidden;
        border: 4px solid ${NEON_COLOR};
        box-shadow: 0 0 20px rgba(0,224,179,0.6);
        display: flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.18));
        z-index: 2;
    }

    img {
        width: 100%;
        height: 100%;
        object-fit: cover; 
        object-position: center center;
        display: block;
    }

    .meta {
        width: 100%;
        min-height: 100px;
        padding: 12px 14px 20px;

        background: ${PANEL_BG};
        border-radius: 8px;
        border: 1px solid ${BORDER_LIGHT};
        box-shadow: 0 4px 15px rgba(0,0,0,0.4);

        h3 { margin: 6px 0 4px; color: ${TEXT_LIGHT}; font-size:1.05rem; }
        span { color: ${NEON_COLOR}; display:block; margin-bottom:6px; font-size:0.95rem; }
        p { color: ${TEXT_MUTED}; margin:0; font-size:0.9rem; line-height:1.45; }
    }
`;
/* -------------------------------------------------------------------- */

/* small grid for non-leader members - narrower cards */
const SmallGrid = styled.div`
    display:grid;
    // Adjusted minmax to accommodate larger cards
    grid-template-columns: repeat(auto-fit, minmax(300px,1fr)); 
    gap: 16px;
`;

/* Footer */
const Footer = styled.footer`
    padding: 28px 36px; color: ${TEXT_MUTED}; text-align:center; border-top: 1px solid rgba(255,255,255,0.03);
`;

/* Icon mapping */
const PLATFORM_ICONS = {
    linkedin: faLinkedin, github: faGithub, instagram: faInstagram, twitter: faTwitter,
    facebook: faFacebook, website: faGlobe, default: faLink
};
const getSocialIcon = (platform) => {
    const lower = (platform || '').toLowerCase();
    if (lower.includes('linkedin')) return PLATFORM_ICONS.linkedin;
    if (lower.includes('github')) return PLATFORM_ICONS.github;
    if (lower.includes('instagram')) return PLATFORM_ICONS.instagram;
    if (lower.includes('twitter')) return PLATFORM_ICONS.twitter;
    if (lower.includes('facebook')) return PLATFORM_ICONS.facebook;
    if (lower.includes('web') || lower.includes('site') || lower.includes('url')) return PLATFORM_ICONS.website;
    return PLATFORM_ICONS.default;
};

const SECTION_ICONS = {
    'Mission': faBullseye, 'Vision': faEye, 'Journey': faRocket,
    'Custom': faAddressCard, 'Text': faAddressCard, default: faPencilAlt
};
const getSectionIcon = (type) => SECTION_ICONS[type] || SECTION_ICONS.default;

const customRoleSorter = (a, b) => {
    if (a.group !== b.group) return a.group - b.group;
    return a.subGroup - b.subGroup;
};

/* ---------------- Component ---------------- */
const AboutPage = ({ onNavigate = () => {}, aboutData = {}, teamData = [], fixedRoles = [] }) => {
    const canvasRef = useRef(null);

    /* Star animation */
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: true });
        const DPR = window.devicePixelRatio || 1;

        function resize() {
            canvas.width = Math.max(window.innerWidth, 300) * DPR;
            canvas.height = Math.max(window.innerHeight, 300) * DPR;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        }
        resize();

        let w = canvas.width / DPR;
        let h = canvas.height / DPR;
        const stars = Array.from({ length: 160 }, () => ({
            x: Math.random() * w,
            y: Math.random() * h,
            baseR: 0.5 + Math.random() * 1.6,
            dx: (Math.random() - 0.5) * 0.3,
            dy: 0.12 + Math.random() * 0.6,
            alpha: 0.35 + Math.random() * 0.7,
            twinkleSpeed: 0.002 + Math.random() * 0.01,
            phase: Math.random() * Math.PI * 2,
            glow: 3 + Math.random() * 5
        }));

        let raf = 0;
        function draw() {
            w = canvas.width / DPR; h = canvas.height / DPR;
            const g = ctx.createLinearGradient(0, 0, 0, h);
            g.addColorStop(0, '#071025'); g.addColorStop(1, '#02040a');
            ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);

            stars.forEach(s => {
                s.x += s.dx; s.y += s.dy; s.phase += s.twinkleSpeed;
                const tw = 0.5 + Math.sin(s.phase) * 0.5;
                const r = s.baseR * (0.8 + tw * 1.5);
                const glowR = r * s.glow;

                if (s.y > h + 10) s.y = -10;
                if (s.x > w + 10) s.x = -10;
                if (s.x < -10) s.x = w + 10;

                const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, glowR);
                grad.addColorStop(0, `rgba(255,255,255,${0.9 * s.alpha})`);
                grad.addColorStop(0.12, `rgba(0,224,179,${0.6 * s.alpha})`);
                grad.addColorStop(0.35, `rgba(0,224,179,${0.18 * s.alpha})`);
                grad.addColorStop(1, 'rgba(0,0,0,0)');

                ctx.globalCompositeOperation = 'lighter';
                ctx.fillStyle = grad;
                ctx.beginPath(); ctx.arc(s.x, s.y, glowR, 0, Math.PI * 2); ctx.fill(); ctx.closePath();

                ctx.fillStyle = `rgba(255,255,255,${0.95 * s.alpha})`;
                ctx.beginPath(); ctx.arc(s.x, s.y, r, 0, Math.PI * 2); ctx.fill(); ctx.closePath();

                ctx.globalCompositeOperation = 'source-over';
            });

            raf = requestAnimationFrame(draw);
        }
        draw();

        window.addEventListener('resize', resize);
        return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
    }, []);

    /* Data handling */
    const safeAboutData = aboutData || {};
    const initialSections = [
        { type: 'Mission', title: 'Our Mission', body: safeAboutData.mission || 'Empower creativity through AI-driven solutions for students and startups. We make technology simple, accessible, and humanized for everyone.' },
        { type: 'Vision', title: 'Our Vision', body: safeAboutData.vision || 'To become the leading student-led creative startup that bridges the gap between innovative ideas and professional execution.' },
        { type: 'Journey', title: 'Our Journey', body: safeAboutData.journey || 'Started as a college project, NEXORA has grown into a trusted creative partner for 100+ clients and innovators.' },
    ];
    const mvjSections = initialSections.filter(s => s.body && s.title);
    const customBlocks = Array.isArray(safeAboutData.sections) ? safeAboutData.sections.filter(s => s.type === 'Custom' || s.type === 'Text') : [];
    const safeTeamData = Array.isArray(teamData) ? teamData : [];
    const safeFixedRoles = fixedRoles || [];

    const groupedAndSortedTeam = useMemo(() => {
        const rolesMap = safeFixedRoles.reduce((map, role) => {
            map[role.name] = { group: role.group, subGroup: role.subGroup, name: role.name }; return map;
        }, {});
        const grouped = safeTeamData.reduce((acc, member) => {
            const roleName = member.role || 'Unassigned';
            if (!acc[roleName]) acc[roleName] = [];
            acc[roleName].push({ ...member, social: Array.isArray(member.social) ? member.social : [] });
            return acc;
        }, {});
        const groupsArray = Object.keys(grouped).map(roleName => {
            const roleHierarchy = rolesMap[roleName] || { group: 9999, subGroup: 0, name: roleName };
            return { roleName, group: roleHierarchy.group, subGroup: roleHierarchy.subGroup, members: grouped[roleName] };
        });
        groupsArray.sort(customRoleSorter);
        return groupsArray;
    }, [safeTeamData, safeFixedRoles]);

    /* render team group */
    const renderTeamGroup = (group, groupIndex) => {
        if (!group.members || group.members.length === 0) return null;
        // No longer distinguishing based on isSingle, all cards will be the same size
        // const isSingle = group.members.length === 1; 

        return (
            <div key={group.roleName} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }} className="animate-in" >
                <h3 style={{ color: NEON_COLOR, margin: '8px 0' }}>{group.roleName}</h3>

                {/* Now all members render within the SmallGrid */}
                <SmallGrid>
                    {group.members.map((member, idx) => (
                        <TeamMemberCard key={member._id || idx} className="animate-in">
                            <div className="image-wrapper">
                                <img
                                    // Use MEMBER_CIRCLE_SIZE for the placeholder image as well
                                    src={member.img || `https://via.placeholder.com/${parseInt(MEMBER_CIRCLE_SIZE)}x${parseInt(MEMBER_CIRCLE_SIZE)}/0f172a/00e0b3?text=Member`}
                                    alt={member.name || 'Member'}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        transformOrigin: 'center center',
                                        transform: `translate(${(typeof member.imgOffsetX === 'number' ? member.imgOffsetX : 0)}%, ${(typeof member.imgOffsetY === 'number' ? member.imgOffsetY : 0)}%) scale(${(typeof member.imgScale === 'number' ? member.imgScale : 1)})`
                                    }}
                                />
                            </div>
                            <div className="meta">
                                <h3>{member.name}</h3>
                                <span>{member.role}</span>
                                <p>{member.bio}</p>
                                {member.social && member.social.length > 0 && (
                                    <div style={{ display:'flex', gap:10, marginTop:10, justifyContent: 'center' }}>
                                        {member.social.filter(l=>l.url && l.platform).map((link, li) => (
                                            <a key={li} href={link.url} target="_blank" rel="noopener noreferrer" style={{ color: TEXT_MUTED }}>
                                                <FontAwesomeIcon icon={getSocialIcon(link.platform)} />
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </TeamMemberCard>
                    ))}
                </SmallGrid>
            </div>
        );
    };

    return (
        <>
            <GlobalStyle />
            <StarCanvas ref={canvasRef} />

            <PageWrapper>
                <Header>
                    <Logo onClick={() => onNavigate('home')} className="neon-text-shadow">NEXORA</Logo>
                    <NavGroup>
                        <NavItem onClick={() => onNavigate('home')}>Home</NavItem>
                        <NavItem onClick={() => onNavigate('about')} style={{ color: NEON_COLOR, fontWeight:700 }}>About</NavItem>
                        <NavItem onClick={() => onNavigate('services')}>Services</NavItem>
                        <NavItem onClick={() => onNavigate('projects')}>Projects</NavItem>
                        <NavItem onClick={() => onNavigate('blog')}>Blog</NavItem>
                        <NavItem onClick={() => onNavigate('contact')}>Contact</NavItem>
                    </NavGroup>
                </Header>

                <HeroAbout>
                    <div className="animate-in" style={{ animationDelay: '0.1s' }}>
                        <HeroTitle className="glow">{safeAboutData.heroTitle || 'Your Vision, Our '} <span>Code</span></HeroTitle>
                        <HeroParagraph className="animate-in" style={{ animationDelay: '0.2s' }}>
                            {safeAboutData.heroDescription || 'Elevating businesses with cutting-edge technology and creative, student-driven solutions.'}
                        </HeroParagraph>
                    </div>
                </HeroAbout>

                <Section>
                    <div className="animate-in" style={{ animationDelay: '0.4s' }}>
                        <SectionHeader>About <span>NEXORA</span></SectionHeader>
                        <SectionSubtitle>We are an innovative, student-driven consultancy delivering high-quality, AI-powered solutions.</SectionSubtitle>
                    </div>

                    <MVJGrid>
                        {mvjSections.map((s, i) => (
                            <MVJCard key={s.type || i} className="animate-in" style={{ animationDelay: `${0.6 + i * 0.12}s` }}>
                                <div className="icon-box">
                                    <FontAwesomeIcon icon={getSectionIcon(s.type)} color={NEON_COLOR} />
                                </div>
                                <h3>{s.title}</h3>
                                <p>{s.body}</p>
                            </MVJCard>
                        ))}
                    </MVJGrid>
                </Section>

                {Array.isArray(customBlocks) && customBlocks.length > 0 && customBlocks.map((section, idx) => (
                    <Section key={idx} style={{ textAlign: 'left' }}>
                        <h2 className="animate-in" style={{ animationDelay: `${1.2 + idx * 0.12}s`, color: NEON_COLOR }}>{section.title}</h2>
                        <p className="animate-in" style={{ animationDelay: `${1.3 + idx * 0.12}s`, color: TEXT_MUTED }}>{section.body}</p>
                    </Section>
                ))}

                {groupedAndSortedTeam.length > 0 && (
                    <Section style={{ paddingBottom: 72 }}>
                        <div className="animate-in" style={{ animationDelay: '1.8s' }}>
                            <SectionHeader>Meet Our <span>Team</span></SectionHeader>
                            <SectionSubtitle>The creative minds behind NEXORA's innovative solutions.</SectionSubtitle>
                        </div>

                        <TeamContainer>
                            {groupedAndSortedTeam.map((g, i) => renderTeamGroup(g, i))}
                        </TeamContainer>
                    </Section>
                )}

                <Section style={{ textAlign: 'center', paddingBottom: 60 }}>
                    <button onClick={() => onNavigate('contact')} className="animate-in" style={{
                        animationDelay: `${2.5 + groupedAndSortedTeam.length * 0.12}s`,
                        padding: '12px 28px', background: NEON_COLOR, border: 'none', borderRadius: 8, color: NAVY_BG,
                        fontWeight: 700, cursor: 'pointer', boxShadow: '0 8px 30px rgba(0,224,179,0.18)'
                    }}>
                        Let's Collaborate
                    </button>
                </Section>

                <Footer>&copy; 2025 Crafted with care by NEXORA Team, JJ College.</Footer>
            </PageWrapper>
        </>
    );
};

export default AboutPage;
