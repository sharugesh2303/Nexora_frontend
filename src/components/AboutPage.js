import React, { useMemo } from 'react';
import styled, { createGlobalStyle, keyframes, css } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faBullseye, faEye, faRocket, faPencilAlt, 
    faGlobe, faCode, faLink, faAddressCard, faBars, faTimes
} from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faGithub, faInstagram, faTwitter, faFacebook } from '@fortawesome/free-brands-svg-icons';

// --- DESIGN TOKENS (Consistent with Homepage) ---
const NEON_COLOR = '#00e0b3'; 
const PRIMARY_BG_LIGHT = '#FFFFFF'; 
const SECONDARY_BG_LIGHT = '#F8F8F8'; 
const TERTIARY_BG_LIGHT = '#EEEEEE'; 
const TEXT_DARK = '#333333'; 
const TEXT_MUTED = '#666666'; 
const BORDER_LIGHT = '#DDDDDD'; 

// --- ANIMATION KEYFRAMES ---
const slideInUp = keyframes`
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
`;
// NEW: Subtle glow for the cards
const glow = keyframes`
    0% { box-shadow: 0 0 0 rgba(0, 224, 179, 0.0); }
    50% { box-shadow: 0 0 10px rgba(0, 224, 179, 0.4), 0 0 15px rgba(0, 224, 179, 0.1); }
    100% { box-shadow: 0 0 0 rgba(0, 224, 179, 0.0); }
`;


// --- CSS Styles and Styled Components ---

const GlobalStyle = createGlobalStyle`
    body {
        margin: 0;
        font-family: 'Poppins', sans-serif;
        background-color: ${PRIMARY_BG_LIGHT};
        color: ${TEXT_DARK};
        min-height: 100vh;
    }
    .neon-text-shadow {
        text-shadow: 0 0 3px ${NEON_COLOR}, 0 0 8px rgba(0, 224, 179, 0.3);
    }
    /* Applied to all animated elements (Staggered Scroll Pop-in) */
    .animate-in {
        opacity: 0;
        animation: ${slideInUp} 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    }
`;
const AboutContainer = styled.div`
    width: 100%;
    min-height: 100vh;
    background-color: ${PRIMARY_BG_LIGHT};
    padding-top: 80px; 
`;
const Header = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 50px;
    background-color: ${PRIMARY_BG_LIGHT};
    position: sticky;
    top: 0;
    left: 0;
    width: 100%;
    box-sizing: border-box;
    z-index: 1000;
    border-bottom: 1px solid ${BORDER_LIGHT};
`;
const Logo = styled.h1`
    color: ${NEON_COLOR}; 
    font-size: 1.8em;
    margin: 0;
    cursor: pointer;
    ${css`text-shadow: 0 0 3px ${NEON_COLOR}, 0 0 8px rgba(0, 224, 179, 0.3);`}
`;
const NavItem = styled.a`
    color: ${TEXT_DARK};
    text-decoration: none;
    padding: 0 15px;
    font-size: 0.95em;
    transition: color 0.3s ease;
    cursor: pointer;
    
    &:hover {
        color: ${NEON_COLOR};
    }
`;

const Section = styled.section`
    padding: 100px 50px;
    max-width: 1200px;
    margin: 0 auto;
    text-align: center;
    background-color: ${PRIMARY_BG_LIGHT}; /* Default to white */

    @media (max-width: 768px) {
        padding: 60px 20px;
    }
`;
const SectionHeader = styled.h2`
    font-size: 3.5em;
    color: ${TEXT_DARK};
    margin-bottom: 15px;
    span {
        color: ${NEON_COLOR};
        filter: drop-shadow(0 0 2px ${NEON_COLOR});
    }
    @media (max-width: 768px) {
        font-size: 2.5em;
    }
`;
const SectionSubtitle = styled.p`
    color: ${TEXT_MUTED};
    margin-bottom: 60px;
    max-width: 700px;
    margin: 0 auto 60px auto;
    font-size: 1.15em;
`;
const HeroAbout = styled(Section)`
    padding-top: 150px;
    text-align: left;
    
    h1 {
        font-size: 4.5em;
        line-height: 1.1;
        color: ${TEXT_DARK};
        margin-bottom: 20px;
        span {
            color: ${NEON_COLOR};
        }
    }
    p {
        font-size: 1.2em;
        color: ${TEXT_MUTED};
        max-width: 700px;
    }

    @media (max-width: 768px) {
        text-align: center;
        h1 {
            font-size: 3em;
        }
    }
`;
const MVJGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 40px;
    margin-top: 40px;
`;
const MVJCard = styled.div`
    background-color: ${SECONDARY_BG_LIGHT}; /* Light card background */
    padding: 30px;
    text-align: center;
    border: 1px solid ${BORDER_LIGHT};
    border-radius: 15px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    /* Initial subtle glow animation */
    animation: ${glow} 2.5s infinite alternate; 

    &:hover {
        transform: translateY(-8px);
        /* Stronger shadow on hover */
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.08), 0 0 20px rgba(0, 224, 179, 0.5);
        animation: none; /* Stop pulsing on interaction */
    }

    .icon-box {
        background-color: ${PRIMARY_BG_LIGHT};
        width: 70px;
        height: 70px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px auto;
        border: 2px solid ${NEON_COLOR};
        /* Internal glow effect */
        box-shadow: 0 0 10px rgba(0, 224, 179, 0.5); 
    }

    h3 {
        color: ${TEXT_DARK};
        margin-bottom: 8px;
        font-size: 1.2em;
        font-weight: 700;
    }
    p {
        color: ${TEXT_MUTED};
        font-size: 0.95em;
        line-height: 1.5;
    }
`;
const RoleTitle = styled.h3`
    color: ${NEON_COLOR};
    font-size: 1.8em;
    margin: 60px 0 20px 0;
    text-align: center;
    width: 100%;
    grid-column: 1 / -1; 
    filter: drop-shadow(0 0 1px ${NEON_COLOR});
`;

const TeamGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
    gap: 30px;
    margin: 20px auto 40px auto;
    max-width: 1200px; 
    justify-content: center; 

    ${props => props.$isSingleMember && `
        grid-template-columns: 1fr; 
        max-width: 300px; 
        justify-items: center; 
    `}

    @media (max-width: 992px) {
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        padding: 0 10px;
    }
    @media (max-width: 576px) {
        grid-template-columns: 1fr;
        max-width: 100%;
        padding: 0 10px;
    }
`;
const TeamMemberCard = styled.div`
    background-color: ${PRIMARY_BG_LIGHT};
    border-radius: 10px;
    overflow: hidden;
    text-align: center;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border: 1px solid ${BORDER_LIGHT};
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
    }

    img {
        width: 100%;
        height: auto;
        aspect-ratio: 4 / 5;
        object-fit: cover;
        border-bottom: 2px solid ${NEON_COLOR}50;
    }

    h3 {
        color: ${TEXT_DARK};
        margin: 15px 0 0 0;
        font-size: 1.2em;
    }
    span {
        color: ${NEON_COLOR};
        font-size: 0.9em;
        display: block;
        margin-bottom: 5px;
    }
    p {
        color: ${TEXT_MUTED};
        font-size: 0.85em;
        padding: 0 15px 15px 15px;
        margin: 0;
    }
`;
const SocialLinks = styled.div`
    display: flex;
    justify-content: center;
    padding: 0 15px 15px;

    a {
        color: ${TEXT_MUTED};
        font-size: 1.2em;
        margin: 0 8px;
        transition: color 0.2s ease;

        &:hover {
            color: ${NEON_COLOR};
        }
    }
`;
const TeamRoleGroupContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`;
const Footer = styled.footer`
    background-color: ${SECONDARY_BG_LIGHT};
    padding: 30px 50px;
    text-align: center;
    color: ${TEXT_MUTED};
    border-top: 1px solid ${BORDER_LIGHT};
`;

// --- Icon Mapping Helpers (UNCHANGED) ---

const PLATFORM_ICONS = {
    linkedin: faLinkedin, github: faGithub, instagram: faInstagram, twitter: faTwitter,
    facebook: faFacebook, website: faGlobe, default: faLink
};

const getSocialIcon = (platform) => {
    const lowerPlatform = platform ? platform.toLowerCase() : 'default';
    if (lowerPlatform.includes('linkedin')) return PLATFORM_ICONS.linkedin;
    if (lowerPlatform.includes('github')) return PLATFORM_ICONS.github;
    if (lowerPlatform.includes('instagram')) return PLATFORM_ICONS.instagram;
    if (lowerPlatform.includes('twitter')) return PLATFORM_ICONS.twitter;
    if (lowerPlatform.includes('facebook')) return PLATFORM_ICONS.facebook;
    if (lowerPlatform.includes('web') || lowerPlatform.includes('site') || lowerPlatform.includes('url')) return PLATFORM_ICONS.website;
    return PLATFORM_ICONS.default;
};

const SECTION_ICONS = {
    'Mission': faBullseye, 'Vision': faEye, 'Journey': faRocket,
    'Custom': faAddressCard, 'Text': faAddressCard, default: faPencilAlt
};

const getSectionIcon = (type) => SECTION_ICONS[type] || SECTION_ICONS.default;

const customRoleSorter = (a, b) => {
    if (a.group !== b.group) {
        return a.group - b.group;
    }
    return a.subGroup - b.subGroup;
};

// --- AboutPage Component ---
const AboutPage = ({ 
    onNavigate,
    aboutData, 
    teamData,
    fixedRoles 
}) => {

    const safeAboutData = aboutData || {};
    // Ensure sections defaults to Mission, Vision, Journey structure if API fails
    const initialSections = [
        { type: 'Mission', title: 'Our Mission', body: safeAboutData.mission || 'Empower creativity through AI-driven solutions for students and startups. We make technology simple, accessible, and humanized for everyone.' },
        { type: 'Vision', title: 'Our Vision', body: safeAboutData.vision || 'To become the leading student-led creative startup that bridges the gap between innovative ideas and professional execution.' },
        { type: 'Journey', title: 'Our Journey', body: safeAboutData.journey || 'Started as a college project, NEXORA has grown into a trusted creative partner for 100+ clients and innovators.' },
    ];
    
    const mvjSections = initialSections.filter(s => s.body && s.title);
    
    const customBlocks = Array.isArray(safeAboutData.sections) ? safeAboutData.sections.filter(s => s.type === 'Custom' || s.type === 'Text') : [];

    const safeTeamData = Array.isArray(teamData) ? teamData : []; 
    const safeFixedRoles = fixedRoles || [];

    // --- CRITICAL USEMEMO: Group and Sort Team Data ---
    const groupedAndSortedTeam = useMemo(() => {
        const rolesMap = safeFixedRoles.reduce((map, role) => {
            map[role.name] = { group: role.group, subGroup: role.subGroup, name: role.name }; 
            return map;
        }, {});

        const grouped = safeTeamData.reduce((acc, member) => {
            const roleName = member.role || 'Unassigned';
            if (!acc[roleName]) {
                acc[roleName] = [];
            }
            const memberWithSocial = {
                ...member,
                social: Array.isArray(member.social) ? member.social : []
            };
            acc[roleName].push(memberWithSocial);
            return acc;
        }, {});

        const groupsArray = Object.keys(grouped).map(roleName => {
            const roleHierarchy = rolesMap[roleName] || { group: 9999, subGroup: 0, name: roleName }; 
            return {
                roleName,
                group: roleHierarchy.group,
                subGroup: roleHierarchy.subGroup,
                members: grouped[roleName],
            };
        });

        groupsArray.sort(customRoleSorter);
        return groupsArray;
    }, [safeTeamData, safeFixedRoles]);

    // Helper to render a group of team members
    const renderTeamGroup = (group, groupIndex) => {
        const isSingleMember = group.members.length === 1;
        
        if (group.members.length === 0) return null;
        
        const isUnassigned = group.group === 9999;

        const roleNumberDisplay = !isUnassigned
            ? `#${group.group}${group.subGroup > 0 ? `(${group.subGroup})` : ''} - `
            : '';

        // Calculate base delay for the entire group, continuing the page stagger
        // MVJ cards start at 0.6s, so Team starts after MVJ
        const teamBaseDelay = 0.6 + (mvjSections.length * 0.15); 
        const groupDelay = teamBaseDelay + (groupIndex * 0.2); 

        return (
            <TeamRoleGroupContainer key={group.roleName} className="animate-in" style={{ animationDelay: `${groupDelay}s` }}>
                <RoleTitle>
                    {group.roleName}
                </RoleTitle>
                
                <TeamGrid $isSingleMember={isSingleMember}>
                    {group.members.map((member, index) => (
                        <TeamMemberCard 
                            key={member._id} 
                            className="animate-in"
                            // Stagger members within the group
                            style={{ animationDelay: `${groupDelay + 0.1 + (index * 0.08)}s` }} 
                        >
                            <img src={member.img || 'https://via.placeholder.com/300x375/e0e0e0/555555?text=Team+Member'} alt={member.name} /> 
                            <h3>{member.name}</h3>
                            <span>{member.role}</span>
                            <p>{member.bio}</p>
                            
                            {/* Render Social Links */}
                            {member.social && member.social.length > 0 && (
                                <SocialLinks>
                                    {member.social
                                        .filter(link => link.url && link.platform)
                                        .map((link, linkIndex) => (
                                            <a 
                                                key={linkIndex}
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                title={link.platform}
                                            >
                                                <FontAwesomeIcon icon={getSocialIcon(link.platform)} />
                                            </a>
                                    ))}
                                </SocialLinks>
                            )}
                            
                        </TeamMemberCard>
                    ))}
                </TeamGrid>
            </TeamRoleGroupContainer>
        );
    };

    return (
        <AboutContainer>
            <GlobalStyle />
            
            <Header>
                <Logo onClick={() => onNavigate('home')} className="neon-text-shadow">NEXORA</Logo>
                <div>
                    <NavItem onClick={() => onNavigate('home')}>Home</NavItem>
                    <NavItem onClick={() => onNavigate('about')} style={{ color: NEON_COLOR }}>About</NavItem>
                    <NavItem onClick={() => onNavigate('services')}>Services</NavItem>
                    <NavItem onClick={() => onNavigate('projects')}>Projects</NavItem>
                    <NavItem onClick={() => onNavigate('blog')}>Blog</NavItem>
                    <NavItem onClick={() => onNavigate('contact')}>Contact</NavItem>
                </div>
            </Header>

            {/* --- HERO SECTION --- */}
            <HeroAbout>
                <h1 className="animate-in" style={{ animationDelay: '0.1s' }}>
                    {safeAboutData.heroTitle || 'Your Vision, Our '}
                    <span style={{ color: NEON_COLOR }}>Code</span>
                </h1>
                <p className="animate-in" style={{ animationDelay: '0.2s' }}>
                    {safeAboutData.heroDescription || 'Elevating businesses with cutting-edge technology and creative, student-driven solutions.'}
                </p>
            </HeroAbout>

            {/* --- MVJ Section --- */}
            <Section>
                <SectionHeader className="animate-in" style={{ animationDelay: '0.4s' }}>About <span>NEXORA</span></SectionHeader>
                <SectionSubtitle className="animate-in" style={{ animationDelay: '0.5s' }}>We are an innovative, student-driven consultancy delivering high-quality, AI-powered solutions.</SectionSubtitle>
                
                <MVJGrid>
                    {mvjSections.map((section, index) => (
                        <MVJCard 
                            key={section.type || index}
                            className="animate-in"
                            style={{ animationDelay: `${0.6 + (index * 0.15)}s` }} // Staggered delay for MVJ cards
                        >
                            <div className="icon-box">
                                <FontAwesomeIcon 
                                    icon={getSectionIcon(section.type)} 
                                    color={NEON_COLOR} 
                                    size="lg" 
                                />
                            </div>
                            <h3>{section.title}</h3>
                            <p>{section.body}</p>
                        </MVJCard>
                    ))}
                </MVJGrid>
            </Section>
            
            {/* --- CUSTOM ADDED SECTIONS --- */}
            {customBlocks.map((section, index) => (
                <Section key={section.title || index} style={{ textAlign: 'left' }}>
                    <h2 className="animate-in" style={{ animationDelay: `${1.2 + (index * 0.2)}s`, fontSize: '2em', color: NEON_COLOR }}>{section.title}</h2>
                    <p className="animate-in" style={{ animationDelay: `${1.3 + (index * 0.2)}s`, fontSize: '1.1em', color: TEXT_MUTED, whiteSpace: 'pre-wrap' }}>{section.body}</p>
                </Section>
            ))}


            {/* --- MEET OUR TEAM SECTION --- */}
            {groupedAndSortedTeam.length > 0 && (
                <Section style={{ paddingBottom: '100px', backgroundColor: SECONDARY_BG_LIGHT }}>
                    <SectionHeader className="animate-in" style={{ animationDelay: '1.8s' }}>Meet Our <span>Team</span></SectionHeader>
                    <SectionSubtitle className="animate-in" style={{ animationDelay: '1.9s' }}>The creative minds behind NEXORA's innovative solutions.</SectionSubtitle>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                        {groupedAndSortedTeam.map(renderTeamGroup)}
                    </div>
                </Section>
            )}

            {/* --- CTA BUTTON --- */}
            <Section className="animate-in" style={{ animationDelay: `${2.5 + (groupedAndSortedTeam.length * 0.2)}s` }}>
                <button 
                    style={{ 
                        padding: '15px 40px', 
                        fontSize: '1.2em', 
                        backgroundColor: NEON_COLOR, 
                        color: PRIMARY_BG_LIGHT, 
                        border: 'none', 
                        borderRadius: '8px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 15px rgba(0, 224, 179, 0.3)',
                    }} 
                    onClick={() => onNavigate('contact')}
                >
                    Let's Collaborate
                </button>
            </Section>

            <Footer>
                &copy; 2025 Crafted with care by NEXORA Team, JJ College.
            </Footer>
        </AboutContainer>
    );
};

export default AboutPage;