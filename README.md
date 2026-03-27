# TimeLineDraw

Interactive timeline editor built with React + TypeScript.

## What it does

- Create and reorder **flows** (rows)
- Add, move, resize, edit, and delete **events** in each flow
- Prevent overlapping events inside the same flow
- Configure timeline max duration and zoom scale
- Export/import timeline JSON data
- Persist timeline state in `localStorage`
- Undo and redo changes
- Clear all flows and events at once

## Tech stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- Zustand (`persist` middleware), along with `zundo` for Undo/Redo tracking
- `@dnd-kit` for drag and sort interactions

## Project structure

- `src/store/timelineStore.ts` - global state/actions and persistence
- `src/types/timeline.ts` - core data types (`Flow`, `TimelineEvent`)
- `src/components/` - UI components (controls, timeline, rows, events)
- `src/hooks/useDraggableEvent.ts` - event drag/resize behavior
- `src/utils/` - overlap and drag math helpers

## Data model

All timeline positioning uses milliseconds:

- `startMs`: event start time in ms
- `endMs`: event end time in ms

```ts
interface TimelineEvent {
  id: string;
  flowId: string;
  title: string;
  startMs: number;
  endMs: number;
  color: string;
}
```

## Getting started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Run dev server

```bash
npm run dev
```

Open the URL shown by Vite (typically `http://localhost:5173`).

## Available scripts

```bash
npm run dev      # start local dev server
npm run build    # type-check and build production assets
npm run preview  # preview production build locally
npm run lint     # run ESLint
```

## Usage

1. Add a flow.
2. Add an event to a flow using `startMs` / `endMs`.
3. Drag the event body to move it.
4. Drag left/right event handles to resize.
5. Use Export/Import to save/load timeline JSON.

## Persistence

State is stored under the key `timeline-storage` in browser `localStorage`.

## Build and deploy

Create a production build:

```bash
npm run build
```

Output is generated in `dist/` and can be deployed to any static hosting provider.

## Publish this local repo to GitHub

Example using SSH alias from your setup:

```bash
git remote add origin git@github-personal:Pulimet/TimeLineDraw.git
git push -u origin HEAD
```

If `origin` already exists, update it:

```bash
git remote set-url origin git@github-personal:Pulimet/TimeLineDraw.git
```
