import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthResponse, UserProfile } from './user.model';
import { LoginData } from '../../features/auth/login-form/login-form';
import { RegisterData } from '../../features/auth/register-form/register-form';
import { ApiError, ApiResponse } from '../../shared/api/api-response';
import { jwtDecode } from 'jwt-decode';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

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
  private readonly baseUrl = `${environment.appApiUrl}/auth`;

  private readonly state = signal<AuthState>(initialState);

  readonly user = computed(() => this.state().user);
  readonly token = computed(() => this.state().accessToken);
  readonly loading = computed(() => this.state().loading);
  readonly initialCheck = computed(() => this.state().initialCheck);
  readonly error = computed(() => this.state().error);

  readonly isUnsafeAuthenticated = computed(() => !!this.state().accessToken);
  readonly isSafeAuthenticated = computed(
    () => this.isUnsafeAuthenticated() && this.initialCheck(),
  );

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

  logout(): void {
    this.updateState({
      user: null,
      accessToken: null,
      loading: false,
      initialCheck: false,
      error: null,
    });
    this.cleanTokenFromLocalStorage();
  }

  async retrieveUserInformation() {
    this.updateState({ loading: true, error: null });

    try {
      const user = await firstValueFrom(
        this.http.get<UserProfile>(`${environment.appApiUrl}/users/info`),
      );

      if (user) {
        this.updateState({
          loading: false,
          initialCheck: true,
          user: user,
          error: null,
        });
      }

      // if (response.error) {
      //   this.logout();
      //   return;
      // }

      // this.updateState({
      //   loading: false,
      //   initialCheck: true,
      //   user: response.data?.user,
      //   // accessToken: response.data?.accessToken,
      //   ...(response.data?.accessToken ? { accessToken: response.data.accessToken } : {}),
      //   error: null,
      // });
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
      accessToken: storedData.token,
      user: storedData.user,
    });
    await this.retrieveUserInformation();
  }

  private updateState(partialState: Partial<AuthState>): void {
    this.state.update((current) => ({ ...current, ...partialState }));
  }

  private retrieveTokenFromLocalStorage(): { token: string; user: UserProfile } | null {
    const data = localStorage.getItem(TOKEN_KEY);
    if (!data) return null;

    try {
      const parsedData = jwtDecode<UserProfile>(data);
      return { token: data, user: parsedData };
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
