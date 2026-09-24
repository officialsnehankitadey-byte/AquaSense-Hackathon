import numpy as np
from scipy import signal
from typing import Dict, List, Any

class HydroAcousticFFTProcessor:
    def __init__(self, sample_rate: int = 4000):
        self.sample_rate = sample_rate

    def generate_synthetic_audio(self, duration: float = 1.0, is_leak: bool = True, leak_freq: float = 340.0) -> np.ndarray:
        t = np.linspace(0, duration, int(self.sample_rate * duration), endpoint=False)
        # Background water flow noise (white noise filtered)
        noise = np.random.normal(0, 0.2, t.shape)
        
        if is_leak:
            # Acoustic resonance associated with pipe burst / orifice leak
            leak_signal = 0.8 * np.sin(2 * np.pi * leak_freq * t) + 0.3 * np.sin(2 * np.pi * (leak_freq * 2) * t)
            combined = noise + leak_signal
        else:
            combined = noise
            
        return combined

    def analyze_audio_spectrum(self, audio_data: np.ndarray) -> Dict[str, Any]:
        N = len(audio_data)
        yf = np.fft.fft(audio_data)
        xf = np.fft.fftfreq(N, 1.0 / self.sample_rate)

        # Get positive frequencies up to 1000 Hz
        positive_mask = (xf >= 0) & (xf <= 1000)
        frequencies = xf[positive_mask].tolist()
        magnitudes = (2.0 / N * np.abs(yf[positive_mask])).tolist()

        # Isolate leak frequency band (100Hz - 800Hz)
        leak_band_mask = (xf >= 100) & (xf <= 800)
        leak_energy = np.sum(np.abs(yf[leak_band_mask]))
        total_energy = np.sum(np.abs(yf[positive_mask])) + 1e-6

        leak_ratio = leak_energy / total_energy
        peak_idx = np.argmax(magnitudes)
        peak_freq = frequencies[peak_idx] if peak_idx < len(frequencies) else 0.0

        leak_probability = min(100.0, float(round(leak_ratio * 120.0, 1)))
        is_leak = leak_probability > 60.0

        return {
            "frequencies": [round(f, 1) for f in frequencies[::5]], # downsampled for UI payload
            "magnitudes": [round(m, 4) for m in magnitudes[::5]],
            "peakFrequencyHz": round(peak_freq, 1),
            "leakProbability": leak_probability,
            "isLeakDetected": is_leak
        }

fft_processor = HydroAcousticFFTProcessor()
