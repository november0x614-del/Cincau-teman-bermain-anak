import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { CharviEmotion, LookTarget } from '../types';

interface CharviJellyMascotProps {
  variant?: 'onboarding' | 'compact';
  isWaving?: boolean;
  emotion?: CharviEmotion;
  lookTarget?: LookTarget;
  isTalking?: boolean;
  isListening?: boolean;
  className?: string;
  onClick?: () => void;
}

export const CharviJellyMascot: React.FC<CharviJellyMascotProps> = ({
  variant = 'onboarding',
  isWaving = true,
  emotion = 'happy',
  lookTarget = { x: 0, y: -0.5 },
  isTalking = false,
  isListening = false,
  className = '',
  onClick,
}) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const [talkingFrame, setTalkingFrame] = useState(0);

  // Natural blink loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const blink = () => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
      timer = setTimeout(blink, 2800 + Math.random() * 2500);
    };
    timer = setTimeout(blink, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Talking mouth animation loop
  useEffect(() => {
    if (!isTalking) return;
    const interval = setInterval(() => {
      setTalkingFrame((prev) => (prev + 1) % 4);
    }, 140);
    return () => clearInterval(interval);
  }, [isTalking]);

  // Eye pupil offset
  const pupilOffsetX = useMemo(() => {
    const raw = (lookTarget?.x ?? 0) * 10;
    return Math.max(-12, Math.min(12, raw));
  }, [lookTarget?.x]);

  const pupilOffsetY = useMemo(() => {
    const raw = (lookTarget?.y ?? 0) * 10;
    return Math.max(-12, Math.min(12, raw));
  }, [lookTarget?.y]);

  const isOnboarding = variant === 'onboarding';

  return (
    <div
      onClick={onClick}
      className={`relative select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <motion.svg
        viewBox={isOnboarding ? '0 0 400 480' : '0 0 380 340'}
        className="w-full h-full overflow-visible drop-shadow-2xl"
        animate={{
          // Gentle breathing and subtle head float
          y: isListening ? [0, -6, 0] : [0, -4, 0],
          scaleY: [1, 1.02, 1],
          scaleX: isListening ? [1, 1.015, 1] : [1, 0.995, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: isListening ? 1.4 : 3.8,
          ease: 'easeInOut',
        }}
      >
        <defs>
          {/* Main vertical jelly gradient: Orange-Red -> Amber -> Yellow -> Aqua Cyan */}
          <linearGradient id="jellyBodyGrad" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#ff4514" />
            <stop offset="18%" stopColor="#ff6200" />
            <stop offset="36%" stopColor="#ffa000" />
            <stop offset="52%" stopColor="#ffd400" />
            <stop offset="68%" stopColor="#55e2cf" />
            <stop offset="85%" stopColor="#00d2e8" />
            <stop offset="100%" stopColor="#00b4d8" />
          </linearGradient>

          {/* Inner petal depth gradient for the 3-crest tulip crown */}
          <linearGradient id="innerCrownGrad" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#ff3300" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#ff7700" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ffd400" stopOpacity="0" />
          </linearGradient>

          {/* Left arm gradient */}
          <linearGradient id="leftArmGrad" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#ffd000" />
            <stop offset="40%" stopColor="#48dfd0" />
            <stop offset="100%" stopColor="#00c8e2" />
          </linearGradient>

          {/* Right waving arm gradient */}
          <linearGradient id="rightArmGrad" x1="0%" y1="100%" x2="80%" y2="0%">
            <stop offset="0%" stopColor="#ffd800" />
            <stop offset="50%" stopColor="#4de0d3" />
            <stop offset="100%" stopColor="#00c9e2" />
          </linearGradient>

          {/* Soft outer glow */}
          <filter id="jellyGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#00c8e2" floodOpacity="0.25" />
            <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#ff6200" floodOpacity="0.2" />
          </filter>

          {/* Eye clip paths */}
          <clipPath id="leftJellyEyeClip">
            <circle cx="164" cy="225" r="23" />
          </clipPath>
          <clipPath id="rightJellyEyeClip">
            <circle cx="236" cy="225" r="23" />
          </clipPath>
        </defs>

        {/* Listening ripple waves */}
        {isListening && (
          <motion.ellipse
            cx="200"
            cy="240"
            rx="180"
            ry="180"
            fill="none"
            stroke="#00e5ff"
            strokeWidth="3.5"
            strokeDasharray="6 6"
            initial={{ opacity: 0.9, scale: 0.9 }}
            animate={{ opacity: [0.9, 0, 0.9], scale: [0.9, 1.15, 0.9] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeOut' }}
          />
        )}

        {/* ===================== LEGS (If onboarding full body) ===================== */}
        {isOnboarding && (
          <g id="jellyLegs">
            {/* Left Leg */}
            <path
              d="M 160, 360 C 158, 410 156, 435 168, 442 C 180, 448 190, 435 192, 385 Z"
              fill="#00bfe0"
              opacity="0.95"
            />
            {/* Right Leg */}
            <path
              d="M 208, 385 C 210, 435 220, 448 232, 442 C 244, 435 242, 410 240, 360 Z"
              fill="#00bfe0"
              opacity="0.95"
            />
            {/* Leg inner highlights */}
            <ellipse cx="174" cy="425" rx="5" ry="12" fill="#ffffff" opacity="0.35" />
            <ellipse cx="226" cy="425" rx="5" ry="12" fill="#ffffff" opacity="0.35" />
          </g>
        )}

        {/* ===================== LEFT ARM (Resting Downward) ===================== */}
        <g id="leftArm">
          <path
            d="M 125, 255 C 100, 275 88, 320 95, 345 C 102, 368 122, 362 135, 335 C 142, 320 148, 280 145, 260 Z"
            fill="url(#leftArmGrad)"
            opacity="0.95"
          />
          {/* Left arm glass reflection */}
          <path
            d="M 104, 290 C 100, 310 102, 340 112, 348"
            stroke="#ffffff"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.5"
          />
        </g>

        {/* ===================== RIGHT ARM (Waving Cheerfully) ===================== */}
        <motion.g
          id="rightArm"
          style={{ transformOrigin: '270px 270px' }}
          animate={
            isWaving
              ? {
                  rotate: [0, 24, -10, 22, -6, 0],
                }
              : { rotate: 0 }
          }
          transition={{
            repeat: Infinity,
            duration: 2.2,
            ease: 'easeInOut',
            repeatDelay: 0.6,
          }}
        >
          <path
            d="M 268, 265 C 290, 260 325, 235 340, 205 C 352, 185 332, 175 315, 195 C 298, 215 278, 245 260, 268 Z"
            fill="url(#rightArmGrad)"
            opacity="0.95"
          />
          {/* Right waving arm highlight */}
          <path
            d="M 315, 198 C 328, 190 336, 195 330, 208"
            stroke="#ffffff"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.6"
          />
        </motion.g>

        {/* ===================== MAIN JELLY BODY & 3-PETAL CROWN ===================== */}
        <g id="jellyMainBody" filter="url(#jellyGlow)">
          {/* Pear/Tulip Body Contour with 3 top lobes */}
          <path
            d="
              M 140, 85
              C 142, 60 152, 50 162, 52
              C 174, 55 178, 75 182, 90
              C 188, 70 195, 45 204, 46
              C 215, 48 218, 75 222, 90
              C 226, 75 232, 55 244, 52
              C 254, 50 262, 62 264, 85
              C 272, 130 295, 210 295, 280
              C 295, 345 255, 385 200, 385
              C 145, 385 105, 345 105, 280
              C 105, 210 132, 130 140, 85
              Z
            "
            fill="url(#jellyBodyGrad)"
          />

          {/* Internal Tulip Petal Crease Layer (Gives the translucent petal depth) */}
          <path
            d="
              M 164, 54
              C 178, 80 185, 120 200, 140
              C 215, 120 224, 80 238, 54
              C 220, 80 215, 110 200, 115
              C 185, 110 180, 80 164, 54
              Z
            "
            fill="url(#innerCrownGrad)"
          />

          {/* Translucent jelly bubbles inside */}
          <g id="jellyBubbles" opacity="0.45">
            {/* Upper bubbles */}
            <circle cx="160" cy="170" r="5" fill="#ffffff" />
            <circle cx="161" cy="169" r="2.5" fill="#ffd400" />

            <circle cx="245" cy="180" r="4" fill="#ffffff" />
            <circle cx="246" cy="179" r="2" fill="#ffd400" />

            {/* Middle bubbles */}
            <circle cx="140" cy="275" r="7" fill="#ffffff" />
            <circle cx="141" cy="274" r="4.5" fill="#00d2e8" />

            <circle cx="165" cy="325" r="5.5" fill="#ffffff" />
            <circle cx="166" cy="324" r="3" fill="#00b4d8" />

            <circle cx="240" cy="330" r="6" fill="#ffffff" />
            <circle cx="241" cy="329" r="3.5" fill="#00b4d8" />

            <circle cx="215" cy="305" r="4" fill="#ffffff" />
          </g>

          {/* Glossy Jelly Specular Sheen (Top Left) */}
          <path
            d="M 148, 88 C 146, 120 152, 155 160, 175 C 156, 160 150, 125 152, 92 Z"
            fill="#ffffff"
            opacity="0.55"
          />
          <ellipse cx="142" cy="188" rx="8" ry="14" fill="#ffffff" opacity="0.38" />
          <circle cx="178" cy="115" r="4" fill="#ffffff" opacity="0.6" />
        </g>

        {/* ===================== EYES ===================== */}
        {/* Left Eye */}
        <g id="leftEyeGroup">
          {/* White eyeball */}
          <circle cx="164" cy="225" r="23" fill="#ffffff" />

          {/* Pupil with clip */}
          <g clipPath="url(#leftJellyEyeClip)">
            <motion.g
              animate={{
                x: pupilOffsetX,
                y: pupilOffsetY,
              }}
              transition={{ type: 'spring', damping: 20, stiffness: 220 }}
            >
              {/* Black pupil circle */}
              <circle cx="164" cy="225" r="16.5" fill="#111114" />
              {/* Large white specular reflection (like the reference image) */}
              <circle cx="158" cy="217" r="5.5" fill="#ffffff" />
              <circle cx="169" cy="231" r="2.4" fill="#ffffff" opacity="0.85" />
            </motion.g>
          </g>

          {/* Blinking Eyelid */}
          <motion.rect
            x="138"
            y="198"
            width="52"
            height="52"
            fill="#ffd400"
            animate={{
              scaleY: isBlinking ? 1 : 0,
            }}
            style={{ transformOrigin: 'top' }}
            transition={{ duration: 0.08 }}
          />
        </g>

        {/* Right Eye */}
        <g id="rightEyeGroup">
          {/* White eyeball */}
          <circle cx="236" cy="225" r="23" fill="#ffffff" />

          {/* Pupil with clip */}
          <g clipPath="url(#rightJellyEyeClip)">
            <motion.g
              animate={{
                x: pupilOffsetX,
                y: pupilOffsetY,
              }}
              transition={{ type: 'spring', damping: 20, stiffness: 220 }}
            >
              {/* Black pupil circle */}
              <circle cx="236" cy="225" r="16.5" fill="#111114" />
              {/* Large white specular reflection */}
              <circle cx="230" cy="217" r="5.5" fill="#ffffff" />
              <circle cx="241" cy="231" r="2.4" fill="#ffffff" opacity="0.85" />
            </motion.g>
          </g>

          {/* Blinking Eyelid */}
          <motion.rect
            x="210"
            y="198"
            width="52"
            height="52"
            fill="#ffd400"
            animate={{
              scaleY: isBlinking ? 1 : 0,
            }}
            style={{ transformOrigin: 'top' }}
            transition={{ duration: 0.08 }}
          />
        </g>

        {/* ===================== CUTE OPEN SMILING MOUTH ===================== */}
        <g id="jellyMouth">
          {isTalking ? (
            talkingFrame % 2 === 0 ? (
              // Open talking mouth
              <g>
                <path
                  d="M 186, 244 C 186, 266 214, 266 214, 244 Z"
                  fill="#1a1114"
                />
                <ellipse cx="200" cy="255" rx="7" ry="5" fill="#ff5376" />
              </g>
            ) : (
              // Slightly smaller open mouth
              <path
                d="M 188, 244 Q 200, 258 212, 244"
                fill="none"
                stroke="#1a1114"
                strokeWidth="5"
                strokeLinecap="round"
              />
            )
          ) : (
            // Iconic cheerful open smile with pink tongue (exact from image)
            <g>
              <path
                d="M 186, 244 C 186, 267 214, 267 214, 244 Z"
                fill="#181114"
              />
              {/* Pink tongue */}
              <path
                d="M 191, 252 C 195, 263 205, 263 209, 252 Z"
                fill="#ff5c80"
              />
            </g>
          )}
        </g>
      </motion.svg>
    </div>
  );
};
