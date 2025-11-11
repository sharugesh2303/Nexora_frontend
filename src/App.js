import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
// CORRECTION: Removed 'styled' import as it was defined but never used (causing the ESLint error)
import { createGlobalStyle } from 'styled-components';

// --- Import All Public Pages (Assuming correct file paths) ---
import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import ServicesPage from './components/ServicesPage';
import ContactPage from './components/ContactPage';
import BlogPage from './components/BlogPage';
import PostPage from './components/PostPage';
import ProjectsPage from './components/ProjectsPage';
import ProjectDetailPage from './components/ProjectDetailPage';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsAndConditions from './components/TermsAndConditions';

// --- Global Styles (Layout Fix Applied) ---
const GlobalStyle = createGlobalStyle`
    body, html {
        margin: 0;
        padding: 0;
        font-family: sans-serif;
        background-color: #0d0d0d;
        color: #e0e0e0;
    }
    #root {
        width: 100%;
        /* Ensure the root container expands with content */
        min-height: 100vh;
        height: auto;
    }
`;

// --- API URL (Unchanged) ---
const API_URL = 'http://localhost:5000/api/content'; 

// CRITICAL HIERARCHY DATA: Hardcoded structure matching AdminPage.js logic
const FIXED_ROLES_HIERARCHY = [
    { id: 1, name: 'CEO', group: 1, subGroup: 0 }, 
    { id: 2, name: 'Lead Developer', group: 2, subGroup: 0 }, 
    { id: 3, name: 'Developer', group: 2, subGroup: 1 }, 
    { id: 4, name: 'Lead Designer', group: 3, subGroup: 0 }, 
    { id: 5, name: 'Designer', group: 3, subGroup: 1 },
    { id: 6, name: 'Lead Content Writer', group: 4, subGroup: 0 },
    { id: 7, name: 'Project Manager', group: 5, subGroup: 0 },
];

function App() {
    const navigate = useNavigate();
    
    // --- State to hold all site content ---
    const [content, setContent] = useState({
        general: {},
        home: {},
        about: {},
        team: [],
        services: [],
        posts: [],
        projects: [],
    });
    const [loading, setLoading] = useState(true);

    // --- Core Data Fetching Function ---
    const fetchAllContent = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/all`);
            
            setContent({
                ...res.data,
                home: { sections: res.data.home.sections || [] },
                about: { sections: res.data.about.sections || [] },
            });
            setLoading(false);
        } catch (err) {
            console.error("Failed to load site content. Is the API server running?", err);
            setLoading(false);
            setContent(prev => ({ ...prev, loadingFailed: true }));
        }
    }, []);

    // 1. Initial Load
    useEffect(() => {
        fetchAllContent();
    }, [fetchAllContent]);

    // 2. Auto-Refresh Logic
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && !loading) {
                console.log("Tab focus detected. Re-fetching data...");
                fetchAllContent();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [loading, fetchAllContent]);


    // --- Other Logic ---
    const handleNavigate = (path) => {
        if (path === 'home') navigate('/');
        else navigate(`/${path}`);
    };

    if (loading) {
        return (
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                <h1 style={{color: 'white', textAlign: 'center'}}>Loading NEXORA...</h1>
            </div>
        );
    }

    // --- Define All Public Routes ---
    return (
        <>
            <GlobalStyle />
            <Routes>
                {/* --- Home Route --- */}
                <Route 
                    path="/" 
                    element={<HomePage 
                        onNavigate={handleNavigate} 
                        homeData={content.home}
                        servicesData={content.services.slice(0, 6)} 
                        generalData={content.general}
                    />} 
                />
                
                {/* --- Primary Navigation Routes --- */}
                <Route 
                    path="/about" 
                    element={<AboutPage 
                        onNavigate={handleNavigate} 
                        aboutData={content.about}
                        teamData={content.team}
                        // CRITICAL: Pass the hardcoded hierarchy data to enable sorting
                        fixedRoles={FIXED_ROLES_HIERARCHY} 
                    />} 
                />
                <Route 
                    path="/services" 
                    element={<ServicesPage 
                        onNavigate={handleNavigate} 
                        servicesData={content.services}
                    />} 
                />
                <Route 
                    path="/contact" 
                    element={<ContactPage 
                        onNavigate={handleNavigate} 
                        generalData={content.general}
                    />} 
                />
                
                {/* --- Blog Routes --- */}
                <Route 
                    path="/blog" 
                    element={<BlogPage 
                        onNavigate={handleNavigate} 
                        posts={content.posts}
                    />} 
                />
                <Route 
                    path="/blog/:id" 
                    element={<PostPage 
                        onNavigate={handleNavigate} 
                        posts={content.posts}
                    />} 
                />
                
                {/* --- Project Routes --- */}
                <Route 
                    path="/projects" 
                    element={<ProjectsPage 
                        onNavigate={handleNavigate} 
                        projects={content.projects}
                    />} 
                />
                <Route 
                    path="/projects/:id" 
                    element={<ProjectDetailPage 
                        onNavigate={handleNavigate} 
                        projects={content.projects}
                    />} 
                />
                
                {/* --- LEGAL ROUTES --- */}
                <Route 
                    path="/privacy" 
                    element={<PrivacyPolicy />} 
                />
                <Route 
                    path="/terms" 
                    element={<TermsAndConditions />} 
                />


                {/* --- Fallback Route --- */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
}

export default App;