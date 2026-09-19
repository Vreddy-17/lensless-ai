# LENSLESS.AI — Frontend Redesign Notes

## Design direction
The UI was rebuilt from the previous cyan/neon glassmorphism dashboard into an **Optical Instrument / Scientific Editorial** interface.

Core visual language:
- near-black optical bench background
- warm off-white technical surfaces
- signal orange for active optical states
- cobalt only for data / inverse-model accents
- hard 1px grids instead of floating rounded cards
- monospace engineering labels + large editorial typography
- 3D used only for the Scene → Encoder → Sensor → AI → Reconstruction path
- restrained motion instead of decorative glow effects

## Major UI changes
- completely new navbar and hero
- redesigned 3D optical path
- new reconstruction workbench layout
- instrument-style input modes
- redesigned PSF / simulation controls
- new eight-stage pipeline indicator
- redesigned image comparison viewer
- redesigned metrics and history
- baseline vs AI panel no longer invents performance numbers
- rebuilt optics learning section
- rebuilt y = Hx + n equation explorer
- rebuilt conceptual AI architecture section
- rebuilt applications section
- rebuilt judge/review presentation mode
- new footer and visual system

## Scientific / integration corrections
- webcam remains explicitly a conventional camera used for software simulation
- y = Hx + n is presented as a simplified project model
- PSNR / SSIM are unavailable without ground truth
- confidence is shown only when supplied
- demo / client-fallback metrics are explicitly illustrative
- fake baseline-vs-AI claims were removed
- bundled DiffuserCam-style SVGs are explicitly labelled UI demo assets, not experimental DLMD samples
- backend health check now supports the current FastAPI `/health` route as well as `/api/health`

## Backend note
Your current FastAPI backend has working upload, preprocessing, and `/simulate/{filename}` endpoints, while AI reconstruction is not yet implemented. The frontend keeps its service abstraction and demo fallback so the UI can be developed now. Once the backend returns reconstruction images/metrics, connect those real responses in `src/lib/api/lensless-service.ts`.

## Run
```bash
npm install
npm run dev
```

Optional environment variable:
```bash
NEXT_PUBLIC_RECONSTRUCTION_API_URL=http://127.0.0.1:8000
```

## Verification performed
- TypeScript: `tsc --noEmit` — passed
- ESLint error check: `eslint src --quiet` — passed with zero errors

A full Next.js production build could not be executed in the isolated Linux editing environment because the uploaded `node_modules` only contains the Windows SWC binary and the environment cannot download the Linux SWC package. Reinstall dependencies on the target Mac (`npm install`) before running/building.
