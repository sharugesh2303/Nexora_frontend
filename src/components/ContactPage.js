// src/components/ContactPage.jsx
import React, { useEffect, useRef, useState } from "react";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faPaperPlane,
  faBars,
  faTimes,
  faCalendarCheck,
  faEnvelopeSquare,
  faMapMarker,
} from "@fortawesome/free-solid-svg-icons";
import {
  faInstagram,
  faLinkedin,
  faWhatsapp,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

/* =======================
   API CONFIG (unchanged)
======================= */
const DEPLOYED_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const MESSAGE_API_URL = DEPLOYED_BASE_URL
  ? `${DEPLOYED_BASE_URL}/api/messages`
  : "http://localhost:5000/api/messages";

const SCHEDULE_API_URL = DEPLOYED_BASE_URL
  ? `${DEPLOYED_BASE_URL}/api/schedule`
  : "http://localhost:5000/api/schedule";

/* =======================
   THEME (light / navy / gold)
======================= */
const NAVY = "#012a4a";
const GOLD = "#d4af37";
const BG_WHITE = "#ffffff";
const LIGHT_TEXT = "#012a4a"; // primary text (navy)
const MUTED = "#6f7b86";
const GLASS_LIGHT = "rgba(250, 251, 253, 0.95)"; // card bg
const BORDER = "rgba(1,42,74,0.08)";
const INPUT_BG = "#f6f8fb";
const INPUT_BORDER = "rgba(1,42,74,0.12)";

/* =======================
   GLOBAL
======================= */
const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }
  html, body, #root {
    height: 100%;
    margin: 0;
    color: ${LIGHT_TEXT};
    font-family: 'Poppins', system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
    background: ${BG_WHITE};
  }
`;

/* =======================
   LAYOUT
======================= */
const Page = styled.div`
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
`;

/* Header */
const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 40px;
  padding: 14px 48px;
  background: rgba(255,255,255,0.95);
  border-bottom: 1px solid ${BORDER};

  @media (max-width: 768px) {
    padding: 12px 20px;
    gap: 20px;
  }
`;

/* Brand: NEXORA (navy) + CREW (gold) */
const Brand = styled.div`
  font-weight: 800;
  letter-spacing: 0.5px;
  cursor: pointer;
  font-size: 1.4rem;
  display: inline-flex;
  align-items: center;
  gap: 0px;
`;

const BrandN = styled.span`
  color: ${NAVY};
`;
const BrandCrew = styled.span`
  color: ${GOLD};
`;

/* Nav */
const Nav = styled.nav`
  display: flex;
  gap: 18px;
  margin-right: auto;

  @media (max-width: 768px) {
    position: fixed;
    inset: 0 0 auto auto;
    top: 56px;
    right: 0;
    width: 100%;
    max-width: 320px;
    background: ${BG_WHITE};
    border-left: 1px solid ${BORDER};
    border-bottom: 1px solid ${BORDER};
    transform: ${({ open }) => (open ? "translateX(0)" : "translateX(100%)")};
    transition: transform .3s ease;
    padding: 18px;
    flex-direction: column;
    margin-right: 0;
    z-index: 25;
  }
`;

/* NavItem (no neon) — underline on hover only */
const NavItem = styled.button`
  position: relative;
  background: transparent;
  border: 0;
  color: ${MUTED};
  font-weight: 600;
  cursor: pointer;
  padding: 8px 10px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  gap: 0px;
  transition: color .18s ease, transform .12s ease, background .12s ease, font-size .12s ease;
  font-size: 0.98rem;

  &:hover {
    color: ${NAVY};
    transform: translateY(-1px);
    background: rgba(1,42,74,0.03);
  }

  &.active {
    color: ${NAVY};
    font-weight: 700;
  }

  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -6px;
    height: 3px;
    width: 0;
    background: ${GOLD};
    border-radius: 4px;
    transition: width 0.22s ease;
  }

  &:hover::after { width: 72%; }
`;

const MobileToggle = styled.button`
  display: none;
  @media (max-width: 768px){ display: inline-flex; }
  border: 0;
  background: transparent;
  color: ${NAVY};
  font-size: 1.25rem;
  cursor: pointer;
`;

/* =======================
   STARFIELD (scoped)
======================= */
const floatUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Section = styled.section`
  position: relative;
  padding: clamp(56px, 6vw, 80px) 20px;
  display: grid;
  place-items: center;
  background: ${BG_WHITE};
`;

const SectionInner = styled.div`
  position: relative;
  width: min(1100px, 100%);
  z-index: 2;
`;

/* subtle canvas on white */
const StarLayer = styled.canvas`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  border-radius: 20px;
  overflow: hidden;
  opacity: 0.06;
`;

const StarGlow = styled.div`
  position: absolute;
  inset: -20%;
  pointer-events: none;
  z-index: 1;
  background: radial-gradient(60% 40% at 50% 0%, rgba(1,42,74,0.02), transparent 55%);
  filter: blur(18px);
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
  font-size: clamp(2rem, 4vw, 2.6rem);
  font-weight: 800;
  letter-spacing: 0.2px;
  color: ${NAVY};

  span { color: ${GOLD}; }
`;

const Subtitle = styled.p`
  margin: 0;
  color: ${MUTED};
`;

/* =======================
   GRID
======================= */
const Grid = styled.div`
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  gap: 26px;

  @media (max-width: 980px){
    grid-template-columns: 1fr;
  }
`;

/* =======================
   CARDS (light theme)
======================= */
const Card = styled.div`
  position: relative;
  background: ${GLASS_LIGHT};
  border: 1px solid ${BORDER};
  border-radius: 18px;
  padding: 22px;
  box-shadow: 0 10px 24px rgba(2,36,60,0.06);
  backdrop-filter: blur(4px);
  animation: ${floatUp} .6s ease both;
`;

const CardTitle = styled.h3`
  margin: 0 0 14px 0;
  color: ${NAVY};
`;

const InfoRow = styled.div`
  display: grid;
  grid-template-columns: 28px 1fr;
  gap: 12px;
  align-items: start;
  padding: 10px 0;
  color: ${LIGHT_TEXT};

  small { color: ${MUTED}; display: block; }
  .icon { color: ${GOLD}; font-size: 1.1rem; line-height: 1; margin-top: 2px; }
`;

/* =======================
   MODE SWITCH
======================= */
const ModeSwitch = styled.div`
  display: flex;
  background: rgba(250,250,252,0.9);
  border-radius: 999px;
  padding: 4px;
  border: 1px solid rgba(1,42,74,0.04);
  margin-bottom: 18px;
`;

const ModeButton = styled.button`
  flex: 1;
  border: none;
  border-radius: 999px;
  padding: 8px 10px;
  font-size: 0.92rem;
  font-weight: 700;
  cursor: pointer;
  background: ${({ $active }) =>
    $active ? `linear-gradient(90deg, ${NAVY}, ${GOLD})` : "transparent"};
  color: ${({ $active }) => ($active ? "#fff" : MUTED)};
  opacity: ${({ $active }) => ($active ? 1 : 0.85)};
  transition: background 0.2s ease, color 0.2s ease, opacity 0.2s ease, transform .12s ease;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &:hover { transform: translateY(-1px); opacity: 1; }
`;

/* =======================
   FORMS (light)
======================= */
const Form = styled.form`
  display: grid;
  gap: 14px;
`;

const Label = styled.label`
  font-size: 0.92rem;
  color: ${MUTED};
  margin-bottom: 6px;
  display: inline-block;
`;

const InputField = styled.input`
  width: 100%;
  background: ${INPUT_BG};
  border: 1px solid ${INPUT_BORDER};
  color: ${LIGHT_TEXT};
  padding: 12px 14px;
  border-radius: 12px;
  outline: none;
  transition: border .16s ease, box-shadow .16s ease, background .16s ease;

  &::placeholder { color: rgba(1,42,74,0.35); }
  &:focus {
    border-color: ${NAVY};
    box-shadow: 0 0 0 6px rgba(1,42,74,0.04);
    background: #fff;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  background: ${INPUT_BG};
  border: 1px solid ${INPUT_BORDER};
  color: ${LIGHT_TEXT};
  padding: 14px 16px;
  border-radius: 14px;
  font-size: 1rem;
  font-family: 'Poppins', sans-serif;
  line-height: 1.6;
  outline: none;
  resize: none;
  min-height: 140px;
  transition: all 0.2s ease;

  &::placeholder { color: rgba(1,42,74,0.35); font-style: italic; }

  &:focus {
    border-color: ${NAVY};
    background: #fff;
    box-shadow: 0 0 12px rgba(1,42,74,0.06);
  }
`;

const InputRow = styled.div`
  display: flex;
  gap: 12px;
  & > * { flex: 1; }
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(90deg, ${NAVY}, ${GOLD});
  color: #fff;
  border: none;
  font-weight: 800;
  padding: 12px 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: transform .12s ease, box-shadow .12s ease, opacity .12s ease;
  &:hover { transform: translateY(-2px); box-shadow: 0 10px 22px rgba(1,42,74,0.12); }
  &:disabled { opacity: .6; cursor: not-allowed; transform: none; box-shadow: none; }
`;

const Status = styled.p`
  margin: 8px 0 0 0;
  font-weight: 600;
  color: ${({ type }) => (type === "error" ? "#ff6b6b" : NAVY)};
`;

/* =======================
   FOOTER (new)
======================= */
const FooterWrap = styled.footer`
  margin-top: auto;
  background: ${BG_WHITE};
  border-top: 1px solid ${BORDER};
  padding: 40px 20px;
  color: ${MUTED};
`;

const FooterInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 180px 1fr 220px;
  gap: 28px;
  align-items: start;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const FooterCol = styled.div``;

const FooterBrand = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const FooterBrandTitle = styled.div`
  font-weight: 800;
  font-size: 1.25rem;
  color: ${NAVY};
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

const SocialRow = styled.div`
  display:flex;
  gap: 10px;
  align-items:center;
`;

const SocialIcon = styled.a`
  display:inline-flex;
  align-items:center;
  justify-content:center;
  width:34px;
  height:34px;
  border-radius:8px;
  background: #fff;
  border: 1px solid rgba(2,36,60,0.06);
  color: ${NAVY};
  text-decoration:none;
  font-size: 14px;
  transition: transform .12s ease, box-shadow .12s ease;
  &:hover { transform: translateY(-3px); box-shadow: 0 6px 14px rgba(2,36,60,0.06); }
`;

const FooterList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 8px 0 0 0;
  color: ${MUTED};

  li { margin-bottom: 10px; }
  li a {
    color: ${MUTED};
    text-decoration: none;
    font-weight: 500;
  }
  li a:hover { color: ${NAVY}; }
`;

const ServicesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 8px 0 0 0;
  color: ${MUTED};
  li { margin-bottom: 8px; font-size: 0.95rem; }
`;

const ContactInfo = styled.div`
  color: ${MUTED};
  display:flex;
  flex-direction:column;
  gap:8px;

  div { display:flex; gap:10px; align-items:flex-start; }
  strong { color: ${NAVY}; display:block; margin-bottom:4px; font-weight:700; }
`;

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
      a: 0.15 + Math.random() * 0.45,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const g = ctx.createLinearGradient(0, 0, 0, height);
      g.addColorStop(0, "rgba(255,255,255,0)");
      g.addColorStop(1, "rgba(255,255,255,0)");
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
        ctx.fillStyle = `rgba(1,42,74,${s.a})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };

    const ro = new ResizeObserver(sizeCanvas);
    ro.observe(container);

    draw();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [containerRef, density]);

  return canvasRef;
}

/* =======================
   PAGE COMPONENT
======================= */
export default function ContactPage({ onNavigate, generalData }) {
  const [menuOpen, setMenuOpen] = useState(false);

  // mode: "contact" or "schedule"
  const [mode, setMode] = useState("contact");

  // contact form
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState({ type: "", text: "" });
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    mobile: "",
    message: "",
  });

  // schedule meeting form
  const [scheduleForm, setScheduleForm] = useState({
    name: "",
    companyName: "",
    role: "",
    mobile: "",
    email: "",
    message: "",
    meetingDate: "",
    meetingTime: "",
  });

  const sectionRef = useRef(null);
  const canvasRef = useStarfield(sectionRef, 130);

  const safe = generalData || {};
  const today = new Date().toISOString().split("T")[0];

  const navigateAndClose = (route) => {
    onNavigate?.(route);
    setMenuOpen(false);
  };

  /* --- handlers --- */
  const onContactChange = (e) =>
    setContactForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onScheduleChange = (e) =>
    setScheduleForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  /* --- submit contact --- */
  const submitContact = async (e) => {
    e.preventDefault();
    setSending(true);
    setStatus({ type: "", text: "Sending..." });

    try {
      await axios.post(MESSAGE_API_URL, contactForm);
      setStatus({ type: "success", text: "✅ Message sent successfully!" });
      setContactForm({ name: "", email: "", mobile: "", message: "" });
    } catch (err) {
      let msg = "❌ Failed to send. Please check network connection.";
      if (err?.response) {
        if (err.response.status === 400 && err.response.data?.errors) {
          msg = `❌ Validation Error: ${err.response.data.errors[0].msg}`;
        } else if (err.response.status === 500) {
          msg = "❌ Server Error (500). Database save failed.";
        } else if ([404, 405].includes(err.response.status)) {
          msg =
            "❌ Routing Error. Backend endpoint not found/allowed. (Check /api prefix)";
        }
      }
      setStatus({ type: "error", text: msg });
    } finally {
      setSending(false);
    }
  };

  /* --- submit schedule --- */
  const submitSchedule = async (e) => {
    e.preventDefault();
    setSending(true);
    setStatus({ type: "", text: "Sending..." });

    try {
      await axios.post(SCHEDULE_API_URL, scheduleForm);
      setStatus({
        type: "success",
        text:
          "✅ Meeting request submitted! We'll contact you soon to confirm.",
      });
      setScheduleForm({
        name: "",
        companyName: "",
        role: "",
        mobile: "",
        email: "",
        message: "",
        meetingDate: "",
        meetingTime: "",
      });
    } catch (error) {
      const msg =
        error?.response?.data?.msg ||
        "❌ Failed to schedule. Please try again.";
      setStatus({ type: "error", text: msg });
    } finally {
      setSending(false);
    }
  };

  const isScheduleValid =
    scheduleForm.name &&
    scheduleForm.companyName &&
    scheduleForm.email &&
    scheduleForm.meetingDate &&
    scheduleForm.meetingTime;

  return (
    <>
      <GlobalStyle />
      <Page>
        <Header>
          <Brand onClick={() => navigateAndClose("home")}>
            <BrandN>NEXORA</BrandN>
            <BrandCrew>CREW</BrandCrew>
          </Brand>

          <Nav open={menuOpen}>
            <NavItem onClick={() => navigateAndClose("home")}>Home</NavItem>
            <NavItem onClick={() => navigateAndClose("about")}>About</NavItem>
            <NavItem onClick={() => navigateAndClose("services")}>
              Services
            </NavItem>
            <NavItem onClick={() => navigateAndClose("projects")}>
              Projects
            </NavItem>
            <NavItem onClick={() => navigateAndClose("blog")}>Blog</NavItem>

            {/* Progress nav item added here (near Blog) */}
            <NavItem onClick={() => navigateAndClose("progress")}>Progress</NavItem>

            {/* Team between Progress and Contact */}
            <NavItem onClick={() => navigateAndClose("team")}>Team</NavItem>

            <NavItem
              className="active"
              onClick={() => navigateAndClose("contact")}
            >
              Contact
            </NavItem>
          </Nav>

          <MobileToggle
            onClick={() => setMenuOpen((s) => !s)}
            aria-label="Toggle menu"
          >
            <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
          </MobileToggle>
        </Header>

        {/* CONTACT / SCHEDULE SECTION */}
        <Section ref={sectionRef}>
          <StarLayer ref={canvasRef} aria-hidden />
          <StarGlow />

          <SectionInner>
            <TitleWrap>
              <Title>
                Let’s <span>Connect</span>
              </Title>
              <Subtitle>
                Choose how you’d like to reach us — a quick message or a
                scheduled meeting.
              </Subtitle>
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

              {/* RIGHT: MODE SWITCH + FORM */}
              <Card>
                <ModeSwitch>
                  <ModeButton
                    type="button"
                    $active={mode === "contact"}
                    onClick={() => {
                      setMode("contact");
                      setStatus({ type: "", text: "" });
                    }}
                  >
                    Contact
                  </ModeButton>
                  <ModeButton
                    type="button"
                    $active={mode === "schedule"}
                    onClick={() => {
                      setMode("schedule");
                      setStatus({ type: "", text: "" });
                    }}
                  >
                    <FontAwesomeIcon icon={faCalendarCheck} />
                    Schedule Meeting
                  </ModeButton>
                </ModeSwitch>

                {mode === "contact" ? (
                  <Form onSubmit={submitContact} noValidate>
                    <div>
                      <Label htmlFor="name">Your Name</Label>
                      <InputField
                        id="name"
                        name="name"
                        placeholder="John Doe"
                        value={contactForm.name}
                        onChange={onContactChange}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <InputField
                        id="email"
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        value={contactForm.email}
                        onChange={onContactChange}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="mobile">Mobile</Label>
                      <InputField
                        id="mobile"
                        name="mobile"
                        placeholder="+91 9xxxx xxxxx"
                        value={contactForm.mobile}
                        onChange={onContactChange}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Message</Label>
                      <TextArea
                        id="message"
                        name="message"
                        placeholder="Tell us about your project…"
                        value={contactForm.message}
                        onChange={onContactChange}
                        required
                      />
                    </div>

                    <Button type="submit" disabled={sending} aria-busy={sending}>
                      <FontAwesomeIcon icon={faPaperPlane} />
                      {sending ? "Sending..." : "Send Message"}
                    </Button>

                    {status.text && (
                      <Status type={status.type}>{status.text}</Status>
                    )}
                  </Form>
                ) : (
                  <Form onSubmit={submitSchedule} noValidate>
                    <div>
                      <Label htmlFor="name">Your Name *</Label>
                      <InputField
                        id="name"
                        name="name"
                        value={scheduleForm.name}
                        onChange={onScheduleChange}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="companyName">Name of the Company *</Label>
                      <InputField
                        id="companyName"
                        name="companyName"
                        value={scheduleForm.companyName}
                        onChange={onScheduleChange}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="role">Your Role in the Company</Label>
                      <InputField
                        id="role"
                        name="role"
                        value={scheduleForm.role}
                        onChange={onScheduleChange}
                      />
                    </div>

                    <div>
                      <Label htmlFor="mobile">Mobile No.</Label>
                      <InputField
                        id="mobile"
                        name="mobile"
                        value={scheduleForm.mobile}
                        onChange={onScheduleChange}
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email ID *</Label>
                      <InputField
                        id="email"
                        type="email"
                        name="email"
                        value={scheduleForm.email}
                        onChange={onScheduleChange}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">
                        What you want to talk about (Message)
                      </Label>
                      <TextArea
                        id="message"
                        name="message"
                        value={scheduleForm.message}
                        onChange={onScheduleChange}
                      />
                    </div>

                    <InputRow>
                      <div>
                        <Label htmlFor="meetingDate">Date Choosing *</Label>
                        <InputField
                          id="meetingDate"
                          type="date"
                          name="meetingDate"
                          value={scheduleForm.meetingDate}
                          onChange={onScheduleChange}
                          min={today}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="meetingTime">Time Deciding *</Label>
                        <InputField
                          id="meetingTime"
                          type="time"
                          name="meetingTime"
                          value={scheduleForm.meetingTime}
                          onChange={onScheduleChange}
                          required
                        />
                      </div>
                    </InputRow>

                    <Button
                      type="submit"
                      disabled={sending || !isScheduleValid}
                      aria-busy={sending}
                    >
                      <FontAwesomeIcon icon={faCalendarCheck} />
                      {sending ? "Sending..." : "Submit Request"}
                    </Button>

                    {status.text && (
                      <Status type={status.type}>{status.text}</Status>
                    )}
                  </Form>
                )}
              </Card>
            </Grid>
          </SectionInner>
        </Section>

        {/* FOOTER: 4-column layout */}
        <FooterWrap>
          <FooterInner>
            {/* Column 1: Brand & short text + social icons */}
            <FooterCol>
              <FooterBrand>
                <FooterBrandTitle>
                  <BrandN>NEXORA</BrandN>
                  <BrandCrew>CREW</BrandCrew>
                </FooterBrandTitle>
                <div style={{ maxWidth: 360, color: MUTED }}>
                  Transforming ideas into powerful digital products using modern
                  technology, creativity, and AI.
                </div>

                <SocialRow>
                  <SocialIcon
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram"
                  >
                    <FontAwesomeIcon icon={faInstagram} />
                  </SocialIcon>

                  <SocialIcon
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn"
                  >
                    <FontAwesomeIcon icon={faLinkedin} />
                  </SocialIcon>

                  <SocialIcon
                    href="mailto:nexoracrew@email.com"
                    aria-label="Email"
                  >
                    <FontAwesomeIcon icon={faEnvelopeSquare} />
                  </SocialIcon>

                  <SocialIcon
                    href="https://wa.me/919597646460"
                    aria-label="WhatsApp"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FontAwesomeIcon icon={faWhatsapp} />
                  </SocialIcon>

                  <SocialIcon
                    href="https://youtube.com"
                    aria-label="YouTube"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FontAwesomeIcon icon={faYoutube} />
                  </SocialIcon>
                </SocialRow>
              </FooterBrand>
            </FooterCol>

            {/* Column 2: Quick links */}
            <FooterCol>
              <strong style={{ color: NAVY, display: "block", marginBottom: 8 }}>
                Quick Links
              </strong>
              <FooterList>
                <li>
                  <a href="#home" onClick={(e)=>{e.preventDefault(); onNavigate?.('home');}}>Home</a>
                </li>
                <li>
                  <a href="#about" onClick={(e)=>{e.preventDefault(); onNavigate?.('about');}}>About</a>
                </li>
                <li>
                  <a href="#projects" onClick={(e)=>{e.preventDefault(); onNavigate?.('projects');}}>Projects</a>
                </li>
                <li>
                  <a href="#team" onClick={(e)=>{e.preventDefault(); onNavigate?.('team');}}>Team</a>
                </li>
                <li>
                  <a href="#progress" onClick={(e)=>{e.preventDefault(); onNavigate?.('progress');}}>Progress</a>
                </li>
                <li>
                  <a href="#blog" onClick={(e)=>{e.preventDefault(); onNavigate?.('blog');}}>Blog</a>
                </li>
                <li>
                  <a href="#contact" onClick={(e)=>{e.preventDefault(); onNavigate?.('contact');}}>Contact</a>
                </li>
              </FooterList>
            </FooterCol>

            {/* Column 3: Services */}
            <FooterCol>
              <strong style={{ color: NAVY, display: "block", marginBottom: 8 }}>
                Services
              </strong>
              <ServicesList>
                <li>Web Development</li>
                <li>Poster designing & logo making</li>
                <li>Content creation</li>
                <li>Digital marketing & SEO</li>
                <li>AI and automation</li>
                <li>Hosting & Support</li>
                <li>Printing & Branding solutions</li>
              </ServicesList>
            </FooterCol>

            {/* Column 4: Contact Info */}
            <FooterCol>
              <strong style={{ color: NAVY, display: "block", marginBottom: 8 }}>
                Contact Info
              </strong>
              <ContactInfo>
                <div>
                  <div style={{ color: GOLD, marginTop: 2 }}>
                    <FontAwesomeIcon icon={faMapMarker} />
                  </div>
                  <div>
                    <strong>JJCET</strong>
                    <div style={{ color: MUTED }}>Palakarai, Tiruchirappalli</div>
                  </div>
                </div>

                <div>
                  <div style={{ color: GOLD, marginTop: 2 }}>
                    <FontAwesomeIcon icon={faEnvelopeSquare} />
                  </div>
                  <div>
                    <strong>Email</strong>
                    <div style={{ color: MUTED }}>nexoracrew@email.com</div>
                  </div>
                </div>

                <div>
                  <div style={{ color: GOLD, marginTop: 2 }}>
                    <FontAwesomeIcon icon={faPhone} />
                  </div>
                  <div>
                    <strong>Phone</strong>
                    <div style={{ color: MUTED }}>+91 95976 46460</div>
                  </div>
                </div>
              </ContactInfo>
            </FooterCol>
          </FooterInner>
        </FooterWrap>
      </Page>
    </>
  );
}
