import { useRef, useEffect, useState, type ReactNode } from 'react';

interface RevealSectionProps {
  children: ReactNode;
  className?: string;
  /** Delay in ms before starting animation */
  delay?: number;
  /** 'fade' | 'slide-up' | 'slide-up-short' */
  variant?: 'fade' | 'slide-up' | 'slide-up-short';
}

export function RevealSection({ children, className = '', delay = 0, variant = 'slide-up' }: RevealSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          const t = setTimeout(() => setVisible(true), delay);
          return () => clearTimeout(t);
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  const variantClass = {
    fade: visible ? 'opacity-100' : 'opacity-0',
    'slide-up': visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
    'slide-up-short': visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3',
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${variantClass[variant]} ${className}`}
    >
      {children}
    </div>
  );
}
