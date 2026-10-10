import React from 'react';
import { motion } from 'motion/react';
import { DailyMission, KurikulumPhase } from '../types';
import { BookOpen, CheckCircle, ChevronRight, Sparkles, Award } from 'lucide-react';

interface CincauLearningMissionsProps {
  currentPhase: KurikulumPhase;
  onPhaseChange: (phase: KurikulumPhase) => void;
  missions: DailyMission[];
  onStartMission: (mission: DailyMission) => void;
}

export const CincauLearningMissions: React.FC<CincauLearningMissionsProps> = ({
  currentPhase,
  onPhaseChange,
  missions,
  onStartMission,
}) => {
  const filteredMissions = missions.filter((m) => m.phase === currentPhase);

  return (
    <div className="w-full flex flex-col mt-3 mb-6 select-none">
      {/* Kurikulum Merdeka Phase Selector Tabs */}
      <div className="flex items-center justify-between mb-2 px-0.5">
        <span className="text-xs font-extrabold text-neutral-800 tracking-tight flex items-center gap-1.5">
          <span>Misi Harian Kurikulum Merdeka</span>
          <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
        </span>
        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          Dapat Makanan 🥣
        </span>
      </div>

      {/* Segmented Phase Switcher */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-neutral-100 rounded-2xl mb-3 border border-neutral-200/80">
        {(['Fase A', 'Fase B', 'Fase C'] as KurikulumPhase[]).map((phase) => {
          const isActive = currentPhase === phase;
          const gradeLabel =
            phase === 'Fase A' ? 'Kelas 1-2' : phase === 'Fase B' ? 'Kelas 3-4' : 'Kelas 5-6';

          return (
            <button
              key={phase}
              onClick={() => onPhaseChange(phase)}
              className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex flex-col items-center leading-none ${
                isActive
                  ? 'bg-white text-neutral-900 shadow-2xs border border-neutral-200/90'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <span>{phase}</span>
              <span className="text-[9px] font-normal text-neutral-400 mt-0.5">{gradeLabel}</span>
            </button>
          );
        })}
      </div>

      {/* 3 Contextual Daily Task Cards */}
      <div className="space-y-2.5">
        {filteredMissions.map((mission) => {
          const isDone = Boolean(mission.isCompleted);

          return (
            <div
              key={mission.id}
              className={`w-full rounded-2xl p-3.5 border transition-all flex items-center justify-between gap-3 ${
                isDone
                  ? 'bg-neutral-50 border-neutral-200/70 opacity-80'
                  : 'bg-white hover:bg-neutral-50/80 border-neutral-200 shadow-2xs'
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {mission.badge}
                  </span>
                  <span className="text-[11px] text-neutral-400 font-medium truncate">
                    {mission.subject}
                  </span>
                </div>

                <h4 className="font-bold text-xs text-neutral-900 leading-tight mb-1 truncate">
                  {mission.title}
                </h4>

                <p className="text-[11px] text-neutral-500 leading-snug line-clamp-1">
                  {mission.description}
                </p>

                {/* Reward pill */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50/80 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200/60">
                    <span>🥣</span>
                    <span>+{mission.rewardFood} Makanan</span>
                  </span>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50/80 px-2 py-0.5 rounded-full flex items-center gap-1 border border-amber-200/60">
                    <span>⭐</span>
                    <span>+{mission.rewardStars} Bintang</span>
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onStartMission(mission)}
                disabled={isDone}
                className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  isDone
                    ? 'bg-neutral-200 text-neutral-500 cursor-default'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs shadow-emerald-600/20 active:scale-95'
                }`}
              >
                {isDone ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                    <span>Selesai</span>
                  </>
                ) : (
                  <>
                    <span>Mulai</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
