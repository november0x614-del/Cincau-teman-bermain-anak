import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Gamepad2, Sparkles, Trees, Compass } from 'lucide-react';
import { MascotTheme } from '../types';
import { CharviMascot } from './CharviMascot';
import { playPopSound } from '../utils/audioEffects';

interface OutdoorViewProps {
  mascotTheme: MascotTheme;
  onBackToLivingRoom: () => void;
  onStartPlay: () => void;
}

export const OutdoorView: React.FC<OutdoorViewProps> = ({
  mascotTheme,
  onBackToLivingRoom,
  onStartPlay,
}) => {
  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '-100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 220 }}
      className="absolute inset-0 z-40 bg-gradient-to-b from-emerald-50 via-teal-50/50 to-emerald-100/60 flex flex-col justify-between overflow-y-auto select-none p-6"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between w-full pt-2">
        <button
          onClick={() => {
            playPopSound();
            onBackToLivingRoom();
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white shadow-sm border border-emerald-200 text-emerald-950 font-bold text-xs hover:bg-emerald-50 cursor-pointer transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Ruang Tengah</span>
        </button>

        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-200/80 rounded-full border border-emerald-300 shadow-2xs">
          <Trees className="w-3.5 h-3.5 text-emerald-900" />
          <span className="text-xs font-black text-emerald-950 tracking-tight">Taman Alam Cincau</span>
        </div>
      </div>

      {/* Outdoor Content */}
      <div className="flex-1 flex flex-col items-center justify-center my-auto py-6 relative">
        <div className="absolute w-64 h-64 bg-radial from-emerald-300/40 via-teal-200/20 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 w-44 h-44 flex items-center justify-center mb-2">
          <CharviMascot
            variant="large-bottom"
            theme={mascotTheme}
            emotion="excited"
            className="w-40 h-40 drop-shadow-xl"
          />
        </div>

        <div className="bg-white/95 backdrop-blur-md px-5 py-3 rounded-2xl shadow-md border border-emerald-200 text-center max-w-sm mb-6 z-10">
          <h2 className="text-sm font-black text-emerald-950 flex items-center justify-center gap-1.5 mb-1">
            <Compass className="w-4 h-4 text-emerald-600" />
            <span>Taman Bermain & Jelajah Alam</span>
          </h2>
          <p className="text-xs text-neutral-600 font-medium leading-relaxed">
            Hirup udara segar di bawah rindangnya daun tropis! Mainkan mini-game seru dan jelajahi fakta sains alam bersama Cincau! 🌿🎮
          </p>
        </div>

        {/* Mini Game Playground Cards */}
        <div className="w-full max-w-sm space-y-2.5 z-10">
          <div
            onClick={() => {
              playPopSound();
              onStartPlay();
            }}
            className="bg-white hover:bg-emerald-50/80 border border-emerald-200 rounded-2xl p-3.5 shadow-sm flex items-center justify-between cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-neutral-900 text-xs">Petualangan Kata Nusantara</h4>
                <p className="text-[10px] text-neutral-500 font-medium">Lompat daun teratai & susun kata</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-600 group-hover:translate-x-1 transition-transform">Main ➔</span>
          </div>

          <div
            onClick={() => {
              playPopSound();
              onStartPlay();
            }}
            className="bg-white hover:bg-emerald-50/80 border border-emerald-200 rounded-2xl p-3.5 shadow-sm flex items-center justify-between cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500 text-white flex items-center justify-center shadow-sm">
                <span className="text-base">🍎</span>
              </div>
              <div>
                <h4 className="font-bold text-neutral-900 text-xs">Tangkap Buah & Hidup Sehat</h4>
                <p className="text-[10px] text-neutral-500 font-medium">Kumpulkan buah segar di keranjang</p>
              </div>
            </div>
            <span className="text-xs font-bold text-teal-600 group-hover:translate-x-1 transition-transform">Main ➔</span>
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="w-full pt-2 pb-2 flex justify-center">
        <button
          onClick={() => {
            playPopSound();
            onStartPlay();
          }}
          className="w-full max-w-sm py-3.5 px-6 rounded-2xl bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Buka Semua Mini-Game 🎮</span>
        </button>
      </div>
    </motion.div>
  );
};
