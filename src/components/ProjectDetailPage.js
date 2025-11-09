import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';

// --- GLOBAL STYLES ---
const GlobalStyle = createGlobalStyle`
    body {
        margin: 0;
        font-family: sans-serif;
        background-color: #0d0d0d;
        color: #e0e0e0;
        min-height: 100vh;
    }
`;

// --- Styled Components ---
const ProjectContainer = styled.div`
    width: 100%;
    min-height: 100vh;
    background-color: #0d0d0d;
    padding-top: 80px; 
`;
const Header = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 50px;
    background-color: #000000;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    box-sizing: border-box;
    z-index: 1000;
    border-bottom: 1px solid #1a1a1a;
`;
const Logo = styled.h1`
    color: #00e0b3; 
    font-size: 1.8em;
    margin: 0;
    cursor: pointer;
`;
const NavItem = styled.a`
    color: white;
    text-decoration: none;
    margin-left: 30px;
    font-size: 0.95em;
    transition: color 0.3s ease;
    cursor: pointer;
    
    &:hover {
        color: #00e0b3;
    }
`;
const Footer = styled.footer`
    background-color: #000000;
    padding: 30px 50px;
    text-align: center;
    color: #555;
    border-top: 1px solid #1a1a1a;
    margin-top: 100px;
`;

// --- Project-Specific Styles ---
const ProjectHeader = styled.div`
    max-width: 1000px;
    margin: 40px auto 0;
    padding: 0 20px;
    box-sizing: border-box;
`;
const HeaderImage = styled.img`
    width: 100%;
    height: auto;
    max-height: 70vh; 
    object-fit: contain; 
    border-radius: 10px;
    background-color: #1a1a1a;
`;
const ProjectTitle = styled.h1`
    font-size: 3.5em;
    color: white;
    margin: 30px 0 10px 0;
    text-align: left;
`;
const TagContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 40px;
    border-bottom: 1px solid #3a3a3a;
    padding-bottom: 20px;
`;
const Tag = styled.span`
    background-color: #00e0b3;
    color: #1a1a1a;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.75em;
    font-weight: bold;
`;
const ProjectContent = styled.div`
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 20px;
    color: #cccccc;
    line-height: 1.8;
    font-size: 1.1em;
    white-space: pre-wrap; 
`;

const GitHubButton = styled.a`
    background-color: #00e0b3;
    color: #1a1a1a;
    border: none;
    padding: 12px 25px;
    border-radius: 5px;
    font-size: 1em;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    margin-top: 40px;

    &:hover {
        background-color: #00c7a0;
    }
`;

// --- ProjectDetailPage Component ---
const ProjectDetailPage = ({ onNavigate, projects }) => {
    const { id } = useParams(); // Get the ':id' from the URL
    const safeProjects = projects || [];
    const project = safeProjects.find(p => p._id === id);

    if (!projects || projects.length === 0) {
        return (
             <h1 style={{color: 'white', textAlign: 'center', paddingTop: '100px'}}>Loading Project...</h1>
        );
    }
    
    if (!project) {
        return <Navigate to="/projects" replace />;
    }
    
    return (
        <ProjectContainer>
            <GlobalStyle />
            {/* --- HEADER --- */}
            <Header>
                <Logo onClick={() => onNavigate('home')}>NEXORA</Logo>
                <div>
                    <NavItem onClick={() => onNavigate('home')}>Home</NavItem>
                    <NavItem onClick={() => onNavigate('about')}>About</NavItem>
                    <NavItem onClick={() => onNavigate('services')}>Services</NavItem>
                    <NavItem onClick={() => onNavigate('projects')}>Projects</NavItem>
                    <NavItem onClick={() => onNavigate('blog')}>Blog</NavItem>
                    <NavItem onClick={() => onNavigate('contact')}>Contact</NavItem>
                </div>
            </Header>

            {/* --- PROJECT HEADER --- */}
            <ProjectHeader>
                {project.imageUrl && (
                    <HeaderImage src={project.imageUrl} alt={project.title} />
                )}
                <ProjectTitle>{project.title}</ProjectTitle>
                <TagContainer>
                    {project.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}
                </TagContainer>
            </ProjectHeader>

            {/* --- PROJECT CONTENT --- */}
            <ProjectContent>
                {project.description}

                {/* --- THE GITHUB LINK --- */}
                {project.projectUrl && (
                    <GitHubButton href={project.projectUrl} target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faLink} />
                        View Project (GitHub)
                    </GitHubButton>
                )}
            </ProjectContent>

            {/* --- FOOTER --- */}
            <Footer>
                &copy; 2025 Crafted with care by NEXORA Team, JJ College.
            </Footer>
        </ProjectContainer>
    );
};

export default ProjectDetailPage;