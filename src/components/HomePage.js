// HomePage.jsx
import React, { useEffect, useRef, useState } from 'react';
import styled, { createGlobalStyle, keyframes, css } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faUsers, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';

/* -------------------------
<<<<<<< HEAD
    DESIGN TOKENS
    ------------------------- */
=======
   DESIGN TOKENS
   ------------------------- */
>>>>>>> 225ebed91a843b32db53f7297dfc7ae53cd2c752
const NEON_COLOR = '#00e0b3';
const DARK_BG = '#0F172A';
const LIGHT_TEXT = '#E2E8F0';
const MUTED_TEXT = '#A9B7C7';

/* -------------------------
<<<<<<< HEAD
    GLOBAL STYLE
    ------------------------- */
const GlobalStyle = createGlobalStyle`
    html, body, #root {
        height: 100%;
    }
    body {
        margin: 0;
        font-family: 'Poppins', sans-serif;
        background: ${DARK_BG};
        color: ${LIGHT_TEXT};
        overflow-x: hidden;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        /* CSS variable controlled by JS to reflect zoom/devicePixelRatio */
        --dpr-scale: 1;
    }

    .neon-text-shadow {
        text-shadow: 0 0 3px ${NEON_COLOR}, 0 0 8px rgba(0,224,179,0.5);
    }
`;

/* -------------------------
    KEYFRAMES
    ------------------------- */
const fadeUp = keyframes`
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
=======
   GLOBAL STYLE
   ------------------------- */
const GlobalStyle = createGlobalStyle`
  html, body, #root {
    height: 100%;
  }
  body {
    margin: 0;
    font-family: 'Poppins', sans-serif;
    background: ${DARK_BG};
    color: ${LIGHT_TEXT};
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    /* CSS variable controlled by JS to reflect zoom/devicePixelRatio */
    --dpr-scale: 1;
  }

  .neon-text-shadow {
    text-shadow: 0 0 3px ${NEON_COLOR}, 0 0 8px rgba(0,224,179,0.5);
  }
`;

/* -------------------------
   KEYFRAMES
   ------------------------- */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
>>>>>>> 225ebed91a843b32db53f7297dfc7ae53cd2c752
`;

/* flag-wave: translate up/down & rotate a little */
const flagWave = keyframes`
<<<<<<< HEAD
    0% { transform: translateY(0) rotate(0deg); }
    25% { transform: translateY(-10px) rotate(-1.5deg); }
    50% { transform: translateY(0) rotate(0deg); }
    75% { transform: translateY(8px) rotate(1deg); }
    100% { transform: translateY(0) rotate(0deg); }
=======
  0% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-10px) rotate(-1.5deg); }
  50% { transform: translateY(0) rotate(0deg); }
  75% { transform: translateY(8px) rotate(1deg); }
  100% { transform: translateY(0) rotate(0deg); }
>>>>>>> 225ebed91a843b32db53f7297dfc7ae53cd2c752
`;

/* soft glow pulse for neon */
const glowPulse = keyframes`
<<<<<<< HEAD
    0% { text-shadow: 0 0 8px ${NEON_COLOR}, 0 0 18px rgba(0,224,179,0.5); }
    50% { text-shadow: 0 0 18px ${NEON_COLOR}, 0 0 30px rgba(0,224,179,0.8); }
    100% { text-shadow: 0 0 8px ${NEON_COLOR}, 0 0 18px rgba(0,224,179,0.5); }
`;

/* -------------------------
    FIXED STAR CANVAS
    ------------------------- */
const StarCanvas = styled.canvas`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 0;
    pointer-events: none;
    display: block;
    background: radial-gradient(circle at 10% 10%, #071022 0%, #081226 25%, #071020 55%, #05060a 100%);
    transform-origin: center center;
`;

/* -------------------------
    PAGE LAYER (content sits above the fixed canvas)
    ------------------------- */
const PageLayer = styled.div`
    position: relative;
    z-index: 2;
=======
  0% { text-shadow: 0 0 8px ${NEON_COLOR}, 0 0 18px rgba(0,224,179,0.5); }
  50% { text-shadow: 0 0 18px ${NEON_COLOR}, 0 0 30px rgba(0,224,179,0.8); }
  100% { text-shadow: 0 0 8px ${NEON_COLOR}, 0 0 18px rgba(0,224,179,0.5); }
`;

/* -------------------------
   FIXED STAR CANVAS
   ------------------------- */
const StarCanvas = styled.canvas`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
  display: block;
  background: radial-gradient(circle at 10% 10%, #071022 0%, #081226 25%, #071020 55%, #05060a 100%);
  transform-origin: center center;
`;

/* -------------------------
   PAGE LAYER (content sits above the fixed canvas)
   ------------------------- */
const PageLayer = styled.div`
  position: relative;
  z-index: 2;
>>>>>>> 225ebed91a843b32db53f7297dfc7ae53cd2c752
`;

/* --- HERO / UI components --- */
const HeroSection = styled.section`
<<<<<<< HEAD
    min-height: 90vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 120px 20px 80px;
    box-sizing: border-box;
    animation: ${fadeUp} 0.9s ease forwards;
`;

const HeroInner = styled.div`
    max-width: 1200px;
    width: 100%;
    display: flex;
    gap: 60px;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`;

const TextBlock = styled.div`
    max-width: 1200px;
    color: ${LIGHT_TEXT};
    text-align: center;
=======
  min-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 120px 20px 80px;
  box-sizing: border-box;
  animation: ${fadeUp} 0.9s ease forwards;
`;

const HeroInner = styled.div`
  max-width: 1200px;
  width: 100%;
  display: flex;
  gap: 60px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const TextBlock = styled.div`
  max-width: 1200px;
  color: ${LIGHT_TEXT};
  text-align: center;
>>>>>>> 225ebed91a843b32db53f7297dfc7ae53cd2c752
`;

/* Big headline container for per-letter spans */
const Headline = styled.h1`
<<<<<<< HEAD
    font-size: clamp(2.4rem, 6vw, 6.5rem); /* large, responsive */
    line-height: 0.95;
    margin: 0 0 18px 0;
    letter-spacing: -0.02em;
    display: inline-block;
    will-change: transform;
    /* overall neon pulse */
    animation: ${glowPulse} 3s infinite ease-in-out;
    color: ${LIGHT_TEXT};
    span.word {
        display: inline-block;
        margin: 0 0.5rem;
    }
=======
  font-size: clamp(2.4rem, 6vw, 6.5rem); /* large, responsive */
  line-height: 0.95;
  margin: 0 0 18px 0;
  letter-spacing: -0.02em;
  display: inline-block;
  will-change: transform;
  /* overall neon pulse */
  animation: ${glowPulse} 3s infinite ease-in-out;
  color: ${LIGHT_TEXT};
  span.word {
    display: inline-block;
    margin: 0 0.5rem;
  }
>>>>>>> 225ebed91a843b32db53f7297dfc7ae53cd2c752
`;

/* each letter span */
const Letter = styled.span`
<<<<<<< HEAD
    display: inline-block;
    transform-origin: center bottom;
    /* apply flag wave animation with stagger via inline style delay */
    animation: ${flagWave} 2.2s ease-in-out infinite;
    /* scale slightly on browser zoom using CSS var set by JS */
    transform: translateY(0) rotate(0deg) scale(calc(1 * var(--dpr-scale, 1)));
    /* subtle neon color for specific words */
    &.neon {
        color: ${NEON_COLOR};
        filter: drop-shadow(0 0 8px ${NEON_COLOR});
    }
=======
  display: inline-block;
  transform-origin: center bottom;
  /* apply flag wave animation with stagger via inline style delay */
  animation: ${flagWave} 2.2s ease-in-out infinite;
  /* scale slightly on browser zoom using CSS var set by JS */
  transform: translateY(0) rotate(0deg) scale(calc(1 * var(--dpr-scale, 1)));
  /* subtle neon color for specific words */
  &.neon {
    color: ${NEON_COLOR};
    filter: drop-shadow(0 0 8px ${NEON_COLOR});
  }
>>>>>>> 225ebed91a843b32db53f7297dfc7ae53cd2c752
`;

/* Subtitle and buttons */
const Subtitle = styled.p`
<<<<<<< HEAD
    color: ${MUTED_TEXT};
    font-size: clamp(0.95rem, 1.2vw, 1.05rem);
    margin: 16px 0 28px;
    line-height: 1.6;
    max-width: 900px;
    margin-left: auto;
    margin-right: auto;
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    justify-content: center;
`;

const PrimaryBtn = styled.a`
    background: ${NEON_COLOR};
    color: ${DARK_BG};
    padding: 12px 26px;
    border-radius: 10px;
    font-weight: 700;
    text-decoration: none;
    box-shadow: 0 10px 30px rgba(0,224,179,0.25);
    display: inline-flex;
    align-items: center;
    gap: 10px;
    transition: transform .18s ease, box-shadow .18s ease;
    &:hover { transform: translateY(-3px); box-shadow: 0 16px 40px rgba(0,224,179,0.35); }
`;

const SecondaryBtn = styled(PrimaryBtn)`
    background: transparent;
    color: ${LIGHT_TEXT};
    border: 1px solid rgba(255,255,255,0.06);
=======
  color: ${MUTED_TEXT};
  font-size: clamp(0.95rem, 1.2vw, 1.05rem);
  margin: 16px 0 28px;
  line-height: 1.6;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
`;

const PrimaryBtn = styled.a`
  background: ${NEON_COLOR};
  color: ${DARK_BG};
  padding: 12px 26px;
  border-radius: 10px;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 10px 30px rgba(0,224,179,0.25);
  display: inline-flex;
  align-items: center;
  gap: 10px;
  transition: transform .18s ease, box-shadow .18s ease;
  &:hover { transform: translateY(-3px); box-shadow: 0 16px 40px rgba(0,224,179,0.35); }
`;

const SecondaryBtn = styled(PrimaryBtn)`
  background: transparent;
  color: ${LIGHT_TEXT};
  border: 1px solid rgba(255,255,255,0.06);
>>>>>>> 225ebed91a843b32db53f7297dfc7ae53cd2c752
`;

/* Footer */
const Footer = styled.footer`
<<<<<<< HEAD
    padding: 50px 20px;
    text-align: center;
    color: ${MUTED_TEXT};
    z-index: 2;
`;

/* -------------------------
    HOME PAGE COMPONENT
    ------------------------- */
const HomePage = ({ onNavigate = () => {}, generalData = {} }) => {
    const canvasRef = useRef(null);
    const rafRef = useRef(null);

    // keep last DPR to set CSS variable
    const [dpr, setDpr] = useState(typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1);

    // utility: split text into words then letters
    const renderAnimatedTitle = (text, neonWord = 'NEXORA') => {
        // ensure we keep words intact (we mark neon word)
        const words = text.split(' ');
        return words.map((w, wi) => (
            <span className="word" key={`w-${wi}`}>
                {Array.from(w).map((ch, li) => {
                    const isNeon = w.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() === neonWord;
                    // stagger delay based on overall index
                    const globalIndex = words.slice(0, wi).join(' ').length + li + wi; // rough unique index
                    const delay = (globalIndex % 20) * 0.04; // keep delays reasonable
                    return (
                        <Letter
                            key={`l-${wi}-${li}`}
                            className={isNeon ? 'neon' : ''}
                            style={{ animationDelay: `${delay}s` }}
                        >
                            {ch}
                        </Letter>
                    );
                })}
            </span>
        ));
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: true });

        // make canvas size match devicepixels for crispness (handles zoom/dpr)
        const setSize = () => {
            const dprLocal = Math.max(1, window.devicePixelRatio || 1);
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            canvas.width = Math.round(window.innerWidth * dprLocal);
            canvas.height = Math.round(window.innerHeight * dprLocal);
            ctx.setTransform(dprLocal, 0, 0, dprLocal, 0, 0);
        };
        setSize();

        let width = canvas.width / (window.devicePixelRatio || 1);
        let height = canvas.height / (window.devicePixelRatio || 1);

        const starCount = Math.max(80, Math.floor((window.innerWidth * window.innerHeight) / 50000));
        const stars = Array.from({ length: starCount }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            baseR: 0.6 + Math.random() * 1.6,
            dx: (Math.random() - 0.5) * 0.25,
            dy: 0.15 + Math.random() * 0.7,
            alpha: 0.3 + Math.random() * 0.7,
            twinklePhase: Math.random() * Math.PI * 2,
            twinkleSpeed: 0.004 + Math.random() * 0.014,
            glow: 3 + Math.random() * 6
        }));

        const orbs = Array.from({ length: 5 }, (_, i) => ({
            x: Math.random() * width,
            y: Math.random() * (height * 0.6),
            radius: 70 + Math.random() * 140,
            vx: (Math.random() - 0.5) * 0.12,
            vy: (Math.random() - 0.5) * 0.06,
            color: i % 2 ? 'rgba(98,0,255,0.035)' : 'rgba(0,224,179,0.05)'
        }));

        let meteors = [];
        function spawnMeteor() {
            const startX = Math.random() < 0.5 ? -80 : width + 80;
            const startY = Math.random() * height * 0.45;
            const dir = startX < 0 ? 1 : -1;
            meteors.push({
                x: startX,
                y: startY,
                vx: dir * (4 + Math.random() * 6),
                vy: 1 + Math.random() * 2,
                length: 80 + Math.random() * 140,
                life: 0,
                maxLife: 40 + Math.floor(Math.random() * 40)
            });
        }
        let meteorTimer = 0;
        const meteorIntervalBase = 360;

        const onResize = () => {
            setSize();
            width = canvas.width / (window.devicePixelRatio || 1);
            height = canvas.height / (window.devicePixelRatio || 1);
        };
        window.addEventListener('resize', onResize);

        function draw() {
            ctx.clearRect(0, 0, width, height);
            const gBg = ctx.createLinearGradient(0, 0, 0, height);
            gBg.addColorStop(0, '#071025');
            gBg.addColorStop(1, '#02040a');
            ctx.fillStyle = gBg;
            ctx.fillRect(0, 0, width, height);

            orbs.forEach(orb => {
                orb.x += orb.vx;
                orb.y += orb.vy;
                if (orb.x < -200) orb.x = width + 200;
                if (orb.x > width + 200) orb.x = -200;
                if (orb.y < -200) orb.y = height + 200;
                if (orb.y > height + 200) orb.y = -200;

                const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
                grad.addColorStop(0, orb.color);
                grad.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.globalCompositeOperation = 'lighter';
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.closePath();
                ctx.globalCompositeOperation = 'source-over';
            });

            stars.forEach(s => {
                s.twinklePhase += s.twinkleSpeed;
                const tw = 0.5 + Math.sin(s.twinklePhase) * 0.5;
                const radius = s.baseR * (0.8 + tw * 1.5);
                const glowR = radius * s.glow;

                s.x += s.dx;
                s.y += s.dy;
                if (s.y > height + 10) s.y = -10;
                if (s.x > width + 10) s.x = -10;
                if (s.x < -10) s.x = width + 10;

                const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, glowR);
                grad.addColorStop(0, `rgba(255,255,255,${0.9 * s.alpha})`);
                grad.addColorStop(0.1, `rgba(0,224,179,${0.55 * s.alpha})`);
                grad.addColorStop(0.35, `rgba(0,224,179,${0.18 * s.alpha})`);
                grad.addColorStop(1, 'rgba(0,0,0,0)');

                ctx.globalCompositeOperation = 'lighter';
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(s.x, s.y, glowR, 0, Math.PI * 2);
                ctx.fill();
                ctx.closePath();

                ctx.fillStyle = `rgba(255,255,255,${0.95 * s.alpha})`;
                ctx.beginPath();
                ctx.arc(s.x, s.y, radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.closePath();
                ctx.globalCompositeOperation = 'source-over';
            });

            meteorTimer += 1;
            if (meteorTimer > (meteorIntervalBase + Math.random() * 600)) {
                spawnMeteor();
                meteorTimer = 0;
            }
            meteors = meteors.filter(m => m.life < m.maxLife);
            meteors.forEach(m => {
                ctx.globalCompositeOperation = 'lighter';
                const trailGrad = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * m.length, m.y - m.vy * m.length);
                trailGrad.addColorStop(0, 'rgba(255,255,255,0.95)');
                trailGrad.addColorStop(1, 'rgba(0,224,179,0.02)');
                ctx.strokeStyle = trailGrad;
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.moveTo(m.x, m.y);
                ctx.lineTo(m.x - m.vx * m.length, m.y - m.vy * m.length);
                ctx.stroke();
                ctx.closePath();

                ctx.fillStyle = 'rgba(255,255,255,1)';
                ctx.beginPath();
                ctx.arc(m.x, m.y, 2.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.closePath();
                ctx.globalCompositeOperation = 'source-over';

                m.x += m.vx;
                m.y += m.vy;
                m.life++;
            });

            rafRef.current = requestAnimationFrame(draw);
        }

        draw();

        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener('resize', onResize);
        };
    }, []);

    // update CSS var based on devicePixelRatio for subtle scaling on zoom (listens to resize)
    useEffect(() => {
        const setVar = () => {
            const d = Math.max(1, window.devicePixelRatio || 1);
            // clamp scale to reasonable range so letters don't explode
            const scale = Math.min(1.25, 1 + (d - 1) * 0.18);
            document.documentElement.style.setProperty('--dpr-scale', String(scale));
            setDpr(d);
        };
        setVar();
        window.addEventListener('resize', setVar);
        // sometimes dpr changes without resize in some browsers — poll as fallback
        let poll = setInterval(() => {
            const now = Math.max(1, window.devicePixelRatio || 1);
            if (now !== dpr) setVar();
        }, 600);
        return () => {
            window.removeEventListener('resize', setVar);
            clearInterval(poll);
        };
    }, [dpr]);

    const safeGeneralData = {
        email: generalData?.email || 'info@nexora.com',
        phone: generalData?.phone || '+91 95976 46460',
        location: generalData?.location || 'Coimbatore, India',
    };

    return (
        <>
            <GlobalStyle />
            <StarCanvas ref={canvasRef} />

            <PageLayer>
                <HeroSection>
                    <HeroInner>
                        <TextBlock>
                            <Headline aria-hidden>
                                {renderAnimatedTitle('Welcome to NEXORA', 'NEXORA')}
                            </Headline>

                            <Subtitle>
                                Empowering students and businesses with next-level digital solutions — design, build, and grow with a student-driven creative studio.
                            </Subtitle>

                            <ButtonGroup>
                                {/* UPDATED: Text is now "Explore More" and navigates to 'about' */}
                                <PrimaryBtn onClick={() => onNavigate('about')}>
                                    Explore More <FontAwesomeIcon icon={faChevronRight} />
                                </PrimaryBtn>
                                <SecondaryBtn onClick={() => onNavigate('contact')}>
                                    Join Our Community <FontAwesomeIcon icon={faUsers} />
                                </SecondaryBtn>
                            </ButtonGroup>
                        </TextBlock>
                    </HeroInner>
                </HeroSection>

                <Footer>
                    <div style={{ marginBottom: 8 }}>
                        <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" style={{ color: LIGHT_TEXT, marginRight: 14 }}>
                            <FontAwesomeIcon icon={faInstagram} />
                        </a>
                        <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" style={{ color: LIGHT_TEXT, marginRight: 14 }}>
                            <FontAwesomeIcon icon={faLinkedinIn} />
                        </a>
                        <a href={`mailto:${safeGeneralData.email}`} style={{ color: LIGHT_TEXT }}>
                            <FontAwesomeIcon icon={faEnvelope} />
                        </a>
                    </div>
                    <div style={{ color: MUTED_TEXT }}>
                        © 2025 NEXORA Team, JJ College — All Rights Reserved.
                    </div>
                </Footer>
            </PageLayer>
        </>
    );
};

export default HomePage;
=======
  padding: 50px 20px;
  text-align: center;
  color: ${MUTED_TEXT};
  z-index: 2;
`;

/* -------------------------
   HOME PAGE COMPONENT
   ------------------------- */
const HomePage = ({ onNavigate = () => {}, generalData = {} }) => {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  // keep last DPR to set CSS variable
  const [dpr, setDpr] = useState(typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1);

  // utility: split text into words then letters
  const renderAnimatedTitle = (text, neonWord = 'NEXORA') => {
    // ensure we keep words intact (we mark neon word)
    const words = text.split(' ');
    return words.map((w, wi) => (
      <span className="word" key={`w-${wi}`}>
        {Array.from(w).map((ch, li) => {
          const isNeon = w.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() === neonWord;
          // stagger delay based on overall index
          const globalIndex = words.slice(0, wi).join(' ').length + li + wi; // rough unique index
          const delay = (globalIndex % 20) * 0.04; // keep delays reasonable
          return (
            <Letter
              key={`l-${wi}-${li}`}
              className={isNeon ? 'neon' : ''}
              style={{ animationDelay: `${delay}s` }}
            >
              {ch}
            </Letter>
          );
        })}
      </span>
    ));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });

    // make canvas size match devicepixels for crispness (handles zoom/dpr)
    const setSize = () => {
      const dprLocal = Math.max(1, window.devicePixelRatio || 1);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      canvas.width = Math.round(window.innerWidth * dprLocal);
      canvas.height = Math.round(window.innerHeight * dprLocal);
      ctx.setTransform(dprLocal, 0, 0, dprLocal, 0, 0);
    };
    setSize();

    let width = canvas.width / (window.devicePixelRatio || 1);
    let height = canvas.height / (window.devicePixelRatio || 1);

    const starCount = Math.max(80, Math.floor((window.innerWidth * window.innerHeight) / 50000));
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      baseR: 0.6 + Math.random() * 1.6,
      dx: (Math.random() - 0.5) * 0.25,
      dy: 0.15 + Math.random() * 0.7,
      alpha: 0.3 + Math.random() * 0.7,
      twinklePhase: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.004 + Math.random() * 0.014,
      glow: 3 + Math.random() * 6
    }));

    const orbs = Array.from({ length: 5 }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * (height * 0.6),
      radius: 70 + Math.random() * 140,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.06,
      color: i % 2 ? 'rgba(98,0,255,0.035)' : 'rgba(0,224,179,0.05)'
    }));

    let meteors = [];
    function spawnMeteor() {
      const startX = Math.random() < 0.5 ? -80 : width + 80;
      const startY = Math.random() * height * 0.45;
      const dir = startX < 0 ? 1 : -1;
      meteors.push({
        x: startX,
        y: startY,
        vx: dir * (4 + Math.random() * 6),
        vy: 1 + Math.random() * 2,
        length: 80 + Math.random() * 140,
        life: 0,
        maxLife: 40 + Math.floor(Math.random() * 40)
      });
    }
    let meteorTimer = 0;
    const meteorIntervalBase = 360;

    const onResize = () => {
      setSize();
      width = canvas.width / (window.devicePixelRatio || 1);
      height = canvas.height / (window.devicePixelRatio || 1);
    };
    window.addEventListener('resize', onResize);

    function draw() {
      ctx.clearRect(0, 0, width, height);
      const gBg = ctx.createLinearGradient(0, 0, 0, height);
      gBg.addColorStop(0, '#071025');
      gBg.addColorStop(1, '#02040a');
      ctx.fillStyle = gBg;
      ctx.fillRect(0, 0, width, height);

      orbs.forEach(orb => {
        orb.x += orb.vx;
        orb.y += orb.vy;
        if (orb.x < -200) orb.x = width + 200;
        if (orb.x > width + 200) orb.x = -200;
        if (orb.y < -200) orb.y = height + 200;
        if (orb.y > height + 200) orb.y = -200;

        const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
        grad.addColorStop(0, orb.color);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.globalCompositeOperation = 'source-over';
      });

      stars.forEach(s => {
        s.twinklePhase += s.twinkleSpeed;
        const tw = 0.5 + Math.sin(s.twinklePhase) * 0.5;
        const radius = s.baseR * (0.8 + tw * 1.5);
        const glowR = radius * s.glow;

        s.x += s.dx;
        s.y += s.dy;
        if (s.y > height + 10) s.y = -10;
        if (s.x > width + 10) s.x = -10;
        if (s.x < -10) s.x = width + 10;

        const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, glowR);
        grad.addColorStop(0, `rgba(255,255,255,${0.9 * s.alpha})`);
        grad.addColorStop(0.1, `rgba(0,224,179,${0.55 * s.alpha})`);
        grad.addColorStop(0.35, `rgba(0,224,179,${0.18 * s.alpha})`);
        grad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(s.x, s.y, glowR, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();

        ctx.fillStyle = `rgba(255,255,255,${0.95 * s.alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.globalCompositeOperation = 'source-over';
      });

      meteorTimer += 1;
      if (meteorTimer > (meteorIntervalBase + Math.random() * 600)) {
        spawnMeteor();
        meteorTimer = 0;
      }
      meteors = meteors.filter(m => m.life < m.maxLife);
      meteors.forEach(m => {
        ctx.globalCompositeOperation = 'lighter';
        const trailGrad = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * m.length, m.y - m.vy * m.length);
        trailGrad.addColorStop(0, 'rgba(255,255,255,0.95)');
        trailGrad.addColorStop(1, 'rgba(0,224,179,0.02)');
        ctx.strokeStyle = trailGrad;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x - m.vx * m.length, m.y - m.vy * m.length);
        ctx.stroke();
        ctx.closePath();

        ctx.fillStyle = 'rgba(255,255,255,1)';
        ctx.beginPath();
        ctx.arc(m.x, m.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.globalCompositeOperation = 'source-over';

        m.x += m.vx;
        m.y += m.vy;
        m.life++;
      });

      rafRef.current = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // update CSS var based on devicePixelRatio for subtle scaling on zoom (listens to resize)
  useEffect(() => {
    const setVar = () => {
      const d = Math.max(1, window.devicePixelRatio || 1);
      // clamp scale to reasonable range so letters don't explode
      const scale = Math.min(1.25, 1 + (d - 1) * 0.18);
      document.documentElement.style.setProperty('--dpr-scale', String(scale));
      setDpr(d);
    };
    setVar();
    window.addEventListener('resize', setVar);
    // sometimes dpr changes without resize in some browsers — poll as fallback
    let poll = setInterval(() => {
      const now = Math.max(1, window.devicePixelRatio || 1);
      if (now !== dpr) setVar();
    }, 600);
    return () => {
      window.removeEventListener('resize', setVar);
      clearInterval(poll);
    };
  }, [dpr]);

  const safeGeneralData = {
    email: generalData?.email || 'info@nexora.com',
    phone: generalData?.phone || '+91 95976 46460',
    location: generalData?.location || 'Coimbatore, India',
  };

  return (
    <>
      <GlobalStyle />
      <StarCanvas ref={canvasRef} />

      <PageLayer>
        <HeroSection>
          <HeroInner>
            <TextBlock>
              <Headline aria-hidden>
                {renderAnimatedTitle('Welcome to NEXORA', 'NEXORA')}
              </Headline>

              <Subtitle>
                Empowering students and businesses with next-level digital solutions — design, build, and grow with a student-driven creative studio.
              </Subtitle>

              <ButtonGroup>
                <PrimaryBtn onClick={() => onNavigate('services')}>
                  Explore Services <FontAwesomeIcon icon={faChevronRight} />
                </PrimaryBtn>
                <SecondaryBtn onClick={() => onNavigate('contact')}>
                  Join Our Community <FontAwesomeIcon icon={faUsers} />
                </SecondaryBtn>
              </ButtonGroup>
            </TextBlock>
          </HeroInner>
        </HeroSection>

        <Footer>
          <div style={{ marginBottom: 8 }}>
            <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" style={{ color: LIGHT_TEXT, marginRight: 14 }}>
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" style={{ color: LIGHT_TEXT, marginRight: 14 }}>
              <FontAwesomeIcon icon={faLinkedinIn} />
            </a>
            <a href={`mailto:${safeGeneralData.email}`} style={{ color: LIGHT_TEXT }}>
              <FontAwesomeIcon icon={faEnvelope} />
            </a>
          </div>
          <div style={{ color: MUTED_TEXT }}>
            © 2025 NEXORA Team, JJ College — All Rights Reserved.
          </div>
        </Footer>
      </PageLayer>
    </>
  );
};

export default HomePage;
>>>>>>> 225ebed91a843b32db53f7297dfc7ae53cd2c752
