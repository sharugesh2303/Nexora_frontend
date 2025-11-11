import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faEnvelope,
  faMapMarkerAlt,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";

// ==================== STYLED COMPONENTS ==================== //
const Container = styled.div`
  position: relative;
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a2a, #1b1b4d, #090922);
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 50px 20px;
  overflow: hidden;
`;

const Canvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
`;

const ContactCard = styled.div`
  position: relative;
  z-index: 2;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 30px rgba(0, 255, 255, 0.1);
  border-radius: 20px;
  padding: 40px 60px;
  max-width: 900px;
  width: 100%;
  backdrop-filter: blur(15px);
  animation: fadeIn 1.5s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(25px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    padding: 30px 20px;
  }
`;

const Title = styled.h1`
  font-size: 3rem;
  text-align: center;
  margin-bottom: 10px;
  color: #00ffff;
  text-shadow: 0 0 15px rgba(0, 255, 255, 0.8);
`;

const Subtitle = styled.p`
  text-align: center;
  color: #aaa;
  margin-bottom: 40px;
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
`;

const InfoBox = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 1.1rem;
  color: #fff;
  background: rgba(255, 255, 255, 0.07);
  border-radius: 10px;
  padding: 12px 18px;
  transition: 0.3s;

  &:hover {
    transform: translateX(5px);
    background: rgba(255, 255, 255, 0.15);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Input = styled.input`
  padding: 14px;
  border: none;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.02);
  }
`;

const TextArea = styled.textarea`
  padding: 14px;
  border: none;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  outline: none;
  resize: none;
  transition: all 0.3s ease;

  &:focus {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.02);
  }
`;

const Button = styled.button`
  background: linear-gradient(90deg, #00ffff, #007bff);
  color: black;
  border: none;
  border-radius: 10px;
  padding: 14px 20px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);

  &:hover {
    background: linear-gradient(90deg, #007bff, #00ffff);
    transform: translateY(-2px) scale(1.05);
  }
`;

const Message = styled.p`
  color: ${({ success }) => (success ? "#00ff88" : "#ff5555")};
  text-align: center;
  font-size: 1rem;
  margin-top: 8px;
  font-weight: 500;
`;

// ==================== COMPONENT ==================== //
const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    message: "",
  });
  const [statusMessage, setStatusMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const canvasRef = useRef(null);

  // --- Star Background Animation ---
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const stars = Array.from({ length: 80 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 2,
      d: Math.random() * 2,
    }));

    const drawStars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "white";
      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      });
      moveStars();
    };

    const moveStars = () => {
      stars.forEach((star) => {
        star.y += star.d;
        if (star.y > window.innerHeight) {
          star.y = 0;
          star.x = Math.random() * window.innerWidth;
        }
      });
    };

    const animate = () => {
      drawStars();
      requestAnimationFrame(animate);
    };

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    animate();
  }, []);

  // --- Handle Input Change ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- Handle Submit (Connected to Backend) ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.mobile || !formData.message) {
      setStatusMessage("⚠️ Please fill all fields.");
      setSuccess(false);
      return;
    }

    try {
      const res = await axios.post("/api/messages", formData);
      if (res.status === 201) {
        setStatusMessage("✅ Message sent successfully!");
        setSuccess(true);
        setFormData({ name: "", email: "", mobile: "", message: "" });
      } else {
        setStatusMessage("⚠️ Something went wrong. Try again.");
        setSuccess(false);
      }
    } catch (err) {
      console.error(err);
      setStatusMessage("❌ Failed to send message. Server error.");
      setSuccess(false);
    }
  };

  return (
    <Container>
      <Canvas ref={canvasRef} />
      <ContactCard>
        <Title>Contact Us</Title>
        <Subtitle>We’d love to hear your thoughts and feedback!</Subtitle>

        <ContactGrid>
          {/* --- LEFT SIDE INFO --- */}
          <InfoSection>
            <InfoBox>
              <FontAwesomeIcon icon={faPhone} color="#00ffff" /> +91 98765 43210
            </InfoBox>
            <InfoBox>
              <FontAwesomeIcon icon={faEnvelope} color="#00ffff" /> contact@nexora.com
            </InfoBox>
            <InfoBox>
              <FontAwesomeIcon icon={faMapMarkerAlt} color="#00ffff" /> Chennai, India
            </InfoBox>
          </InfoSection>

          {/* --- RIGHT SIDE FORM --- */}
          <Form onSubmit={handleSubmit}>
            <Input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
            />
            <Input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
            />
            <Input
              type="text"
              name="mobile"
              placeholder="Your Mobile Number"
              value={formData.mobile}
              onChange={handleChange}
            />
            <TextArea
              rows="4"
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
            />
            <Button type="submit">
              <FontAwesomeIcon icon={faPaperPlane} /> Send Message
            </Button>
            {statusMessage && (
              <Message success={success}>{statusMessage}</Message>
            )}
          </Form>
        </ContactGrid>
      </ContactCard>
    </Container>
  );
};

export default ContactPage;
