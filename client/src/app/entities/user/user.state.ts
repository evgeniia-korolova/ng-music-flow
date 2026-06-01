import { computed, Injectable, signal } from '@angular/core';
import { AuthResponse, UserProfile } from './user.model';
import { LoginData } from '../../features/auth/login-form/login-form';
import { RegisterData } from '../../features/auth/register-form/register-form';
import { ApiError } from '../../shared/api/api-response';
import { jwtDecode } from 'jwt-decode';

export interface AuthState {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  initialCheck: boolean;
  error: ApiError | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  initialCheck: false,
  error: null,
};

const TOKEN_KEY = 'ngMusicFlow:token';

@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  private readonly state = signal<AuthState>(initialState);

  readonly user = computed(() => this.state().user);
  readonly token = computed(() => this.state().token);
  readonly loading = computed(() => this.state().loading);
  readonly initialCheck = computed(() => this.state().initialCheck);
  readonly error = computed(() => this.state().error);

  readonly isUnsafeAuthenticated = computed(() => !!this.state().token);
  readonly isSafeAuthenticated = computed(
    () => this.isUnsafeAuthenticated() && this.initialCheck(),
  );

  async login(loginData: LoginData): Promise<void> {
    this.updateState({ loading: true, error: null });

    try {
      const response = await this.mockLoginCall(loginData);

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
        token: response.data?.token,
        error: null,
      });

      this.saveTokenToLocalStorage(response.data?.token);
    } catch (err) {
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

  async register(data: RegisterData): Promise<void> {
    this.updateState({ loading: true, error: null });

    try {
      const response = await this.mockRegisterCall(data);

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
        token: response.data?.token,
        error: null,
      });

      this.saveTokenToLocalStorage(response.data?.token);
    } catch (err) {
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
      token: null,
      loading: false,
      initialCheck: false,
      error: null,
    });
    this.cleanTokenFromLocalStorage();
  }

  async retrieveUserInformation() {
    this.updateState({ loading: true, error: null });

    try {
      const response = await this.mockUserInformationCall();

      if (response.error) {
        this.logout();
        return;
      }

      this.updateState({
        loading: false,
        initialCheck: true,
        user: response.data?.user,
        token: response.data?.token,
        error: null,
      });
    } catch (err) {
      this.logout();
      this.updateState({
        initialCheck: true,
        error: {
          message: (err instanceof Error && err.message) || 'Something went wrong',
          status: 500,
        },
      });
    }
  }

  checkOnInit(): void {
    const storedData = this.retrieveTokenFromLocalStorage();

    if (!storedData) {
      this.updateState({ initialCheck: true });
      return;
    }

    this.updateState({ ...storedData });
    this.retrieveUserInformation();
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

  private mockLoginCall(loginData: LoginData): Promise<AuthResponse> {
    const random = Math.random();
    return new Promise((resolve) => {
      setTimeout(() => {
        if (random < 0.33) {
          resolve({ data: null, error: { message: 'Wrong credentials provided', status: 403 } });
          return;
        }
        if (random < 0.66) {
          resolve({ data: null, error: { message: 'Unexpected server error', status: 400 } });
          return;
        }
        resolve(this.mockApiResponse(loginData.email, 'User'));
      }, 3000);
    });
  }

  private mockRegisterCall(registerData: RegisterData): Promise<AuthResponse> {
    const random = Math.random();
    return new Promise((resolve) => {
      setTimeout(() => {
        if (random < 0.33) {
          resolve({
            data: null,
            error: { message: 'Email is already taken', status: 403, code: 'AUTH.EMAIL.TAKEN' },
          });
          return;
        }
        if (random < 0.66) {
          resolve({
            data: null,
            error: {
              message: 'Username is already taken',
              status: 403,
              code: 'AUTH.USERNAME.TAKEN',
            },
          });
          return;
        }
        resolve(this.mockApiResponse(registerData.email, 'User'));
      }, 3000);
    });
  }

  private mockUserInformationCall(): Promise<AuthResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.mockApiResponse('retrieved@email.com', 'User'));
      }, 3000);
    });
  }

  private mockApiResponse(email: string, username: string): AuthResponse {
    return {
      data: {
        user: {
          id: 'uuid',
          email,
          username,
          jamendoActive: false,
        },
        token: 'mocked-jwt-token',
      },
      error: null,
    };
  }
}
