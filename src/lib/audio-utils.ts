// Audio processing utilities for resampling and format conversion

// Extend Window interface for webkitAudioContext
declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

/**
 * Resamples audio to 16kHz sample rate
 * @param audioBlob - The original audio blob to resample
 * @returns Promise<Blob> - The resampled audio blob
 */
export const resampleAudioTo16kHz = async (audioBlob: Blob): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContextClass({
      sampleRate: 16000,
    });

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const arrayBuffer = reader.result as ArrayBuffer;
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        // Create a new audio buffer with 16kHz sample rate
        const targetSampleRate = 16000;
        const targetLength = Math.floor(
          (audioBuffer.length * targetSampleRate) / audioBuffer.sampleRate
        );
        const resampledBuffer = audioContext.createBuffer(
          audioBuffer.numberOfChannels,
          targetLength,
          targetSampleRate
        );

        // Simple linear interpolation resampling
        for (
          let channel = 0;
          channel < audioBuffer.numberOfChannels;
          channel++
        ) {
          const inputData = audioBuffer.getChannelData(channel);
          const outputData = resampledBuffer.getChannelData(channel);

          for (let i = 0; i < targetLength; i++) {
            const inputIndex = (i * audioBuffer.length) / targetLength;
            const index = Math.floor(inputIndex);
            const fraction = inputIndex - index;

            if (index + 1 < inputData.length) {
              outputData[i] =
                inputData[index] * (1 - fraction) +
                inputData[index + 1] * fraction;
            } else {
              outputData[i] = inputData[index];
            }
          }
        }

        // Convert back to blob
        const wavBlob = audioBufferToWav(resampledBuffer);
        resolve(wavBlob);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = reject;
    reader.readAsArrayBuffer(audioBlob);
  });
};

/**
 * Converts AudioBuffer to WAV blob format
 * @param audioBuffer - The AudioBuffer to convert
 * @returns Blob - The WAV format blob
 */
export const audioBufferToWav = (audioBuffer: AudioBuffer): Blob => {
  const numberOfChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const length = audioBuffer.length;
  const arrayBuffer = new ArrayBuffer(44 + length * numberOfChannels * 2);
  const view = new DataView(arrayBuffer);

  // WAV header
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + length * numberOfChannels * 2, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numberOfChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numberOfChannels * 2, true);
  view.setUint16(32, numberOfChannels * 2, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, length * numberOfChannels * 2, true);

  // Convert float samples to 16-bit PCM
  let offset = 44;
  for (let i = 0; i < length; i++) {
    for (let channel = 0; channel < numberOfChannels; channel++) {
      const sample = Math.max(
        -1,
        Math.min(1, audioBuffer.getChannelData(channel)[i])
      );
      view.setInt16(
        offset,
        sample < 0 ? sample * 0x8000 : sample * 0x7fff,
        true
      );
      offset += 2;
    }
  }

  return new Blob([arrayBuffer], { type: "audio/wav" });
};

/**
 * Audio constraints for 16kHz recording
 */
export const AUDIO_CONSTRAINTS_16KHZ = {
  sampleRate: 16000,
  channelCount: 1,
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
} as const;
