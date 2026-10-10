import React from 'react';
import { motion } from 'motion/react';
import { AppView } from '../types';

interface BackgroundWorldProps {
  currentView: AppView;
}

export const BackgroundWorld: React.FC<BackgroundWorldProps> = ({ currentView }) => {
  // Mapping views to horizontal offsets (0%, -100%, -200%, -300%)
  const viewMap: Record<AppView, number> = {
    'onboarding': 0,
    'home': -100,
    'living-room': -100,
    'bedroom': -200,
    'outdoor': -300,
  };

  const xOffset = viewMap[currentView];

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <motion.div
        animate={{ x: `${xOffset}%` }}
        transition={{ type: 'spring', damping: 26, stiffness: 120 }}
        className="flex h-full w-[400%]"
      >
        {/* 1. ONBOARDING ZONE (Soft Gradients) */}
        <div className="w-1/4 h-full relative bg-white">
          <div className="absolute inset-0 bg-linear-to-b from-sky-50/40 via-white to-white" />
          {/* Subtle clouds/shapes */}
          <div className="absolute top-20 left-10 w-32 h-16 bg-sky-100/30 rounded-full blur-xl" />
          <div className="absolute bottom-40 right-10 w-48 h-24 bg-amber-50/20 rounded-full blur-2xl" />
        </div>

        {/* 2. LIVING ROOM ZONE (Crystal Bowl) */}
        <div className="w-1/4 h-full relative bg-white overflow-hidden">
          <div className="absolute inset-0 bg-radial-[at_50%_40%] from-amber-50/60 via-white to-white opacity-80" />
          {/* 2D Crystal Bowl Rim Illustration */}
          <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[120%] h-[70%] border-t-8 border-amber-100/40 rounded-[50%] blur-[2px]" />
          {/* Soft honey glow points */}
          <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-amber-200/20 rounded-full blur-xl animate-pulse" />
          <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-amber-300/10 rounded-full blur-2xl animate-pulse delay-700" />
        </div>

        {/* 3. BEDROOM ZONE (Study Sanctuary) */}
        <div className="w-1/4 h-full relative bg-white">
          <div className="absolute inset-0 bg-linear-to-b from-sky-100/60 via-white to-white" />
          {/* 2D Shelf/Desk shapes */}
          <div className="absolute right-0 bottom-0 w-1/2 h-full opacity-10">
             <div className="absolute bottom-20 right-4 w-40 h-2 bg-sky-900/20 rounded-full" />
             <div className="absolute bottom-44 right-8 w-32 h-2 bg-sky-900/20 rounded-full" />
             <div className="absolute bottom-68 right-4 w-36 h-2 bg-sky-900/20 rounded-full" />
          </div>
          <div className="absolute top-20 -right-20 w-64 h-64 bg-sky-200 rounded-full blur-3xl opacity-40" />
        </div>

        {/* 4. OUTDOOR ZONE (Jungle Playground) */}
        <div className="w-1/4 h-full relative bg-white overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-b from-emerald-50/80 via-white to-white" />
          {/* 2D Giant Leaf Silhouettes */}
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-emerald-200/40 rounded-full blur-3xl" />
          <div className="absolute top-0 -right-20 w-80 h-80 bg-lime-100/30 rounded-full blur-3xl" />
          
          {/* Leaf sketches (minimalist) */}
          <svg className="absolute bottom-0 left-0 w-full h-1/2 opacity-10 text-emerald-900" viewBox="0 0 400 200">
             <path d="M-50,200 Q50,50 150,200 Z" fill="currentColor" />
             <path d="M100,200 Q200,80 300,200 Z" fill="currentColor" />
             <path d="M250,200 Q350,100 450,200 Z" fill="currentColor" />
          </svg>
        </div>
      </motion.div>
    </div>
  );
};
