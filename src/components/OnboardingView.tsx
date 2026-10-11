import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CharviMascot } from './CharviMascot';
import { FruitBasketIcon } from './FruitBasketIcon';
import { ArrowRight, Sparkles, Home, Trees } from 'lucide-react';
import { MascotTheme, CharviEmotion, LookTarget } from '../types';
import { CincauFeedingOverlay } from './CincauFeedingOverlay';
import { playPopSound } from '../utils/audioEffects';
import { getThemeStyle } from '../utils/themeColors';
import { HabitatWorlds } from './HabitatWorlds';

interface OnboardingViewProps {
  mascotTheme: MascotTheme;
  onToggleTheme: () => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({
  mascotTheme,
  onToggleTheme,
}) => {
  // Global View Index (0: Onboarding, 1: Rumah Cincau, 2: Luar Ruangan)
  const [viewIndex, setViewIndex] = useState<number>(0);
  const [bounceKey, setBounceKey] = useState<number>(0);

  const [selectedMode, setSelectedMode] = useState<'learn' | 'play' | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [mouseLookTarget, setMouseLookTarget] = useState<LookTarget>({ x: 0, y: 0.3 });
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Feeding & Gamification States
  const [isBubbleMenuOpen, setIsBubbleMenuOpen] = useState(false);
  const [isFeedingOpen, setIsFeedingOpen] = useState(false);
  const [mascotEmotionOverride, setMascotEmotionOverride] = useState<CharviEmotion | null>(null);
  const [dragLookTarget, setDragLookTarget] = useState<LookTarget | null>(null);

  // Tamagotchi Points State
  const [currentHp, setCurrentHp] = useState<number>(75);

  const lastTapTimeRef = useRef<number>(0);
  const emotionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const mascotContainerRef = useRef<HTMLDivElement | null>(null);

  const registerInteraction = () => {
    setIsInteracting(true);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      setIsInteracting(false);
    }, 3500);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    registerInteraction();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    setMouseLookTarget({ x: x * 0.9, y: y * 0.9 });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    registerInteraction();
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((touch.clientY - rect.top) / rect.height) * 2 - 1;
    setMouseLookTarget({ x: x * 0.9, y: y * 0.9 });
  };

  useEffect(() => {
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  // Listen for Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFeedingOpen) {
          setIsFeedingOpen(false);
        } else if (isBubbleMenuOpen) {
          setIsBubbleMenuOpen(false);
        } else if (selectedMode) {
          setSelectedMode(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFeedingOpen, isBubbleMenuOpen, selectedMode]);

  // Outside click handler
  const handleOutsideClick = () => {
    if (isFeedingOpen) {
      setIsFeedingOpen(false);
    }
    if (isBubbleMenuOpen) {
      setIsBubbleMenuOpen(false);
    }
    if (selectedMode !== null) {
      setSelectedMode(null);
    }
  };

  const handleSelectMode = (e: React.MouseEvent, mode: 'learn' | 'play') => {
    e.stopPropagation();
    registerInteraction();
    setSelectedMode(mode);
  };

  // Trigger travel transition and mascot bounce jump
  const travelToView = (targetIndex: number) => {
    playPopSound();
    setViewIndex(targetIndex);
    setBounceKey((k) => k + 1);
    setMascotEmotionOverride('excited');
    setTimeout(() => setMascotEmotionOverride('happy'), 2600);
  };

  // Primary Action Button Handler (Driven by current world)
  const handlePrimaryAction = () => {
    registerInteraction();
    if (viewIndex === 0) {
      travelToView(1);
    } else if (viewIndex === 1) {
      travelToView(2);
    } else {
      travelToView(1);
    }
  };

  // Double-tap on Cincau's body to reveal horizontal menu
  const handleCincauTap = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    registerInteraction();
    const now = Date.now();
    const timeSinceLastTap = now - lastTapTimeRef.current;

    if (timeSinceLastTap > 40 && timeSinceLastTap < 420) {
      setIsBubbleMenuOpen(true);
      setMascotEmotionOverride('happy');
      playPopSound();
      lastTapTimeRef.current = 0;
    } else {
      lastTapTimeRef.current = now;
    }
  };

  const themeStyle = getThemeStyle(mascotTheme);

  // Dynamic gaze target & emotion
  const { lookTarget, mascotEmotion } = useMemo<{
    lookTarget: { x: number; y: number };
    mascotEmotion: CharviEmotion;
  }>(() => {
    if (dragLookTarget) {
      return {
        lookTarget: dragLookTarget,
        mascotEmotion: mascotEmotionOverride || 'happy',
      };
    }
    if (mascotEmotionOverride) {
      return {
        lookTarget: { x: 0, y: -0.75 },
        mascotEmotion: mascotEmotionOverride,
      };
    }
    if (isFeedingOpen) {
      return {
        lookTarget: { x: 0, y: -0.9 },
        mascotEmotion: 'happy',
      };
    }
    if (isBubbleMenuOpen) {
      return {
        lookTarget: { x: 0, y: -0.95 },
        mascotEmotion: 'excited',
      };
    }
    if (isInteracting || isHovered) {
      return {
        lookTarget: mouseLookTarget,
        mascotEmotion: mascotEmotionOverride || 'idle',
      };
    }
    return {
      lookTarget: { x: 0.28, y: -0.75 },
      mascotEmotion: 'idle',
    };
  }, [dragLookTarget, mascotEmotionOverride, isFeedingOpen, isBubbleMenuOpen, isHovered, isInteracting, mouseLookTarget]);

  return (
    <div
      onClick={handleOutsideClick}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onTouchStart={registerInteraction}
      className="relative w-full h-full min-h-screen bg-white text-neutral-900 flex flex-col justify-between overflow-hidden select-none cursor-default"
    >
      {/* 1. 2D SIDE-SCROLLING BACKGROUND CONTAINER */}
      <HabitatWorlds viewIndex={viewIndex} />

      {/* 2. TOP MOBILE STATUS BAR (Persistent, does not slide) */}
      <div className="w-full pt-3 px-6 flex items-center justify-between text-xs text-neutral-700 z-20">
        <span className="font-bold text-neutral-900 tracking-wide">9:41</span>
        <div className="flex items-center gap-2">

        </div>
      </div>

      {/* 3. CONTEXTUAL WORLD SWITCHER BADGE (Persistent, indicates world 0, 1, 2) */}
      <div className="px-6 pt-2 z-20 flex justify-between items-center">
        <span className="text-[13px] text-neutral-500 font-semibold tracking-wide">ID</span>

        {/* Floating Navigation Icons */}
        <div className="flex items-center gap-3 pr-2">
          {/* Awal / Onboarding Icon */}
          <motion.button
            onClick={() => travelToView(0)}
            animate={{ 
              y: viewIndex === 0 ? [0, -3, 0] : 0,
              scale: viewIndex === 0 ? 1.15 : 0.9,
              rotate: viewIndex === 0 ? [0, 8, 0] : 0
            }}
            transition={{ 
              y: { repeat: Infinity, duration: 3, ease: 'easeInOut' },
              rotate: { repeat: Infinity, duration: 4, ease: 'easeInOut' },
              scale: { type: 'spring', stiffness: 300, damping: 15 }
            }}
            className={`p-2 rounded-2xl border-2 transition-all cursor-pointer shadow-xs ${
              viewIndex === 0
                ? 'bg-amber-100 border-amber-400 text-amber-600 shadow-md'
                : 'bg-white/80 border-neutral-100 text-neutral-400 hover:border-neutral-200'
            }`}
            title="Ke Halaman Awal"
          >
            <Sparkles className="w-5 h-5" />
          </motion.button>

          {/* Rumah Cincau Icon (Active only if 'learn' mode is selected) */}
          <motion.button
            onClick={() => selectedMode === 'learn' && travelToView(1)}
            disabled={selectedMode !== 'learn'}
            animate={{ 
              y: viewIndex === 1 ? [0, -3, 0] : 0,
              scale: viewIndex === 1 ? 1.15 : 0.9,
              rotate: viewIndex === 1 ? [0, -8, 0] : 0,
              opacity: selectedMode === 'learn' ? 1 : 0.4
            }}
            transition={{ 
              y: { repeat: Infinity, duration: 3.2, ease: 'easeInOut', delay: 0.2 },
              rotate: { repeat: Infinity, duration: 4.2, ease: 'easeInOut', delay: 0.1 },
              scale: { type: 'spring', stiffness: 300, damping: 15 }
            }}
            className={`p-2 rounded-2xl border-2 transition-all shadow-xs ${
              selectedMode === 'learn' ? 'cursor-pointer' : 'cursor-not-allowed grayscale'
            } ${
              viewIndex === 1
                ? 'bg-amber-100 border-amber-400 text-amber-600 shadow-md'
                : 'bg-white/80 border-neutral-100 text-neutral-400 hover:border-neutral-200'
            }`}
            title={selectedMode === 'learn' ? "Ke Rumah Cincau" : "Pilih mode 'Belajar' untuk masuk ke rumah"}
          >
            <Home className="w-5 h-5" />
          </motion.button>

          {/* Luar Ruangan Icon (Active only if 'play' mode is selected) */}
          <motion.button
            onClick={() => selectedMode === 'play' && travelToView(2)}
            disabled={selectedMode !== 'play'}
            animate={{ 
              y: viewIndex === 2 ? [0, -3, 0] : 0,
              scale: viewIndex === 2 ? 1.15 : 0.9,
              rotate: viewIndex === 2 ? [0, 10, 0] : 0,
              opacity: selectedMode === 'play' ? 1 : 0.4
            }}
            transition={{ 
              y: { repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: 0.4 },
              rotate: { repeat: Infinity, duration: 4.5, ease: 'easeInOut', delay: 0.2 },
              scale: { type: 'spring', stiffness: 300, damping: 15 }
            }}
            className={`p-2 rounded-2xl border-2 transition-all shadow-xs ${
              selectedMode === 'play' ? 'cursor-pointer' : 'cursor-not-allowed grayscale'
            } ${
              viewIndex === 2
                ? 'bg-emerald-100 border-emerald-400 text-emerald-600 shadow-md'
                : 'bg-white/80 border-neutral-100 text-neutral-400 hover:border-neutral-200'
            }`}
            title={selectedMode === 'play' ? "Ke Luar Ruangan" : "Pilih mode 'Bermain' untuk ke luar ruangan"}
          >
            <Trees className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* 4. SYNCHRONIZED SLIDING TOP UI TRACK (Slides together with HabitatWorlds) */}
      <div className="w-full overflow-hidden relative z-20 pt-1 pb-2">
        <motion.div
          animate={{
            x: `${-(viewIndex * 100) / 3}%`,
            y: isFeedingOpen ? -180 : 0,
            opacity: isFeedingOpen ? 0 : 1,
            scale: isFeedingOpen ? 0.9 : 1,
          }}
          transition={{
            type: 'spring',
            damping: 26,
            stiffness: 120,
          }}
          style={{ width: '300%' }}
          className="flex pointer-events-auto"
        >
          {/* SLIDE 0 UI: ONBOARDING / LAYAR AWAL */}
          <div className="w-1/3 flex-shrink-0 px-6 max-w-sm mx-auto flex flex-col items-start relative">


            {/* Sticker 1: "Belajar" */}
            <motion.div
              role="button"
              tabIndex={0}
              onClick={(e) => handleSelectMode(e, 'learn')}
              whileHover={{ scale: selectedMode === 'learn' ? 1.05 : 1.03 }}
              whileTap={{ scale: 0.94, y: 4 }}
              initial={{ opacity: 0, y: -20, rotate: -8 }}
              animate={{
                opacity: 1,
                y: selectedMode === 'learn' ? 4 : 0,
                rotate: selectedMode === 'learn' ? -1.5 : -3.5,
                scale: selectedMode === 'learn' ? 1.05 : selectedMode === 'play' ? 0.95 : 1,
              }}
              transition={{ type: 'spring', damping: 14, stiffness: 260 }}
              className={`relative inline-block text-white px-5 py-1.5 rounded-lg font-extrabold text-3xl tracking-tight transition-colors duration-200 cursor-pointer select-none ${
                selectedMode === 'learn'
                  ? `${themeStyle.primaryBg} ring-4 ring-offset-2 ${themeStyle.ringColor} shadow-lg ${themeStyle.shadowColor}`
                  : `${themeStyle.primaryBg} ${themeStyle.primaryHover} shadow-md ${themeStyle.shadowColor}`
              } ${selectedMode === 'play' ? 'opacity-70' : 'opacity-100'}`}
            >
              Belajar
              <div
                className={`absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 rounded-tl-xs pointer-events-none ${themeStyle.borderColor}`}
              />
            </motion.div>

            {/* Sticker 2: "Bermain" */}
            <motion.div
              role="button"
              tabIndex={0}
              onClick={(e) => handleSelectMode(e, 'play')}
              whileHover={{ scale: selectedMode === 'play' ? 1.05 : 1.03 }}
              whileTap={{ scale: 0.94, y: 4 }}
              initial={{ opacity: 0, y: -15, rotate: 6 }}
              animate={{
                opacity: 1,
                y: selectedMode === 'play' ? 4 : 0,
                rotate: selectedMode === 'play' ? 2 : 2.5,
                scale: selectedMode === 'play' ? 1.05 : selectedMode === 'learn' ? 0.95 : 1,
              }}
              transition={{ type: 'spring', damping: 14, stiffness: 260, delay: 0.1 }}
              className={`relative mt-2 ml-10 inline-block text-white px-5 py-1.5 rounded-lg font-extrabold text-3xl tracking-tight transition-colors duration-200 cursor-pointer select-none ${
                selectedMode === 'play'
                  ? `${themeStyle.primaryBg} ring-4 ring-offset-2 ${themeStyle.ringColor} shadow-lg ${themeStyle.shadowColor}`
                  : `${themeStyle.primaryBg} ${themeStyle.primaryHover} shadow-md ${themeStyle.shadowColor}`
              } ${selectedMode === 'learn' ? 'opacity-70' : 'opacity-100'}`}
            >
              Bermain
              <div className="absolute -bottom-2 -right-2 w-8 h-8 border border-dashed border-neutral-400/80 rounded-xs pointer-events-none" />
            </motion.div>

            {/* Subtitle Text */}
            <div className="mt-5 min-h-[72px] flex flex-col justify-center w-full">
              <AnimatePresence mode="wait">
                {selectedMode === null ? (
                  <motion.div
                    key="default-text"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-neutral-800 leading-snug font-handwriting"
                  >
                    <span className="text-xl sm:text-2xl font-bold text-neutral-600 block">
                      apa yang kamu mau lakukan hari ini,
                    </span>
                    <span className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight block mt-0.5">
                      Budi? 🌟
                    </span>
                  </motion.div>
                ) : selectedMode === 'learn' ? (
                  <motion.div
                    key="learn-text"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-neutral-800 leading-snug font-handwriting"
                  >
                    <span className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight block">
                      ayo kita belajar
                    </span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="play-text"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-neutral-800 leading-snug font-handwriting"
                  >
                    <span className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight block">
                      kamu yakin ingin bermain?
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* SLIDE 1 UI: RUMAH CINCAU (Crystal Bowl Interior) */}
          <div className="w-1/3 flex-shrink-0 px-6 max-w-sm mx-auto flex flex-col items-start relative">
            {/* Header Text */}
            <div className="text-neutral-800 leading-snug font-handwriting mb-2">
              <span className="text-lg sm:text-xl font-bold text-amber-700 block">
                selamat datang di
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight block mt-0.5">
                Rumah Cincau! 🏡
              </h2>
            </div>

          </div>

          {/* SLIDE 2 UI: LUAR RUANGAN */}
          <div className="w-1/3 flex-shrink-0 px-6 max-w-sm mx-auto flex flex-col items-start relative">
            {/* Header Text */}
            <div className="text-neutral-800 leading-snug font-handwriting mb-2">
              <span className="text-lg sm:text-xl font-bold text-emerald-800 block">
                petualangan di
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-emerald-950 tracking-tight block mt-0.5">
                Luar Ruangan! 🌳
              </h2>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 5. FEEDING OVERLAY COMPONENT */}
      <CincauFeedingOverlay
        isMenuOpen={isBubbleMenuOpen}
        isFeedingOpen={isFeedingOpen}
        onOpenMenu={() => setIsBubbleMenuOpen(true)}
        onCloseMenu={() => setIsBubbleMenuOpen(false)}
        onOpenFeeding={() => {
          setIsBubbleMenuOpen(true);
          setIsFeedingOpen(true);
        }}
        onCloseFeeding={() => setIsFeedingOpen(false)}
        onFeedSuccess={(food, speech) => {
          if (emotionTimerRef.current) clearTimeout(emotionTimerRef.current);
          setMascotEmotionOverride('excited');
          emotionTimerRef.current = setTimeout(() => {
            setMascotEmotionOverride('idle');
          }, 8000);
        }}
        onPetMascot={() => {
          if (emotionTimerRef.current) clearTimeout(emotionTimerRef.current);
          setMascotEmotionOverride('excited');
          emotionTimerRef.current = setTimeout(() => {
            setMascotEmotionOverride('idle');
          }, 8000);
        }}
        onHpChange={(newHp) => setCurrentHp(newHp)}
        hp={currentHp}
        setHp={setCurrentHp}
        onMascotEmotionChange={(emo) => setMascotEmotionOverride(emo)}
        onLookTargetChange={(target) => setDragLookTarget(target)}
        mascotContainerRef={mascotContainerRef}
      />

      {/* 6. FOREGROUND PERSISTENT MASCOT WITH BOUNCE JUMP ON SLIDE */}
      <div
        ref={mascotContainerRef}
        onClick={handleCincauTap}
        onTouchEnd={handleCincauTap}
        className="relative w-full flex-1 flex flex-col justify-end items-center pointer-events-auto cursor-pointer z-10"
      >
        {!isBubbleMenuOpen && !isFeedingOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: [0.65, 1, 0.65], y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 3.6, ease: 'easeInOut' }}
            className="absolute bottom-[310px] sm:bottom-[345px] z-20 px-3 py-1 rounded-full bg-amber-50/95 border border-amber-200/90 text-[11px] font-bold text-amber-900 shadow-2xs pointer-events-none flex items-center gap-1.5"
          >
            <span>✨</span>
            <span>Ketuk 2x tubuh Cincau</span>
          </motion.div>
        )}


        <motion.div
          key={`mascot-bounce-${bounceKey}`}
          animate={{ y: [0, -32, 0] }}
          transition={{ duration: 0.48, ease: [0.175, 0.885, 0.32, 1.275] }}
          className="w-full max-w-[340px] sm:max-w-[380px] -mb-1"
        >
          <CharviMascot
            variant="large-bottom"
            theme={mascotTheme}
            emotion={mascotEmotion}
            isInteracting={isInteracting || isHovered || selectedMode !== null || isFeedingOpen || isBubbleMenuOpen}
            lookTarget={lookTarget}
            className="w-full h-auto drop-shadow-xl"
          />
        </motion.div>

        {/* 7. CONTEXTUAL NAVIGATION ACTION BUTTON */}
        <motion.div
          onClick={(e) => e.stopPropagation()}
          animate={{
            y: isFeedingOpen ? 90 : 0,
            opacity: isFeedingOpen ? 0 : 1,
            pointerEvents: isFeedingOpen ? 'none' : 'auto',
          }}
          transition={{ duration: 0.25 }}
          className="absolute bottom-6 w-full px-6 flex flex-col items-center gap-3 z-30 max-w-sm"
        >

        </motion.div>
      </div>
    </div>
  );
};
