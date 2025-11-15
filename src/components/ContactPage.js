// src/components/ContactPage.js
import React, { useEffect, useRef, useState } from "react";
import styled, { createGlobalStyle, keyframes, css } from "styled-components";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faPaperPlane,
  faBars,
  faTimes,
  faCalendarCheck
} from "@fortawesome/free-solid-svg-icons";

/* =======================
   API CONFIG
======================= */
const DEPLOYED_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_URL = DEPLOYED_BASE_URL
  ? `${DEPLOYED_BASE_URL}/api/messages`
  : "http://localhost:5000/api/messages";

/* =======================
   THEME
======================= */
const NEON = "#00ffc6";
const NAVY_BG = "#040b1a";
const LIGHT = "#e8f1ff";
const MUTED = "#9aa8b8";
const GLASS = "rgba(12, 20, 35, 0.55)";
const BORDER = "rgba(255,255,255,0.08)";
const ACCENT = "#12f3d4";

/* =======================
   GLOBAL
======================= */
const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }
  html, body, #root { height: 100%; margin: 0; color: ${LIGHT}; font-family: 'Poppins', system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial, sans-serif; background: ${NAVY_BG}; }
  .neon-text-shadow { text-shadow: 0 0 10px ${NEON}; }
`;

/* =======================
   KEYFRAMES
======================= */
const floatUp = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/* =======================
   LAYOUT / HEADER (matches About/Services)
======================= */
const Page = styled.div`
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
`;

/* Header copied to match About/Services style */
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
  z-index: 40;

  @media (max-width: 880px) {
    padding: 12px 18px;
    gap: 12px;
  }
`;

const Logo = styled.h1`
  color: ${NEON};
  font-size: 1.8rem;
  font-weight: 800;
  cursor: pointer;
  letter-spacing: 1px;
  margin: 0;
  text-shadow: 0 0 12px ${NEON};
`;

const NavGroup = styled.div`
  display: flex;
  gap: 22px;
  align-items: center;
  margin-right: auto;

  span {
    color: ${MUTED};
    cursor: pointer;
    font-weight: 500;
    position: relative;
    transition: 0.3s ease;
    padding: 6px 4px;
    background: transparent;
    border: none;
  }

  span:hover {
    color: ${NEON};
    text-shadow: 0 0 10px ${NEON};
  }

  span:after {
    content: '';
    position: absolute;
    left: 0; bottom: -2px;
    width: 0;
    height: 2px;
    background: ${NEON};
    transition: 0.3s;
    border-radius: 4px;
  }

  span:hover:after {
    width: 100%;
  }

  .active {
    color: ${NEON};
    text-shadow: 0 0 8px ${NEON};
  }

  @media (max-width: 880px) {
    gap: 12px;
    .hide-mobile { display: none; }
  }
`;

/* Mobile menu toggle (appears on small screens) */
const MobileToggle = styled.button`
  display: none;
  @media (max-width: 880px) { display: inline-flex; }
  border: 0;
  background: transparent;
  color: ${NEON};
  font-size: 1.25rem;
  cursor: pointer;
`;

/* Small slide-down mobile nav */
const MobileNav = styled.div`
  display: none;
  @media (max-width: 880px) {
    display: ${({ open }) => (open ? "block" : "none")};
    position: absolute;
    top: 64px;
    left: 12px;
    right: 12px;
    background: rgba(7,16,38,0.92);
    border-radius: 10px;
    padding: 12px;
    z-index: 45;
    border: 1px solid rgba(255,255,255,0.04);
  }
`;

/* =======================
   STARFIELD (scoped)
======================= */
const Section = styled.section`
  position: relative;
  padding: clamp(56px, 6vw, 80px) 20px;
  display: grid;
  place-items: center;
`;

const SectionInner = styled.div`
  position: relative;
  width: min(1100px, 100%);
  z-index: 2;
`;

const StarLayer = styled.canvas`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  border-radius: 20px;
  overflow: hidden;
`;

const StarGlow = styled.div`
  position: absolute;
  inset: -20%;
  background: radial-gradient(60% 40% at 50% 0%, rgba(0,255,198,0.10), transparent 55%),
              radial-gradient(30% 30% at 85% 40%, rgba(0,255,198,0.06), transparent 60%);
  filter: blur(30px);
  pointer-events: none;
  z-index: 1;
`;

/* =======================
   TITLES
======================= */
const TitleWrap = styled.div`
  text-align: center;
  margin-bottom: 28px;
  animation: ${floatUp} 0.6s ease both;
`;

const Title = styled.h1`
  margin: 0 0 8px 0;
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 800;
  span { color: ${NEON}; }
`;

const Subtitle = styled.p`
  margin: 0;
  color: ${MUTED};
`;

/* =======================
   GRID & CARDS (unchanged)
======================= */
const Grid = styled.div`
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  gap: 26px;

  @media (max-width: 980px){
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  position: relative;
  background: ${GLASS};
  border: 1px solid ${BORDER};
  border-radius: 18px;
  padding: 22px;
  box-shadow: 0 12px 30px rgba(0,0,0,0.25);
  backdrop-filter: blur(8px);
  animation: ${floatUp} .6s ease both;
`;

const CardTitle = styled.h3` margin: 0 0 14px 0; color: ${NEON}; `;

const InfoRow = styled.div`
  display: grid;
  grid-template-columns: 28px 1fr;
  gap: 12px;
  align-items: start;
  padding: 10px 0;
  color: ${LIGHT};
  small { color: ${MUTED}; display: block; }
  .icon { color: ${NEON}; font-size: 1.1rem; line-height: 1; margin-top: 2px; }
`;

/* FORM */
const Form = styled.form` display: grid; gap: 14px; `;
const Label = styled.label` font-size: 0.92rem; color: ${MUTED}; margin-bottom: 6px; display: inline-block; `;
const Input = styled.input`
  width: 100%;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  color: ${LIGHT};
  padding: 12px 14px;
  border-radius: 12px;
  outline: none;
  transition: border .2s ease, box-shadow .2s ease, background .2s ease;
  &::placeholder { color: rgba(232,241,255,.5); }
  &:focus { border-color: ${NEON}; box-shadow: 0 0 0 4px rgba(0,255,198,0.12); background: rgba(255,255,255,0.06); }
`;
const TextArea = styled.textarea`
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255,255,255,0.08);
  color: ${LIGHT};
  padding: 14px 16px;
  border-radius: 14px;
  font-size: 1rem;
  font-family: 'Poppins', sans-serif;
  line-height: 1.6;
  outline: none;
  resize: none;
  min-height: 160px;
  transition: all 0.3s ease;
  box-shadow: inset 0 2px 8px rgba(0,0,0,0.25);
  &::placeholder { color: rgba(232,241,255,0.45); font-style: italic; }
  &:focus { border-color: ${NEON}; background: rgba(255,255,255,0.08); box-shadow: 0 0 14px rgba(0,255,198,0.25), inset 0 0 8px rgba(0,255,198,0.12); }
`;
const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(90deg, ${NEON}, ${ACCENT});
  color: #00130e;
  border: none;
  font-weight: 800;
  padding: 12px 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: transform .15s ease, box-shadow .15s ease, opacity .2s ease;
  &:hover { transform: translateY(-2px); box-shadow: 0 10px 22px rgba(0,255,198,.28); }
  &:disabled { opacity: .6; cursor: not-allowed; transform: none; box-shadow: none; }
`;
const Status = styled.p` margin: 8px 0 0 0; font-weight: 600; color: ${({ type }) => (type === "error" ? "#ff6b6b" : NEON)}; `;
const Footer = styled.footer` margin-top: auto; padding: 22px; text-align: center; color: ${MUTED}; border-top: 1px solid ${BORDER}; `;

/* =======================
   STARFIELD HOOK (scoped)
======================= */
function useStarfield(containerRef, density = 120) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width = container.clientWidth;
    let height = container.clientHeight;
    let raf;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    function sizeCanvas() {
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = Math.max(1, Math.floor(width * DPR));
      canvas.height = Math.max(1, Math.floor(height * DPR));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    sizeCanvas();

    const stars = Array.from({ length: density }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.6 + 0.5,
      dx: (Math.random() - 0.5) * 0.35,
      dy: 0.25 + Math.random() * 0.4,
      a: 0.35 + Math.random() * 0.65,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const g = ctx.createLinearGradient(0, 0, 0, height);
      g.addColorStop(0, "rgba(4,11,26,0.85)");
      g.addColorStop(1, "rgba(4,11,26,0.95)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);

      stars.forEach((s) => {
        s.x += s.dx;
        s.y += s.dy;

        if (s.y > height) s.y = 0;
        if (s.x > width) s.x = 0;
        if (s.x < 0) s.x = width;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,255,198,${s.a})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };

    const ro = new ResizeObserver(sizeCanvas);
    ro.observe(container);
    draw();

    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [containerRef, density]);

  return canvasRef;
}

/* =======================
   PAGE
======================= */
export default function ContactPage({ onNavigate, generalData }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState({ type: "", text: "" });
  const [form, setForm] = useState({ name: "", email: "", mobile: "", message: "" });

  const sectionRef = useRef(null);
  const canvasRef = useStarfield(sectionRef, 130);
  const safe = generalData || {};

  useEffect(() => {
    // close mobile nav on route change attempt handled by parent
  }, []);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    setStatus({ type: "", text: "Sending..." });

    try {
      await axios.post(API_URL, form);
      setStatus({ type: "success", text: "✅ Message sent successfully!" });
      setForm({ name: "", email: "", mobile: "", message: "" });
    } catch (err) {
      let msg = "❌ Failed to send. Please check network connection.";
      if (err?.response) {
        if (err.response.status === 400 && err.response.data?.errors) {
          msg = `❌ Validation Error: ${err.response.data.errors[0].msg}`;
        } else if (err.response.status === 500) {
          msg = "❌ Server Error (500). Database save failed.";
        } else if ([404, 405].includes(err.response.status)) {
          msg = "❌ Routing Error. Backend endpoint not found/allowed. (Check /api prefix)";
        }
      }
      setStatus({ type: "error", text: msg });
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <GlobalStyle />

      {/* Header (same UI/UX as About/Services) */}
      <Header>
        <Logo onClick={() => onNavigate?.("home")} className="neon-text-shadow">NEXORA</Logo>

        <NavGroup>
          <span onClick={() => onNavigate?.("home")}>Home</span>
          <span onClick={() => onNavigate?.("about")}>About</span>
          <span onClick={() => onNavigate?.("services")}>Services</span>
          <span onClick={() => onNavigate?.("projects")}>Projects</span>
          <span onClick={() => onNavigate?.("blog")}>Blog</span>
          <span className="active" onClick={() => onNavigate?.("contact")}>Contact</span>

          <span onClick={() => onNavigate?.("schedule")} style={{ color: NEON, display: 'inline-flex', alignItems: 'center' }}>
            <FontAwesomeIcon icon={faCalendarCheck} style={{ marginRight: 6 }} />
            Schedule Meeting
          </span>
        </NavGroup>

        <MobileToggle onClick={() => setMobileOpen(s => !s)} aria-label="Toggle menu">
          <FontAwesomeIcon icon={mobileOpen ? faTimes : faBars} />
        </MobileToggle>
      </Header>

      {/* Small slide-down mobile nav (re-uses header items) */}
      <MobileNav open={mobileOpen}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button onClick={() => { onNavigate?.('home'); setMobileOpen(false); }} style={mobileBtnStyle()}>Home</button>
          <button onClick={() => { onNavigate?.('about'); setMobileOpen(false); }} style={mobileBtnStyle()}>About</button>
          <button onClick={() => { onNavigate?.('services'); setMobileOpen(false); }} style={mobileBtnStyle()}>Services</button>
          <button onClick={() => { onNavigate?.('projects'); setMobileOpen(false); }} style={mobileBtnStyle()}>Projects</button>
          <button onClick={() => { onNavigate?.('blog'); setMobileOpen(false); }} style={mobileBtnStyle()}>Blog</button>
          <button onClick={() => { onNavigate?.('contact'); setMobileOpen(false); }} style={mobileBtnStyle(true)}>Contact</button>
          <div style={{ marginTop: 8 }}>
            <Button onClick={() => { onNavigate?.('schedule'); setMobileOpen(false); }}><FontAwesomeIcon icon={faCalendarCheck} /> Schedule</Button>
          </div>
        </div>
      </MobileNav>

      {/* CONTACT SECTION */}
      <Page>
        <Section ref={sectionRef}>
          <StarLayer ref={canvasRef} aria-hidden />
          <StarGlow />

          <SectionInner>
            <TitleWrap>
              <Title>Let’s <span>Connect</span></Title>
              <Subtitle>Have a project or idea? Reach out to collaborate!</Subtitle>
            </TitleWrap>

            <Grid>
              {/* LEFT: INFO */}
              <Card>
                <CardTitle>Get In Touch</CardTitle>

                <InfoRow>
                  <FontAwesomeIcon icon={faEnvelope} className="icon" />
                  <div>
                    <strong>Email</strong>
                    <small>{safe.email || "nexora.crew@gmail.com"}</small>
                  </div>
                </InfoRow>

                <InfoRow>
                  <FontAwesomeIcon icon={faPhone} className="icon" />
                  <div>
                    <strong>Phone</strong>
                    <small>{safe.phone || "+91 95976 46460"}</small>
                  </div>
                </InfoRow>

                <InfoRow>
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="icon" />
                  <div>
                    <strong>Location</strong>
                    <small>Palakarai, Tiruchirappalli, Tamil Nadu</small>
                  </div>
                </InfoRow>
              </Card>

              {/* RIGHT: FORM */}
              <Card>
                <Form onSubmit={submit} noValidate>
                  <div>
                    <Label htmlFor="name">Your Name</Label>
                    <Input id="name" name="name" placeholder="John Doe" value={form.name} onChange={onChange} required />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" name="email" placeholder="you@example.com" value={form.email} onChange={onChange} required />
                  </div>

                  <div>
                    <Label htmlFor="mobile">Mobile</Label>
                    <Input id="mobile" name="mobile" placeholder="+91 9xxxx xxxxx" value={form.mobile} onChange={onChange} required />
                  </div>

                  <div>
                    <Label htmlFor="message">Message</Label>
                    <TextArea id="message" name="message" placeholder="Tell us about your project…" value={form.message} onChange={onChange} required />
                  </div>

                  <Button type="submit" disabled={sending} aria-busy={sending}>
                    <FontAwesomeIcon icon={faPaperPlane} />
                    {sending ? "Sending..." : "Send Message"}
                  </Button>

                  {status.text && <Status type={status.type}>{status.text}</Status>}
                </Form>
              </Card>
            </Grid>
          </SectionInner>
        </Section>

        <Footer>© NEXORACREW — Crafted with passion ✨</Footer>
      </Page>
    </>
  );
}

/* =======================
   Small helper for mobile btn style
======================= */
function mobileBtnStyle(active = false) {
  return {
    background: active ? 'linear-gradient(90deg,#00ffc6,#12f3d4)' : 'transparent',
    color: active ? '#00130e' : '#9aa8b8',
    fontWeight: 700,
    padding: '10px 12px',
    borderRadius: 8,
    border: 'none',
    textAlign: 'left',
    cursor: 'pointer'
  };
}
