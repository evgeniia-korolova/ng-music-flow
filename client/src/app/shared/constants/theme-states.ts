import { ThemeMode } from '../../features/theme-toggler/theme.store';
import { IconName } from '../ui/icon/icon-registry';

export const themeStates: Record<ThemeMode, IconName> = {
  light: 'sun',
  dark: 'moonStar',
  system: 'shirt',
};
