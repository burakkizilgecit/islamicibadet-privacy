/**
 * Generates silent placeholder WAV files so EAS build succeeds.
 * Replace these files with real audio to activate custom notification sounds.
 *
 * Real audio sources:
 *   ezan.wav    → Mekke/Medine ezanı (archive.org, free public domain)
 *   ilahi.wav   → Türkçe ilahi (youtube-dl ile mp3→wav dönüştür)
 *   salavat.wav → Salavat-ı Şerife melodisi
 *
 * After replacing: eas build --platform android --profile preview
 */
const fs   = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '..', 'assets', 'sounds');
fs.mkdirSync(OUT_DIR, { recursive: true });

function silentWav(durationSeconds = 1) {
  const sampleRate  = 44100;
  const numChannels = 1;
  const bitsPerSample = 8;
  const numSamples  = Math.floor(sampleRate * durationSeconds);
  const dataSize    = numSamples * numChannels * (bitsPerSample / 8);
  const buf         = Buffer.alloc(44 + dataSize);

  buf.write('RIFF',  0);  buf.writeUInt32LE(36 + dataSize, 4);
  buf.write('WAVE',  8);  buf.write('fmt ', 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1,  20);               // PCM
  buf.writeUInt16LE(numChannels,     22);
  buf.writeUInt32LE(sampleRate,      24);
  buf.writeUInt32LE(sampleRate * numChannels * (bitsPerSample / 8), 28);
  buf.writeUInt16LE(numChannels * (bitsPerSample / 8), 32);
  buf.writeUInt16LE(bitsPerSample,   34);
  buf.write('data', 36);  buf.writeUInt32LE(dataSize, 40);
  buf.fill(128, 44); // 128 = silence for unsigned 8-bit PCM

  return buf;
}

const files = ['ezan.wav', 'ilahi.wav', 'salavat.wav'];
for (const f of files) {
  const dest = path.join(OUT_DIR, f);
  if (!fs.existsSync(dest)) {
    fs.writeFileSync(dest, silentWav(1));
    console.log(`✓ Created placeholder: assets/sounds/${f}`);
  } else {
    console.log(`• Already exists (skipped): assets/sounds/${f}`);
  }
}
console.log('\nDone. Replace with real audio files and rebuild.');
