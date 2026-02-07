import React, { useState, useEffect } from 'react';
import { useLanguage } from '../i18n';

export const ScrollToTopButton: React.FC = () => {
  const { t: ui } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll percentage
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;

      // Show button after 30% scroll
      setIsVisible(scrollPercent > 30);
    };

    window.addEventListener('scroll', handleScroll);

    // Check initial scroll position
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 w-[50px] h-[50px] rounded-full transition-all duration-300 flex items-center justify-center z-50 ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
      }`}
      style={{
        backgroundColor: '#ff8800'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#ff5500';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#ff8800';
      }}
      aria-label={ui.scrollToTop}
    >
      {/* Material Design arrow_upward icon */}
      <svg
        className="w-6 h-6 text-white"
        fill="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.59 5.58L20 12l-8-8-8 8z" />
      </svg>
    </button>
  );
};
