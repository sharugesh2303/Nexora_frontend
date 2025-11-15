import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faCalendarAlt, faChevronLeft, faChevronRight 
} from '@fortawesome/free-solid-svg-icons';

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
const NavItem = styled.span`
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
// Carousel/Main image wrapper
const MainImageWrapper = styled.div`
    position: relative;
    
    /* 💡 CRITICAL CHANGE: Reduce max-width and set height higher for portrait view */
    max-width: 400px; /* Limits the horizontal size */
    width: 100%; 
    height: 400px; /* Increased vertical size */
    margin: 0 auto 20px auto; /* Center the narrow element */

    overflow: hidden;
    border-radius: 10px;
    background-color: #1a1a1a;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #00e0b3;
    padding: 10px;
`;
const HeaderImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: contain; 
    border-radius: 6px;
    transition: opacity 0.5s ease-in-out; 
    cursor: zoom-in;
`;
// Navigation Buttons for Carousel
const NavButton = styled.button`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    padding: 15px 10px;
    cursor: pointer;
    z-index: 10;
    opacity: 0.8;
    transition: opacity 0.2s, background 0.2s;
    font-size: 1.5em;

    &:hover {
        opacity: 1;
        background: rgba(0, 224, 179, 0.7); 
    }

    ${p => p.direction === 'left' ? 'left: 0; border-top-right-radius: 6px; border-bottom-right-radius: 6px;' : ''}
    ${p => p.direction === 'right' ? 'right: 0; border-top-left-radius: 6px; border-bottom-left-radius: 6px;' : ''}
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

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const postImages = post?.images || [];
    
    const mainImage = postImages[currentImageIndex];


    // Effect for Automatic Slide Transition (5 seconds)
    useEffect(() => {
        if (postImages.length <= 1) return; 

        const timer = setInterval(() => {
            setCurrentImageIndex(prevIndex => 
                (prevIndex + 1) % postImages.length
            );
        }, 5000); 

        return () => clearInterval(timer);
    }, [postImages.length]); 


    // Manual Navigation Handlers
    const goToPrevious = () => {
        setCurrentImageIndex(prevIndex => 
            (prevIndex - 1 + postImages.length) % postImages.length
        );
    };

    const goToNext = () => {
        setCurrentImageIndex(prevIndex => 
            (prevIndex + 1) % postImages.length
        );
    };


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

            {/* --- POST HEADER / CAROUSEL --- */}
            <PostHeader>
                {mainImage ? (
                    <MainImageWrapper>
                        {/* Navigation Controls only if there's more than one image */}
                        {postImages.length > 1 && (
                            <>
                                <NavButton direction="left" onClick={goToPrevious} title="Previous Image" style={{left: '20px'}}>
                                    <FontAwesomeIcon icon={faChevronLeft} />
                                </NavButton>
                                <NavButton direction="right" onClick={goToNext} title="Next Image" style={{right: '20px'}}>
                                    <FontAwesomeIcon icon={faChevronRight} />
                                </NavButton>
                            </>
                        )}

                        <HeaderImage 
                            key={mainImage} 
                            src={mainImage} 
                            alt={`${post.title} image ${currentImageIndex + 1}`} 
                            onClick={() => window.open(mainImage, '_blank')}
                        />
                    </MainImageWrapper>
                ) : (
                    <div style={{ height: '400px', maxWidth: '400px', margin: '0 auto 20px auto', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid #1a1a1a', borderRadius: '10px' }}>
                        <h3 style={{ color: '#aaa' }}>No Header Image Available</h3>
                    </div>
                )}
                
                <PostTitle>{post.title}</PostTitle>
                <PostMeta>
                    <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: '8px' }} />
                    By {post.author} on {new Date(post.date).toLocaleDateString()}
                </PostMeta>
            </PostHeader>

            {/* --- POST CONTENT (Text only) --- */}
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