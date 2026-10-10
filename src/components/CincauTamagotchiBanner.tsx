import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Gamepad2, Sparkles } from 'lucide-react';

interface CincauTamagotchiBannerProps {
  activeMode: 'learn' | 'play';
  onSelectMode: (mode: 'learn' | 'play') => void;
  pendingMissionsCount: number;
}

export const CincauTamagotchiBanner: React.FC<CincauTamagotchiBannerProps> = ({
  activeMode,
  onSelectMode,
  pendingMissionsCount,
}) => {
  return (
    <div className="w-full mt-2 mb-3">
      {/* Banner Title */}
      <div className="flex items-center justify-between px-1 mb-2">
        <span className="text-xs font-extrabold text-neutral-700 tracking-tight flex items-center gap-1.5">
          <span>Pilih Petualangan Hari Ini</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
        </span>
        <span className="text-[11px] font-semibold text-neutral-400">
          {activeMode === 'learn' ? 'Fokus Kurikulum' : 'Eksplorasi Santai'}
        </span>
      </div>

      {/* 2 Big Touch-Friendly Activity Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Card 1: Belajar */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onSelectMode('learn')}
          className={`relative p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[96px] ${
            activeMode === 'learn'
              ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-emerald-400 shadow-md shadow-emerald-500/20 ring-2 ring-emerald-500/30'
              : 'bg-white hover:bg-neutral-50 text-neutral-800 border-neutral-200/90 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                activeMode === 'learn' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              <BookOpen className="w-4 h-4 stroke-[2.4]" />
            </div>
            {pendingMissionsCount > 0 && (
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  activeMode === 'learn'
                    ? 'bg-amber-300 text-neutral-900 font-extrabold'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {pendingMissionsCount} Misi
              </span>
            )}
          </div>

          <div className="mt-2">
            <div
              className={`font-extrabold text-sm leading-tight ${
                activeMode === 'learn' ? 'text-white' : 'text-neutral-900'
              }`}
            >
              Belajar Cerdas
            </div>
            <div
              className={`text-[11px] font-medium leading-snug mt-0.5 line-clamp-1 ${
                activeMode === 'learn' ? 'text-emerald-100' : 'text-neutral-500'
              }`}
            >
              Kurikulum Merdeka SD
            </div>
          </div>
        </motion.button>

        {/* Card 2: Bermain */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onSelectMode('play')}
          className={`relative p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[96px] ${
            activeMode === 'play'
              ? 'bg-gradient-to-br from-violet-600 to-purple-700 text-white border-violet-400 shadow-md shadow-violet-500/20 ring-2 ring-violet-500/30'
              : 'bg-white hover:bg-neutral-50 text-neutral-800 border-neutral-200/90 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                activeMode === 'play' ? 'bg-white/20 text-white' : 'bg-violet-100 text-violet-700'
              }`}
            >
              <Gamepad2 className="w-4 h-4 stroke-[2.4]" />
            </div>
            <span
              className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                activeMode === 'play'
                  ? 'bg-white/20 text-white'
                  : 'bg-violet-100 text-violet-800'
              }`}
            >
              2D & 3D
            </span>
          </div>

          <div className="mt-2">
            <div
              className={`font-extrabold text-sm leading-tight ${
                activeMode === 'play' ? 'text-white' : 'text-neutral-900'
              }`}
            >
              Bermain Edukatif
            </div>
            <div
              className={`text-[11px] font-medium leading-snug mt-0.5 line-clamp-1 ${
                activeMode === 'play' ? 'text-violet-100' : 'text-neutral-500'
              }`}
            >
              5 Game Asah Kognitif
            </div>
          </div>
        </motion.button>
      </div>
    </div>
  );
};
