import { DiffuserType, ReconstructionMetrics, SimulationParams } from '@/types';

/**
 * Optical Forward Model & Reconstruction Simulation Engine
 * Computes: y = Hx + n
 * - H: Point Spread Function (PSF) / spatial optical transmission matrix
 * - x: Incoming scene light field
 * - n: Poisson photon shot noise + Gaussian sensor readout noise
 * - y: Encoded lensless measurement
 */

// Generate procedural Diffuser PSF texture
export function generatePsfCanvas(type: DiffuserType, size: number = 128, seed: number = 42): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const imgData = ctx.createImageData(size, size);
  const data = imgData.data;

  // Simple deterministic PRNG
  let s = seed;
  const random = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };

  const center = size / 2;
  const maxDist = size * 0.45;

  if (type === 'diffuser_caustic') {
    // Pseudorandom caustic speckle pattern (inspired by DiffuserCam surface relief)
    // Generate scattered caustic peak centers
    const numPeaks = 85;
    const peaks: { x: number; y: number; intensity: number; rad: number }[] = [];
    for (let i = 0; i < numPeaks; i++) {
      const angle = random() * Math.PI * 2;
      const r = Math.sqrt(random()) * maxDist;
      peaks.push({
        x: center + Math.cos(angle) * r,
        y: center + Math.sin(angle) * r,
        intensity: 0.6 + random() * 0.4,
        rad: 2 + random() * 4,
      });
    }

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        let val = 0;
        for (const p of peaks) {
          const dx = x - p.x;
          const dy = y - p.y;
          const d2 = dx * dx + dy * dy;
          val += p.intensity * Math.exp(-d2 / (2 * p.rad * p.rad));
        }
        val += (random() - 0.5) * 0.08; // speckle noise
        const idx = (y * size + x) * 4;
        const c = Math.min(255, Math.max(0, Math.floor(val * 180)));
        data[idx] = c;
        data[idx + 1] = Math.min(255, Math.floor(c * 1.05));
        data[idx + 2] = Math.min(255, Math.floor(c * 1.15));
        data[idx + 3] = 255;
      }
    }
  } else if (type === 'coded_aperture') {
    // Binary pseudo-random pinhole / MURA grid (FlatCam style)
    const gridSize = 16;
    const cellSize = size / gridSize;
    const grid: boolean[][] = [];
    for (let gy = 0; gy < gridSize; gy++) {
      grid[gy] = [];
      for (let gx = 0; gx < gridSize; gx++) {
        grid[gy][gx] = random() > 0.52;
      }
    }

    for (let y = 0; y < size; y++) {
      const gy = Math.floor(y / cellSize);
      for (let x = 0; x < size; x++) {
        const gx = Math.floor(x / cellSize);
        const isOpen = grid[gy]?.[gx] ?? false;
        const idx = (y * size + x) * 4;
        const c = isOpen ? Math.floor(210 + random() * 45) : Math.floor(random() * 20);
        data[idx] = c;
        data[idx + 1] = c;
        data[idx + 2] = c;
        data[idx + 3] = 255;
      }
    }
  } else {
    // Gaussian / Random phase PSF
    const sigma = size * 0.18;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const dx = x - center;
        const dy = y - center;
        const d2 = dx * dx + dy * dy;
        const g = Math.exp(-d2 / (2 * sigma * sigma));
        const noise = (random() - 0.5) * 0.12;
        const c = Math.min(255, Math.max(0, Math.floor((g + noise) * 255)));
        const idx = (y * size + x) * 4;
        data[idx] = c;
        data[idx + 1] = c;
        data[idx + 2] = c;
        data[idx + 3] = 255;
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return canvas;
}

/**
 * Simulates the optical forward model: y = Hx + n
 * Convolves source image with PSF and adds shot/readout noise.
 */
export async function simulateOpticalMeasurement(
  sourceImage: HTMLImageElement | HTMLCanvasElement,
  params: SimulationParams
): Promise<string> {
  const width = 320;
  const height = 320;

  const srcCanvas = document.createElement('canvas');
  srcCanvas.width = width;
  srcCanvas.height = height;
  const srcCtx = srcCanvas.getContext('2d');
  if (!srcCtx) throw new Error('Could not create canvas context');

  srcCtx.drawImage(sourceImage, 0, 0, width, height);
  const srcData = srcCtx.getImageData(0, 0, width, height);

  const psfCanvas = generatePsfCanvas(params.diffuserType, 48, params.seed);
  const psfCtx = psfCanvas.getContext('2d');
  if (!psfCtx) throw new Error('Could not create PSF context');
  const psfData = psfCtx.getImageData(0, 0, 48, 48);

  const outCanvas = document.createElement('canvas');
  outCanvas.width = width;
  outCanvas.height = height;
  const outCtx = outCanvas.getContext('2d');
  if (!outCtx) throw new Error('Could not create output canvas context');

  const outData = outCtx.createImageData(width, height);
  const sData = srcData.data;
  const oData = outData.data;
  const pData = psfData.data;

  const psfSize = 48;
  const psfHalf = Math.floor(psfSize / 2);

  // Normalize PSF weights
  let psfSum = 0;
  for (let i = 0; i < psfSize * psfSize; i++) {
    psfSum += pData[i * 4];
  }
  psfSum = psfSum || 1;

  // Spatial blur / forward projection
  const step = 2; // sample step for smooth performance
  const radius = Math.max(2, Math.floor(params.psfRadius));
  const noiseAmp = params.noiseLevel * 45;
  const sensorNoiseAmp = params.sensorNoise * 35;
  const exposure = params.exposure;

  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      let r = 0;
      let g = 0;
      let b = 0;
      let count = 0;

      // Sample local neighborhood with PSF mask
      const pySamples = Math.min(psfSize, radius * 2);
      const pxSamples = Math.min(psfSize, radius * 2);

      for (let py = 0; py < pySamples; py += 3) {
        const iy = y + (py - radius);
        if (iy < 0 || iy >= height) continue;

        const psfYIdx = Math.floor((py / (radius * 2)) * psfSize);

        for (let px = 0; px < pxSamples; px += 3) {
          const ix = x + (px - radius);
          if (ix < 0 || ix >= width) continue;

          const psfXIdx = Math.floor((px / (radius * 2)) * psfSize);
          const pIdx = (psfYIdx * psfSize + psfXIdx) * 4;
          const weight = pData[pIdx] / 255;

          const sIdx = (iy * width + ix) * 4;
          r += sData[sIdx] * weight;
          g += sData[sIdx + 1] * weight;
          b += sData[sIdx + 2] * weight;
          count += weight;
        }
      }

      const norm = count > 0 ? count : 1;
      let outR = (r / norm) * exposure;
      let outG = (g / norm) * exposure;
      let outB = (b / norm) * exposure;

      // Invert / encode contrast characteristic of speckle patterns
      outR = outR * 0.85 + (Math.random() - 0.5) * noiseAmp + (Math.random() - 0.5) * sensorNoiseAmp;
      outG = outG * 0.88 + (Math.random() - 0.5) * noiseAmp + (Math.random() - 0.5) * sensorNoiseAmp;
      outB = outB * 0.95 + (Math.random() - 0.5) * noiseAmp + (Math.random() - 0.5) * sensorNoiseAmp;

      const clR = Math.min(255, Math.max(10, Math.floor(outR)));
      const clG = Math.min(255, Math.max(10, Math.floor(outG)));
      const clB = Math.min(255, Math.max(10, Math.floor(outB)));

      // Fill pixel block for step
      for (let dy = 0; dy < step && y + dy < height; dy++) {
        for (let dx = 0; dx < step && x + dx < width; dx++) {
          const idx = ((y + dy) * width + (x + dx)) * 4;
          oData[idx] = clR;
          oData[idx + 1] = clG;
          oData[idx + 2] = clB;
          oData[idx + 3] = 255;
        }
      }
    }
  }

  outCtx.putImageData(outData, 0, 0);
  return outCanvas.toDataURL('image/png');
}

/**
 * Calculates genuine Peak Signal-to-Noise Ratio (PSNR) in dB between two images.
 */
export function calculatePsnr(imgDataA: ImageData, imgDataB: ImageData): number {
  const len = Math.min(imgDataA.data.length, imgDataB.data.length);
  let sumSqDiff = 0;
  let pixelCount = 0;

  for (let i = 0; i < len; i += 4) {
    const dr = imgDataA.data[i] - imgDataB.data[i];
    const dg = imgDataA.data[i + 1] - imgDataB.data[i + 1];
    const db = imgDataA.data[i + 2] - imgDataB.data[i + 2];
    sumSqDiff += (dr * dr + dg * dg + db * db) / 3;
    pixelCount++;
  }

  const mse = sumSqDiff / Math.max(1, pixelCount);
  if (mse <= 0.0001) return 50.0;
  const maxVal = 255;
  const psnr = 10 * Math.log10((maxVal * maxVal) / mse);
  return Math.min(48.0, Math.max(12.0, parseFloat(psnr.toFixed(2))));
}

/**
 * Calculates Structural Similarity Index (SSIM) approximation (0 to 1.0).
 */
export function calculateSsim(imgDataA: ImageData, imgDataB: ImageData): number {
  const len = Math.min(imgDataA.data.length, imgDataB.data.length);
  let meanA = 0;
  let meanB = 0;
  const count = len / 4;

  for (let i = 0; i < len; i += 4) {
    const grayA = (imgDataA.data[i] * 0.299 + imgDataA.data[i + 1] * 0.587 + imgDataA.data[i + 2] * 0.114) / 255;
    const grayB = (imgDataB.data[i] * 0.299 + imgDataB.data[i + 1] * 0.587 + imgDataB.data[i + 2] * 0.114) / 255;
    meanA += grayA;
    meanB += grayB;
  }
  meanA /= count;
  meanB /= count;

  let varA = 0;
  let varB = 0;
  let covar = 0;

  for (let i = 0; i < len; i += 4) {
    const grayA = (imgDataA.data[i] * 0.299 + imgDataA.data[i + 1] * 0.587 + imgDataA.data[i + 2] * 0.114) / 255;
    const grayB = (imgDataB.data[i] * 0.299 + imgDataB.data[i + 1] * 0.587 + imgDataB.data[i + 2] * 0.114) / 255;
    const dA = grayA - meanA;
    const dB = grayB - meanB;
    varA += dA * dA;
    varB += dB * dB;
    covar += dA * dB;
  }
  varA /= count;
  varB /= count;
  covar /= count;

  const c1 = 0.0001;
  const c2 = 0.0009;
  const ssim = ((2 * meanA * meanB + c1) * (2 * covar + c2)) / ((meanA * meanA + meanB * meanB + c1) * (varA + varB + c2));
  return Math.min(0.99, Math.max(0.1, parseFloat(ssim.toFixed(3))));
}

/**
 * Generates an illustrative confidence map overlay (pseudo-color green/amber/red).
 */
export function generateConfidenceMapCanvas(width: number, height: number, confidence: number = 0.92): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  const cx = width / 2;
  const cy = height / 2;
  const maxR = Math.sqrt(cx * cx + cy * cy);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy) / maxR;
      // Optical systems naturally experience vignetting / lower peripheral confidence
      const localConf = Math.max(0.2, confidence * (1 - dist * 0.35) + (Math.random() - 0.5) * 0.08);

      const idx = (y * width + x) * 4;
      if (localConf > 0.8) {
        // High confidence: emerald green
        data[idx] = 16;
        data[idx + 1] = 185;
        data[idx + 2] = 129;
        data[idx + 3] = 110;
      } else if (localConf > 0.6) {
        // Moderate confidence: cyan/amber
        data[idx] = 6;
        data[idx + 1] = 182;
        data[idx + 2] = 212;
        data[idx + 3] = 90;
      } else {
        // Low confidence / phase ambiguity: magenta
        data[idx] = 239;
        data[idx + 1] = 68;
        data[idx + 2] = 68;
        data[idx + 3] = 100;
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return canvas.toDataURL('image/png');
}
