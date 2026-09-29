/**
 * High-performance 16-bit PCM WAV encoder
 * Converts Float32Array PCM audio into standard RIFF WAVE bytes and Blobs.
 */

export function encodeWav16(
  samples: Float32Array,
  sampleRate = 44100,
  numChannels = 1
): Uint8Array {
  const numSamples = samples.length;
  const bytesPerSample = 2; // 16-bit
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = numSamples * bytesPerSample;
  const headerSize = 44;
  const totalSize = headerSize + dataSize;

  const buffer = new ArrayBuffer(totalSize);
  const view = new DataView(buffer);

  // RIFF chunk descriptor
  writeAscii(view, 0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeAscii(view, 8, "WAVE");

  // "fmt " sub-chunk
  writeAscii(view, 12, "fmt ");
  view.setUint32(16, 16, true);             // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true);              // AudioFormat (1 for PCM)
  view.setUint16(22, numChannels, true);    // NumChannels
  view.setUint32(24, sampleRate, true);     // SampleRate
  view.setUint32(28, byteRate, true);       // ByteRate
  view.setUint16(32, blockAlign, true);     // BlockAlign
  view.setUint16(34, 16, true);             // BitsPerSample

  // "data" sub-chunk
  writeAscii(view, 36, "data");
  view.setUint32(40, dataSize, true);

  // PCM Sample payload (clamped to [-1.0, 1.0] and converted to Int16)
  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    const s = Math.max(-1.0, Math.min(1.0, samples[i]));
    const int16 = s < 0 ? Math.round(s * 32768) : Math.round(s * 32767);
    view.setInt16(offset, int16, true);
    offset += 2;
  }

  return new Uint8Array(buffer);
}

export function createWavBlob(
  samples: Float32Array,
  sampleRate = 44100,
  numChannels = 1
): Blob {
  const bytes = encodeWav16(samples, sampleRate, numChannels);
  return new Blob([bytes.buffer as ArrayBuffer], { type: "audio/wav" });
}

export function downloadWavBlob(blob: Blob, filename: string): void {
  if (typeof window === "undefined") return;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = filename.endsWith(".wav") ? filename : `${filename}.wav`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 1000);
}

function writeAscii(view: DataView, offset: number, text: string): void {
  for (let i = 0; i < text.length; i++) {
    view.setUint8(offset + i, text.charCodeAt(i));
  }
}
