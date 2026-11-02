"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export interface InteractiveStickerProps {
  id: string;
  imageSrc: string;
  alt: string;
  quote: string;
  subquote?: string;
  story?: string;
  factTag?: string;
  badge?: string;
  badgeColor?: "blue" | "emerald" | "amber" | "purple" | "rose" | "dark";
  size?: "xs" | "sm" | "md" | "lg";
  floatType?: "1" | "2" | "3";
  className?: string;
  tooltipPosition?: "top" | "bottom";
  onInteract?: (id: string) => void;
  pitchIndex?: number;
  draggable?: boolean;
}

export function InteractiveSticker({
  id,
  imageSrc,
  alt,
  quote,
  subquote,
  story,
  factTag,
  badge = "BIAN",
  badgeColor = "blue",
  size = "sm",
  floatType = "1",
  className = "",
  tooltipPosition = "bottom",
  onInteract,
  pitchIndex = 0,
  draggable = false,
}: InteractiveStickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-dismiss popup after 8 seconds if left alone, or when user clicks outside
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      setIsOpen(false);
    }, 8000);

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleClickOutside);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, [isOpen]);

  // Play musical note on click using Web Audio API
  const playPopSound = () => {
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        const ctx = new AudioContextClass();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const now = ctx.currentTime;

        const notes = [
          261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88, 523.25, 587.33, 659.25, 783.99,
          880.0,
        ];
        const baseFreq = notes[pitchIndex % notes.length];

        osc.type = "sine";
        osc.frequency.setValueAtTime(baseFreq, now);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.09);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.09);
      }
    } catch {}
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 14, y: -y * 14 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playPopSound();
    setIsOpen((prev) => !prev);
    onInteract?.(id);
  };

  const sizeClasses = {
    xs: "w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 min-w-[48px] min-h-[48px]",
    sm: "w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 min-w-[64px] min-h-[64px]",
    md: "w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 min-w-[80px] min-h-[80px]",
    lg: "w-24 h-24 sm:w-32 sm:h-32 lg:w-36 lg:h-36 min-w-[96px] min-h-[96px]",
  };

  const floatClass =
    floatType === "2"
      ? "animate-float-sticker-2"
      : floatType === "3"
      ? "animate-float-sticker-1"
      : "animate-float-sticker-1";

  const badgeColorStyles = {
    blue: "bg-[#dbeafe] text-[#1e40af] border-[#bfdbfe]",
    emerald: "bg-emerald-100 text-emerald-800 border-emerald-200",
    amber: "bg-[#fef3c7] text-[#92400e] border-[#fde68a]",
    purple: "bg-purple-100 text-purple-800 border-purple-200",
    rose: "bg-rose-100 text-rose-800 border-rose-200",
    dark: "bg-[#18181b] text-white border-white/20",
  };

  return (
    <motion.div
      ref={containerRef}
      drag={draggable}
      dragElastic={0.2}
      dragConstraints={{ left: -60, right: 60, top: -45, bottom: 45 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        transform: `perspective(800px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) translateZ(8px)`,
        transition: "transform 0.15s ease-out",
      }}
      className={`cursor-pointer group select-none relative inline-block pointer-events-auto z-20 ${
        draggable ? "active:cursor-grabbing" : ""
      } ${className}`}
      title={`Klik stiker: ${quote}`}
    >
      <div className={`relative ${floatClass}`}>
        {/* 3D Sticker Image Frame */}
        <div
          className={`relative ${sizeClasses[size]} drop-shadow-[0_8px_18px_rgba(0,0,0,0.12)] group-hover:drop-shadow-[0_12px_24px_rgba(37,99,235,0.25)] group-hover:scale-108 active:scale-95 transition-all duration-300`}
        >
          <Image
            src={imageSrc}
            alt={alt}
            fill
            priority
            unoptimized
            className="object-contain"
          />
        </div>

        {/* Tiny Hover Hint */}
        {!isOpen && (
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none scale-90 group-hover:scale-100 whitespace-nowrap z-10">
            <span
              className={`px-2 py-0.5 rounded-full font-mono text-[8.5px] font-bold uppercase tracking-wider shadow-xs border ${badgeColorStyles[badgeColor]}`}
            >
              Klik aku 💬
            </span>
          </div>
        )}

        {/* Informative Popup Card (Never Cut-Off, Controlled Position) */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
                y: tooltipPosition === "bottom" ? -6 : 6,
              }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{
                opacity: 0,
                scale: 0.9,
                y: tooltipPosition === "bottom" ? -6 : 6,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className={`absolute z-50 pointer-events-auto left-1/2 -translate-x-1/2 w-60 sm:w-68 max-w-[calc(100vw-36px)] ${
                tooltipPosition === "bottom"
                  ? "top-full mt-2.5"
                  : "bottom-full mb-2.5"
              }`}
            >
              <div className="bg-white/98 backdrop-blur-md p-3.5 rounded-2xl shadow-2xl border border-[#ded8cb] text-left flex flex-col gap-1 relative overflow-hidden">
                {/* Header: Badge & Close Button */}
                <div className="flex items-center justify-between pb-1 border-b border-[#ded8cb]/60">
                  <span
                    className={`px-2 py-0.5 rounded-md font-mono text-[9px] font-bold uppercase tracking-wider border ${badgeColorStyles[badgeColor]}`}
                  >
                    {badge}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsOpen(false);
                    }}
                    className="w-5 h-5 rounded-full bg-[#f5f2ea] hover:bg-[#ded8cb] text-[#6b6863] flex items-center justify-center text-[10px] font-bold cursor-pointer"
                    aria-label="Tutup info"
                  >
                    ✕
                  </button>
                </div>

                {/* Title & Quote */}
                <div className="flex items-center gap-1.5 pt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb] animate-pulse shrink-0" />
                  <span className="font-sans text-xs font-bold text-[#222222]">
                    {quote}
                  </span>
                </div>

                {/* Humble, General Story about Bian */}
                <p className="font-sans text-[11px] text-[#55524c] leading-relaxed">
                  {story || subquote}
                </p>

                {/* Bottom Fact Tag */}
                {factTag && (
                  <div className="mt-0.5 pt-1.5 border-t border-[#ded8cb]/60 flex items-center gap-1 font-mono text-[9px] text-[#2563eb] font-semibold">
                    <span>⚡</span>
                    <span className="truncate">{factTag}</span>
                  </div>
                )}

                {/* Speech Bubble Arrow */}
                {tooltipPosition === "bottom" ? (
                  <div className="absolute left-1/2 -translate-x-1/2 -top-1.5 w-3 h-3 bg-white border-t border-l border-[#ded8cb] transform rotate-45" />
                ) : (
                  <div className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-3 h-3 bg-white border-b border-r border-[#ded8cb] transform rotate-45" />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
