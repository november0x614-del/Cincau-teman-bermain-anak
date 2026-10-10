import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, BookOpen, Gamepad2, Sparkles, Home, DoorClosed } from 'lucide-react';
import { MascotTheme } from '../types';
import { CharviMascot } from './CharviMascot';
import { playPopSound } from '../utils/audioEffects';

interface HomeLivingRoomViewProps {
  mascotTheme: MascotTheme;
  onNavigateRoom: (room: 'living-room' | 'bedroom' | 'outdoor' | 'main') => void;
  onBackToOnboarding: () => void;
}

export const HomeLivingRoomView: React.FC<HomeLivingRoomViewProps> = ({
  mascotTheme,
  onNavigateRoom,
  onBackToOnboarding,
}) => {
  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '-100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 220 }}
      className="absolute inset-0 z-40 bg-gradient-to-b from-amber-50 via-orange-50/50 to-amber-100/60 flex flex-col justify-between overflow-y-auto select-none p-6"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between w-full pt-2">
        <button
          onClick={() => {
            playPopSound();
            onBackToOnboarding();
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white shadow-sm border border-amber-200/80 text-amber-900 font-bold text-xs hover:bg-amber-50 cursor-pointer transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-200/80 rounded-full border border-amber-300 shadow-2xs">
          <Home className="w-3.5 h-3.5 text-amber-900" />
          <span className="text-xs font-black text-amber-950 tracking-tight">Ruang Tengah Cincau</span>
        </div>
      </div>

      {/* Center Room Content (Jelly Mascot Living Room) */}
      <div className="flex-1 flex flex-col items-center justify-center my-auto py-6 relative">
        {/* Soft Warm Glow Behind Cincau */}
        <div className="absolute w-64 h-64 bg-radial from-amber-300/40 via-orange-200/20 to-transparent rounded-full blur-2xl pointer-events-none" />

        {/* Mascot in Living Room */}
        <div className="relative z-10 w-48 h-48 flex items-center justify-center mb-4">
          <CharviMascot
            variant="large-bottom"
            theme={mascotTheme}
            emotion="happy"
            className="w-44 h-44 drop-shadow-xl"
          />
        </div>

        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-2xl shadow-md border border-amber-200 text-center max-w-xs mb-6 z-10"
        >
          <p className="text-xs font-extrabold text-neutral-800">
            "Selamat datang di Ruang Tengah rumah jeli Cincau! Pilih pintu untuk masuk ke kamar belajar atau bermain di luar ya! 🏡✨"
          </p>
        </motion.div>

        {/* TWO DOORS (Pintu Kamar & Pintu Luar Ruangan) */}
        <div className="w-full max-w-sm grid grid-cols-2 gap-4 z-10">
          {/* Pintu 1: Kamar Cincau */}
          <motion.div
            whileHover={{ scale: 1.04, y: -4 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              playPopSound();
              onNavigateRoom('bedroom');
            }}
            className="bg-linear-to-b from-rose-50 to-pink-100/80 border-2 border-pink-200 rounded-3xl p-4 shadow-md flex flex-col items-center cursor-pointer group transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-pink-500 text-white flex items-center justify-center shadow-md mb-2 group-hover:rotate-6 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-xs font-black text-pink-950 uppercase tracking-wide">Kamar Cincau</h3>
            <p className="text-[10px] text-pink-800/80 font-medium text-center mt-0.5">Meja belajar & Bintang Prestasi ⭐</p>
          </motion.div>

          {/* Pintu 2: Luar Ruangan */}
          <motion.div
            whileHover={{ scale: 1.04, y: -4 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              playPopSound();
              onNavigateRoom('outdoor');
            }}
            className="bg-linear-to-b from-emerald-50 to-teal-100/80 border-2 border-emerald-200 rounded-3xl p-4 shadow-md flex flex-col items-center cursor-pointer group transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md mb-2 group-hover:-rotate-6 transition-transform">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <h3 className="text-xs font-black text-emerald-950 uppercase tracking-wide">Luar Ruangan</h3>
            <p className="text-[10px] text-emerald-800/80 font-medium text-center mt-0.5">Taman bermain & Jelajah alam 🌿</p>
          </motion.div>
        </div>
      </div>

      {/* Bottom Quick Access to Main Homescreen */}
      <div className="w-full pt-2 pb-2 flex justify-center">
        <button
          onClick={() => {
            playPopSound();
            onNavigateRoom('main');
          }}
          className="w-full max-w-sm py-3 px-5 rounded-2xl bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-xs shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Buka Misi & Aktivitas Harian (Homescreen)</span>
        </button>
      </div>
    </motion.div>
  );
};
