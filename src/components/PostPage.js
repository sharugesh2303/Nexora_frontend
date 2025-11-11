import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

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
const PostContainer = styled.div`
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

// --- Post-Specific Styles ---
const PostHeader = styled.div`
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
const PostTitle = styled.h1`
    font-size: 3.5em;
    color: white;
    margin: 30px 0 10px 0;
    text-align: left;
`;
const PostMeta = styled.div`
    color: #00e0b3;
    font-size: 0.9em;
    text-align: left;
    margin-bottom: 40px;
    border-bottom: 1px solid #3a3a3a;
    padding-bottom: 20px;
`;
const PostContent = styled.div`
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 20px;
    color: #cccccc;
    line-height: 1.8;
    font-size: 1.1em;

    white-space: pre-wrap; 

    h2, h3 {
        color: white;
        margin-top: 40px;
    }

    a {
        color: #00e0b3;
    }
`;

// --- PostPage Component ---
const PostPage = ({ onNavigate, posts }) => {
    const { id } = useParams(); 
    const safePosts = posts || [];
    const post = safePosts.find(p => p._id === id);

    if (!posts || posts.length === 0) {
        return (
             <h1 style={{color: 'white', textAlign: 'center', paddingTop: '100px'}}>Loading Post...</h1>
        );
    }
    
    if (!post) {
        return <Navigate to="/blog" replace />;
    }
    
    return (
        <PostContainer>
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

            {/* --- POST HEADER --- */}
            <PostHeader>
                {post.headerImage && (
                    <HeaderImage src={post.headerImage} alt={post.title} />
                )}
                <PostTitle>{post.title}</PostTitle>
                <PostMeta>
                    <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: '8px' }} />
                    By {post.author} on {new Date(post.date).toLocaleDateString()}
                </PostMeta>
            </PostHeader>

            {/* --- POST CONTENT --- */}
            <PostContent>
                {post.content}
            </PostContent>

            {/* --- FOOTER --- */}
            <Footer>
                &copy; 2025 Crafted with care by NEXORA Team, JJ College.
            </Footer>
        </PostContainer>
    );
};

export default PostPage;