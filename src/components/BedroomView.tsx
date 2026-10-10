import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, BookOpen, Award, Sparkles, Star } from 'lucide-react';
import { MascotTheme } from '../types';
import { CharviMascot } from './CharviMascot';
import { playPopSound } from '../utils/audioEffects';

interface BedroomViewProps {
  mascotTheme: MascotTheme;
  starPoints: number;
  onBackToLivingRoom: () => void;
  onStartLearning: () => void;
}

export const BedroomView: React.FC<BedroomViewProps> = ({
  mascotTheme,
  starPoints,
  onBackToLivingRoom,
  onStartLearning,
}) => {
  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '-100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 220 }}
      className="absolute inset-0 z-40 bg-gradient-to-b from-pink-50 via-rose-50/50 to-pink-100/60 flex flex-col justify-between overflow-y-auto select-none p-6"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between w-full pt-2">
        <button
          onClick={() => {
            playPopSound();
            onBackToLivingRoom();
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white shadow-sm border border-pink-200 text-pink-950 font-bold text-xs hover:bg-pink-50 cursor-pointer transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Ruang Tengah</span>
        </button>

        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-100 rounded-full border border-amber-300 shadow-2xs">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
          <span className="text-xs font-black text-amber-950">{starPoints} Bintang Prestasi</span>
        </div>
      </div>

      {/* Bedroom Content */}
      <div className="flex-1 flex flex-col items-center justify-center my-auto py-6 relative">
        <div className="absolute w-64 h-64 bg-radial from-pink-300/40 via-rose-200/20 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 w-44 h-44 flex items-center justify-center mb-2">
          <CharviMascot
            variant="large-bottom"
            theme={mascotTheme}
            emotion="thinking"
            className="w-40 h-40 drop-shadow-xl"
          />
        </div>

        <div className="bg-white/95 backdrop-blur-md px-5 py-3 rounded-2xl shadow-md border border-pink-200 text-center max-w-sm mb-6 z-10">
          <h2 className="text-sm font-black text-pink-950 flex items-center justify-center gap-1.5 mb-1">
            <BookOpen className="w-4 h-4 text-pink-600" />
            <span>Kamar Belajar Cincau</span>
          </h2>
          <p className="text-xs text-neutral-600 font-medium leading-relaxed">
            Tempat Cincau merenung, belajar suku kata, matematika, dan merawat koleksi bintang prestasimu! 🌟
          </p>
        </div>

        {/* Trophies & Study Desk Card */}
        <div className="w-full max-w-sm bg-white border border-pink-200/90 rounded-3xl p-5 shadow-sm z-10 space-y-3">
          <div className="flex items-center justify-between border-b border-pink-100 pb-2.5">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span className="text-xs font-bold text-neutral-800">Rak Trofi Bintang Cilik</span>
            </div>
            <span className="text-[10px] font-black bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
              Level 2 - Aktif
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-2.5 flex flex-col items-center text-center">
              <span className="text-lg">⭐</span>
              <span className="text-[10px] font-bold text-amber-900 mt-1">Suku Kata</span>
            </div>
            <div className="bg-pink-50 border border-pink-200 rounded-2xl p-2.5 flex flex-col items-center text-center">
              <span className="text-lg">🏆</span>
              <span className="text-[10px] font-bold text-pink-900 mt-1">Hitung Cepat</span>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-2.5 flex flex-col items-center text-center">
              <span className="text-lg">🌿</span>
              <span className="text-[10px] font-bold text-emerald-900 mt-1">Sains Alam</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="w-full pt-2 pb-2 flex justify-center">
        <button
          onClick={() => {
            playPopSound();
            onStartLearning();
          }}
          className="w-full max-w-sm py-3.5 px-6 rounded-2xl bg-linear-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-extrabold text-xs shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Mulai Belajar di Meja Cincau 📖</span>
        </button>
      </div>
    </motion.div>
  );
};
