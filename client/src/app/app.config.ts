import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withPreloading,
  withViewTransitions,
} from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthStore } from './entities/user/user.state';
import { authInterceptor } from './shared/interceptors/auth.interceptor';
import { IMAGE_LOADER, ImageLoaderConfig } from '@angular/common';
import { BackgroundPreloadingStrategy } from './shared/lib/router/background-preloading-strategy';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withViewTransitions(),
      withPreloading(BackgroundPreloadingStrategy),
    ),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAppInitializer(() => {
      const authStore = inject(AuthStore);
      return authStore.checkOnInit();
    }),
    {
      provide: IMAGE_LOADER,
      useValue: (config: ImageLoaderConfig) => config.src,
    },
  ],
};
