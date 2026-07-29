import { useEffect, useRef } from 'react';

export default function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    
    // Aurora color palette (Dark Mode)
    const AURORA_COLORS = [
      'rgba(0, 229, 160, 0.35)',   // emerald
      'rgba(0, 180, 216, 0.3)',     // teal
      'rgba(123, 47, 247, 0.25)',   // violet
      'rgba(240, 192, 64, 0.2)',    // gold
      'rgba(0, 229, 160, 0.2)',     // emerald dim
      'rgba(0, 180, 216, 0.15)',    // teal dim
    ];

    // Prism color palette (Light Mode)
    const PRISM_COLORS = [
      'rgba(59, 130, 246, 0.35)',   // blue
      'rgba(217, 70, 239, 0.3)',    // fuchsia
      'rgba(139, 92, 246, 0.25)',   // violet
      'rgba(59, 130, 246, 0.2)',    // blue dim
      'rgba(217, 70, 239, 0.15)',   // fuchsia dim
    ];

    const getColors = () => {
      return document.documentElement.getAttribute('data-theme') === 'light' 
        ? PRISM_COLORS 
        : AURORA_COLORS;
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight;
      initParticles();
    };

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.8 + 0.2;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = Math.random() * 0.4 - 0.2;
        // Keep an index to dynamically fetch the right color for the current theme
        this.colorIndex = Math.floor(Math.random() * 5);
        this.opacity = Math.random() * 0.6 + 0.2;
        this.pulseSpeed = Math.random() * 0.01 + 0.005;
        this.pulseOffset = Math.random() * Math.PI * 2;
      }

      update(time) {
        this.x += this.speedX;
        this.y += this.speedY;

        // Gentle pulse effect
        this.opacity = 0.2 + Math.sin(time * this.pulseSpeed + this.pulseOffset) * 0.15;

        if (this.x > canvas.width) this.x = 0;
        else if (this.x < 0) this.x = canvas.width;
        
        if (this.y > canvas.height) this.y = 0;
        else if (this.y < 0) this.y = canvas.height;
      }

      draw(colors) {
        if (!ctx) return;
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = colors[this.colorIndex % colors.length];
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    const initParticles = () => {
      particles = [];
      const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 100);
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    let time = 0;
    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time++;
      
      const currentColors = getColors();
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';

      for (let i = 0; i < particles.length; i++) {
        particles[i].update(time);
        particles[i].draw(currentColors);
        
        // Connecting lines
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 120) {
            const alpha = (0.08 - distance / 1500);
            ctx.beginPath();
            
            const gradient = ctx.createLinearGradient(
              particles[i].x, particles[i].y,
              particles[j].x, particles[j].y
            );
            
            if (isLight) {
              gradient.addColorStop(0, `rgba(59, 130, 246, ${alpha})`);
              gradient.addColorStop(1, `rgba(217, 70, 239, ${alpha})`);
            } else {
              gradient.addColorStop(0, `rgba(0, 229, 160, ${alpha})`);
              gradient.addColorStop(1, `rgba(0, 180, 216, ${alpha})`);
            }
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    
    // Observer for theme changes to trigger instant redraws or logic if needed
    const observer = new MutationObserver(() => {});
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="particle-canvas"
    />
  );
}
