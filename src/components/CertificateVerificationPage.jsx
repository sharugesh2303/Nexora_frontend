import React, { useEffect, useRef, useState } from "react";
import axios from 'axios';
import styled, { createGlobalStyle } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faBars,
  faTimes,
  faEnvelope,
  faMapMarkerAlt,
  faPhone,
  faFilePdf,
  faCheckCircle,
  faExclamationCircle,
  faSpinner,
  faDownload
} from "@fortawesome/free-solid-svg-icons";
import {
  faInstagram,
  faLinkedinIn,
  faWhatsapp,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

/* =========================================
   THEME CONSTANTS & CONFIG
   ========================================= */
const API_BASE = (process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');
const NEON_COLOR = "#123165"; // primary navy
const TEXT_LIGHT = "#111827";
const TEXT_MUTED = "#6B7280";
const BORDER_LIGHT = "rgba(15,23,42,0.08)";
const GOLD_ACCENT = "#D4A937";

/* =========================================
   GLOBAL STYLES
   ========================================= */
const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0; padding: 0; width: 100%; overflow-x: hidden;
    font-family: 'Poppins', sans-serif;
    background:
      radial-gradient(circle at 0% 0%, #fff9e8 0, #ffffff 35%, transparent 55%),
      linear-gradient(180deg, #ffffff 0%, #f5f7fb 40%, #e5edf7 100%);
    color: ${TEXT_LIGHT};
  }
  * { box-sizing: border-box; }
  .animate-in { opacity: 0; transform: translateY(20px); animation: fadeSlide 0.8s ease forwards; }
  @keyframes fadeSlide { to { opacity: 1; transform: translateY(0); } }
`;

/* =========================================
   STAR CANVAS EFFECT
   ========================================= */
const StarCanvas = styled.canvas`
  position: fixed; inset: 0; width: 100vw; height: 100vh; z-index: 0; pointer-events: none;
`;

function useStarEffect(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    const DPR = window.devicePixelRatio || 1;

    function resize() {
      canvas.width = Math.floor(window.innerWidth * DPR);
      canvas.height = Math.floor(window.innerHeight * DPR);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    resize();
    let width = window.innerWidth, height = window.innerHeight;
    const stars = Array.from({ length: 140 }, () => ({
      x: Math.random() * width, y: Math.random() * height,
      r: 1 + Math.random() * 2.2, dx: (Math.random() - 0.5) * 0.25, dy: 0.08 + Math.random() * 0.35,
      alpha: 0.15 + Math.random() * 0.35, pulse: Math.random() * Math.PI * 2,
    }));

    function onResize() { width = window.innerWidth; height = window.innerHeight; resize(); }
    window.addEventListener("resize", onResize);

    let rafId = null;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      stars.forEach((s) => {
        s.x += s.dx; s.y += s.dy; s.pulse += 0.02;
        const a = s.alpha * (0.85 + 0.15 * Math.sin(s.pulse));
        if (s.y > height + 10) s.y = -10;
        if (s.x > width + 10) s.x = -10;
        if (s.x < -10) s.x = width + 10;
        ctx.beginPath(); ctx.fillStyle = `rgba(212,169,55,${0.18 * a})`; ctx.arc(s.x, s.y, s.r * 3.6, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.fillStyle = `rgba(212,169,55,${0.9 * a})`; ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
      });
      rafId = requestAnimationFrame(draw);
    };
    draw();
    return () => { if (rafId) cancelAnimationFrame(rafId); window.removeEventListener("resize", onResize); };
  }, [canvasRef]);
}

/* =========================================
   LAYOUT COMPONENTS (Shared UI)
   ========================================= */
const PageWrapper = styled.div`
  position: relative; z-index: 1; min-height: 100vh; width: 100%;
`;

const Header = styled.header`
  display: flex; align-items: center; gap: 40px; padding: 14px 48px; position: sticky; top: 0; width: 100%;
  background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border-bottom: 1px solid ${BORDER_LIGHT};
  z-index: 1000;
  @media (max-width: 768px) { padding: 14px 20px; justify-content: space-between; }
`;

const Logo = styled.h1`
  margin: 0; font-weight: 800; font-size: 1.8rem; cursor: pointer; letter-spacing: 1px; color: ${NEON_COLOR};
  span.gold { color: ${GOLD_ACCENT}; }
  @media (max-width: 480px) { font-size: 1.4rem; }
`;

const NavGroup = styled.nav`
  display: flex; gap: 22px; align-items: center; margin-right: auto;
  span {
    color: ${TEXT_MUTED}; font-weight: 500; cursor: pointer; position: relative; padding: 6px 4px; transition: 0.3s ease;
    &:hover { color: ${NEON_COLOR}; }
    &::after { content: ""; position: absolute; left: 0; bottom: -2px; width: 0; height: 2px; background: ${GOLD_ACCENT}; transition: 0.3s; border-radius: 4px; }
    &:hover::after { width: 100%; }
  }
  @media (max-width: 1024px) { display: none; }
`;

const MobileMenuButton = styled.button`
  display: none; background: none; border: none; color: ${NEON_COLOR}; font-size: 1.5rem; cursor: pointer;
  @media (max-width: 1024px) { display: block; }
`;

const MobileNavMenu = styled.div`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #ffffff; z-index: 1100;
  display: flex; flex-direction: column; align-items: center; padding-top: 80px;
  transform: translateX(${(p) => (p.isOpen ? "0" : "100%")}); transition: transform 0.28s ease-in-out;
  .close-btn { position: absolute; top: 20px; right: 20px; background: none; border: none; font-size: 2rem; cursor: pointer; color: ${TEXT_LIGHT}; }
  span { font-size: 1.3rem; margin: 14px 0; color: ${TEXT_MUTED}; cursor: pointer; }
`;

/* =========================================
   CERTIFICATE SPECIFIC COMPONENTS
   ========================================= */
const Container = styled.div`
  position: relative; z-index: 2; max-width:800px; margin:0 auto; padding: 120px 20px 60px;
  display: flex; flex-direction: column; align-items: center; text-align: center;
  min-height: 80vh;
`;

const PageTitle = styled.h2`
  font-size: 2.8rem; color: ${NEON_COLOR}; margin-bottom: 10px; font-weight: 800;
  span { color: ${GOLD_ACCENT}; }
  @media (max-width: 768px) { font-size: 2rem; }
`;

const SubText = styled.p`
  color: ${TEXT_MUTED}; font-size: 1.1rem; max-width: 600px; margin-bottom: 40px; line-height: 1.6;
`;

const SearchBox = styled.div`
  background: white; padding: 10px; border-radius: 50px; 
  box-shadow: 0 10px 40px rgba(18,49,101,0.08);
  border: 1px solid ${BORDER_LIGHT};
  display: flex; width: 100%; max-width: 600px;
  transition: all 0.3s ease;
  &:hover, &:focus-within {
    box-shadow: 0 15px 50px rgba(212,169,55,0.15);
    border-color: rgba(212,169,55,0.5);
  }
`;

const SearchInput = styled.input`
  flex: 1; border: none; padding: 15px 25px; font-size: 1.1rem; outline: none; border-radius: 50px;
  color: ${TEXT_LIGHT}; background: transparent;
  &::placeholder { color: #9CA3AF; }
`;

const SearchButton = styled.button`
  background: linear-gradient(90deg, ${NEON_COLOR}, ${GOLD_ACCENT});
  color: white; border: none; padding: 0 35px; border-radius: 40px; font-size: 1.1rem; font-weight: 600; cursor: pointer;
  transition: transform 0.2s;
  &:hover { transform: scale(1.05); }
  &:disabled { opacity: 0.7; cursor: not-allowed; }
`;

const ResultCard = styled.div`
  margin-top: 50px; width: 100%; max-width: 600px; background: white;
  border-radius: 20px; padding: 40px; text-align: center;
  border: 1px solid ${BORDER_LIGHT};
  box-shadow: 0 20px 60px rgba(0,0,0,0.05);
  position: relative; overflow: hidden;
  animation: fadeSlide 0.5s ease forwards;

  &::before {
    content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 6px;
    background: linear-gradient(90deg, ${NEON_COLOR}, ${GOLD_ACCENT});
  }
`;

const VerifiedBadge = styled.div`
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(34, 197, 94, 0.1); color: #16a34a;
  padding: 8px 16px; border-radius: 20px; font-weight: 700; font-size: 0.9rem;
  margin-bottom: 20px;
`;

const CertDetail = styled.div`
  margin-bottom: 25px;
  h3 { font-size: 2rem; color: ${NEON_COLOR}; margin: 10px 0; font-weight: 800; }
  p { font-size: 1.1rem; color: ${TEXT_MUTED}; margin: 5px 0; }
  strong { color: ${TEXT_LIGHT}; }
`;

const DownloadButton = styled.a`
  display: inline-flex; align-items: center; gap: 10px;
  background: ${NEON_COLOR}; color: white;
  padding: 15px 30px; border-radius: 12px; text-decoration: none;
  font-weight: 600; transition: 0.3s;
  margin-top: 10px;
  &:hover { background: ${GOLD_ACCENT}; transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
`;

const ErrorMessage = styled.div`
  margin-top: 30px; padding: 20px; border-radius: 12px;
  background: #FEF2F2; color: #DC2626; border: 1px solid #FCA5A5;
  display: flex; align-items: center; gap: 10px; justify-content: center;
`;

/* =========================================
   FOOTER (Identical to ProjectDetailPage)
   ========================================= */
const FullFooter = styled.footer`
  background: rgba(255,255,255,0.9); padding: 60px 50px 20px; color: ${TEXT_MUTED};
  border-top: 1px solid ${BORDER_LIGHT}; box-sizing: border-box;
  @media (max-width: 768px) { padding: 40px 20px 20px; }
`;
const FooterGrid = styled.div`
  max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; gap: 30px;
  @media (max-width: 900px) { flex-wrap: wrap; }
  @media (max-width: 600px) { flex-direction: column; }
`;
const FooterColumn = styled.div`
  min-width: 200px;
  @media (max-width: 600px) { width: 100%; }
  h4 {
    color: ${TEXT_LIGHT}; font-size: 1.1rem; margin-bottom: 20px; font-weight: 700; position: relative;
    &:after { content: ''; position: absolute; left: 0; bottom: -5px; width: 30px; height: 2px; background: ${GOLD_ACCENT}; }
  }
  ul { list-style: none; padding: 0; margin: 0; }
  li { margin-bottom: 10px; }
  a { color: ${TEXT_MUTED}; text-decoration: none; font-size: 0.9rem; transition: color 0.3s; cursor: pointer; &:hover { color: ${NEON_COLOR}; } }
`;
const SocialIcons = styled.div`
  display: flex; gap: 15px; margin-top: 15px;
  a {
    width: 36px; height: 36px; border-radius: 999px; background: rgba(212,169,55,0.15); 
    display: flex; align-items: center; justify-content: center; color: ${GOLD_ACCENT}; 
    transition: 0.3s;
    &:hover { background: ${GOLD_ACCENT}; color: #ffffff; transform: translateY(-3px); }
  }
`;
const Copyright = styled.div`
  text-align: center; font-size: 0.8rem; padding-top: 30px; border-top: 1px solid ${BORDER_LIGHT}; margin-top: 50px;
`;


/* =========================================
   MAIN COMPONENT
   ========================================= */
const CertificateVerificationPage = ({ onNavigate }) => {
  const canvasRef = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useStarEffect(canvasRef);

  const navItems = ['home','about','services','projects','team','progress','blog','contact'];
  const safeGeneralData = { email: 'nexora.crew@gmail.com', phone: '+91 95976 46460' };

  const handleNavigation = (route) => {
    if (onNavigate) onNavigate(route);
    setIsMobileMenuOpen(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      // API Call to Backend
      const res = await axios.get(`${API_BASE}/api/certificates/verify/${searchId.trim()}`);
      if (res.data.success) {
        setResult(res.data.data);
      }
    } catch (err) {
      setResult(null);
      setError("Certificate not found. Please check the ID and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <GlobalStyle />
      <StarCanvas ref={canvasRef} />

      <PageWrapper>
        {/* HEADER */}
        <Header>
          <Logo onClick={() => handleNavigation('home')}>
            NEXORA<span className="gold">CREW</span>
          </Logo>
          <NavGroup>
            {navItems.map((item) => (
              <span key={item} onClick={() => handleNavigation(item)}>
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
            <span key={item} onClick={() => handleNavigation(item)}>
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </span>
          ))}
        </MobileNavMenu>

        {/* CONTENT */}
        <Container className="animate-in">
          <PageTitle>Verify <span className="gold">Certificate</span></PageTitle>
          <SubText>
            Authenticity matters. Enter the unique Certificate ID located on the document to verify its validity within the Nexora Crew database.
          </SubText>

          <form onSubmit={handleSearch} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <SearchBox>
              <SearchInput 
                placeholder="Enter Certificate ID (e.g. NEX-2025-001)" 
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
              />
              <SearchButton type="submit" disabled={loading}>
                {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faSearch} />}
              </SearchButton>
            </SearchBox>
          </form>

          {error && (
            <ErrorMessage className="animate-in">
              <FontAwesomeIcon icon={faExclamationCircle} /> {error}
            </ErrorMessage>
          )}

          {result && (
            <ResultCard>
              <VerifiedBadge>
                <FontAwesomeIcon icon={faCheckCircle} /> Verified Authentic
              </VerifiedBadge>
              <CertDetail>
                <p>Certificate Issued To</p>
                <h3>{result.studentName}</h3>
              </CertDetail>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '20px', color: TEXT_MUTED }}>
                 <div>
                    <small>Certificate ID</small><br/>
                    <strong>{result.certificateID}</strong>
                 </div>
                 <div>
                    <small>Issue Date</small><br/>
                    <strong>{new Date(result.issueDate).toLocaleDateString()}</strong>
                 </div>
              </div>
              
              <DownloadButton href={result.pdfUrl} target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faFilePdf} /> View Certificate
              </DownloadButton>
              <div style={{marginTop: 15}}>
                <a href={result.pdfUrl} download style={{color: TEXT_MUTED, fontSize: '0.9rem', textDecoration: 'underline'}}>
                   <FontAwesomeIcon icon={faDownload} /> Direct Download
                </a>
              </div>
            </ResultCard>
          )}
        </Container>

        {/* FOOTER */}
        <FullFooter>
          <FooterGrid>
            <FooterColumn style={{ minWidth: '300px' }}>
              <Logo onClick={() => handleNavigation('home')} style={{fontSize:'1.5rem', marginBottom:'10px'}}>
                NEXORA<span className="gold">CREW</span>
              </Logo>
              <p>Transforming ideas into powerful digital products using modern technology, creativity, and AI.</p>
              <SocialIcons>
                <a href="https://www.instagram.com/nexoracrew" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faInstagram} /></a>
                <a href="https://www.linkedin.com/in/nexoracrew" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faLinkedinIn} /></a>
                <a href={`mailto:${safeGeneralData.email}`}><FontAwesomeIcon icon={faEnvelope} /></a>
                <a href="https://wa.me/9597646460" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faWhatsapp} /></a>
                <a href="https://www.youtube.com/@Nexora-crew" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faYoutube} /></a>
              </SocialIcons>
            </FooterColumn>

            <FooterColumn>
              <h4>Quick Links</h4>
              <ul>
                {navItems.map((item, i) => (
                  <li key={i}><a onClick={() => handleNavigation(item)}>{item.charAt(0).toUpperCase() + item.slice(1)}</a></li>
                ))}
              </ul>
            </FooterColumn>

            <FooterColumn>
              <h4>Contact Info</h4>
              <ul>
                <li><a href="#map"><FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: GOLD_ACCENT }} /> Palakarai, Trichy.</a></li>
                <li><a href={`mailto:${safeGeneralData.email}`}><FontAwesomeIcon icon={faEnvelope} style={{ color: GOLD_ACCENT }} /> {safeGeneralData.email}</a></li>
                <li><a href={`tel:${safeGeneralData.phone}`}><FontAwesomeIcon icon={faPhone} style={{ color: GOLD_ACCENT }} /> +91 9597646460</a></li>
              </ul>
            </FooterColumn>
          </FooterGrid>
          <Copyright>© 2025 Nexoracrew. All Rights Reserved.</Copyright>
        </FullFooter>
      </PageWrapper>
    </>
  );
};

export default CertificateVerificationPage;