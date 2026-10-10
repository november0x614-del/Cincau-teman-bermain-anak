import React from 'react';

export const OnboardingBackground: React.FC = () => (
  <div className="absolute inset-0 bg-linear-to-b from-sky-50 via-white to-white overflow-hidden">
    {/* Floating clouds/blobs */}
    <div className="absolute top-20 -left-10 w-40 h-40 bg-sky-100/50 rounded-full blur-3xl animate-pulse" />
    <div className="absolute top-40 -right-10 w-60 h-60 bg-indigo-50/50 rounded-full blur-3xl" />
    <div className="absolute bottom-20 left-1/4 w-32 h-32 bg-sky-50/80 rounded-full blur-2xl" />
  </div>
);

export const HomeBackground: React.FC = () => (
  <div className="absolute inset-0 bg-amber-50 overflow-hidden">
    {/* Giant Crystal Bowl SVG */}
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 430 880" fill="none" preserveAspectRatio="xMidYMid slice">
      {/* Bowl background base */}
      <rect width="430" height="880" fill="#fffbeb" />
      
      {/* Bowl Rim */}
      <path d="M-50 420 Q 215 370 480 420" stroke="#fde68a" strokeWidth="12" strokeLinecap="round" opacity="0.6" />
      
      {/* Honey Glow Lamp */}
      <circle cx="350" cy="150" r="100" fill="url(#honeyGlow)" opacity="0.5" />
      <defs>
        <radialGradient id="honeyGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(350 150) rotate(90) scale(100)">
          <stop stopColor="#fbbf24" />
          <stop offset="1" stopColor="#fbbf24" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Leaf Study Desk Detail */}
      <g transform="translate(40, 520) scale(0.9)">
        <path d="M0 40 Q 150 0 300 40 Q 300 120 150 160 Q 0 120 0 40Z" fill="#34d399" fillOpacity="0.2" stroke="#059669" strokeWidth="3" />
        <path d="M40 60 L 140 60 M 40 85 L 120 85" stroke="#059669" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
      </g>

      {/* Star Trophy Shelf */}
      <g transform="translate(280, 480)">
        <rect x="0" y="0" width="120" height="6" rx="3" fill="#9ca3af" opacity="0.6" />
        <path d="M40 -20 L 45 -10 L 55 -10 L 47 -2 L 50 8 L 40 2 L 30 8 L 33 -2 L 25 -10 L 35 -10 Z" fill="#f59e0b" opacity="0.8" />
        <path d="M80 -25 L 85 -15 L 95 -15 L 87 -7 L 90 3 L 80 -3 L 70 3 L 73 -7 L 65 -15 L 75 -15 Z" fill="#f59e0b" opacity="0.6" />
      </g>
    </svg>
    
    <div className="absolute top-0 left-0 w-full h-1/2 bg-radial-[at_50%_0%] from-amber-200/20 to-transparent pointer-events-none" />
  </div>
);

export const OutdoorBackground: React.FC = () => (
  <div className="absolute inset-0 bg-emerald-50 overflow-hidden">
    {/* Tropical Jungle SVG */}
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 430 880" fill="none" preserveAspectRatio="xMidYMid slice">
      <rect width="430" height="880" fill="#f0fdf4" />
      
      {/* Sunlight Beams */}
      <path d="M-100 -50 L 250 880" stroke="white" strokeWidth="150" strokeOpacity="0.1" />
      <path d="M150 -50 L 500 880" stroke="white" strokeWidth="100" strokeOpacity="0.08" />

      {/* Giant Fern Leaves */}
      <g transform="translate(-60, 120) rotate(-10)">
        <path d="M0 0 Q 180 -60 350 120 M 0 0 Q 180 60 350 120" fill="#10b981" fillOpacity="0.15" stroke="#047857" strokeWidth="1" />
        <path d="M0 0 L 350 120" stroke="#047857" strokeWidth="2" strokeOpacity="0.3" />
      </g>

      <g transform="translate(220, 250) rotate(5) scale(1.3)">
        <path d="M0 0 Q 140 -90 280 60 M 0 0 Q 140 30 280 60" fill="#34d399" fillOpacity="0.12" stroke="#065f46" strokeWidth="1" />
        <path d="M0 0 L 280 60" stroke="#065f46" strokeWidth="2" strokeOpacity="0.3" />
      </g>
    </svg>
    
    <div className="absolute bottom-0 left-0 w-full h-1/3 bg-radial-[at_50%_100%] from-emerald-200/30 to-transparent pointer-events-none" />
  </div>
);
