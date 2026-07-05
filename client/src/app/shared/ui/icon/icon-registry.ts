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
  search: () =>
    Promise.resolve(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color, currentColor)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="m21 21-4.34-4.34"/>
        <circle cx="11" cy="11" r="8" fill="none" />
      </svg>`,
    ),

  'chevrons-left': () =>
    Promise.resolve(`
    <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="var(--primary-color, currentColor)">
      <path stroke-linecap="round" stroke-linejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" />
    </svg>
  `),

  'chevrons-right': () =>
    Promise.resolve(`
    <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="var(--primary-color, currentColor)">
      <path stroke-linecap="round" stroke-linejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
    </svg>
  `),

  'skip-next': () =>
    Promise.resolve(
      `<svg xmlns="http://w3.org" viewBox="0 0 24 24" fill="var(--primary-color, currentColor)"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>`,
    ),

  'skip-previous': () =>
    Promise.resolve(
      `<svg xmlns="http://w3.org" viewBox="0 0 24 24" fill="var(--primary-color, currentColor)"><path d="M6 6v12h2V6H6zm3.5 6l8.5 6V6l-8.5 6z"/></svg>`,
    ),

  'playlist-music': () =>
    Promise.resolve(
      `<svg xmlns="http://w3.org" viewBox="0 0 24 24" fill="var(--primary-color, currentColor)"><path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z"/></svg>`,
    ),
  'volume-high': () =>
    Promise.resolve(
      `<svg xmlns="http://w3.org" viewBox="0 0 24 24" fill="var(--primary-color, currentColor)"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>`,
    ),
  'volume-off': () =>
    Promise.resolve(
      `<svg xmlns="http://w3.org" viewBox="0 0 24 24" fill="var(--primary-color, currentColor)"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.21.05-.42.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>`,
    ),
  edit: () =>
    Promise.resolve(
      `<svg xmlns="http://w3.org" viewBox="0 0 24 24" fill="var(--primary-color, currentColor)"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>`,
    ),
  lock: () =>
    Promise.resolve(
      `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="var(--primary-color, currentColor)"" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="16" r="1" fill="var(--primary-color, currentColor)"/>
      <rect x="3" y="10" width="18" height="12" rx="2"/>
      <path d="M7 10V7a5 5 0 0 1 10 0v3"/></svg>`,
    ),
};

export type IconName = keyof typeof ICON_REGISTRY;
