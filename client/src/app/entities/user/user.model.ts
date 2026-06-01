import { ApiResponse } from '../../shared/api/api-response';

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  jamendoActive: boolean;
}

export interface UserDto {
  user: UserProfile;
  token: string;
}

export type AuthResponse = ApiResponse<UserDto>;
