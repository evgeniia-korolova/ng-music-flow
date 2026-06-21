export function validateMagicBytes(buffer: Buffer): boolean {
  if (!buffer || buffer.length < 4) return false;

  // Extract the first 4 bytes as a Hexadecimal string
  const hex = buffer.subarray(0, 4).toString('hex').toUpperCase();

  // 1. Check for MP3 (ID3v2 tags start with 'ID3' -> '494433')
  if (hex.startsWith('494433')) return true;

  // 2. Check for raw MP3 frames (Starts with frame sync bits: 'FFF')
  if (hex.startsWith('FFF')) return true;

  // 3. Check for WAV (Starts with 'RIFF' -> '52494646')
  if (hex === '52494646') {
    // To be thorough with WAV, make sure 'WAVE' is present at bytes 8-12
    const containerCheck = buffer.subarray(8, 12).toString('ascii');
    if (containerCheck === 'WAVE') return true;
  }

  // 4. Check for FLAC (Starts with 'fLaC' -> '664C6143')
  if (hex === '664C6143') return true;

  // 5. Check for OGG (Starts with 'OggS' -> '4F676753')
  if (hex === '4F676753') return true;

  // If it matches none of these signatures, it's an impostor file
  return false;
}
