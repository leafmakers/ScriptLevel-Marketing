'use client';

import { type ReactNode } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

type RevealProps = {
  children: ReactNode;
  delay?: 1 | 2 | 3 | 4 | 5;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'header' | 'footer' | 'li' | 'p' | 'h1' | 'h2' | 'h3';
  threshold?: number;
};

export default function Reveal({
  children,
  delay,
  className = '',
  as = 'div',
  threshold = 0.15,
}: RevealProps) {
  const { ref, isVisible } = useScrollAnimation(threshold, true);
  const Tag = as as 'div';
  const delayClass = delay ? `reveal-d${delay}` : '';
  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`reveal ${delayClass} ${isVisible ? 'is-visible' : ''} ${className}`}
    >
      {children}
    </Tag>
  );
}
