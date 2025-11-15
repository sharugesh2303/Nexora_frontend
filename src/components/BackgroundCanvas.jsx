// client-app/src/components/BackgroundCanvas.jsx
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const StarCanvas = styled.canvas`
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
  background: radial-gradient(circle at 10% 10%, #071022 0%, #081226 25%, #071020 55%, #05060a 100%);
  transform-origin: 50% 50%;
  transform: scale(var(--bg-scale, 1));
`;

export default function BackgroundCanvas() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const setCssScale = (scale) => {
      const inv = scale > 0 ? 1 / scale : 1;
      document.documentElement.style.setProperty('--bg-scale', inv);
    };

    const setSize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    setSize();
    setCssScale(window.visualViewport?.scale || 1);

    const vv = window.visualViewport;
    if (vv) vv.addEventListener('resize', () => setCssScale(vv.scale || 1));
    window.addEventListener('resize', setSize);

    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#071025');
      grad.addColorStop(1, '#02040a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', setSize);
      if (vv) vv.removeEventListener('resize', () => setCssScale(vv.scale || 1));
    };
  }, []);

  return <StarCanvas ref={canvasRef} />;
}
