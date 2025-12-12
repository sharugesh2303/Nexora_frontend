// src/components/BlogPage.jsx
import React, { useEffect, useRef, useState } from "react";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faMapMarkerAlt,
  faPhone,
  faEnvelope as faEnvelopeSolid,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { faInstagram, faLinkedin, faWhatsapp, faYoutube } from "@fortawesome/free-brands-svg-icons";

/* THEME */
const NEON_COLOR = "#123165";
const GOLD_ACCENT = "#D4A937";
const TEXT_LIGHT = "#111827";
const TEXT_MUTED = "#6B7280";
const BORDER_LIGHT = "rgba(15,23,42,0.08)";

/* ANIMATIONS + GLOBAL */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: translateY(0); }
`;

const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    overflow-x: hidden;
    font-family: 'Poppins', sans-serif;

    /* glow background (same feel as Team page) */
    background:
      radial-gradient(circle at 0% 0%, #fff9e8 0, #ffffff 35%, transparent 55%),
      linear-gradient(180deg, #ffffff 0%, #f5f7fb 40%, #e5edf7 100%);
    color: ${TEXT_LIGHT};
  }

  #root { width: 100%; overflow-x: hidden; }

  .animate-in {
      opacity: 0;
      transform: translateY(20px);
      animation: fadeSlide 0.8s ease forwards;
  }
  @keyframes fadeSlide {
      to { opacity: 1; transform: translateY(0); }
  }
`;

/* STAR CANVAS (fixed behind content) */
const StarCanvas = styled.canvas`
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
  background: transparent;
`;

/* Styled FA icon — make all icons gold */
const FAIcon = styled(FontAwesomeIcon)`
  color: ${GOLD_ACCENT};
  display: inline-block;
  vertical-align: middle;
`;

/* LAYOUT */
const Page = styled.div`
  position: relative;
  z-index: 1; /* content above the stars */
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: transparent;
`;

/* HEADER (Navbar matched to Team page style) */
const Header = styled.header`
  display: flex;
  align-items: center;
  gap: 40px;
  padding: 14px 48px;
  position: sticky;
  top: 0;
  width: 100%;
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid ${BORDER_LIGHT};
  z-index: 1100;
  @media (max-width: 768px) {
    padding: 14px 20px;
    gap: 20px;
    justify-content: space-between;
  }
`;

const Logo = styled.h1`
  margin: 0;
  font-weight: 800;
  font-size: 1.8rem;
  cursor: pointer;
  letter-spacing: 1px;
  display: inline-flex;
  align-items: center;
  gap: 0;
  color: ${NEON_COLOR};
  span.gold { color: ${GOLD_ACCENT}; margin-left: 6px; }
  @media (max-width: 480px) { font-size: 1.4rem; }
`;

/* NavGroup copied/adapted from TeamPage for identical style but non-bold nav text */
const NavGroup = styled.nav`
  display: flex;
  gap: 22px;
  align-items: center;
  margin-right: auto;

  span.navItem {
    color: ${TEXT_MUTED};
    font-weight: 500; /* non-bold */
    cursor: pointer;
    position: relative;
    padding: 6px 4px;
    transition: 0.3s ease;
    font-size: 1rem;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  span.navItem:hover { color: ${NEON_COLOR}; }
  span.navItem::after {
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
  span.navItem:hover::after { width: 100%; }
  span.navItem.active { color: ${NEON_COLOR}; } /* only color change; no bolding */

  @media (max-width: 1024px) { display: none; }
`;

const MobileMenuButton = styled.button`
  display: none;
  @media (max-width: 1024px) {
    display: block;
    background: none; border: none; color: ${NEON_COLOR};
    font-size: 1.5rem; cursor: pointer;
  }
`;

/* Mobile menu — using isOpen prop same as TeamPage */
const MobileNavMenu = styled.div`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: #ffffff; z-index: 1200; display:flex; flex-direction:column; align-items:center;
  padding-top: 80px;
  transform: translateX(${p => (p.isOpen ? '0' : '100%')});
  transition: transform 0.28s ease-in-out;
  box-shadow: -4px 0 20px rgba(15,23,42,0.12);

  .close-btn { position: absolute; top: 20px; right: 20px; background:none; border:none; font-size: 2rem; cursor:pointer; color: ${TEXT_LIGHT}; }

  span { font-size: 1.3rem; margin: 14px 0; color: ${TEXT_MUTED}; cursor: pointer; }
`;

/* INTRO + GRID */
const Intro = styled.section`
  padding: 84px 20px 8px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  z-index: 5;
  text-align: center;
  animation: ${fadeUp} 0.45s ease forwards;
  opacity: 0;
`;
const IntroTitle = styled.h2`
  font-size: 2.4rem; margin: 0 0 8px; color: ${NEON_COLOR}; font-weight: 800;
  span { color: ${GOLD_ACCENT}; margin-left: 6px; }
  @media (max-width: 768px) { font-size: 1.9rem; }
`;
const IntroSubtitle = styled.p`
  color: ${TEXT_MUTED}; margin: 6px 0 0; max-width: 820px; margin-left:auto; margin-right:auto; font-size: 1.05rem;
`;

const PostGrid = styled.div`
  width: 100%; max-width: 1200px; margin: 36px auto 80px; padding: 0 20px;
  display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 28px; z-index: 5;
  justify-items: center;
`;

const PostCard = styled.article`
  width: 100%; max-width: 360px; background: rgba(255,255,255,0.98);
  border-radius: 12px; overflow: hidden; border: 1px solid ${BORDER_LIGHT};
  box-shadow: 0 10px 30px rgba(15,23,42,0.04); transition: transform .28s ease, box-shadow .28s ease, border-color .28s ease;
  transform-origin: center; animation: ${fadeUp} 0.6s ease forwards; opacity: 0;
  &:hover { transform: translateY(-8px); box-shadow: 0 30px 50px rgba(15,23,42,0.08); border-color: ${GOLD_ACCENT}; }
  @media (max-width: 480px) { max-width: 320px; }
`;
const ImageWrapper = styled.div` width: 100%; aspect-ratio: 16 / 9; position: relative; background: #f0f4f8; overflow: hidden; border-bottom: 1px solid ${BORDER_LIGHT}; `;
const PostImage = styled.img` position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 0.45s ease; &:hover{ transform: scale(1.05); } `;
const CardBody = styled.div` padding: 18px 20px 22px; `;
const Meta = styled.div` display:flex; justify-content:space-between; align-items:center; color: ${TEXT_MUTED}; font-size: 0.85rem; margin-bottom: 10px; svg { color: ${NEON_COLOR}; margin-right: 6px; } `;
const Title = styled.h3` color: ${TEXT_LIGHT}; font-size: 1.2rem; font-weight: 700; margin: 0 0 8px; `;
const Summary = styled.p` color: ${TEXT_MUTED}; margin: 0 0 14px; line-height: 1.6; font-size: 0.95rem; `;
const ReadMore = styled.span`
  display:inline-flex; align-items:center; gap:8px; padding: 8px 16px;
  background: linear-gradient(135deg, ${NEON_COLOR}, #0b3b58); color: #fff; border-radius: 999px; font-weight: 600; font-size: 0.85rem; cursor: pointer;
  box-shadow: 0 6px 14px rgba(18,49,101,0.18);
`;

/* =========================
   FOOTER (copied from TeamPage)
   ========================= */
const FullFooter = styled.footer`
    background: rgba(255,255,255,0.9); /* Slight transparency */
    padding: 60px 50px 20px;
    color: ${TEXT_MUTED};
    border-top: 1px solid ${BORDER_LIGHT};
    box-sizing: border-box;

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

    @media (max-width: 900px) {
        flex-wrap: wrap;
    }

    @media (max-width: 600px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 30px;
    }
`;

const FooterColumn = styled.div`
    min-width: 200px;
    
    @media (max-width: 768px) {
        min-width: unset;
        flex: 1; 
    }
    
    @media (max-width: 600px) {
        width: 100%;
        flex: none;
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

/* =========================
   LOGIC UTILS
   ========================= */
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

/* COMPONENT */
const BlogPage = ({ onNavigate = () => {}, posts, teamData = [], fixedRoles = [], generalData = {} }) => {
  const canvasRef = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navItems = ["home", "about", "services", "projects", "team", "progress", "blog", "contact"];

  const safeGeneralData = {
    email: generalData?.email || 'nexora.crew@gmail.com',
    phone: generalData?.phone || '+91 95976 46460',
    location: generalData?.location || 'JJ College of Engineering, Trichy',
  };

  /* STAR CANVAS logic — identical behaviour to TeamPage's implementation */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });

    let DPR = Math.max(1, window.devicePixelRatio || 1);
    let width = Math.max(1, Math.floor(window.innerWidth));
    let height = Math.max(1, Math.floor(window.innerHeight));

    function resize() {
      DPR = Math.max(1, window.devicePixelRatio || 1);
      width = Math.max(1, Math.floor(window.innerWidth));
      height = Math.max(1, Math.floor(window.innerHeight));
      canvas.width = Math.floor(width * DPR);
      canvas.height = Math.floor(height * DPR);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    resize();

    const count = 140;
    const stars = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 1 + Math.random() * 2.2,
      dx: (Math.random() - 0.5) * 0.25,
      dy: 0.08 + Math.random() * 0.35,
      alpha: 0.15 + Math.random() * 0.35,
    }));

    function onWindowResize() {
      resize();
      // reposition stars proportionally to new size to avoid clumping
      for (let s of stars) {
        s.x = Math.random() * width;
        s.y = Math.random() * height;
      }
    }
    window.addEventListener("resize", onWindowResize);

    let rafId = 0;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (let s of stars) {
        s.x += s.dx;
        s.y += s.dy;
        if (s.y > height + 10) s.y = -10;
        if (s.x > width + 10) s.x = -10;
        if (s.x < -10) s.x = width + 10;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212,169,55,${s.alpha})`; // gold-ish particles
        ctx.fill();
      }

      rafId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onWindowResize);
    };
  }, []);

  // fallback posts
  const getPostsData = () => {
    if (posts && posts.length) return posts;
    return [
      {
        _id: "1",
        title: "Grand Inauguration: A Step Towards a Digital Future",
        summary: "Exciting insights from the grand launch of NEXORA, marking our journey into innovative technology solutions.",
        author: "NEXORA Admin",
        date: "2025-11-09T00:00:00.000Z",
        headerImage: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop",
      },
      {
        _id: "2",
        title: "5 Web Development Trends for 2025",
        summary: "Stay ahead of the curve with our expert predictions on the evolving landscape of web development.",
        author: "Tech Guru",
        date: "2025-11-01T00:00:00.000Z",
        headerImage: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop",
      },
      {
        _id: "3",
        title: "The Rise of AI in Content Creation",
        summary: "Explore how artificial intelligence is revolutionizing content strategies and production workflows.",
        author: "AI Insights",
        date: "2025-10-15T00:00:00.000Z",
        headerImage: "https://images.unsplash.com/photo-1558229987-9b7e7161b9e2?q=80&w=1974&auto=format&fit=crop",
      },
    ];
  };

  const safePosts = (getPostsData() || []).slice().sort((a, b) => {
    const da = a && a.date ? new Date(a.date).getTime() : 0;
    const db = b && b.date ? new Date(b.date).getTime() : 0;
    return da - db;
  });

  const handleNavigation = (route) => {
    onNavigate(route);
    setIsMobileMenuOpen(false);
  };

  const grouped = React.useMemo(() => groupByDbFields(teamData, fixedRoles), [teamData, fixedRoles]);

  return (
    <>
      <GlobalStyle />
      <StarCanvas ref={canvasRef} />

      <Page>
        <Header>
          <Logo onClick={() => handleNavigation("home")}>
            NEXORA<span className="gold">CREW</span>
          </Logo>

          <NavGroup>
            {navItems.map((item) => (
              <span
                key={item}
                className={`navItem ${item === "blog" ? "active" : ""}`}
                onClick={() => handleNavigation(item)}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </span>
            ))}
          </NavGroup>

          <MobileMenuButton onClick={() => setIsMobileMenuOpen(true)} aria-label="Open menu">
            <FAIcon icon={faBars} />
          </MobileMenuButton>
        </Header>

        <MobileNavMenu isOpen={isMobileMenuOpen}>
          <button className="close-btn" onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu">
            <FAIcon icon={faTimes} />
          </button>

          {navItems.map((item) => (
            <span key={`mob-${item}`} onClick={() => handleNavigation(item)} style={item === "blog" ? { color: NEON_COLOR } : {}}>
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </span>
          ))}
        </MobileNavMenu>

        <Intro>
          <IntroTitle>
            Our <span>Blog</span>
          </IntroTitle>
          <IntroSubtitle>Updates, insights, and stories from the NEXORACREW team.</IntroSubtitle>
        </Intro>

        <PostGrid>
          {safePosts.map((post, idx) => (
            <PostCard key={post._id} style={{ animationDelay: `${0.12 * idx + 0.12}s` }}>
              <ImageWrapper>
                <PostImage src={post.headerImage} alt={post.title} />
              </ImageWrapper>

              <CardBody>
                <Meta>
                  <span>{post.author}</span>
                  <span>
                    <FAIcon icon={faCalendarAlt} />
                    {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </span>
                </Meta>

                <Title>{post.title}</Title>
                <Summary>{post.summary}</Summary>

                <ReadMore onClick={() => handleNavigation(`blog/${post._id}`)}>Read More →</ReadMore>
              </CardBody>
            </PostCard>
          ))}
        </PostGrid>

        {/* FOOTER (from TeamPage) */}
        <FullFooter>
          <FooterGrid>
            <FooterColumn style={{ minWidth: '300px' }}>
              <FooterLogo onClick={() => handleNavigation('home')}>
                <span style={{ color: NEON_COLOR }}>NEXORA</span><span style={{ color: GOLD_ACCENT, marginLeft: 6 }}>CREW</span>
              </FooterLogo>
              <p>
                Transforming ideas into powerful digital products using modern
                technology, creativity, and AI. Where ideas meet innovation.
              </p>
              <SocialIcons>
                <a href="https://www.instagram.com/nexoracrew?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noreferrer">
                  <FAIcon icon={faInstagram} />
                </a>
                <a href="https://www.linkedin.com/in/nexoracrew-%E2%80%8C-01842a396/" target="_blank" rel="noreferrer">
                  <FAIcon icon={faLinkedin} />
                </a>
                <a href={`mailto:${safeGeneralData.email}`}>
                  <FAIcon icon={faEnvelopeSolid} />
                </a>
                <a href="https://wa.me/9597646460" target="_blank" rel="noopener noreferrer">
                  <FAIcon icon={faWhatsapp} />
                </a>
                <a href="https://www.youtube.com/@Nexora-crew" target="_blank" rel="noopener noreferrer">
                  <FAIcon icon={faYoutube} />
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
                {['Web Development', 'Poster designing & logo making' , 'Content creation' , 'Digital marketing &SEO' , 'AI and automation' , 'Hosting & Support' , 'Printing &Branding solutions' , 'Enterprise networking &server architecture' , 'Bold branding&Immersive visual design' , 'Next gen web & mobile experience'].map((l, i) => (
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
                    <FAIcon icon={faMapMarkerAlt} /> {safeGeneralData.location}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${safeGeneralData.email}`}>
                    <FAIcon icon={faEnvelopeSolid} /> {safeGeneralData.email}
                  </a>
                </li>
                <li>
                  <a href={`tel:${safeGeneralData.phone}`}>
                    <FAIcon icon={faPhone} /> {safeGeneralData.phone}
                  </a>
                </li>
              </ul>
            </FooterColumn>
          </FooterGrid>

          <Copyright>
            © 2025 Nexoracrew. All Rights Reserved.
          </Copyright>
        </FullFooter>
      </Page>
    </>
  );
};

export default BlogPage;
