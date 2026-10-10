import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CharviMascot } from './CharviMascot';
import { CharviEmotion, LookTarget, MascotTheme, TamagotchiState } from '../types';
import { Sparkles, Utensils, MessageCircle, Heart, AlertCircle, Clock, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CincauMascotStageProps {
  tamagotchi: TamagotchiState;
  onFeedCincau: () => void;
  onOpenAiChat: () => void;
  onSimulateNeglectToggle: () => void;
  isSimulatingNeglect: boolean;
  mascotTheme: MascotTheme;
  isInteracting: boolean;
  lookTarget: LookTarget;
}

export const CincauMascotStage: React.FC<CincauMascotStageProps> = ({
  tamagotchi,
  onFeedCincau,
  onOpenAiChat,
  onSimulateNeglectToggle,
  isSimulatingNeglect,
  mascotTheme,
  isInteracting,
  lookTarget,
}) => {
  const [isFeedingAnimation, setIsFeedingAnimation] = useState(false);
  const [localEmotionOverride, setLocalEmotionOverride] = useState<CharviEmotion | null>(null);
  const [speechBubbleText, setSpeechBubbleText] = useState<string | null>(null);

  // Compute live emotion based on Tamagotchi energy & neglect
  const activeEmotion: CharviEmotion = (() => {
    if (localEmotionOverride) return localEmotionOverride;
    if (isSimulatingNeglect || tamagotchi.energy <= 25) {
      return 'sad'; // downward depression flow
    }
    if (tamagotchi.energy >= 75) {
      return 'happy'; // gold/yellow dopamine
    }
    return 'idle'; // cyan calm
  })();

  const isLowEnergy = tamagotchi.energy <= 25 || isSimulatingNeglect;

  const handleFeedClick = () => {
    if (tamagotchi.foodStock <= 0) {
      setLocalEmotionOverride('pouty');
      setSpeechBubbleText('Mangkuk makanan habis! Selesaikan 1 misi belajar di bawah ya! 📖');
      setTimeout(() => {
        setLocalEmotionOverride(null);
        setSpeechBubbleText(null);
      }, 3000);
      return;
    }

    setIsFeedingAnimation(true);
    setLocalEmotionOverride('excited');
    setSpeechBubbleText('Nyam nyam nyam! Segar sekali! Terima kasih makanannya! 🥣✨');

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.45 },
    });

    onFeedCincau();

    setTimeout(() => {
      setIsFeedingAnimation(false);
      setLocalEmotionOverride('happy');
    }, 1200);

    setTimeout(() => {
      setLocalEmotionOverride(null);
      setSpeechBubbleText(null);
    }, 8000);
  };

  const handleMascotTap = () => {
    if (isLowEnergy) {
      setLocalEmotionOverride('sad');
      setSpeechBubbleText('Cincau lemas karena belum belajar... yuk temani Cincau! 🥺');
    } else {
      setLocalEmotionOverride('excited');
      setSpeechBubbleText('Yaaay! Cincau kenyang dan penuh semangat belajar! 🌟');
    }

    setTimeout(() => {
      setLocalEmotionOverride(null);
      setSpeechBubbleText(null);
    }, 2800);
  };

  return (
    <div className="relative w-full flex flex-col items-center my-1 select-none">
      {/* Speech Bubble Above Cincau */}
      <div className="h-10 flex items-center justify-center mb-1">
        <AnimatePresence>
          {(speechBubbleText || isLowEnergy) && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.9 }}
              className={`relative font-semibold text-xs py-1.5 px-3.5 rounded-2xl shadow-lg flex items-center gap-1.5 border max-w-[340px] text-center ${
                isLowEnergy
                  ? 'bg-sky-950 text-sky-100 border-sky-800 shadow-sky-950/20'
                  : 'bg-neutral-900 text-white border-neutral-800 shadow-neutral-900/20'
              }`}
            >
              <span>
                {speechBubbleText ||
                  'Cincau rindu belajar bareng kamu... yuk selesaikan 1 misi agar dapat makanan! 💧'}
              </span>
              <div
                className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 ${
                  isLowEnergy ? 'bg-sky-950' : 'bg-neutral-900'
                }`}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* MASCOT RIGGED CONTAINER */}
      <div
        onClick={handleMascotTap}
        className="relative w-32 h-28 -mb-2 z-10 hover:scale-105 active:scale-95 transition-transform cursor-pointer flex items-center justify-center"
        title="Ketuk Cincau untuk menyapa!"
      >
        <CharviMascot
          variant="compact-header"
          theme={mascotTheme}
          emotion={activeEmotion}
          isInteracting={isInteracting || isFeedingAnimation}
          lookTarget={lookTarget}
          className="w-full h-full"
        />

        {/* Flying Food Bowl animation when feeding */}
        <AnimatePresence>
          {isFeedingAnimation && (
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.5 }}
              animate={{ opacity: 1, y: -10, scale: 1.3 }}
              exit={{ opacity: 0, y: -30, scale: 0.8 }}
              className="absolute text-4xl pointer-events-none z-30"
            >
              🥣
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* TAMAGOTCHI STATUS & CARING CARD */}
      <div className="w-full bg-neutral-50/90 border border-neutral-200/90 rounded-2xl p-3 shadow-2xs mt-1">
        {/* Energy bar & Condition title */}
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <Heart
              className={`w-3.5 h-3.5 ${
                isLowEnergy ? 'text-sky-500 animate-pulse' : 'text-rose-500 fill-rose-500'
              }`}
            />
            <span className="text-xs font-bold text-neutral-800">
              {isLowEnergy ? 'Kondisi: Lemas & Lapar 💧' : 'Kondisi: Ceria & Sehat ✨'}
            </span>
          </div>

          <span className="text-xs font-extrabold text-neutral-700">{tamagotchi.energy}%</span>
        </div>

        {/* Progress meter */}
        <div className="w-full bg-neutral-200 h-2.5 rounded-full overflow-hidden mb-2.5">
          <motion.div
            initial={false}
            animate={{ width: `${tamagotchi.energy}%` }}
            transition={{ duration: 0.4 }}
            className={`h-full rounded-full transition-colors ${
              tamagotchi.energy >= 60
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                : tamagotchi.energy >= 30
                ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                : 'bg-gradient-to-r from-sky-400 to-blue-600'
            }`}
          />
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center gap-2">
          {/* Suapi Cincau button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleFeedClick}
            className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer ${
              tamagotchi.foodStock > 0
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                : 'bg-neutral-200 hover:bg-neutral-300 text-neutral-600'
            }`}
            title="Beri makan Cincau menggunakan mangkuk hasil belajar"
          >
            <span className="text-sm">🥣</span>
            <span>Suapi Cincau ({tamagotchi.foodStock})</span>
          </motion.button>

          {/* Sapa dengan Suara button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={onOpenAiChat}
            className="flex-1 py-2 px-3 rounded-xl bg-neutral-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
            title="Bicara dengan Cincau"
          >
            <MessageCircle className="w-3.5 h-3.5 text-cyan-300" />
            <span>Sapa Suara</span>
          </motion.button>
        </div>

        {/* Simulation switch for testing Tamagotchi character reflection */}
        <div className="mt-2.5 pt-2 border-t border-neutral-200/60 flex items-center justify-between text-[11px] text-neutral-500">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-neutral-400" />
            <span>Simulasi Karakter:</span>
          </span>

          <button
            onClick={onSimulateNeglectToggle}
            className={`px-2 py-0.5 rounded-full font-semibold border transition-all cursor-pointer text-[10px] ${
              isSimulatingNeglect
                ? 'bg-sky-100 text-sky-800 border-sky-300'
                : 'bg-neutral-100 text-neutral-600 border-neutral-200 hover:bg-neutral-200'
            }`}
            title="Uji coba perubahan ekspresi jika anak tidak belajar beberapa hari"
          >
            {isSimulatingNeglect ? '🔵 Sedang Depresi' : '⚪ Aktif Normal'}
          </button>
        </div>
      </div>
    </div>
  );
};
