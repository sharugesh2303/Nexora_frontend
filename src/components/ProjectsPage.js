import React, { useState, useMemo } from 'react';
import styled, { createGlobalStyle, css, keyframes } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';

// --- DESIGN TOKENS (Matching Homepage Light Theme) ---
const NEON_COLOR = '#00e0b3'; 
const PRIMARY_ACCENT_LIGHT = '#1ddc9f';
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
const projectLoad = keyframes`
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
`;

// --- GLOBAL STYLES ---
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
    .animate-in {
        opacity: 0;
        animation: ${slideInUp} 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    }
`;

// --- General Styled Components ---
const ProjectsContainer = styled.div`
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
    position: fixed;
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
const Footer = styled.footer`
    background-color: ${SECONDARY_BG_LIGHT};
    padding: 30px 50px;
    text-align: center;
    color: ${TEXT_MUTED};
    border-top: 1px solid ${BORDER_LIGHT};
`;

// --- Filter Bar Styles ---
const FilterBar = styled.div`
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 15px;
    margin-bottom: 60px;
    animation: ${slideInUp} 0.8s 0.3s forwards;
`;

const FilterButton = styled.button`
    background-color: ${props => props.$active ? NEON_COLOR : PRIMARY_BG_LIGHT};
    color: ${props => props.$active ? TEXT_DARK : TEXT_MUTED};
    border: 1px solid ${props => props.$active ? NEON_COLOR : BORDER_LIGHT};
    padding: 10px 20px;
    border-radius: 8px;
    font-size: 0.9em;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: ${props => props.$active ? '0 5px 15px rgba(0, 224, 179, 0.2)' : 'none'};

    &:hover {
        background-color: ${NEON_COLOR}30; /* Light neon overlay on hover */
        border-color: ${NEON_COLOR};
        color: ${TEXT_DARK};
    }
`;

// --- Project Grid and Card Styles ---
const ProjectGrid = styled(motion.div)`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 40px;
    
    @media (max-width: 992px) {
        grid-template-columns: repeat(2, 1fr);
    }
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const ProjectCard = styled(motion.div)`
    background-color: ${PRIMARY_BG_LIGHT};
    border-radius: 15px;
    overflow: hidden;
    text-decoration: none;
    color: inherit;
    border: 1px solid ${BORDER_LIGHT};
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05); /* Soft starting shadow */
    transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s;
    cursor: pointer; 
    
    /* Hover effects for depth */
    &:hover {
        transform: translateY(-8px);
        border-color: ${NEON_COLOR};
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1); 
    }
`;

const CardImage = styled.div`
    display: block;
    position: relative;
    background-color: ${TERTIARY_BG_LIGHT}; /* Light placeholder background */
    height: 220px;

    img {
        width: 100%;
        height: 100%;
        display: block;
        object-fit: cover;
        transition: transform 0.5s ease;
    }
    
    ${ProjectCard}:hover & img {
        transform: scale(1.05); /* Zoom image on hover */
    }
`;

const CardContent = styled.div`
    padding: 25px;
    text-align: left;
`;

const CardTitle = styled.h3`
    color: ${TEXT_DARK};
    font-size: 1.4em;
    margin: 0 0 8px 0;
`;

const CardDescription = styled.p`
    color: ${TEXT_MUTED};
    font-size: 1em;
    line-height: 1.5;
    margin-bottom: 15px;
    min-height: 40px; 
`;

const TagContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 15px;
`;

const Tag = styled.span`
    background-color: ${NEON_COLOR}20; /* Light background neon tint */
    color: ${TEXT_DARK}; 
    padding: 5px 10px;
    border-radius: 6px;
    font-size: 0.8em;
    font-weight: 600;
    border: 1px solid ${NEON_COLOR}50;
`;

// --- ProjectsPage Component ---
const ProjectsPage = ({ onNavigate, projects }) => {
    const [activeFilter, setActiveFilter] = useState('All');
    // Defaulting project structure if empty, just like previous page logic
    const safeProjects = projects || [
        { _id: '1', title: 'College Portal Redesign', description: 'A massive project involving complete overhaul of the college’s information and enrollment system using React and Node.js.', tags: ['Web App', 'UI/UX'], imageUrl: 'https://via.placeholder.com/400x225/1ddc9f/333333?text=College+Portal' },
        { _id: '2', title: 'AI Recommendation Engine', description: 'Developed a custom machine learning model for personalized product recommendations based on user behavior data.', tags: ['AI', 'Python'], imageUrl: 'https://via.placeholder.com/400x225/3081ff/FFFFFF?text=AI+Engine' },
        { _id: '3', title: 'NEXORA Brand Identity', description: 'Our comprehensive branding project, covering logo, style guide, and core messaging for the startup.', tags: ['Branding', 'Design'], imageUrl: 'https://via.placeholder.com/400x225/00e0b3/333333?text=NEXORA+Brand' },
        { _id: '4', title: 'Mobile E-Commerce App', description: 'Cross-platform mobile application development using React Native for a local retail chain.', tags: ['Mobile', 'Web App'], imageUrl: 'https://via.placeholder.com/400x225/ff914d/FFFFFF?text=Mobile+App' },
    ];
    
    const allTags = useMemo(() => {
        const tags = new Set();
        safeProjects.forEach(p => p.tags.forEach(tag => {
            if (tag.toLowerCase() !== 'all') {
                tags.add(tag);
            }
        }));
        return ['All', ...Array.from(tags)];
    }, [safeProjects]);

    const filteredProjects = useMemo(() => {
        if (activeFilter === 'All') {
            return safeProjects;
        }
        return safeProjects.filter(p => p.tags.includes(activeFilter));
    }, [activeFilter, safeProjects]);

    // Framer Motion Variants for Project Grid
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <ProjectsContainer>
            <GlobalStyle />
            {/* --- HEADER --- */}
            <Header>
                <Logo onClick={() => onNavigate('home')} className="neon-text-shadow">NEXORA</Logo>
                <div>
                    <NavItem onClick={() => onNavigate('home')}>Home</NavItem>
                    <NavItem onClick={() => onNavigate('about')}>About</NavItem>
                    <NavItem onClick={() => onNavigate('services')}>Services</NavItem>
                    <NavItem onClick={() => onNavigate('projects')} style={{ color: NEON_COLOR }}>Projects</NavItem>
                    <NavItem onClick={() => onNavigate('blog')}>Blog</NavItem>
                    <NavItem onClick={() => onNavigate('contact')}>Contact</NavItem>
                </div>
            </Header>

            {/* --- INTRO & FILTER SECTION --- */}
            <Section style={{ paddingTop: '150px' }}>
                <SectionHeader className="animate-in" style={{ animationDelay: '0s' }}>Our <span>Projects</span></SectionHeader>
                <SectionSubtitle className="animate-in" style={{ animationDelay: '0.1s' }}>A collection of our work, demonstrating creative and technical excellence.</SectionSubtitle>
                
                <FilterBar>
                    {allTags.map(tag => (
                        <FilterButton 
                            key={tag}
                            $active={activeFilter === tag}
                            onClick={() => setActiveFilter(tag)}
                        >
                            {tag}
                        </FilterButton>
                    ))}
                </FilterBar>

                {/* --- ANIMATED PROJECT GRID --- */}
                <ProjectGrid 
                    layout
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <AnimatePresence>
                        {filteredProjects.map((project) => (
                            <ProjectCard
                                key={project._id}
                                onClick={() => onNavigate(`projects/${project._id}`)}
                                // Use Framer Motion for smooth filter/load transitions
                                layout
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                transition={{ duration: 0.4 }}
                            >
                                <CardImage>
                                    <img 
                                        src={project.imageUrl || 'https://via.placeholder.com/400x225/1ddc9f/333333?text=Project+Image'} 
                                        alt={project.title} 
                                    />
                                </CardImage>
                                <CardContent>
                                    <CardTitle>{project.title}</CardTitle>
                                    <CardDescription>{project.description.substring(0, 100)}...</CardDescription>
                                    <TagContainer>
                                        {project.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}
                                    </TagContainer>
                                </CardContent>
                            </ProjectCard>
                        ))}
                    </AnimatePresence>
                </ProjectGrid>
                {filteredProjects.length === 0 && (
                    <SectionSubtitle style={{marginTop: '50px'}}>No projects found for this filter.</SectionSubtitle>
                )}
            </Section>

            {/* --- FOOTER --- */}
            <Footer>
                &copy; 2025 Crafted with care by NEXORA Team, JJ College.
            </Footer>
        </ProjectsContainer>
    );
};

export default ProjectsPage;