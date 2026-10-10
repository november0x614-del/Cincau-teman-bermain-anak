import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DailyMission } from '../types';
import { X, CheckCircle, Award, Sparkles, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CincauMissionQuizModalProps {
  mission: DailyMission;
  onClose: () => void;
  onComplete: (missionId: string, earnedFood: number, earnedStars: number) => void;
}

export const CincauMissionQuizModal: React.FC<CincauMissionQuizModalProps> = ({
  mission,
  onClose,
  onComplete,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const question = mission.questions[currentQuestionIndex];
  const totalQuestions = mission.questions.length;

  const handleSelectOption = (index: number) => {
    if (isAnswerChecked) return;
    setSelectedOption(index);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    const correct = selectedOption === question.correctIndex;
    setIsCorrect(correct);
    setIsAnswerChecked(true);

    if (correct) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex + 1 < totalQuestions) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerChecked(false);
    } else {
      setQuizFinished(true);
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.5 },
      });
    }
  };

  const handleClaimReward = () => {
    onComplete(mission.id, mission.rewardFood, mission.rewardStars);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-neutral-100 flex flex-col overflow-hidden text-neutral-900"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              {mission.badge}
            </span>
            <span className="text-xs text-neutral-500 font-medium">{mission.subject}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {!quizFinished ? (
            <motion.div
              key={`q-${currentQuestionIndex}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col"
            >
              {/* Progress bar */}
              <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden mb-4">
                <div
                  className="bg-emerald-500 h-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                />
              </div>

              <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">
                Soal {currentQuestionIndex + 1} dari {totalQuestions}
              </div>

              <h3 className="text-base font-bold text-neutral-900 leading-snug mb-4">
                {question.question}
              </h3>

              {/* Options */}
              <div className="space-y-2 mb-4">
                {question.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isThisCorrect = question.correctIndex === idx;

                  let btnStyle = 'bg-neutral-50 border-neutral-200 text-neutral-800 hover:bg-neutral-100';

                  if (isAnswerChecked) {
                    if (isThisCorrect) {
                      btnStyle = 'bg-emerald-500 text-white border-emerald-600 shadow-sm';
                    } else if (isSelected) {
                      btnStyle = 'bg-rose-100 text-rose-800 border-rose-300';
                    } else {
                      btnStyle = 'bg-neutral-50 text-neutral-400 border-neutral-200 opacity-60';
                    }
                  } else if (isSelected) {
                    btnStyle = 'bg-neutral-900 text-white border-neutral-900 shadow-xs';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswerChecked}
                      className={`w-full text-left p-3 rounded-2xl border text-sm font-semibold transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {isAnswerChecked && isThisCorrect && (
                        <CheckCircle className="w-4 h-4 text-white shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback explanation if checked */}
              {isAnswerChecked && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-2xl mb-4 text-xs font-medium ${
                    isCorrect ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}
                >
                  <div className="font-bold mb-0.5">{isCorrect ? '✨ Jawabanmu Benar!' : '💡 Pembahasan:'}</div>
                  <div>{question.explanation}</div>
                </motion.div>
              )}

              {/* Action Button */}
              <div className="mt-2">
                {!isAnswerChecked ? (
                  <button
                    onClick={handleCheckAnswer}
                    disabled={selectedOption === null}
                    className={`w-full py-3 rounded-2xl font-bold text-sm transition-all shadow-md cursor-pointer ${
                      selectedOption !== null
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/25'
                        : 'bg-neutral-200 text-neutral-400 cursor-not-allowed shadow-none'
                    }`}
                  >
                    Periksa Jawaban
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="w-full py-3 rounded-2xl bg-neutral-900 hover:bg-black text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{currentQuestionIndex + 1 < totalQuestions ? 'Soal Berikutnya' : 'Selesaikan Misi'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="celebration"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center py-4"
            >
              <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center mb-3 shadow-inner">
                <Award className="w-9 h-9 stroke-[2.2]" />
              </div>

              <h3 className="text-xl font-extrabold text-neutral-900 mb-1">
                Luar Biasa, Berhasil! 🎉
              </h3>
              <p className="text-xs text-neutral-600 max-w-xs mb-5">
                Kamu telah menuntaskan misi <strong>{mission.title}</strong>! Cincau bangga sekali padamu!
              </p>

              {/* Reward Pills */}
              <div className="w-full bg-neutral-50 rounded-2xl p-3 border border-neutral-200/80 mb-5 flex items-center justify-around">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🥣</span>
                  <div className="text-left">
                    <div className="text-[10px] text-neutral-500 font-bold uppercase">Makanan Cincau</div>
                    <div className="text-sm font-extrabold text-emerald-600">+{mission.rewardFood} Mangkuk</div>
                  </div>
                </div>

                <div className="h-8 w-px bg-neutral-200" />

                <div className="flex items-center gap-2">
                  <span className="text-2xl">⭐</span>
                  <div className="text-left">
                    <div className="text-[10px] text-neutral-500 font-bold uppercase">Bintang Prestasi</div>
                    <div className="text-sm font-extrabold text-amber-500">+{mission.rewardStars} Bintang</div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleClaimReward}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 fill-white" />
                <span>Klaim Hadiah & Beri Makan Cincau</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
