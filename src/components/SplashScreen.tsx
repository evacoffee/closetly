import React from 'react';
import '../styles/global.css';

const SplashScreen: React.FC = () => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      const splash = document.querySelector('.splash');
      if (splash) {
        splash.classList.add('fade-out');
        splash.addEventListener('transitionend', () => {
          splash.remove();
        }, { once: true });
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="splash">
      <div className="splash-logo">
        <span className="text-6xl font-bold text-text-light">FIT</span>
      </div>
    </div>
  );
};

export default SplashScreen;
