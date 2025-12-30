import { useState, useEffect } from 'react';
import './NewYear2026.css';

function NewYear2026() {
  const [timeLeft, setTimeLeft] = useState({});
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const targetDate = new Date('2026-01-01T00:00:00').getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Create fireworks effect based on goragod.com design
    const createFirework = () => {
      const colors = [
        '#ff6b6b', '#4ecdc4', '#45b7d1', '#ffd93d', '#a8dadc', '#f093fb', 
        '#ff8e53', '#3eecac', '#667eea', '#764ba2', '#f5576c', '#00d2ff',
        '#ffb347', '#ff6ec7', '#7ee8fa', '#80ff72', '#ff9a76', '#a8e6cf',
        '#ffd700', '#ff1493', '#00ffff', '#ff69b4', '#32cd32', '#ff4500'
      ];
      const particlesCount = 16;

      const x = 10 + Math.random() * 80;
      const y = 10 + Math.random() * 50;
      const baseHue = Math.random() * 360;

      for (let i = 0; i < particlesCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'firework';
        particle.style.left = x + '%';
        particle.style.top = y + '%';
        
        // Mix between base color and random colors for variety
        if (Math.random() > 0.5) {
          // Use HSL with varied hue for gradient effect
          const hue = (baseHue + (i * 360 / particlesCount)) % 360;
          particle.style.backgroundColor = `hsl(${hue}, ${80 + Math.random() * 20}%, ${50 + Math.random() * 20}%)`;
        } else {
          // Use random color from palette
          particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        }

        const angle = (Math.PI * 2 * i) / particlesCount;
        const velocity = 80 + Math.random() * 60;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;

        particle.style.setProperty('--tx', tx + 'px');
        particle.style.setProperty('--ty', ty + 'px');

        document.querySelector('.celebration-layer')?.appendChild(particle);
        setTimeout(() => particle.remove(), 2000);
      }
    };

    // Trigger fireworks periodically
    const fireworkInterval = setInterval(createFirework, 1500);
    
    // Initial fireworks
    setTimeout(createFirework, 300);
    setTimeout(createFirework, 800);
    setTimeout(createFirework, 1200);

    return () => clearInterval(fireworkInterval);
  }, []);

  if (!isActive) return null;

  return (
    <div className="celebration-layer">
      <div className="countdown-container">
        <button 
          className="celebration-close" 
          onClick={() => setIsActive(false)}
          aria-label="Close celebration"
        >
          ×
        </button>
        
        <h2 className="celebration-title">Happy New Year 2026 🎉</h2>        <p className="celebration-greeting">
          May this year bring you joy, success, and endless possibilities. 
          Wishing you health, happiness, and prosperity!
        </p>
        <p className="celebration-thanks">
          Thank you for following and supporting <strong>@kenzchiro</strong> across all channels! 💙
        </p>
        <div className="countdown">
          <div className="countdown-item">
            <span className="countdown-value">{timeLeft.days || 0}</span>
            <span className="countdown-label">Days</span>
          </div>
          <div className="countdown-item">
            <span className="countdown-value">{timeLeft.hours || 0}</span>
            <span className="countdown-label">Hours</span>
          </div>
          <div className="countdown-item">
            <span className="countdown-value">{timeLeft.minutes || 0}</span>
            <span className="countdown-label">Minutes</span>
          </div>
          <div className="countdown-item">
            <span className="countdown-value">{timeLeft.seconds || 0}</span>
            <span className="countdown-label">Seconds</span>
          </div>
        </div>
      </div>
      
      <div className="stars-container">
        {[...Array(30)].map((_, i) => (
          <div 
            key={i} 
            className="star" 
            style={{
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animationDelay: Math.random() * 3 + 's'
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default NewYear2026;
