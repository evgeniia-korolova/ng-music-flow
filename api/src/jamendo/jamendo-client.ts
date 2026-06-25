import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JamendoTokenResponse } from 'src/auth/interfaces/jamendo';
import { UsersService } from 'src/users/users.service';

interface JamendoResponseHeader {
  status: 'succeed' | 'failed';
  code: number;
  error_message: string;
}

export interface JamendoResponse<T> {
  headers: JamendoResponseHeader;
  results: T[];
}

@Injectable()
export class JamendoClient {
  private readonly baseUrl = 'https://api.jamendo.com/v3.0';

  constructor(
    private readonly config: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  async refreshToken(refreshToken: string): Promise<JamendoTokenResponse> {
    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: this.config.getOrThrow<string>('JAMENDO_CLIENT_ID'),
      client_secret: this.config.getOrThrow<string>('JAMENDO_CLIENT_SECRET'),
    });

    const response = await fetch(`${this.baseUrl}/oauth/grant/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    return (await response.json()) as JamendoTokenResponse;
  }

  async request<T, B = undefined>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    accessToken: string,
    userId: string,
    body?: B,
  ): Promise<JamendoResponse<T>> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    url.searchParams.append(
      'client_id',
      this.config.getOrThrow<string>('JAMENDO_CLIENT_ID'),
    );
    url.searchParams.append('access_token', accessToken);
    url.searchParams.append('format', 'json');

    const options: RequestInit = {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    };

    const response = await fetch(url.toString(), options);

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.statusText}`);
    }

    let data = (await response.json()) as JamendoResponse<T>;

    if (data.headers.status === 'failed' && data.headers.code === 12) {
      const user = await this.usersService.findById(userId);
      if (user?.jamendoRefreshToken) {
        const tokens = await this.refreshToken(user.jamendoRefreshToken);
        await this.usersService.update(userId, {
          jamendoAccessToken: tokens.access_token,
          jamendoRefreshToken: tokens.refresh_token,
        });

        const retryUrl = new URL(`${this.baseUrl}${endpoint}`);
        retryUrl.searchParams.append(
          'client_id',
          this.config.getOrThrow<string>('JAMENDO_CLIENT_ID'),
        );
        retryUrl.searchParams.append('access_token', tokens.access_token);
        retryUrl.searchParams.append('format', 'json');

        const newResponse = await fetch(retryUrl.toString(), options);

        data = (await newResponse.json()) as JamendoResponse<T>;

        if (data.headers?.status === 'failed') {
          throw new Error(
            `Jamendo API Error (${data.headers.code}): ${data.headers.error_message}`,
          );
        }
      }
    }

    return data;
  }
}
