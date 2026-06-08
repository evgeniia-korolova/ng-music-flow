import { ApiResponse } from '../../shared/api/api-response';

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  jamendoActive: boolean;
  userInformation?: UserInformation;
}

export interface UserInformation {
  avatar?: string;
  name: string;
  lastName: string;
  dateOfBirth?: Date;
  showEmail: boolean;
  socials?: UserSocials;
}

export interface UserSocials {
  instagram?: string;
  soundcloud?: string;
  twitter?: string;
}

export interface UserDto {
  user: UserProfile;
  accessToken: string;
}

export type AuthResponse = ApiResponse<UserDto>;
