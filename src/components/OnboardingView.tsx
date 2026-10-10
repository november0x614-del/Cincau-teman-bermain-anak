import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CharviMascot } from './CharviMascot';
import { FruitBasketIcon } from './FruitBasketIcon';
import { ArrowRight, Sparkles } from 'lucide-react';
import { MascotTheme, CharviEmotion, LookTarget, DailyMission, EducationalGame } from '../types';
import { CincauFeedingOverlay } from './CincauFeedingOverlay';
import { playPopSound } from '../utils/audioEffects';
import { getThemeStyle } from '../utils/themeColors';
import { CincauMissionQuizModal } from './CincauMissionQuizModal';
import { CincauGameModal } from './CincauGameModal';
import { CharviAiChat } from './CharviAiChat';
import { INITIAL_MISSIONS, EDUCATIONAL_GAMES } from '../data/cincauContent';

interface OnboardingViewProps {
  mascotTheme: MascotTheme;
  onToggleTheme: () => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({
  mascotTheme,
  onToggleTheme,
}) => {
  const [selectedMode, setSelectedMode] = useState<'learn' | 'play' | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Feeding & Gamification States
  const [isBubbleMenuOpen, setIsBubbleMenuOpen] = useState(false);
  const [isFeedingOpen, setIsFeedingOpen] = useState(false);
  const [mascotEmotionOverride, setMascotEmotionOverride] = useState<CharviEmotion | null>(null);
  const [dragLookTarget, setDragLookTarget] = useState<LookTarget | null>(null);

  // Tamagotchi Points State
  const [foodStock, setFoodStock] = useState<number>(3);
  const [starPoints, setStarPoints] = useState<number>(25);
  const [currentHp, setCurrentHp] = useState<number>(() => {
    const saved = localStorage.getItem('cincau_tamagotchi_hp');
    if (saved) {
      const parsed = Number(saved);
      if (!isNaN(parsed) && parsed >= 0 && parsed <= 100) return parsed;
    }
    return 75;
  });

  // Active Modals over Screen 1
  const [activeQuizMission, setActiveQuizMission] = useState<DailyMission | null>(null);
  const [activeGame, setActiveGame] = useState<EducationalGame | null>(null);
  const [isAiOpen, setIsAiOpen] = useState(false);

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

  const handleStartAction = () => {
    registerInteraction();
    if (selectedMode === 'play') {
      // Launch Educational Game
      setActiveGame(EDUCATIONAL_GAMES[0]);
    } else {
      // Default / Belajar: Launch Kurikulum Merdeka Mission Quiz
      const pendingMission = INITIAL_MISSIONS.find((m) => !m.isCompleted) || INITIAL_MISSIONS[0];
      setActiveQuizMission(pendingMission);
    }
  };

  // Double-tap on Cincau's body to reveal horizontal menu
  const handleCincauTap = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    registerInteraction();
    const now = Date.now();
    const timeSinceLastTap = now - lastTapTimeRef.current;

    if (timeSinceLastTap > 40 && timeSinceLastTap < 420) {
      // Double tap triggered!
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
    if (selectedMode === 'learn') {
      return {
        lookTarget: { x: -0.22, y: -0.85 },
        mascotEmotion: 'happy',
      };
    }
    if (selectedMode === 'play') {
      return {
        lookTarget: { x: 0.35, y: -0.75 },
        mascotEmotion: 'excited',
      };
    }
    if (isHovered) {
      return {
        lookTarget: { x: 0.1, y: 0.8 },
        mascotEmotion: 'idle',
      };
    }
    if (currentHp <= 28) {
      return {
        lookTarget: { x: 0, y: -0.5 },
        mascotEmotion: 'sad',
      };
    }
    return {
      lookTarget: { x: 0.28, y: -0.75 },
      mascotEmotion: 'idle',
    };
  }, [dragLookTarget, mascotEmotionOverride, isFeedingOpen, isBubbleMenuOpen, selectedMode, isHovered, currentHp]);

  return (
    <div
      onClick={handleOutsideClick}
      onMouseMove={registerInteraction}
      onTouchStart={registerInteraction}
      className="relative w-full h-full min-h-screen bg-white text-neutral-900 flex flex-col justify-between overflow-hidden select-none cursor-default"
    >
      {/* Top Mobile Status Bar */}
      <div className="w-full pt-3 px-6 flex items-center justify-between text-xs text-neutral-700 z-20">
        <span className="font-bold text-neutral-900 tracking-wide">9:41</span>
        <div className="flex items-center gap-2">


          {/* AI Helper Trigger */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsAiOpen(true);
            }}
            className={`p-1.5 rounded-full bg-neutral-100 border border-neutral-200 hover:bg-neutral-200 transition-colors relative cursor-pointer ${themeStyle.textColor}`}
            title="Tanya Cincau AI"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>

          {/* Theme Quick Switcher */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleTheme();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all cursor-pointer bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-700 shadow-2xs"
            title="Ganti tema warna Cincau"
          >
            <div className={`w-2.5 h-2.5 rounded-full ${themeStyle.dotColor}`} />
            <span>Cincau</span>
          </button>
        </div>
      </div>

      {/* Language badge */}
      <div className="px-6 pt-2 z-20 flex justify-between items-center">
        <span className="text-[13px] text-neutral-500 font-semibold tracking-wide">ID</span>
      </div>

      {/* CENTER HERO CONTENT: Kotak Belajar & Bermain */}
      <motion.div
        animate={{
          y: isFeedingOpen ? -180 : 0,
          opacity: isFeedingOpen ? 0 : 1,
          scale: isFeedingOpen ? 0.9 : 1,
        }}
        transition={{
          type: 'spring',
          damping: 22,
          stiffness: 220,
        }}
        style={{ pointerEvents: isFeedingOpen ? 'none' : 'auto' }}
        className="relative px-6 pt-4 pb-2 z-20 flex flex-col items-start max-w-sm mx-auto w-full"
      >
        {/* Fruit Basket Food Icon */}
        <div className="absolute right-7 -top-3 pointer-events-auto">
          <motion.div
            initial={{ rotate: 8, scale: 0.9 }}
            animate={{ rotate: [8, 14, 8], y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
            whileHover={{ scale: 1.15, rotate: 12 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              playPopSound();
              setIsFeedingOpen(true);
              setIsBubbleMenuOpen(true);
            }}
            className="cursor-pointer"
            title="Buka Keranjang Hadiah Makanan Cincau"
          >
            <FruitBasketIcon className="w-11 h-11 drop-shadow-sm" />
          </motion.div>
        </div>

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
          transition={{ type: 'spring', damping: 14, stiffness: 260, delay: selectedMode ? 0 : 0.15 }}
          className={`relative mt-2 ml-10 inline-block text-white px-5 py-1.5 rounded-lg font-extrabold text-3xl tracking-tight transition-colors duration-200 cursor-pointer select-none ${
            selectedMode === 'play'
              ? `${themeStyle.primaryBg} ring-4 ring-offset-2 ${themeStyle.ringColor} shadow-lg ${themeStyle.shadowColor}`
              : `${themeStyle.primaryBg} ${themeStyle.primaryHover} shadow-md ${themeStyle.shadowColor}`
          } ${selectedMode === 'learn' ? 'opacity-70' : 'opacity-100'}`}
        >
          Bermain
          <div className="absolute -bottom-2 -right-2 w-8 h-8 border border-dashed border-neutral-400/80 rounded-xs pointer-events-none" />
        </motion.div>

        {/* Dynamic subtitle text */}
        <div className="mt-5 min-h-[72px] flex flex-col justify-center w-full">
          <AnimatePresence mode="wait">
            {selectedMode === null && (
              <motion.div
                key="default"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="text-neutral-800 leading-snug font-handwriting"
              >
                <span className="text-xl sm:text-2xl font-bold text-neutral-600 block">
                  apa yang kamu mau lakukan hari ini,
                </span>
                <span className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight block mt-0.5">
                  Budi? 🌟
                </span>
              </motion.div>
            )}

            {selectedMode === 'learn' && (
              <motion.div
                key="learn"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="text-neutral-800 leading-snug font-handwriting"
              >
                <span className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight block">
                  ayo kita belajar
                </span>
              </motion.div>
            )}

            {selectedMode === 'play' && (
              <motion.div
                key="play"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="text-neutral-800 leading-snug font-handwriting"
              >
                <span className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight block">
                  kamu yakin ingin bermain?
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* FEEDING OVERLAY COMPONENT */}
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
          setFoodStock((f) => Math.max(0, f - 1));
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

      {/* CINCAU MASCOT EMERGING FROM THE BOTTOM */}
      <div
        ref={mascotContainerRef}
        onClick={handleCincauTap}
        onTouchEnd={handleCincauTap}
        className="relative w-full flex-1 flex flex-col justify-end items-center pointer-events-auto cursor-pointer"
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
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          transition={{
            type: 'spring',
            damping: 18,
            stiffness: 90,
            mass: 1.1,
            delay: 0.1,
          }}
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

        {/* Floating Action Bar overlaying the bottom character */}
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
          {/* Main Action Button */}
          <button
            onClick={handleStartAction}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`w-full py-3.5 px-6 rounded-full font-bold text-base shadow-xl transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer ${
              selectedMode
                ? `${themeStyle.primaryBg} ${themeStyle.primaryHover} text-white ${themeStyle.shadowColor} active:scale-[0.98]`
                : 'bg-neutral-900 hover:bg-black text-white shadow-black/15 active:scale-[0.98]'
            }`}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={selectedMode || 'default'}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                {selectedMode === 'learn'
                  ? 'Mulai Belajar'
                  : selectedMode === 'play'
                  ? 'Mulai Bermain'
                  : 'Mulai Petualangan'}
              </motion.span>
            </AnimatePresence>
            <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>

      {/* OVERLAY MODALS DIRECTLY ON SCREEN 1 */}
      {/* 1. Kurikulum Merdeka Quiz Mission Modal */}
      {activeQuizMission && (
        <CincauMissionQuizModal
          mission={activeQuizMission}
          onClose={() => setActiveQuizMission(null)}
          onComplete={(missionId, earnedFood, earnedStars) => {
            setFoodStock((f) => f + earnedFood);
            setStarPoints((s) => s + earnedStars);
            setActiveQuizMission(null);
            setMascotEmotionOverride('happy');
          }}
        />
      )}

      {/* 2. Educational Games Modal */}
      {activeGame && (
        <CincauGameModal
          game={activeGame}
          onClose={() => setActiveGame(null)}
          onGameWin={(stars) => {
            setStarPoints((s) => s + stars);
          }}
        />
      )}

      {/* 3. AI Chat Modal */}
      {isAiOpen && (
        <CharviAiChat
          mascotTheme={mascotTheme}
          onClose={() => setIsAiOpen(false)}
        />
      )}
    </div>
  );
};
