export interface JamendoTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

export interface JamendoUser {
  id: string;
  name: string;
}
