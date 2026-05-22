import { CompactNumberPipe } from './compact-number-pipe';

describe('CompactNumberPipe', () => {
  const pipe = new CompactNumberPipe();

  it('it should return "0" for emty or false values', () => {
    expect(pipe.transform(null)).toBe('0');
    expect(pipe.transform(undefined)).toBe('0');
    expect(pipe.transform(NaN)).toBe('0');
  });

  it('it should display values < 1000 unchanged', () => {
    expect(pipe.transform(0)).toBe('0');
    expect(pipe.transform(42)).toBe('42');
    expect(pipe.transform(999)).toBe('999');
  });

  it('it should transform thousands into format К', () => {
    expect(pipe.transform(1000)).toBe('1K');
    expect(pipe.transform(1500)).toBe('1.5K');
    expect(pipe.transform(99400)).toBe('99.4K');
  });

  it('it should transform millions into format М', () => {
    expect(pipe.transform(1000000)).toBe('1M');
    expect(pipe.transform(1200000)).toBe('1.2M');
    expect(pipe.transform(6999113)).toBe('7M');
  });

  it('should handle negative numbers correctly', () => {
    expect(pipe.transform(-500)).toBe('-500');
    expect(pipe.transform(-1500)).toBe('-1.5K');
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
});
