# Implementation Plan - Simplified Sliding 2D World with Contextual Navigation

## Overview
We will implement a unified "Side-Scrolling World" where navigation is driven by direct button actions instead of physical door interactions. Cincau remains the persistent guide in the foreground.

### 1. Foreground Layer: Persistent Mascot
- **Fixed Position & Size**: Cincau remains rendered at the top level of `App.tsx`. Its position and scale do not change during transitions.
- **The Bounce**: Cincau will perform a quick spring-based `y-offset` jump whenever the view changes, signaling a travel event.

### 2. Background Layer: The Sliding World Container
- All habitat environments and their corresponding UI (text, buttons, cards) will be children of a single horizontal container in `App.tsx`.
- **Sliding Mechanic**: Animating the container's `x` position will move the entire "world" behind Cincau.
- **Habitats (Detailed SVG Illustrations)**:
    - **Dunia 0 (Onboarding)**: Soft clouds and floating jelly-bits.
    - **Dunia 1 (Rumah Cincau)**: A giant **Crystal Bowl** interior featuring a leaf-study desk and glowing star shelves (combined living/study space).
    - **Dunia 2 (Luar Ruangan)**: A lush **Tropical Jungle** with giant leaves, sunbeams, and mini-game portals.

### 3. Contextual Navigation (Button-Driven)
Navigation will be managed by a primary action button that updates based on the current world:
- **Di Onboarding**: Tombol "Pergi ke rumah" -> Slides to Dunia 1.
- **Di Rumah Cincau**: Tombol "Pergi ke luar ruangan" -> Slides to Dunia 2.
- **Di Luar Ruangan**: Tombol "Kembali ke rumah" -> Slides to Dunia 1.

---

## Technical Strategy

### 1. Unified Background Component
- Create `HabitatWorlds.tsx` containing the SVG illustrations for the Home and Outdoor environments.

### 2. Global State Management
- `App.tsx` will track `viewIndex` (0: Onboarding, 1: Home, 2: Outdoor).
- The mascot state (emotion, look target) will be managed at the top level to ensure no resets during world slides.

### 3. Layout Integration
- The current `MainNotesView` and `OnboardingView` logic will be integrated into the sliding panels so that their respective content moves with their backgrounds.

---

## Verification Plan
1. **Mascot Persistence**: Verify Cincau stays fixed in the same spot and size while the world slides.
2. **Contextual Buttons**: Verify the button text changes correctly ("Pergi ke rumah" vs "Pergi ke luar ruangan").
3. **Synchronized Slide**: Background SVGs and UI elements must move as a single unit.
4. **Transition Bounce**: Confirm Cincau's jump animation occurs on every slide.
5. **Visual Quality**: Verify that the Crystal Bowl and Tropical Jungle SVGs are rendered clearly.
