import os
import glob
import numpy as np
from scipy import signal
import scipy.io.wavfile as wavfile
import warnings
from typing import Dict, List, Any, Optional

class HydroAcousticFFTProcessor:
    def __init__(self):
        self.acoustic_dir = self._resolve_acoustic_dir()
        self.leak_files = []
        self.noleak_files = []
        self._index_dataset()

    def _resolve_acoustic_dir(self) -> str:
        candidates = [
            os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "acoustic")),
            os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "backend", "acoustic")),
            os.path.abspath("acoustic"),
            os.path.abspath("backend/acoustic")
        ]
        for path in candidates:
            if os.path.exists(path):
                return path
        return candidates[0]

    def _index_dataset(self):
        if os.path.exists(self.acoustic_dir):
            all_wavs = glob.glob(os.path.join(self.acoustic_dir, "**", "*.wav"), recursive=True)
            for file_path in all_wavs:
                norm_path = file_path.replace("\\", "/")
                if "/Leak/" in norm_path or "/Leak-" in norm_path or "Leak_" in norm_path:
                    self.leak_files.append(file_path)
                elif "/No-Leak/" in norm_path or "/NoLeak-" in norm_path or "NoLeak_" in norm_path or "No-Leak" in norm_path:
                    self.noleak_files.append(file_path)
                else:
                    self.leak_files.append(file_path)
        
        # Sort for deterministic indexing
        self.leak_files.sort()
        self.noleak_files.sort()

    def load_real_wav(self, file_path: str) -> tuple[int, np.ndarray]:
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Acoustic recording not found at: {file_path}")
            
        with warnings.catch_warnings():
            warnings.simplefilter("ignore")
            sample_rate, data = wavfile.read(file_path)
            
        if data.ndim > 1:
            data = data[:, 0]
            
        audio_float = data.astype(np.float32)
        max_val = np.max(np.abs(audio_float)) + 1e-6
        normalized = audio_float / max_val
        return sample_rate, normalized

    def analyze_file(self, file_path: str) -> Dict[str, Any]:
        sample_rate, audio_data = self.load_real_wav(file_path)
        return self.analyze_audio_spectrum(audio_data, sample_rate=sample_rate)

    def analyze_audio_spectrum(self, audio_data: np.ndarray, sample_rate: int = 4096) -> Dict[str, Any]:
        N = len(audio_data)
        if N == 0:
            return {
                "frequencies": [],
                "magnitudes": [],
                "peakFrequencyHz": 0.0,
                "leakProbability": 0.0,
                "isLeakDetected": False
            }
            
        yf = np.fft.fft(audio_data)
        xf = np.fft.fftfreq(N, 1.0 / sample_rate)

        # Focus spectrum on positive frequencies up to 1200 Hz
        positive_mask = (xf >= 0) & (xf <= 1200)
        frequencies = xf[positive_mask].tolist()
        magnitudes = (2.0 / N * np.abs(yf[positive_mask])).tolist()

        # Leak band energy analysis (100 Hz - 800 Hz)
        leak_band_mask = (xf >= 100) & (xf <= 800)
        leak_energy = np.sum(np.abs(yf[leak_band_mask]))
        total_energy = np.sum(np.abs(yf[positive_mask])) + 1e-6

        leak_ratio = float(leak_energy / total_energy)
        
        # Find peak frequency in leak band or total positive band
        leak_mags = [m for f, m in zip(frequencies, magnitudes) if 100 <= f <= 800]
        leak_freqs = [f for f, m in zip(frequencies, magnitudes) if 100 <= f <= 800]
        
        if leak_mags:
            peak_idx = int(np.argmax(leak_mags))
            peak_freq = float(leak_freqs[peak_idx])
        else:
            peak_idx = int(np.argmax(magnitudes))
            peak_freq = float(frequencies[peak_idx]) if frequencies else 340.0

        leak_probability = min(99.4, float(round(leak_ratio * 115.0, 1)))
        is_leak = leak_probability >= 55.0

        # Downsample frequency arrays to maintain fast, compact UI websocket & API payloads (~50 points)
        step = max(1, len(frequencies) // 60)
        
        return {
            "frequencies": [round(float(f), 1) for f in frequencies[::step]],
            "magnitudes": [round(float(m), 5) for m in magnitudes[::step]],
            "peakFrequencyHz": round(peak_freq, 1),
            "leakProbability": leak_probability,
            "isLeakDetected": is_leak,
            "sampleRateHz": sample_rate,
            "totalSamplesProcessed": N
        }

    def get_sample_leak_recording(self, incident_code: str = "") -> str:
        if not self.leak_files:
            raise RuntimeError("No leak acoustic recordings found in dataset.")
        # Hash incident code to deterministically pick a real recording file
        idx = abs(hash(incident_code)) % len(self.leak_files)
        return self.leak_files[idx]

fft_processor = HydroAcousticFFTProcessor()
