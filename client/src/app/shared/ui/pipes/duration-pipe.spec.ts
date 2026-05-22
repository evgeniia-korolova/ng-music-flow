import { DurationPipe } from './duration-pipe';

describe('DurationPipe', () => {
  const pipe = new DurationPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('it should return "00:00" for null, undefined, NaN values', () => {
    expect(pipe.transform(null)).toBe('00:00');
    expect(pipe.transform(undefined)).toBe('00:00');
    expect(pipe.transform(NaN)).toBe('00:00');
  });

  it('should handle negative numbers correctly', () => {
    expect(pipe.transform(-42)).toBe('00:00');
  });

  it('should handle duration correctly', () => {
    expect(pipe.transform(45)).toBe('00:45');
    expect(pipe.transform(120)).toBe('02:00');
    expect(pipe.transform(346)).toBe('05:46');
  });
});
