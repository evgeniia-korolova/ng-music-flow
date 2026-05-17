import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';

export const themeStorageKey = 'user-theme';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeState {
  theme: ThemeMode;
}

const initialState: ThemeState = {
  theme: 'system',
};

export const ThemeStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    setTheme(newTheme: ThemeMode) {
      patchState(store, { theme: newTheme });
      localStorage.setItem(themeStorageKey, newTheme);
      this.applyTheme(newTheme);
    },

    applyTheme(theme: ThemeMode) {
      let isDark = theme === 'dark';

      if (theme === 'system') {
        isDark = globalThis.matchMedia(`(prefers-color-scheme: dark)`).matches;
      }

      const html = document.documentElement;
      if (isDark) {
        html.classList.add('dark');
      } else {
        html.classList.remove('dark');
      }
    },
  })),
  withHooks({
    onInit(store) {
      const data = localStorage.getItem(themeStorageKey);

      if (isThemeMode(data)) {
        store.applyTheme(data);
        patchState(store, { theme: data });
      } else {
        store.applyTheme('system');
      }

      const query = globalThis.matchMedia('(prefers-color-scheme: dark)');

      const handleThemeChange = () => {
        if (store.theme() === 'system') {
          store.applyTheme('system');
        }
      };

      query.addEventListener('change', handleThemeChange);

      return {
        onDestroy() {
          query?.removeEventListener('change', handleThemeChange);
        },
      };
    },
  }),
);

export function isThemeMode(data: unknown): data is ThemeMode {
  return typeof data === 'string' && ['light', 'dark', 'system'].includes(data);
}
