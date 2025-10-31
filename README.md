# Horse Racing Game

Latest delployment: https://horse-racing-hame-4yumxaq1d-hanus-kostiantyns-projects.vercel.app/

Vue 3 + TypeScript horse racing game

## Features

- **20 unique horses** with individual names, colors, and condition scores
- **6 race rounds** with increasing distances (1200m - 2200m)
- **Real-time race animation** with condition-based performance
- **Live results tracking** for each completed race
- **UI** with Tailwind CSS

## Tech Stack

- **Vue 3** with Composition API
- **TypeScript** with strict mode
- **Vuex 4** for state management
- **Tailwind CSS** for styling
- **Vite** for fast development
- **Vitest** for unit testing
- **Playwright** for E2E testing
- **ESLint**

## Installation

```bash
# Install dependencies
pnpm install

# Start development server (http://localhost:5173)
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Testing

```bash
# Run unit tests (15 tests)
pnpm test:unit

# Run E2E tests (8 tests)
pnpm test:e2e

# Run all tests
pnpm test

# Type checking
pnpm type-check

```

## How to Play

1. **Generate Program** - Creates 20 horses and schedules 6 races (10 random horses per race)
2. **Start Race** - Click to begin the current race
3. **Watch** - Horses race across the track based on their condition scores
4. **View Results** - See finishing order in the Results panel
5. **Next Race** - Click to proceed to the next round (after race completes)
6. **Regenerate** - Start a new tournament after all 6 races complete

## Architecture

Built with **Feature-Sliced Design (FSD)** for scalability and maintainability:

```
src/
├── app/              # Application setup
├── pages/            # Page components
├── widgets/          # Complex UI blocks (HorsePanel, RaceTrack, etc.)
├── features/         # User actions (generate-races, control-race)
├── entities/         # Business logic (Horse, Race)
└── shared/           # Utilities, constants, store
```

### Key Patterns

- **Dependency Injection** - Testable services with mock support
- **Factory Pattern** - HorseFactory, RaceFactory for entity creation
- **Service Layer** - RaceService for business logic
- **Type Safety** - Strict TypeScript throughout

## Race Logic

- **Speed Formula**: Base speed × (condition/100) + random variation
- **Animation**: Smooth 60fps using `requestAnimationFrame`
- **Distances**: 1200m, 1400m, 1600m, 1800m, 2000m, 2200m

## Project Structure

See [TESTING.md](./TESTING.md) for testing documentation.

---

Built with Vue 3 and TypeScript.
