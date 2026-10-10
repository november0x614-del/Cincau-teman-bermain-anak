/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { OnboardingView } from './components/OnboardingView';
import { MascotTheme } from './types';

export default function App() {
  const [mascotTheme, setMascotTheme] = useState<MascotTheme>('cyan-jelly');

  const themes: MascotTheme[] = ['cyan-jelly', 'classic-orange', 'emerald-mint', 'berry-purple', 'sunny-banana'];
  const toggleMascotTheme = () => {
    setMascotTheme((prev) => {
      const idx = themes.indexOf(prev);
      return themes[(idx + 1) % themes.length];
    });
  };

  return (
    <main className="min-h-screen w-full bg-[#f8f9fb] flex items-center justify-center sm:py-6 sm:px-4">
      {/* Mobile viewport container */}
      <div className="w-full max-w-[430px] min-h-screen sm:min-h-[880px] sm:h-[880px] bg-white sm:rounded-[44px] overflow-hidden sm:shadow-[0_20px_50px_rgba(0,0,0,0.08)] sm:border-[8px] sm:border-neutral-200/90 flex flex-col relative text-neutral-900">
        <OnboardingView
          mascotTheme={mascotTheme}
          onToggleTheme={toggleMascotTheme}
        />
      </div>
    </main>
  );
}
