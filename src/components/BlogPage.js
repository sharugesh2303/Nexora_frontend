// --- Updated BlogPage.js ---

import React from 'react';
import styled, { createGlobalStyle, keyframes, css } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

// --- DESIGN TOKENS ---
const NEON_COLOR = '#00e0b3'; 
const PRIMARY_ACCENT_LIGHT = '#1ddc9f'; 
const PRIMARY_BG_LIGHT = '#FFFFFF'; 
const SECONDARY_BG_LIGHT = '#F8F8F8'; 
const TERTIARY_BG_LIGHT = '#EEEEEE'; 
const TEXT_DARK = '#333333'; 
const TEXT_MUTED = '#666666'; 
const BORDER_LIGHT = '#DDDDDD'; 

// --- ANIMATIONS ---
const slideInUp = keyframes`
    from { opacity: 0; transform: translateY(50px); }
    to { opacity: 1; transform: translateY(0); }
`;
const pulseBorder = keyframes`
    0% { box-shadow: 0 0 0 rgba(0, 224, 179, 0); }
    50% { box-shadow: 0 0 15px rgba(0, 224, 179, 0.4); }
    100% { box-shadow: 0 0 0 rgba(0, 224, 179, 0); }
`;

// --- GLOBAL STYLE ---
const GlobalStyle = createGlobalStyle`
    body {
        margin: 0;
        font-family: 'Poppins', sans-serif; 
        background-color: ${SECONDARY_BG_LIGHT}; 
        color: ${TEXT_DARK}; 
        min-height: 100vh;
        overflow-x: hidden; 
    }
    .animate-in {
        opacity: 0;
        animation: ${css`${slideInUp} 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`}; 
    }
    .neon-text-shadow {
        text-shadow: 0 0 3px ${NEON_COLOR}, 0 0 8px rgba(0, 224, 179, 0.3);
    }
`;

// --- STRUCTURE ---
const BlogContainer = styled.div`
    width: 100%;
    min-height: 100vh;
    background-color: ${SECONDARY_BG_LIGHT}; 
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
    position: relative;
    z-index: 5;
    background-color: ${SECONDARY_BG_LIGHT};
    
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
    margin-bottom: 80px; 
    max-width: 700px;
    margin: 0 auto 80px auto;
    font-size: 1.15em;
`;

const PostGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); 
    gap: 40px 30px;
    margin-top: 50px;
`;

// ✅ UPDATED: Taller vertical image ratio (150%)
const ImageWrapper = styled.div`
    position: relative;
    width: 100%;
    padding-top: 150%; /* increased from 125% → 150% */
    overflow: hidden;
    background-color: ${TERTIARY_BG_LIGHT}; 
    border-bottom: 1px solid ${BORDER_LIGHT};
    
    img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: contain; 
        transition: transform 0.3s ease;
    }
`;

const PostCard = styled.div`
    background-color: ${PRIMARY_BG_LIGHT}; 
    border-radius: 15px; 
    text-align: left;
    border: 1px solid ${BORDER_LIGHT}; 
    transition: box-shadow 0.4s ease, transform 0.4s ease, border-color 0.4s;
    overflow: hidden; 
    position: relative;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05); 
    animation: ${css`${pulseBorder} 2s ease-out 1s 1`}; 
    animation-fill-mode: forwards;

    &:hover {
        transform: translateY(-12px); 
        border-color: ${NEON_COLOR};
        box-shadow: 0 25px 40px rgba(0, 0, 0, 0.1); 
    }
`;

const CardContent = styled.div`
    padding: 25px;

    h3 {
        color: ${TEXT_DARK}; 
        font-size: 1.4em; 
        margin: 0 0 10px 0;
    }
    
    p {
        color: ${TEXT_MUTED}; 
        font-size: 1em;
        margin-bottom: 20px;
        min-height: 40px; 
        line-height: 1.6;
    }
`;

const CardMeta = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.85em; 
    color: ${TEXT_MUTED}; 
    margin-bottom: 20px;

    span {
        display: flex;
        align-items: center;
        gap: 8px; 
    }
    svg {
        color: ${NEON_COLOR}; 
    }
`;

const ReadMoreButton = styled.a`
    background-color: ${NEON_COLOR}; 
    color: ${PRIMARY_BG_LIGHT}; 
    border: none;
    padding: 12px 25px;
    border-radius: 8px;
    font-weight: 600;
    transition: all 0.3s ease;
    text-decoration: none;
    cursor: pointer;
    display: inline-block; 
    box-shadow: 0 4px 15px rgba(0, 224, 179, 0.3);

    &::after {
        content: ' →'; 
        transition: transform 0.2s ease;
    }
    &:hover {
        background-color: ${PRIMARY_ACCENT_LIGHT};
        transform: translateY(-2px);
    }
`;

const Footer = styled.footer`
    background-color: ${SECONDARY_BG_LIGHT}; 
    padding: 30px 50px;
    text-align: center;
    color: ${TEXT_MUTED};
    border-top: 1px solid ${BORDER_LIGHT};
`;

// --- COMPONENT ---
const BlogPage = ({ onNavigate, posts }) => {

    const getPostsData = () => {
        if (posts && posts.length > 0) return posts;

        return [
            {
                _id: '1',
                title: 'Grand Inauguration: A Step Towards a Digital Future',
                summary: 'Exciting insights from the grand launch of NEXORA, marking our journey into innovative technology solutions.',
                author: 'NEXORA Admin',
                date: '2025-11-09T00:00:00.000Z',
                headerImage: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop'
            },
            {
                _id: '2',
                title: '5 Web Development Trends for 2025',
                summary: 'Stay ahead of the curve with our expert predictions on the evolving landscape of web development.',
                author: 'Tech Guru',
                date: '2025-11-01T00:00:00.000Z',
                headerImage: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop'
            }
        ];
    };

    const safePosts = getPostsData();

    return (
        <BlogContainer>
            <GlobalStyle />
            
            <Header>
                <Logo onClick={() => onNavigate('home')} className="neon-text-shadow">NEXORA</Logo>
                <div>
                    <NavItem onClick={() => onNavigate('home')}>Home</NavItem>
                    <NavItem onClick={() => onNavigate('about')}>About</NavItem>
                    <NavItem onClick={() => onNavigate('services')}>Services</NavItem>
                    <NavItem onClick={() => onNavigate('projects')}>Projects</NavItem>
                    <NavItem onClick={() => onNavigate('blog')} style={{ color: NEON_COLOR }}>Blog</NavItem>
                    <NavItem onClick={() => onNavigate('contact')}>Contact</NavItem>
                </div>
            </Header>

            <Section style={{ paddingTop: '150px' }} className="animate-in">
                <SectionHeader>Our <span>Blog</span></SectionHeader>
                <SectionSubtitle>Updates, insights, and stories from the NEXORA team.</SectionSubtitle>
                
                <PostGrid>
                    {safePosts.map((post, index) => (
                        <PostCard 
                            key={post._id}
                            className="animate-in"
                            style={{ animationDelay: `${0.12 * (index) + 0.3}s` }}
                        >
                            <ImageWrapper>
                                <img src={post.headerImage} alt={post.title} />
                            </ImageWrapper>
                            <CardContent>
                                <CardMeta>
                                    <span>By {post.author}</span>
                                    <span>
                                        <FontAwesomeIcon icon={faCalendarAlt} />
                                        {new Date(post.date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </CardMeta>
                                <h3>{post.title}</h3>
                                <p>{post.summary}</p>
                                <ReadMoreButton href="#" onClick={(e) => { e.preventDefault(); onNavigate(`blog/${post._id}`); }}>Read More</ReadMoreButton>
                            </CardContent>
                        </PostCard>
                    ))}
                </PostGrid>

                {safePosts.length === 0 && (
                    <SectionSubtitle style={{marginTop: '50px'}}>No posts found. Check back soon!</SectionSubtitle>
                )}
            </Section>

            <Footer>
                &copy; 2025 Crafted with care by NEXORA Team, JJ College.
            </Footer>
        </BlogContainer>
    );
};

export default BlogPage;
