export interface AuthUser {
  sub: string;
  preferred_username?: string;
  realm_access?: {
    roles?: string[];
  };
  [key: string]: unknown;
}
