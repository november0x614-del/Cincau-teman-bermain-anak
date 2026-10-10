export type CharviEmotion = 
  | 'idle' 
  | 'happy' 
  | 'bored' 
  | 'sad' 
  | 'angry' 
  | 'excited' 
  | 'thinking' 
  | 'confused' 
  | 'encouraging' 
  | 'listening' 
  | 'talking' 
  | 'annoyed' 
  | 'pouty';

export type CincauEmotion = CharviEmotion;

export type AppView = 'onboarding' | 'living-room' | 'bedroom' | 'outdoor' | 'home';

export type MascotTheme = 'cyan-jelly' | 'classic-orange' | 'emerald-mint' | 'berry-purple' | 'sunny-banana';

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  isPinned?: boolean;
  category: 'notes' | 'archived';
  checklist?: ChecklistItem[];
}

export interface LookTarget {
  x: number; // -1 (left) to 1 (right)
  y: number; // -1 (up) to 1 (down)
}

export type KurikulumPhase = 'Fase A' | 'Fase B' | 'Fase C';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface DailyMission {
  id: string;
  title: string;
  subject: string;
  phase: KurikulumPhase;
  description: string;
  badge: string;
  rewardFood: number;
  rewardStars: number;
  questions: QuizQuestion[];
  isCompleted?: boolean;
}

export interface EducationalGame {
  id: string;
  title: string;
  type: '2d' | '3d';
  category: string;
  description: string;
  badge: string;
  skills: string[];
  gradient: string;
  recommendedDuration: string;
}

export interface TamagotchiState {
  energy: number; // 0 to 100
  foodStock: number; // earned through learning missions
  starPoints: number; // stars collected
  lastFedTimestamp: number;
  simulatedDaysNeglected: number; // for interactive simulation toggle
}
