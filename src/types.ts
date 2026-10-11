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

export interface LookTarget {
  x: number; // -1 (left) to 1 (right)
  y: number; // -1 (up) to 1 (down)
}
