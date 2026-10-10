import React, { useState } from 'react';
import { motion } from 'motion/react';
import { EducationalGame } from '../types';
import { Gamepad2, Sparkles, Play, Clock, ChevronRight } from 'lucide-react';

interface CincauPlayGameHubProps {
  games: EducationalGame[];
  onSelectGame: (game: EducationalGame) => void;
}

export const CincauPlayGameHub: React.FC<CincauPlayGameHubProps> = ({
  games,
  onSelectGame,
}) => {
  const [filterType, setFilterType] = useState<'all' | '2d' | '3d'>('all');

  const filteredGames = games.filter((g) => {
    if (filterType === 'all') return true;
    return g.type === filterType;
  });

  return (
    <div className="w-full flex flex-col mt-3 mb-6 select-none">
      {/* Title & Filter Tabs */}
      <div className="flex items-center justify-between mb-2 px-0.5">
        <span className="text-xs font-extrabold text-neutral-800 tracking-tight flex items-center gap-1.5">
          <span>Rekomendasi Game Edukatif</span>
          <Gamepad2 className="w-3.5 h-3.5 text-violet-600" />
        </span>
        <span className="text-[10px] font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-full border border-violet-200">
          Asah Kognitif ✨
        </span>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 mb-3">
        {[
          { id: 'all', label: 'Semua (5 Game)' },
          { id: '2d', label: '🎮 Game 2D Ringan' },
          { id: '3d', label: '🌐 Game 3D Spasial' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterType(f.id as any)}
            className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filterType === f.id
                ? 'bg-neutral-900 text-white shadow-2xs'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 border border-neutral-200/80'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Games List */}
      <div className="space-y-3">
        {filteredGames.map((game) => (
          <motion.div
            key={game.id}
            whileHover={{ scale: 1.01 }}
            onClick={() => onSelectGame(game)}
            className="w-full bg-white rounded-2xl p-3.5 border border-neutral-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col group"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${game.gradient} text-white flex items-center justify-center shrink-0 shadow-xs`}
                >
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span
                      className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-sm ${
                        game.type === '3d'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {game.type.toUpperCase()}
                    </span>
                    <span className="text-[11px] text-neutral-400 font-medium">{game.category}</span>
                  </div>
                  <h4 className="font-bold text-sm text-neutral-900 leading-tight group-hover:text-violet-600 transition-colors">
                    {game.title}
                  </h4>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[10px] text-neutral-400 font-medium shrink-0">
                <Clock className="w-3 h-3" />
                <span>{game.recommendedDuration}</span>
              </div>
            </div>

            <p className="text-[11px] text-neutral-500 leading-relaxed mb-3">
              {game.description}
            </p>

            {/* Bottom skills and play trigger */}
            <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
              <div className="flex flex-wrap gap-1">
                {game.skills.slice(0, 2).map((s, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-medium bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-md"
                  >
                    {s}
                  </span>
                ))}
              </div>

              <button className="px-3 py-1 rounded-xl bg-neutral-900 group-hover:bg-violet-700 text-white font-bold text-xs flex items-center gap-1 transition-colors">
                <Play className="w-3 h-3 fill-white" />
                <span>Mainkan</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
