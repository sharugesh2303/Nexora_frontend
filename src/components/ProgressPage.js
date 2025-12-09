// src/components/ProgressPage.jsx
import React from 'react';
import styled, { createGlobalStyle, keyframes, css } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBullseye,
    faTriangleExclamation,
    faBolt,
    faUserShield,
    faCalendarCheck
} from '@fortawesome/free-solid-svg-icons';

/* ---------------- THEME ---------------- */
const NEON_COLOR = '#00e0b3';
const TEXT_LIGHT = '#E6F0F2';
const TEXT_MUTED = '#9AA8B8';

/* ---------------- GLOBAL STYLE ---------------- */
const GlobalStyle = createGlobalStyle`
    html, body, #root { height: 100%; }

    body {
        margin: 0;
        font-family: 'Poppins', sans-serif;
        background: radial-gradient(circle at 20% 10%, #0a132f 0%, #050817 40%, #01030a 100%);
        color: ${TEXT_LIGHT};
        overflow-x: hidden;
    }
`;

/* ---------------- ANIMATIONS ---------------- */
const glowPulse = keyframes`
  0% { box-shadow: 0 0 0px rgba(34,197,94,0.0); }
  50% { box-shadow: 0 0 28px rgba(34,197,94,0.35); }
  100% { box-shadow: 0 0 0px rgba(34,197,94,0.0); }
`;

/* ---------------- HEADER (same style as About) ---------------- */
const Header = styled.header`
    display: flex;
    align-items: center;
    gap: 40px;
    padding: 14px 48px;
    position: sticky;
    top: 0;
    width: 100%;
    background: rgba(7,16,38,0.65);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255,255,255,0.04);
    z-index: 10;

    @media (max-width: 780px) {
        padding: 12px 20px;
        gap: 18px;
    }
`;

const Logo = styled.h1`
    color: ${NEON_COLOR};
    font-size: 1.8rem;
    font-weight: 800;
    cursor: pointer;
    letter-spacing: 1px;
    text-shadow: 0 0 12px ${NEON_COLOR};
`;

const NavGroup = styled.div`
    display: flex;
    gap: 22px;
    align-items: center;
    margin-right: auto;

    span {
        color: ${TEXT_MUTED};
        cursor: pointer;
        font-weight: 500;
        position: relative;
        transition: 0.3s ease;
        padding: 6px 4px;

        &:hover {
            color: ${NEON_COLOR};
            text-shadow: 0 0 10px ${NEON_COLOR};
        }

        &:after {
            content: '';
            position: absolute;
            left: 0; bottom: -2px;
            width: 0;
            height: 2px;
            background: ${NEON_COLOR};
            transition: 0.3s;
            border-radius: 4px;
        }
        &:hover:after {
            width: 100%;
        }
    }
`;

/* ---------------- PAGE LAYOUT ---------------- */
const PageWrapper = styled.div`
    position: relative;
    min-height: 100vh;
`;

const ContentWrapper = styled.div`
    max-width: 1180px;
    margin: 0 auto;
    padding: 140px 24px 80px;

    @media (max-width: 780px) {
        padding: 120px 20px 60px;
    }
`;

const Shell = styled.div`
  border-radius: 32px;
  padding: 48px 40px 56px;
  background: radial-gradient(circle at top left, #020617, #020617 55%, #020617 100%);
  border: 1px solid rgba(148, 163, 184, 0.18);
  box-shadow: 0 24px 80px rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(24px);

  @media (max-width: 768px) {
    padding: 32px 20px 40px;
    border-radius: 24px;
  }
`;

const Title = styled.h1`
  text-align: center;
  font-size: 34px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  margin: 0 0 40px;
  color: #e5e7eb;

  span {
    color: #facc15;
  }

  @media (max-width: 640px) {
    font-size: 26px;
    letter-spacing: 0.12em;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 28px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const BaseBox = styled.div`
  border-radius: 28px;
  padding: 26px 30px;
  background: radial-gradient(circle at top left, #020617, #020617 55%, #020617 100%);
  border: 1px solid rgba(15, 23, 42, 1);
  position: relative;
  overflow: hidden;
  transition: transform 0.16s ease-out, border-color 0.16s ease-out;

  &:before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: radial-gradient(circle at top left, rgba(248, 250, 252, 0.05), transparent 60%);
    opacity: 0;
    transition: opacity 0.22s ease-out;
  }

  &:hover:before {
    opacity: 1;
  }

  &:hover {
    transform: translateY(-4px);
  }
`;

const StrengthBox = styled(BaseBox)`
  border-left: 3px solid #22c55e;
  animation: ${glowPulse} 4s ease-in-out infinite;
`;
const WeaknessBox = styled(BaseBox)`
  border-left: 3px solid #ef4444;
`;
const OpportunityBox = styled(BaseBox)`
  border-left: 3px solid #3b82f6;
`;
const ThreatBox = styled(BaseBox)`
  border-left: 3px solid #eab308;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 12px;
`;

const IconCircle = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;

  ${({ variant }) =>
    variant === "strength" &&
    css`
      border: 1px solid rgba(34, 197, 94, 0.4);
      background: radial-gradient(circle, rgba(34, 197, 94, 0.08), transparent);
      color: #4ade80;
    `}
  ${({ variant }) =>
    variant === "weakness" &&
    css`
      border: 1px solid rgba(248, 113, 113, 0.5);
      background: radial-gradient(circle, rgba(248, 113, 113, 0.08), transparent);
      color: #f97373;
    `}
  ${({ variant }) =>
    variant === "opportunity" &&
    css`
      border: 1px solid rgba(59, 130, 246, 0.5);
      background: radial-gradient(circle, rgba(59, 130, 246, 0.08), transparent);
      color: #60a5fa;
    `}
  ${({ variant }) =>
    variant === "threat" &&
    css`
      border: 1px solid rgba(234, 179, 8, 0.5);
      background: radial-gradient(circle, rgba(234, 179, 8, 0.08), transparent);
      color: #facc15;
    `}
`;

const BoxTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: #f9fafb;
  margin: 0;
`;

const BulletList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 8px 0 0;

  li {
    font-size: 14px;
    color: #cbd5f5;
    margin-bottom: 6px;
    position: relative;
    padding-left: 16px;
  }

  li:before {
    content: "•";
    position: absolute;
    left: 0;
    top: -1px;
    color: #64748b;
  }
`;

/* ---------------- COMPONENT ---------------- */
const ProgressPage = ({ onNavigate = () => {} }) => {
    return (
        <>
            <GlobalStyle />
            <PageWrapper>
                {/* NAVBAR */}
                <Header>
                    <Logo onClick={() => onNavigate('home')}>NEXORA</Logo>
                    <NavGroup>
                        <span onClick={() => onNavigate('home')}>Home</span>
                        <span onClick={() => onNavigate('about')}>About</span>
                        <span onClick={() => onNavigate('services')}>Services</span>
                        <span onClick={() => onNavigate('projects')}>Projects</span>
                        <span onClick={() => onNavigate('blog')}>Blog</span>
                        <span onClick={() => onNavigate('team')}>Team</span>

                        {/* ACTIVE ITEM FOR THIS PAGE */}
                        <span
                            onClick={() => onNavigate('progress')}
                            style={{ color: NEON_COLOR }}
                        >
                            Progress
                        </span>

                        <span onClick={() => onNavigate('contact')}>Contact</span>
                        <span
                            onClick={() => onNavigate('schedule')}
                            style={{ color: NEON_COLOR, display: 'inline-flex', alignItems: 'center', gap: 6 }}
                        >
                            <FontAwesomeIcon icon={faCalendarCheck} />
                            Schedule Meeting
                        </span>
                    </NavGroup>
                </Header>

                {/* SWOT CONTENT */}
                <ContentWrapper>
                    <Shell>
                        <Title>
                            STRATEGIC <span>ANALYSIS</span>
                        </Title>

                        <Grid>
                            <StrengthBox>
                                <HeaderRow>
                                    <IconCircle variant="strength">
                                        <FontAwesomeIcon icon={faBullseye} />
                                    </IconCircle>
                                    <BoxTitle>Strengths</BoxTitle>
                                </HeaderRow>
                                <BulletList>
                                    <li>Agile, student-led expert team</li>
                                    <li>Cost-effective enterprise solutions</li>
                                    <li>Strong incubation support</li>
                                </BulletList>
                            </StrengthBox>

                            <WeaknessBox>
                                <HeaderRow>
                                    <IconCircle variant="weakness">
                                        <FontAwesomeIcon icon={faTriangleExclamation} />
                                    </IconCircle>
                                    <BoxTitle>Weaknesses</BoxTitle>
                                </HeaderRow>
                                <BulletList>
                                    <li>Limited initial capital (Bootstrapped)</li>
                                    <li>Balancing academics with delivery</li>
                                </BulletList>
                            </WeaknessBox>

                            <OpportunityBox>
                                <HeaderRow>
                                    <IconCircle variant="opportunity">
                                        <FontAwesomeIcon icon={faBolt} />
                                    </IconCircle>
                                    <BoxTitle>Opportunities</BoxTitle>
                                </HeaderRow>
                                <BulletList>
                                    <li>Expanding AI &amp; IoT markets</li>
                                    <li>Partnerships with TANSIM &amp; DPIIT</li>
                                </BulletList>
                            </OpportunityBox>

                            <ThreatBox>
                                <HeaderRow>
                                    <IconCircle variant="threat">
                                        <FontAwesomeIcon icon={faUserShield} />
                                    </IconCircle>
                                    <BoxTitle>Threats</BoxTitle>
                                </HeaderRow>
                                <BulletList>
                                    <li>High market saturation</li>
                                    <li>Rapid tech obsolescence</li>
                                </BulletList>
                            </ThreatBox>
                        </Grid>
                    </Shell>
                </ContentWrapper>
            </PageWrapper>
        </>
    );
};

export default ProgressPage;
