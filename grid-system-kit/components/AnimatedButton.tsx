'use client';

import React, { useEffect, useState, useRef } from 'react';

interface AnimatedButtonProps {
  href: string;
  shortLabel?: string;
  children: React.ReactNode;
  className?: string;
  size?: 'small' | 'default';
  variant?: 'black' | 'green' | 'white';
  subtleBorder?: boolean;
  fullWidth?: boolean;
  /** Use a translucent white track instead of the solid gray one.
   *  Intended for white buttons sitting on dark backgrounds (e.g. the
   *  CTA video card) where a solid track would read as a gray slab. */
  onDark?: boolean;
}

export default function AnimatedButton({
  href,
  shortLabel = "RENDER",
  children,
  className = '',
  size = 'default',
  variant = 'black',
  subtleBorder = false,
  fullWidth = false,
  onDark = false,
}: AnimatedButtonProps) {
  const [nudge, setNudge] = useState(false);
  const [nudgeIntensity, setNudgeIntensity] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  // Swipe state for mobile
  const [swipeProgress, setSwipeProgress] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeComplete, setSwipeComplete] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const containerWidthRef = useRef(0);
  /** Avoids stale `isSwiping` on the first touchmove (state not committed yet). */
  const swipeActiveRef = useRef(false);
  /** Minimum button width as % of track, derived from min px at touch start. */
  const minSwipePctRef = useRef(45);
  const swipeProgressRef = useRef(0);

  // Size-based styling
  const isSmall = size === 'small';
  /** Ideal floor for short label + icon; clamped to track width on narrow layouts. */
  const minSwipeIdealPx = isSmall ? 200 : 248;
  const paddingX = isSmall ? 14 : 16;
  const paddingY = isSmall ? 'py-2.5' : 'py-3';
  const textSize = isSmall ? 'text-[11px]' : 'text-xs';
  const maxWidthClass = fullWidth
    ? ''
    : (isSmall ? 'sm:max-w-[240px]' : 'sm:max-w-[320px]');
  const iconSize = isSmall ? 'w-3.5 h-3.5' : 'w-4 h-4';
  // Minimum rounding (rounded rectangle, not a pill) across both sizes
  const borderRadius = 'rounded-md';

  // Color variant styling — soft, natural gradients with gentle shadows.
  // card-grain is kept on the dark/accent variants where the noise reads as
  // tactile texture; the white variant skips it because 45% multiply on
  // solid white looks dirty rather than textured.
  const bgColor = variant === 'green'
    ? 'bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 border border-white/10 shadow-[0_1px_2px_rgba(0,0,0,0.12)] card-grain'
    : variant === 'white'
      ? 'bg-white border border-black/10 shadow-[0_1px_2px_rgba(0,0,0,0.08),0_4px_12px_-4px_rgba(0,0,0,0.10)]'
      : 'bg-gradient-to-b from-gray-700 to-gray-900 border border-white/[0.06] shadow-[0_1px_2px_rgba(0,0,0,0.2)] card-grain';
  const textColor = variant === 'white' ? 'text-black' : 'text-white';
  const completeBgColor = 'bg-emerald-500';

  // Random nudge animation
  useEffect(() => {
    if (isHovered || isSwiping) return;
    
    const scheduleNudge = () => {
      const delay = 1500 + Math.random() * 2000;
      
      return setTimeout(() => {
        setNudgeIntensity(0.5 + Math.random() * 0.5);
        setNudge(true);
        
        const nudgeDuration = 400 + Math.random() * 300;
        setTimeout(() => setNudge(false), nudgeDuration);
        
        scheduleNudge();
      }, delay);
    };
    
    const timeoutId = scheduleNudge();
    return () => clearTimeout(timeoutId);
  }, [isHovered, isSwiping]);

  // Touch handlers for swipe-to-unlock
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    startXRef.current = touch.clientX;
    swipeActiveRef.current = true;
    swipeProgressRef.current = 0;
    if (containerRef.current) {
      const cw = containerRef.current.offsetWidth;
      containerWidthRef.current = cw;
      if (cw > 0) {
        const inset = 12;
        const labelFloorPx = Math.min(minSwipeIdealPx, Math.max(isSmall ? 132 : 152, cw - inset));
        minSwipePctRef.current = Math.min(100, Math.max(40, (labelFloorPx / cw) * 100));
      }
    }
    setIsSwiping(true);
    setSwipeComplete(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!swipeActiveRef.current) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - startXRef.current;
    const maxSwipe = Math.max(1, containerWidthRef.current * 0.55);
    const progress = Math.max(0, Math.min(1, deltaX / maxSwipe));
    swipeProgressRef.current = progress;
    setSwipeProgress(progress);
  };

  const handleTouchEnd = () => {
    if (!swipeActiveRef.current) return;
    swipeActiveRef.current = false;

    const progress = swipeProgressRef.current;
    if (progress >= 0.92) {
      swipeProgressRef.current = 1;
      setSwipeComplete(true);
      setSwipeProgress(1);

      setTimeout(() => {
        window.location.href = href;
      }, 200);
    } else {
      swipeProgressRef.current = 0;
      setSwipeProgress(0);
      setIsSwiping(false);
    }
  };

  const isExpanded = isHovered || swipeProgress > 0;
  const minPct = minSwipePctRef.current;
  const swipeWidthPct = minPct + swipeProgress * (100 - minPct);
  const buttonWidth = isSwiping
    ? `${swipeWidthPct}%`
    : isExpanded
      ? '100%'
      : 'auto';

  return (
    <div
      ref={containerRef}
      className={`relative w-full cursor-pointer ${maxWidthClass} ${subtleBorder ? 'p-[2px] rounded-[8px] bg-gradient-to-b from-gray-200/60 to-gray-300/40' : ''} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={() => {
        swipeActiveRef.current = false;
        swipeProgressRef.current = 0;
        setSwipeProgress(0);
        setIsSwiping(false);
      }}
      style={{ touchAction: 'pan-y' }}
    >
      {/* Track/Ghost */}
      <div 
        className={`absolute inset-0 ${borderRadius} ${variant === 'white' ? (onDark ? 'bg-white/10 border border-white/20' : 'bg-gray-100 border border-gray-200 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]') : 'bg-white/95 border border-gray-200/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),inset_0_1px_2px_rgba(0,0,0,0.04)]'} pointer-events-none overflow-hidden`}
        style={{
          opacity: isExpanded && !isSwiping ? 0 : 1,
          transition: isSwiping ? 'none' : 'opacity 300ms ease-out'
        }}
      >
        <div className="absolute inset-y-0 right-4 flex items-center gap-1 opacity-40">
          <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
      
      {/* Success flash */}
      {swipeComplete && (
        <div 
          className={`absolute inset-0 ${borderRadius} bg-emerald-400/30 pointer-events-none`}
          style={{ animation: 'pulse 300ms ease-out' }}
        />
      )}
      
      {/* Button */}
      <div className="relative flex justify-start w-full pointer-events-none">
        <a 
          href={href}
          className={`inline-flex items-center justify-center gap-2 ${swipeComplete ? completeBgColor : bgColor} ${textColor} ${textSize} font-semibold tracking-widest ${paddingY} px-4 ${borderRadius} pointer-events-auto touch-none select-none max-w-full shrink-0`}
          style={{ 
            width: buttonWidth,
            boxSizing: 'border-box',
            transitionProperty: isSwiping ? 'none' : 'all',
            transitionDuration: isHovered ? '500ms' : (nudge ? '150ms' : '400ms'),
            transitionTimingFunction: isHovered 
              ? 'cubic-bezier(0.34, 1.56, 0.64, 1)'
              : nudge ? 'cubic-bezier(0.68, -0.55, 0.27, 1.55)'
              : 'cubic-bezier(0.4, 0, 0.2, 1)',
            paddingLeft: !isExpanded && nudge ? `${paddingX + 6 * nudgeIntensity}px` : `${paddingX}px`,
            paddingRight: !isExpanded && nudge ? `${paddingX + 6 * nudgeIntensity}px` : `${paddingX}px`,
          }}
          onClick={(e) => {
            if (isSwiping) e.preventDefault();
          }}
        >
          <div className="flex items-center justify-center gap-2 w-full">
            {swipeComplete ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <>
                <span className="flex items-center gap-2">
                  <span 
                    style={{ 
                      transitionProperty: 'opacity',
                      transitionDuration: isHovered ? '250ms' : '700ms',
                      opacity: isExpanded && !isSwiping ? 0 : 1,
                      display: isExpanded && !isSwiping ? 'none' : 'inline'
                    }}
                  >
                    {shortLabel}
                  </span>
                  <span 
                    className="flex items-center gap-2"
                    style={{ 
                      transitionProperty: 'opacity',
                      transitionDuration: isHovered ? '250ms' : '700ms',
                      opacity: isExpanded && !isSwiping ? 1 : 0,
                      display: isExpanded && !isSwiping ? 'flex' : 'none'
                    }}
                  >
                    {children}
                  </span>
                </span>
                <svg 
                  className={`${iconSize} flex-shrink-0`}
                  style={{
                    transitionProperty: isSwiping ? 'none' : 'transform',
                    transitionDuration: isHovered ? '600ms' : (nudge ? '200ms' : '400ms'),
                    transitionTimingFunction: isHovered 
                      ? 'cubic-bezier(0.34, 1.56, 0.64, 1)'
                      : nudge ? 'cubic-bezier(0.68, -0.55, 0.27, 1.55)'
                      : 'cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: isSwiping 
                      ? `translateX(${swipeProgress * 8}px)` 
                      : isHovered 
                        ? 'translateX(4px)' 
                        : (nudge ? `translateX(${3 * nudgeIntensity}px)` : 'translateX(0)')
                  }}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </div>
        </a>
      </div>
    </div>
  );
}
