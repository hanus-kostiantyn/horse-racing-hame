# Testing Documentation

## Test Structure

### Unit Tests (`src/**/*.test.ts`)

**15 tests across 2 files using Vitest**

#### `horse.test.ts` (5 tests)
- Create horse with generated values
- Use provided parameters
- Create 20 unique horses
- Create specified number of horses
- Throw error when requesting too many horses

#### `race.test.ts` (10 tests)
- Create valid race with correct structure
- Assign correct distance for each round
- Validate round number
- Validate horse count
- Create complete 6-race schedule
- Throw error with insufficient horses
- Initialize positions for all horses
- Update positions based on horse conditions
- Cap position at 100 and mark as finished
- Order horses by position

### E2E Tests (`e2e/*.spec.ts`)

**8 tests across 3 files using Playwright**

#### `01-race-generation.spec.ts` (2 tests)
- Display initial empty state correctly
- Generate complete program with horses and races

#### `02-race-execution.spec.ts` (3 tests)
- Start and complete a race successfully
- Pause and resume race correctly
- Prevent generating new program while racing

#### `03-complete-tournament.spec.ts` (3 tests)
- Complete all 6 races in sequence
- Track race progress correctly in program panel
- Reset tournament when generating new program

## Running Tests

### Unit Tests
```bash
# Run unit tests
pnpm test:unit

# Run in watch mode
pnpm test:unit:watch

# Run with UI
pnpm test:ui

# Run with coverage
pnpm test:coverage
```

### E2E Tests
```bash
# Run E2E tests
pnpm test:e2e 

# Run specific file
pnpm test:e2e e2e/01-race-generation.spec.ts

# Run in headed mode (see browser)
pnpm test:e2e --headed

# Run in debug mode
pnpm test:e2e --debug
```

### Run All Tests
```bash
# Unit tests followed by E2E tests
pnpm test
```





