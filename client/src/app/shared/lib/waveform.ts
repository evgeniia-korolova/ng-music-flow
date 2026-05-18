export function generateFakePeaks(length = 60): number[] {
  return Array.from({ length }, (_, index) => {
    const base = Math.sin(index * 0.35) * 0.3;

    const noise = Math.random() * 0.25;

    return Math.max(0.15, Math.min(1, base + noise + 0.4));
  });
}
