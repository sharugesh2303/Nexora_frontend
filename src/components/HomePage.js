import React, { useEffect, useRef } from 'react';
import styled, { createGlobalStyle, keyframes, css } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

// === THEME COLORS ===
const NEON_COLOR = '#00e0b3';
const DARK_BG = '#0F172A';
const LIGHT_TEXT = '#E2E8F0';
const MUTED_TEXT = '#A9B7C7';
const CARD_BG = '#1E293B';
const ACCENT_BG = '#1ddc9f';
const BORDER_LIGHT = '#273449';

// === GLOBAL STYLES ===
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Poppins', sans-serif;
    background-color: ${DARK_BG};
    color: ${LIGHT_TEXT};
    overflow-x: hidden;
    position: relative;
  }
  .neon-text-shadow {
    text-shadow: 0 0 3px ${NEON_COLOR}, 0 0 8px rgba(0, 224, 179, 0.5);
  }
`;

// === KEYFRAMES ===
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;
const glowPulse = keyframes`
  0%, 100% { text-shadow: 0 0 8px ${NEON_COLOR}, 0 0 15px rgba(0,224,179,0.6); }
  50% { text-shadow: 0 0 15px ${NEON_COLOR}, 0 0 25px rgba(0,224,179,0.8); }
`;

// === BACKGROUND STAR CANVAS ===
const StarCanvas = styled.canvas`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background: radial-gradient(circle at 20% 20%, #0d1b2a, #0b1321, #050811);
`;

// === HERO SECTION ===
const HeroSection = styled.section`
  height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  animation: ${fadeUp} 1.2s ease forwards;
`;

const HeroTitle = styled.h1`
  font-size: 3.8em;
  color: #fff;
  animation: ${glowPulse} 2s infinite alternate;
  margin-bottom: 15px;

  span {
    color: ${NEON_COLOR};
  }

  @media (max-width: 768px) {
    font-size: 2.5em;
  }
`;

const HeroSubtitle = styled.p`
  color: ${MUTED_TEXT};
  font-size: 1.2em;
  max-width: 700px;
  margin-bottom: 40px;
  line-height: 1.6;
`;

const HeroButton = styled.a`
  background: ${NEON_COLOR};
  color: ${DARK_BG};
  padding: 12px 30px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1em;
  text-decoration: none;
  box-shadow: 0 0 20px rgba(0,224,179,0.4);
  transition: all 0.3s ease;

  &:hover {
    background: ${ACCENT_BG};
    transform: translateY(-3px);
    box-shadow: 0 0 30px rgba(0,224,179,0.6);
  }
`;

// === SECTIONS ===
const Section = styled.section`
  padding: 100px 50px;
  text-align: center;
  background-color: ${props => props.dark ? DARK_BG : '#111827'};
  color: ${LIGHT_TEXT};

  @media (max-width: 768px) {
    padding: 60px 20px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 3em;
  margin-bottom: 20px;
  span {
    color: ${NEON_COLOR};
  }
  @media (max-width: 768px) {
    font-size: 2em;
  }
`;

const SectionSubtitle = styled.p`
  color: ${MUTED_TEXT};
  max-width: 700px;
  margin: 0 auto 60px auto;
  font-size: 1.1em;
  line-height: 1.6;
`;

// === SERVICE CARDS ===
const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 35px;
  max-width: 1100px;
  margin: 0 auto;
`;

const Card = styled.div`
  background-color: ${CARD_BG};
  padding: 30px;
  border-radius: 15px;
  border: 1px solid ${BORDER_LIGHT};
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 0 25px rgba(0, 224, 179, 0.3);
    border-color: ${NEON_COLOR};
  }

  h3 {
    color: ${NEON_COLOR};
    font-size: 1.3em;
    margin-bottom: 15px;
  }

  p {
    color: ${MUTED_TEXT};
    font-size: 1em;
    line-height: 1.6;
  }
`;

// === FOOTER ===
const FooterContainer = styled.footer`
  background-color: #0F172A;
  padding: 60px 50px 40px 50px;
  color: ${LIGHT_TEXT};
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const GlowLine = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  width: 80%;
  height: 2px;
  background: linear-gradient(90deg, transparent, ${NEON_COLOR}, transparent);
  transform: translateX(-50%);
  opacity: 0.7;
`;

const FooterTitle = styled.h2`
  font-size: 1.8em;
  color: #FFFFFF;
  margin-bottom: 10px;
  ${css`text-shadow: 0 0 8px ${NEON_COLOR}, 0 0 20px rgba(0, 224, 179, 0.3);`}
`;

const FooterSubtitle = styled.p`
  font-size: 1.05em;
  color: #D6E2F0;
  margin-bottom: 35px;
`;

const SocialLinks = styled.div`
  margin-bottom: 35px;
`;

const SocialIconLink = styled.a`
  display: inline-block;
  color: #D6E2F0;
  font-size: 1.8em;
  margin: 0 18px;
  transition: color 0.3s ease, transform 0.2s ease, text-shadow 0.3s ease;

  &:hover {
    color: ${NEON_COLOR};
    transform: translateY(-5px) scale(1.1);
    text-shadow: 0 0 10px ${NEON_COLOR}, 0 0 25px rgba(0, 224, 179, 0.7);
  }
`;

const Divider = styled.div`
  width: 80%;
  height: 1px;
  background-color: rgba(255, 255, 255, 0.1);
  margin: 25px auto;
`;

const Copyright = styled.p`
  font-size: 0.9em;
  color: #A9B7C7;
  margin-top: 15px;
`;

// === MAIN COMPONENT ===
const HomePage = ({ onNavigate }) => {
  const canvasRef = useRef(null);

  // Star animation setup
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const stars = Array.from({ length: 150 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5,
      speed: Math.random() * 0.3 + 0.05,
    }));

    const drawStars = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#ffffff';
      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const updateStars = () => {
      stars.forEach((star) => {
        star.y += star.speed;
        if (star.y > height) star.y = 0;
      });
    };

    const animate = () => {
      drawStars();
      updateStars();
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <GlobalStyle />
      <StarCanvas ref={canvasRef} />

      {/* --- HERO --- */}
      <HeroSection>
        <HeroTitle>
          Welcome to <span>NEXORA</span>
        </HeroTitle>
        <HeroSubtitle>
          Empowering students and businesses with next-level digital solutions.
        </HeroSubtitle>
        <HeroButton onClick={() => onNavigate('about')}>Explore More</HeroButton>
      </HeroSection>

      {/* --- ABOUT --- */}
      <Section>
        <SectionTitle>
          Why <span>Choose</span> Us
        </SectionTitle>
        <SectionSubtitle>
          We bridge creativity, technology, and innovation — turning student ideas into professional-level digital solutions.
        </SectionSubtitle>
        <CardGrid>
          <Card>
            <h3>Innovation</h3>
            <p>We empower students to think creatively and build practical tech-driven projects.</p>
          </Card>
          <Card>
            <h3>Mentorship</h3>
            <p>Our experienced mentors guide you through every phase — from idea to implementation.</p>
          </Card>
          <Card>
            <h3>Collaboration</h3>
            <p>We bring together developers, designers, and innovators to craft impactful solutions.</p>
          </Card>
        </CardGrid>
      </Section>

      {/* --- SERVICES --- */}
      <Section dark>
        <SectionTitle>
          Our <span>Services</span>
        </SectionTitle>
        <SectionSubtitle>
          From full-stack development to creative branding, we help you stand out in the digital world.
        </SectionSubtitle>
        <CardGrid>
          <Card>
            <h3>Web & App Development</h3>
            <p>Modern, responsive, and scalable digital platforms built for your goals.</p>
          </Card>
          <Card>
            <h3>Creative Design</h3>
            <p>Branding, posters, UI/UX — everything you need to visually inspire.</p>
          </Card>
          <Card>
            <h3>SEO & Marketing</h3>
            <p>We help you reach your audience with optimized content and strategy.</p>
          </Card>
        </CardGrid>
      </Section>

      {/* --- CTA --- */}
      <Section>
        <SectionTitle>
          Start Your <span>Journey</span> with Us
        </SectionTitle>
        <HeroButton onClick={() => onNavigate('contact')}>Join Now</HeroButton>
      </Section>

      {/* --- FOOTER --- */}
      <FooterContainer>
        <GlowLine />
        <FooterTitle>NEXORA</FooterTitle>
        <FooterSubtitle>Where Student Ideas Meet Creative Solutions.</FooterSubtitle>
        <SocialLinks>
          <SocialIconLink href="https://www.instagram.com/" target="_blank" aria-label="Instagram">
            <FontAwesomeIcon icon={faInstagram} />
          </SocialIconLink>
          <SocialIconLink href="https://www.linkedin.com/" target="_blank" aria-label="LinkedIn">
            <FontAwesomeIcon icon={faLinkedin} />
          </SocialIconLink>
          <SocialIconLink href="mailto:info@nexora.com" aria-label="Email">
            <FontAwesomeIcon icon={faEnvelope} />
          </SocialIconLink>
        </SocialLinks>
        <Divider />
        <Copyright>© 2025 NEXORA Team, JJ College — All Rights Reserved.</Copyright>
      </FooterContainer>
    </>
  );
};

export default HomePage;
