import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly keycloak = new Keycloak({
    url: environment.keycloak.url,
    realm: environment.keycloak.realm,
    clientId: environment.keycloak.clientId,
  });

  private readonly authenticatedSubject = new BehaviorSubject<boolean>(false);
  private readonly usernameSubject = new BehaviorSubject<string>('');
  private readonly rolesSubject = new BehaviorSubject<string[]>([]);

  readonly authenticated$ = this.authenticatedSubject.asObservable();
  readonly username$ = this.usernameSubject.asObservable();
  readonly roles$ = this.rolesSubject.asObservable();

  async initialize(): Promise<void> {
    const authenticated = await this.keycloak.init({
      onLoad: 'check-sso',
      checkLoginIframe: false,
      pkceMethod: 'S256',
    });

    this.updateState(authenticated);
  }

  login(): Promise<void> {
    return this.keycloak.login({ redirectUri: window.location.origin });
  }

  logout(): Promise<void> {
    return this.keycloak.logout({ redirectUri: window.location.origin });
  }

  isAuthenticated(): boolean {
    return this.authenticatedSubject.value;
  }

  getToken(): string {
    return this.keycloak.token ?? '';
  }

  async getValidToken(): Promise<string> {
    if (!this.isAuthenticated()) {
      return '';
    }

    try {
      await this.keycloak.updateToken(30);
      this.updateState(true);
      return this.getToken();
    } catch {
      this.handleUnauthorized();
      return '';
    }
  }

  hasRole(role: string): boolean {
    return this.rolesSubject.value.includes(role);
  }

  async refreshToken(): Promise<void> {
    if (!this.isAuthenticated()) {
      return;
    }

    await this.getValidToken();
  }

  handleUnauthorized(): void {
    this.keycloak.clearToken();
    this.updateState(false);
  }

  private updateState(authenticated: boolean): void {
    this.authenticatedSubject.next(authenticated);

    if (!authenticated) {
      this.usernameSubject.next('');
      this.rolesSubject.next([]);
      return;
    }

    const parsed = this.keycloak.tokenParsed as
      | { preferred_username?: string; realm_access?: { roles?: string[] } }
      | undefined;

    this.usernameSubject.next(parsed?.preferred_username ?? '');
    this.rolesSubject.next(parsed?.realm_access?.roles ?? []);
  }
}
