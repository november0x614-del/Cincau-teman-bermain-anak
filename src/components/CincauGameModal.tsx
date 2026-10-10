import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EducationalGame } from '../types';
import { X, Play, RotateCcw, Sparkles, Trophy, ArrowLeft, Heart, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CincauGameModalProps {
  game: EducationalGame;
  onClose: () => void;
  onGameWin?: (starsEarned: number) => void;
}

export const CincauGameModal: React.FC<CincauGameModalProps> = ({
  game,
  onClose,
  onGameWin,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);

  // States for 2D Word Scramble Game ("Petualangan Kata Nusantara")
  const wordTargets = [
    { target: 'KOMODO', syllables: ['KO', 'MO', 'DO'], hint: 'Kadal purba Nusa Tenggara Timur' },
    { target: 'MANGGA', syllables: ['MANG', 'GA'], hint: 'Buah manis harum khas Nusantara' },
    { target: 'ORANGUTAN', syllables: ['O', 'RANG', 'U', 'TAN'], hint: 'Primata cerdas hutan Kalimantan' },
  ];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [selectedSyllables, setSelectedSyllables] = useState<string[]>([]);
  const [shuffledSyllables, setShuffledSyllables] = useState<string[]>([]);

  // Setup Word Scramble
  useEffect(() => {
    if (game.id === 'game-2d-kata') {
      const active = wordTargets[currentWordIndex];
      const randomized = [...active.syllables].sort(() => Math.random() - 0.5);
      setShuffledSyllables(randomized);
      setSelectedSyllables([]);
    }
  }, [currentWordIndex, game.id]);

  const handleSyllableClick = (syllable: string, index: number) => {
    const nextSelected = [...selectedSyllables, syllable];
    setSelectedSyllables(nextSelected);

    const active = wordTargets[currentWordIndex];
    if (nextSelected.length === active.syllables.length) {
      if (nextSelected.join('') === active.target) {
        confetti({ particleCount: 30, spread: 50 });
        setScore((prev) => prev + 10);
        if (currentWordIndex + 1 < wordTargets.length) {
          setTimeout(() => {
            setCurrentWordIndex((prev) => prev + 1);
          }, 600);
        } else {
          setTimeout(() => {
            setGameCompleted(true);
            onGameWin?.(15);
            confetti({ particleCount: 80, spread: 70 });
          }, 600);
        }
      } else {
        // wrong sequence, reset
        setTimeout(() => {
          setSelectedSyllables([]);
        }, 500);
      }
    }
  };

  // States for 2D Fruit Catch Game ("Tangkap Buah Sehat")
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [basketX, setBasketX] = useState(150);
  const [lives, setLives] = useState(3);

  useEffect(() => {
    if (!isPlaying || game.id !== 'game-2d-buah' || gameCompleted) return;

    let animationFrameId: number;
    let fruits: { x: number; y: number; speed: number; isHealthy: boolean; icon: string }[] = [];
    let frameCount = 0;
    const fruitIcons = ['🥭', '🍌', '🍉', '🍎'];
    const junkIcons = ['🥤', '🍟', '🥫'];

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameLoop = () => {
      frameCount++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn falling fruit every 50 frames
      if (frameCount % 45 === 0) {
        const isHealthy = Math.random() > 0.25;
        const icon = isHealthy
          ? fruitIcons[Math.floor(Math.random() * fruitIcons.length)]
          : junkIcons[Math.floor(Math.random() * junkIcons.length)];
        fruits.push({
          x: Math.random() * (canvas.width - 30) + 15,
          y: -20,
          speed: 2 + Math.random() * 2,
          isHealthy,
          icon,
        });
      }

      // Draw and update fruits
      for (let i = fruits.length - 1; i >= 0; i--) {
        const f = fruits[i];
        f.y += f.speed;

        ctx.font = '24px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(f.icon, f.x, f.y);

        // Check collision with Cincau's basket
        if (f.y >= canvas.height - 45 && f.y <= canvas.height - 15) {
          if (Math.abs(f.x - basketX) < 35) {
            if (f.isHealthy) {
              setScore((s) => {
                const newScore = s + 5;
                if (newScore >= 50) {
                  setGameCompleted(true);
                  onGameWin?.(20);
                  confetti({ particleCount: 70, spread: 70 });
                }
                return newScore;
              });
            } else {
              setLives((l) => {
                const nextLives = Math.max(0, l - 1);
                if (nextLives === 0) {
                  setGameCompleted(true);
                }
                return nextLives;
              });
            }
            fruits.splice(i, 1);
            continue;
          }
        }

        // Offscreen removal
        if (f.y > canvas.height + 20) {
          fruits.splice(i, 1);
        }
      }

      // Draw Cincau jelly basket
      ctx.fillStyle = '#00e5ff';
      ctx.beginPath();
      ctx.roundRect(basketX - 35, canvas.height - 35, 70, 24, [12, 12, 6, 6]);
      ctx.fill();
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Cincau eyes on basket
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(basketX - 12, canvas.height - 23, 3, 0, Math.PI * 2);
      ctx.arc(basketX + 12, canvas.height - 23, 3, 0, Math.PI * 2);
      ctx.fill();

      if (!gameCompleted) {
        animationFrameId = requestAnimationFrame(gameLoop);
      }
    };

    animationFrameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, game.id, basketX, gameCompleted]);

  // States for 3D Island Explorer ("Taman Bermain 3D Cincau")
  const canvas3DRef = useRef<HTMLCanvasElement | null>(null);
  const [cincauPos, setCincauPos] = useState({ x: 0, y: 0, angle: 0 });

  useEffect(() => {
    if (!isPlaying || game.id !== 'game-3d-taman' || gameCompleted) return;

    let animId: number;
    let tick = 0;
    const canvas = canvas3DRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render3D = () => {
      tick += 0.02;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2 + 30;

      // Draw isometric tropical island platform
      const islandWidth = 140;
      const islandHeight = 65;

      // Island base / depth
      ctx.fillStyle = '#047857';
      ctx.beginPath();
      ctx.ellipse(cx, cy + 25, islandWidth, islandHeight, 0, 0, Math.PI * 2);
      ctx.fill();

      // Island cliff sides
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.ellipse(cx, cy + 38, islandWidth - 10, islandHeight - 10, 0, 0, Math.PI * 2);
      ctx.fill();

      // Island grass top
      const grassGrad = ctx.createLinearGradient(cx, cy - 40, cx, cy + 40);
      grassGrad.addColorStop(0, '#34d399');
      grassGrad.addColorStop(1, '#10b981');
      ctx.fillStyle = grassGrad;
      ctx.beginPath();
      ctx.ellipse(cx, cy, islandWidth, islandHeight, 0, 0, Math.PI * 2);
      ctx.fill();

      // Draw island decorations (tropical palm & flowers)
      ctx.fillStyle = '#059669';
      ctx.beginPath();
      ctx.arc(cx - 70, cy - 20, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(cx + 60, cy - 10, 8, 0, Math.PI * 2);
      ctx.fill();

      // Star crystals on island to collect
      const starX = cx + Math.cos(tick * 0.7) * 50;
      const starY = cy + Math.sin(tick * 0.7) * 20 - 15;
      ctx.font = '20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('⭐', starX, starY);

      // Cincau 3D Rolling Sphere
      const ballX = cx + cincauPos.x;
      const ballY = cy + cincauPos.y - 20;

      // Sphere shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
      ctx.beginPath();
      ctx.ellipse(ballX, cy + cincauPos.y + 6, 22, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      // 3D Jelly Sphere gradient
      const sphereGrad = ctx.createRadialGradient(
        ballX - 7,
        ballY - 7,
        2,
        ballX,
        ballY,
        24
      );
      sphereGrad.addColorStop(0, '#e0f2fe');
      sphereGrad.addColorStop(0.3, '#38bdf8');
      sphereGrad.addColorStop(0.8, '#0284c7');
      sphereGrad.addColorStop(1, '#0369a1');

      ctx.fillStyle = sphereGrad;
      ctx.beginPath();
      ctx.arc(ballX, ballY, 22, 0, Math.PI * 2);
      ctx.fill();

      // Cute face on 3D Cincau
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(ballX - 6, ballY - 2, 2.5, 0, Math.PI * 2);
      ctx.arc(ballX + 6, ballY - 2, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Smile
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(ballX, ballY + 4, 4, 0, Math.PI);
      ctx.stroke();

      // Check distance to star
      const dist = Math.hypot(ballX - starX, ballY - starY);
      if (dist < 26) {
        setScore((s) => {
          const next = s + 10;
          confetti({ particleCount: 25, spread: 45 });
          if (next >= 40) {
            setGameCompleted(true);
            onGameWin?.(25);
          }
          return next;
        });
      }

      if (!gameCompleted) {
        animId = requestAnimationFrame(render3D);
      }
    };

    animId = requestAnimationFrame(render3D);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, game.id, cincauPos, gameCompleted]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-neutral-900/65 backdrop-blur-xs select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-neutral-100 flex flex-col overflow-hidden text-neutral-900"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                game.type === '3d'
                  ? 'bg-purple-100 text-purple-700 border border-purple-200'
                  : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
              }`}
            >
              {game.badge}
            </span>
            <span className="text-xs text-neutral-500 font-medium">{game.category}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content before play or during play */}
        {!isPlaying ? (
          <div className="flex flex-col items-center text-center py-2">
            <div
              className={`w-20 h-20 rounded-3xl bg-gradient-to-tr ${game.gradient} text-white flex items-center justify-center mb-4 shadow-lg shadow-black/10`}
            >
              <Sparkles className="w-10 h-10 stroke-[2.2]" />
            </div>

            <h3 className="text-xl font-extrabold text-neutral-900 mb-1.5">{game.title}</h3>
            <p className="text-xs text-neutral-600 leading-relaxed mb-4 max-w-xs">
              {game.description}
            </p>

            {/* Skills trained */}
            <div className="w-full bg-neutral-50 rounded-2xl p-3 border border-neutral-200/70 mb-5">
              <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2 text-left">
                Aspek Kognitif yang Dilatih:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {game.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-semibold bg-white border border-neutral-200 text-neutral-700 px-2 py-0.5 rounded-lg"
                  >
                    ✨ {skill}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setIsPlaying(true);
                setScore(0);
                setLives(3);
                setGameCompleted(false);
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 text-white font-extrabold text-sm shadow-md shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Mulai Mainkan Sekarang</span>
            </button>
          </div>
        ) : gameCompleted ? (
          <div className="flex flex-col items-center text-center py-4">
            <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center mb-3">
              <Trophy className="w-9 h-9 stroke-[2.2]" />
            </div>

            <h3 className="text-xl font-extrabold text-neutral-900 mb-1">Permainan Selesai! 🎉</h3>
            <p className="text-xs text-neutral-600 mb-4">
              Hebat! Kamu berhasil mengumpulkan skor <strong>{score}</strong> di {game.title}!
            </p>

            <div className="w-full bg-neutral-50 rounded-2xl p-3 border border-neutral-200 mb-5 flex items-center justify-center gap-3">
              <span className="text-2xl">⭐</span>
              <div className="text-left">
                <div className="text-[10px] text-neutral-500 font-bold uppercase">Bintang Diraih</div>
                <div className="text-base font-extrabold text-amber-600">+15 Bintang</div>
              </div>
            </div>

            <div className="flex gap-2 w-full">
              <button
                onClick={() => {
                  setScore(0);
                  setLives(3);
                  setCurrentWordIndex(0);
                  setGameCompleted(false);
                }}
                className="flex-1 py-3 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Main Lagi</span>
              </button>

              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-2xl bg-neutral-900 hover:bg-black text-white font-bold text-xs cursor-pointer"
              >
                Kembali ke Beranda
              </button>
            </div>
          </div>
        ) : (
          /* ACTIVE GAME PLAYGROUND */
          <div className="flex flex-col items-center">
            {/* Game Sub-Header */}
            <div className="w-full flex items-center justify-between text-xs font-bold text-neutral-600 mb-2.5">
              <span>Skor: <strong className="text-emerald-600 font-extrabold">{score}</strong></span>
              {game.id === 'game-2d-buah' && (
                <div className="flex items-center gap-1 text-rose-500">
                  {Array.from({ length: lives }).map((_, i) => (
                    <Heart key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
              )}
              {game.id === 'game-2d-kata' && (
                <span className="text-neutral-400">Kata {currentWordIndex + 1}/3</span>
              )}
            </div>

            {/* 1. GAME 2D KATA NUSANTARA */}
            {game.id === 'game-2d-kata' && (
              <div className="w-full flex flex-col items-center py-2">
                <div className="text-xs text-neutral-500 font-medium mb-3 italic">
                  💡 Hint: {wordTargets[currentWordIndex].hint}
                </div>

                {/* Slots */}
                <div className="flex items-center gap-2 mb-6">
                  {wordTargets[currentWordIndex].syllables.map((_, i) => {
                    const filled = selectedSyllables[i];
                    return (
                      <div
                        key={i}
                        className={`w-14 h-12 rounded-2xl border-2 flex items-center justify-center font-extrabold text-base transition-all ${
                          filled
                            ? 'bg-emerald-500 border-emerald-600 text-white shadow-xs'
                            : 'border-dashed border-neutral-300 bg-neutral-50 text-neutral-400'
                        }`}
                      >
                        {filled || '?'}
                      </div>
                    );
                  })}
                </div>

                <div className="text-[11px] font-bold text-neutral-400 mb-2 uppercase">
                  Pilih Suku Kata (Daun Teratai):
                </div>

                {/* Shuffled options */}
                <div className="flex flex-wrap items-center justify-center gap-2.5 mb-6">
                  {shuffledSyllables.map((syllable, idx) => {
                    const isUsed = selectedSyllables.includes(syllable);
                    return (
                      <button
                        key={idx}
                        disabled={isUsed}
                        onClick={() => handleSyllableClick(syllable, idx)}
                        className={`px-4 py-2.5 rounded-2xl font-extrabold text-sm border transition-all cursor-pointer ${
                          isUsed
                            ? 'bg-neutral-100 text-neutral-300 border-neutral-200 cursor-not-allowed'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100 active:scale-95 shadow-2xs'
                        }`}
                      >
                        🍃 {syllable}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setSelectedSyllables([])}
                  className="text-xs text-neutral-500 hover:text-neutral-800 underline cursor-pointer"
                >
                  Ulangi Suku Kata
                </button>
              </div>
            )}

            {/* 2. GAME 2D TANGKAP BUAH SEHAT */}
            {game.id === 'game-2d-buah' && (
              <div className="w-full flex flex-col items-center">
                <canvas
                  ref={canvasRef}
                  width={300}
                  height={220}
                  className="w-full bg-gradient-to-b from-sky-50 to-blue-100/60 rounded-2xl border border-sky-200/80 mb-3 touch-none"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width) * 300;
                    setBasketX(Math.max(35, Math.min(265, x)));
                  }}
                  onTouchMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const touch = e.touches[0];
                    const x = ((touch.clientX - rect.left) / rect.width) * 300;
                    setBasketX(Math.max(35, Math.min(265, x)));
                  }}
                />

                <div className="text-[11px] text-neutral-500 font-medium text-center">
                  Geser keranjang Cincau ke kiri/kanan untuk menangkap buah 🥭🍉🍌 & hindari sampah!
                </div>
              </div>
            )}

            {/* 3. GAME 3D TAMAN BERMAIN CINCAU */}
            {game.id === 'game-3d-taman' && (
              <div className="w-full flex flex-col items-center">
                <canvas
                  ref={canvas3DRef}
                  width={300}
                  height={220}
                  className="w-full bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 rounded-2xl border border-indigo-800/80 mb-3 touch-none shadow-inner"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = (((e.clientX - rect.left) / rect.width) - 0.5) * 160;
                    const y = (((e.clientY - rect.top) / rect.height) - 0.5) * 80;
                    setCincauPos({ x, y, angle: x * 0.05 });
                  }}
                  onTouchMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const touch = e.touches[0];
                    const x = (((touch.clientX - rect.left) / rect.width) - 0.5) * 160;
                    const y = (((touch.clientY - rect.top) / rect.height) - 0.5) * 80;
                    setCincauPos({ x, y, angle: x * 0.05 });
                  }}
                />

                <div className="text-[11px] text-neutral-500 font-medium text-center">
                  Sentuh dan gelindingkan Cincau 3D mengelilingi pulau untuk mengambil kristal bintang ⭐!
                </div>
              </div>
            )}

            {/* Fallback for other game types (Lab & Math) */}
            {game.id !== 'game-2d-kata' && game.id !== 'game-2d-buah' && game.id !== 'game-3d-taman' && (
              <div className="py-8 text-center text-neutral-500 text-xs">
                <div className="text-3xl mb-2">🎮</div>
                <div className="font-bold text-sm text-neutral-800 mb-1">{game.title}</div>
                <div>Simulasi interaktif sedang disiapkan untuk petualangan Cincau berikutnya!</div>
                <button
                  onClick={() => {
                    setScore(30);
                    setGameCompleted(true);
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-neutral-900 text-white font-bold text-xs"
                >
                  Selesaikan Coba Main
                </button>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};
