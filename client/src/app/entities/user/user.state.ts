import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { AuthResponse, UserProfile } from './user.model';
import { LoginData } from '../../features/auth/login-form/login-form';
import { RegisterData } from '../../features/auth/register-form/register-form';
import { ApiError, ApiResponse } from '../../shared/api/api-response';
import { jwtDecode } from 'jwt-decode';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { ChangePasswordData } from '../../features/auth/change-password/change-password';
import { AudioPlayerService } from '../../shared/services/audio-player/audio-player-service';

export interface AuthState {
  user: UserProfile | null;
  accessToken: string | null;
  loading: boolean;
  initialCheck: boolean;
  error: ApiError | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  loading: false,
  initialCheck: false,
  error: null,
};

const TOKEN_KEY = 'ngMusicFlow:token';

@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  private readonly http = inject(HttpClient);
  private readonly playerService = inject(AudioPlayerService);
  private readonly baseUrl = `${environment.appApiUrl}/auth`;

  private readonly state = signal<AuthState>(initialState);

  readonly user = computed(() => this.state().user);
  readonly token = computed(() => this.state().accessToken);
  readonly loading = computed(() => this.state().loading);
  readonly initialCheck = computed(() => this.state().initialCheck);
  readonly error = computed(() => this.state().error);

  readonly isUnsafeAuthenticated = computed(() => !!this.state().user);
  readonly isSafeAuthenticated = computed(
    () => this.isUnsafeAuthenticated() && this.initialCheck(),
  );
  readonly isNotSyncedToJamendo = computed(
    () => !!this.state().user && !this.state().user?.jamendoId,
  );

  readonly isJamendoAlertOpen = signal<boolean>(false);

  constructor() {
    effect(() => {
      if (this.isSafeAuthenticated() && this.user() && !this.user()!.jamendoId) {
        this.isJamendoAlertOpen.set(true);
      } else {
        this.isJamendoAlertOpen.set(false);
      }
    });
  }

  async login(loginData: LoginData): Promise<void> {
    this.updateState({ loading: true, error: null });

    try {
      const response = await firstValueFrom(
        this.http.post<AuthResponse>(`${environment.appApiUrl}/auth/login`, loginData),
      );

      if (response.error) {
        this.updateState({
          loading: false,
          initialCheck: true,
          error: response.error,
        });
        return;
      }

      this.updateState({
        loading: false,
        initialCheck: true,
        user: response.data?.user,
        accessToken: response.data?.accessToken,
        error: null,
      });

      this.saveTokenToLocalStorage(response.data?.accessToken);
    } catch (err) {
      this.updateState({
        loading: false,
        initialCheck: true,
        error: this.handleError(err),
      });
    }
  }

  async register(data: RegisterData): Promise<void> {
    this.updateState({ loading: true, error: null });

    try {
      const response = await firstValueFrom(
        this.http.post<AuthResponse>(`${environment.appApiUrl}/auth/register`, data),
      );

      if (response.error) {
        this.updateState({
          loading: false,
          initialCheck: true,
          error: response.error,
        });
        return;
      }

      this.updateState({
        loading: false,
        initialCheck: true,
        user: response.data?.user,
        accessToken: response.data?.accessToken,
        error: null,
      });

      this.saveTokenToLocalStorage(response.data?.accessToken);
    } catch (err) {
      if (err instanceof HttpErrorResponse) {
        const apiResponse = err.error as ApiResponse<null>;

        this.updateState({
          loading: false,
          initialCheck: true,
          error: apiResponse.error,
        });
        return;
      }
      this.updateState({
        loading: false,
        initialCheck: true,
        error: {
          message: (err instanceof Error && err.message) || 'Something went wrong',
          status: 500,
        },
      });
    }
  }

  async changePassword(changeData: ChangePasswordData) {
    this.updateState({ loading: true, error: null });

    if (!this.state().initialCheck) {
      this.updateState({
        loading: false,
        error: {
          status: 400,
          message: 'User authorization should be checked first',
        },
      });

      return;
    }

    try {
      const { error } = await firstValueFrom(
        this.http.patch<ApiResponse<void>>(
          `${environment.appApiUrl}/auth/change-password`,
          changeData,
        ),
      );

      if (error) {
        this.updateState({
          loading: false,
          error,
        });

        return;
      }

      this.updateState({
        loading: false,
      });
    } catch (err) {
      if (err instanceof HttpErrorResponse) {
        const apiResponse = err.error as ApiResponse<null>;

        this.updateState({
          loading: false,
          error: apiResponse.error,
        });
        return;
      }
      this.updateState({
        loading: false,
        error: {
          message: (err instanceof Error && err.message) || 'Something went wrong',
          status: 500,
        },
      });
    }
  }

  logout(): void {
    this.updateState({
      user: null,
      accessToken: null,
      loading: false,
      initialCheck: false,
      error: null,
    });
    this.cleanTokenFromLocalStorage();
    this.playerService.stopAndReset();
  }

  async retrieveUserInformation() {
    this.updateState({ loading: true, error: null });

    try {
      const response = await firstValueFrom(
        this.http.get<ApiResponse<UserProfile>>(`${environment.appApiUrl}/users/info`),
      );

      if (response.error) {
        this.logout();
        return;
      }

      this.updateState({
        loading: false,
        initialCheck: true,
        user: response.data,
        error: null,
      });
    } catch (err) {
      this.logout();
      this.updateState({
        initialCheck: true,
        error: this.handleError(err),
      });
    }
  }

  async checkOnInit(): Promise<void> {
    const storedData = this.retrieveTokenFromLocalStorage();

    if (!storedData) {
      this.updateState({ initialCheck: true });
      return;
    }

    this.updateState({
      accessToken: storedData.accessToken,
      user: storedData.user,
    });
    await this.retrieveUserInformation();
  }

  private updateState(partialState: Partial<AuthState>): void {
    this.state.update((current) => ({ ...current, ...partialState }));
  }

  private retrieveTokenFromLocalStorage(): { accessToken: string; user: UserProfile } | null {
    const data = localStorage.getItem(TOKEN_KEY);
    if (!data) return null;

    try {
      const parsedData = jwtDecode<UserProfile>(data);
      return { accessToken: data, user: parsedData };
    } catch {
      return null;
    }
  }

  private cleanTokenFromLocalStorage(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  private saveTokenToLocalStorage(token?: string): void {
    if (!token) return;
    localStorage.setItem(TOKEN_KEY, token);
  }

  private handleError(err: unknown): ApiError {
    if (err instanceof HttpErrorResponse && err.error) {
      const apiResponse = err.error as ApiResponse<null>;

      if (apiResponse.error) {
        return apiResponse.error;
      }
    }

    return {
      message: err instanceof Error ? err.message : 'Something went wrong',
      status: err instanceof HttpErrorResponse ? err.status : 500,
    };
  }
}
