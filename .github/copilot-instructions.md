# AI Agent Output Directives 
- **Be concise**: Skip pleasantries, apologies, and concluding remarks. Output direct, actionable answers.
- **Token efficiency**: Provide only the minimal code necessary to accomplish the task. Do not rewrite entire files if a simple snippet and instructions suffice unless specifically requested.
- **Avoid redundancy**: Do not explain obvious standard library concepts unless asked.

# Workspace Tech Stack
- Frontend: **React 19**, **TypeScript**
- Build Tool: **Vite**
- Styling: **Tailwind CSS** (v3.4)
- State Management: **Zustand** (with `persist` middleware for `localStorage`)
- Drag & Drop: **@dnd-kit** (`core`, `sortable`, `utilities`)

# Project Architecture Rules
- Use functional components with hooks.
- Use absolute/relative percentage-based CSS for timeline horizontal scaling, not fixed pixels.
- Use `useEffect` sparsely; prefer standard derived state or Zustand store actions where capable.
- Data structures (`types/timeline.ts`) use milliseconds (`startMs`, `endMs`) for numerical scaling logic.
