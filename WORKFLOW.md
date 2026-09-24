# AquaSense Team Workflow & Task Roadmap

**Project**: AquaSense — AI Hydro-Acoustic Leak Detection & Smart Water Grid Intelligence  
**Team Architecture**: 2 Members (Member 1 = Frontend, Member 2 = Backend / AI)  
**Branching Strategy**: Single `main` branch development (all commits land directly on `main`)  
**Status**: All tasks are `[PENDING]` until fully implemented and verified.

---

## 📊 Repository Inspection & Current State

- **Frontend (`/frontend`)**: Built with Next.js 15 App Router, TypeScript, Vanilla CSS + TailwindCSS, Recharts, and Lucide icons. Visual components exist, but **sidebar navigation and tab routing are currently non-functional/broken**, and views are unintegrated with real routing.
- **Backend & AI (`/backend`)**: Pending setup. Needs FastAPI server, database schema, SCADA simulator, hydro-acoustic FFT signal processor, AI leak classifier, and ROI repair optimizer.

---

## 🎨 Member 1: Frontend Development Roadmap

### Task 1: Fix Sidebar Navigation & Core Dashboard View Routing
- **Status**: `[COMPLETED]`
- **Goal**: Fix the non-working sidebar navigation and mobile drawer toggling. Establish robust state/URL routing for switching seamlessly between views (Dashboard Overview, Network GIS Topology, Active Incidents, Sensor Fleet, Flow & Pressure, Repair Queue, NRW Water Loss Reports, System Settings). Ensure all tab clicks update active state, render correct components, and handle responsive mobile menu triggers.
- **Dependencies**: None.
- **Files / Area Involved**:
  - `frontend/app/page.tsx`
  - `frontend/app/components/layout/Sidebar.tsx`
  - `frontend/app/components/layout/Header.tsx`
  - `frontend/app/components/dashboard/*`
  - `frontend/app/components/views/*`
- **Completion Criteria**: Sidebar links respond reliably on desktop and mobile. Navigating between tabs renders the corresponding view without layout shifts or state bugs. Header mobile menu button opens/closes sidebar.
- **Testing / Commit Checkpoint**: Manually click all 8 sidebar navigation items on desktop and mobile viewports. Run `npm run build` cleanly.  
  `git commit -m "fix(frontend): repair sidebar navigation, mobile drawer and view routing"`

---

### Task 2: API Integration Layer & Real-Time Data Connectors
- **Status**: `[COMPLETED]`
- **Goal**: Create modular API service layer (`axios`/`fetch`) and custom React hooks (`useTelemetry`, `useIncidents`, `useSensors`, `useRepairs`) supporting live backend REST endpoints and WebSocket stream data, with smooth fallback to local mock data.
- **Dependencies**: Member 2 Task 2 (REST API & WebSocket endpoints).
- **Files / Area Involved**:
  - `frontend/app/services/api.ts` [NEW]
  - `frontend/app/services/websocket.ts` [NEW]
  - `frontend/app/hooks/useTelemetry.ts` [NEW]
  - `frontend/app/hooks/useIncidents.ts` [NEW]
  - `frontend/app/page.tsx`
- **Completion Criteria**: Dashboard views consume live REST/WS telemetry seamlessly, updating charts, metrics, and incident tables without page reloads.
- **Testing / Commit Checkpoint**: Verify real-time network payload updates in browser developer tools.  
  `git commit -m "feat(frontend): add backend API service integration layer"`

---

### Task 3: Interactive GIS Network Map & Acoustic Audio Spectrum Player
- **Status**: `[COMPLETED]`
- **Goal**: Upgrade `NetworkTopologyMap` with dynamic GIS layer controls (DMA pressure contours, pipe status filters) and build an `AudioSpectrumPlayer` modal to play hydro-acoustic audio files with real-time FFT frequency spectrum visualization.
- **Dependencies**: Member 1 Task 2, Member 2 Task 3 (Acoustic audio stream & FFT API).
- **Files / Area Involved**:
  - `frontend/app/components/dashboard/NetworkTopologyMap.tsx`
  - `frontend/app/components/dashboard/AudioSpectrumPlayer.tsx` [NEW]
  - `frontend/app/components/dashboard/IncidentsList.tsx`
- **Completion Criteria**: Clicking an incident displays the audio spectrum modal with active playback and peak frequency highlight (100Hz–800Hz); map visually highlights leak pipe segment.
- **Testing / Commit Checkpoint**: Test GIS map interaction and audio spectrum playback controls.  
  `git commit -m "feat(frontend): GIS map layers and acoustic spectrum audio player"`

---

### Task 4: Interactive PRV Remote Control & Dispatch Workflow
- **Status**: `[COMPLETED]`
- **Goal**: Connect Pressure Reducing Valve (PRV) setpoint sliders, sensor calibration triggers, and technician crew dispatch forms to backend mutation endpoints, complete with toast notifications and UI state synchronization.
- **Dependencies**: Member 2 Task 4 (Mutation endpoints).
- **Files / Area Involved**:
  - `frontend/app/components/views/FlowPressureView.tsx`
  - `frontend/app/components/dashboard/IncidentsList.tsx`
  - `frontend/app/components/dashboard/RepairPriorityCard.tsx`
  - `frontend/app/components/views/SensorFleetView.tsx`
- **Completion Criteria**: Adjusting PRV sliders sends API updates that reflect immediately on telemetry graphs; dispatching repair crew updates incident status across all dashboard views.
- **Testing / Commit Checkpoint**: Execute dispatch and PRV adjustments, verifying state consistency across tabs.  
  `git commit -m "feat(frontend): PRV remote control & crew dispatch workflow"`

---

### Task 5: UX Polish, Micro-Animations & Hackathon Demo Controls
- **Status**: `[COMPLETED]`
- **Goal**: Add UI micro-animations, refine visual contrast, polish responsive layout styling, and build a top-header "Demo Control Bar" allowing presenters to trigger live events (e.g. "Inject Pipe Burst", "Simulate Repair Verification", "Reset SCADA").
- **Dependencies**: Member 1 Task 4, Member 2 Task 5 (Demo API endpoints).
- **Files / Area Involved**:
  - `frontend/app/components/layout/Header.tsx`
  - `frontend/app/components/dashboard/DemoControlBar.tsx` [NEW]
  - `frontend/app/globals.css`
- **Completion Criteria**: Zero console or build errors, 60fps micro-interactions, and instantaneous presentation scenario triggers.
- **Testing / Commit Checkpoint**: Run production build `npm run build` cleanly.  
  `git commit -m "polish(frontend): micro-interactions, responsive design & demo controls"`

---

## ⚡ Member 2: Backend & AI Development Roadmap

### Task 1: Repository Setup, Database Schema & SCADA Telemetry Simulator
- **Status**: `[COMPLETED]`
- **Goal**: Initialize Python FastAPI service in `/backend`, design database models (SQLAlchemy/SQLModel) for DMA zones, pipe segments, hydrophones, telemetry logs, and incidents, and implement a background 1Hz telemetry stream generator.
- **Dependencies**: None.
- **Files / Area Involved**:
  - `backend/app/main.py` [NEW]
  - `backend/app/database.py` [NEW]
  - `backend/app/models/schemas.py` [NEW]
  - `backend/app/simulator/telemetry_generator.py` [NEW]
  - `backend/requirements.txt` [NEW]
- **Completion Criteria**: FastAPI server launches on port 8000, seeds initial network topology, and generates live synthetic pressure and flow telemetry.
- **Testing / Commit Checkpoint**: Verify `/docs` Swagger UI and execute health check endpoint.  
  `git commit -m "feat(backend): FastAPI service, DB schema & SCADA telemetry simulator"`

---

### Task 2: REST & WebSocket Telemetry Gateway APIs
- **Status**: `[COMPLETED]`
- **Goal**: Implement RESTful CRUD endpoints for network nodes, incidents, sensor fleet, PRV status, and water loss audits, alongside a WebSocket gateway (`/ws/telemetry`) broadcasting live sensor updates to connected frontend clients.
- **Dependencies**: Member 2 Task 1.
- **Files / Area Involved**:
  - `backend/app/api/routers/telemetry.py` [NEW]
  - `backend/app/api/routers/incidents.py` [NEW]
  - `backend/app/api/routers/sensors.py` [NEW]
  - `backend/app/api/routers/repairs.py` [NEW]
  - `backend/app/api/ws.py` [NEW]
- **Completion Criteria**: REST JSON payloads match `frontend/app/types/dashboard.ts` specifications. WebSocket broadcasts live telemetry every 1 second.
- **Testing / Commit Checkpoint**: Run automated API route tests with `pytest`.  
  `git commit -m "feat(backend): REST endpoints & real-time WebSocket telemetry gateway"`

---

### Task 3: Hydro-Acoustic Leak Detection & FFT Signal Processing Engine
- **Status**: `[COMPLETED]`
- **Goal**: Build a signal processing module using `numpy` and `scipy.signal` to execute Fast Fourier Transforms (FFT) on hydrophone acoustic audio data, isolating leak frequency signatures (100Hz–800Hz) and scoring leak confidence (0–100%).
- **Dependencies**: Member 2 Task 1.
- **Files / Area Involved**:
  - `backend/app/ai/fft_processor.py` [NEW]
  - `backend/app/api/routers/incidents.py` [UPDATED]
- **Completion Criteria**: Audio processor analyzes raw hydrophone signals, outputs spectral density arrays, and creates incident alerts when confidence exceeds 75%.
- **Testing / Commit Checkpoint**: Run test suite on normal vs leak audio recordings verifying detection accuracy.  
  `git commit -m "feat(backend/ai): hydro-acoustic FFT signal processor & leak classifier"`

---

### Task 4: AI Repair Prioritization & Hydro-Structural Sinkhole Risk Matrix
- **Status**: `[COMPLETED]`
- **Goal**: Implement an optimization engine ranking pipe repair priorities using: (1) Water Loss Rate (L/min), (2) Soil Erosion / Sinkhole Hazard Index (pressure drop + pipe age), and (3) Financial ROI ($ saved/day).
- **Dependencies**: Member 2 Task 3.
- **Files / Area Involved**:
  - `backend/app/ai/repair_optimizer.py` [NEW]
  - `backend/app/api/routers/repairs.py` [NEW]
- **Completion Criteria**: `/api/repairs/priorities` outputs sorted queue of repair tasks with complete financial ROI and structural hazard metrics.
- **Testing / Commit Checkpoint**: Run unit tests validating priority scoring calculations.  
  `git commit -m "feat(backend/ai): repair priority optimization engine & sinkhole risk matrix"`

---

### Task 5: End-to-End Hackathon Demo Suite & Scenario Trigger Engine
- **Status**: `[COMPLETED]`
- **Goal**: Create triggerable demo scenario endpoints (`POST /api/demo/trigger-burst`, `POST /api/demo/verify-repair`, `POST /api/demo/reset`) allowing instantaneous injection of burst leaks and telemetry spikes for live judging demonstrations.
- **Dependencies**: Member 2 Task 2, Member 2 Task 3, Member 2 Task 4.
- **Files / Area Involved**:
  - `backend/app/api/routers/demo.py` [NEW]
  - `backend/app/simulator/telemetry_generator.py` [UPDATED]
- **Completion Criteria**: Triggering a burst injects synthetic telemetry spikes, generates an AI alert, and pushes real-time WebSocket updates to the frontend within 1 second.
- **Testing / Commit Checkpoint**: Execute end-to-end integration test from scenario trigger to dashboard state update.  
  `git commit -m "feat(backend): demo scenario injector & end-to-end test suite"`

---

## 🔄 Synchronized Integration Milestones

1. **Milestone 1 (Foundational Setup & Navigation Fix)**: Member 1 completes Task 1 (Fixing sidebar & navigation). Member 2 completes Task 1 & Task 2. Both confirm clean local operation.
2. **Milestone 2 (AI Signal Processing & Real-time Integration)**: Member 1 completes Task 2 & Task 3. Member 2 completes Task 3 & Task 4. Real-time telemetry and audio FFT rendering validated.
3. **Milestone 3 (Interactive Controls & Final Demo Suite)**: Member 1 completes Task 4 & Task 5. Member 2 completes Task 5. Full system presentation dry-run conducted.

---

## 📌 Commit & Main-Branch Guidelines

- **Workflow**: All work is committed directly to the `main` branch. No PRs or feature branches.
- **Commit Format**: `<type>(<scope>): <short description>` (e.g. `fix(frontend): repair sidebar navigation, mobile drawer and view routing`).
- **Verification Checkpoint**: Before committing to `main`, Member 1 runs `npm run build` and Member 2 runs `pytest` / server startup check.
