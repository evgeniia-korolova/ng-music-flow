export const ICON_REGISTRY: Record<string, () => Promise<string>> = {
  pause: () =>
    Promise.resolve(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--primary-color, currentColor)">
        <path fill-rule="evenodd" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" clip-rule="evenodd" />
      </svg>
  `,
    ),
  play: () =>
    Promise.resolve(
      `<svg xmlns="w3.org" viewBox="0 0 24 24" fill="var(--primary-color, currentColor)">
          <path d="M8 5v14l11-7z" />
        </svg>`,
    ),
  favorite: () =>
    Promise.resolve(
      `<svg xmlns="w3.org" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke="var(--primary-color, currentColor)">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>`,
    ),
  download: () =>
    Promise.resolve(
      `<svg xmlns="w3.org" fill="none" stroke="var(--primary-color, currentColor)" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>`,
    ),
  sun: () =>
    Promise.resolve(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color, currentColor)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="4"/>
            <path d="M12 2v2"/>
            <path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/>
            <path d="m17.66 17.66 1.41 1.41"/>
            <path d="M2 12h2"/><path d="M20 12h2"/>
            <path d="m6.34 17.66-1.41 1.41"/>
            <path d="m19.07 4.93-1.41 1.41"/>
        </svg>`,
    ),
  moonStar: () =>
    Promise.resolve(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color, currentColor)" "stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 5h4"/>
            <path d="M20 3v4"/>
            <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/>
        </svg>`,
    ),
  shirt: () =>
    Promise.resolve(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color, currentColor)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>
        </svg>`,
    ),
  menu: () =>
    Promise.resolve(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color, currentColor)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 5h16"/>
            <path d="M4 12h16"/>
            <path d="M4 19h16"/>
        </svg>`,
    ),
  logIn: () =>
    Promise.resolve(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color, currentColor)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m10 17 5-5-5-5"/><path d="M15 12H3"/>
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
        </svg>`,
    ),
  logOut: () =>
    Promise.resolve(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color, currentColor)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      </svg>`,
    ),
  x: () =>
    Promise.resolve(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color, currentColor)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 6 6 18"/>
        <path d="m6 6 12 12"/>
      </svg>`,
    ),
  user: () =>
    Promise.resolve(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color, currentColor)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>`,
    ),
  waveForm: () =>
    Promise.resolve(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color, currentColor)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M2 10v3"/>
        <path d="M6 6v11"/>
        <path d="M10 3v18"/>
        <path d="M14 8v7"/>
        <path d="M18 5v13"/>
        <path d="M22 10v3"/>
      </svg>`,
    ),
  keySquare: () =>
    Promise.resolve(
      `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="var(--primary-color, currentColor)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12.4 2.7a2.5 2.5 0 0 1 3.4 0l5.5 5.5a2.5 2.5 0 0 1 0 3.4l-3.7 3.7a2.5 2.5 0 0 1-3.4 0L8.7 9.8a2.5 2.5 0 0 1 0-3.4z"/>
          <path d="m14 7 3 3"/>
          <path d="m9.4 10.6-6.814 6.814A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814"/>
        </svg>`,
    ),
  info: () =>
    Promise.resolve(
      `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="var(--primary-color, currentColor)" stroke-width="2">
        <circle fill="none" cx="12" cy="12" r="10" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M12 16v-4" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M12 8h0" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`,
    ),
  warning: () =>
    Promise.resolve(
      `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="var(--primary-color, currentColor)" stroke-width="2">
        <path fill="none" d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" stroke-linecap="round" stroke-linejoin="round"/>
        <path fill="none" d="M12 9v4" stroke-linecap="round" stroke-linejoin="round"/>
        <path fill="none" d="M12 17h0" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`,
    ),
  refresh: () =>
    Promise.resolve(
      `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="var(--primary-color, currentColor)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" fill="none"/>
        <path d="M3 3v5h5"/>
        <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" fill="none"/>
        <path d="M16 16h5v5"/>
        <circle cx="12" cy="12" r="1"/>
      </svg>`,
    ),
  check: () =>
    Promise.resolve(
      `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="var(--primary-color, currentColor)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path fill="none" d="M21.801 10A10 10 0 1 1 17 3.335"/>
        <path fill="none" d="m9 11 3 3L22 4"/>
      </svg>`,
    ),
  eye: () =>
    Promise.resolve(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color, currentColor)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path fill="none" d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>`,
    ),
  eyeClosed: () =>
    Promise.resolve(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color, currentColor)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path fill="none" d="m15 18-.722-3.25"/>
        <path fill="none" d="M2 8a10.645 10.645 0 0 0 20 0"/>
        <path d="m20 15-1.726-2.05"/>
        <path d="m4 15 1.726-2.05"/>
        <path d="m9 18 .722-3.25"/>
      </svg>`,
    ),
  'arrow-up': () =>
    Promise.resolve(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color, currentColor)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="12" y1="19" x2="12" y2="5"></line>
      <polyline points="5 12 12 5 19 12"></polyline>
    </svg>`,
    ),
};

export type IconName = keyof typeof ICON_REGISTRY;
