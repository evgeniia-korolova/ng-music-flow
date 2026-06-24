import { TransformFnParams } from 'class-transformer/types';

export function trimAndSanitize({ value }: TransformFnParams): string {
  if (typeof value !== 'string') return '';

  return value.trim().replaceAll(/\s+/g, ' ');
}
