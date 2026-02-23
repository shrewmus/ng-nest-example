import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Poll } from '../shared/models/poll.model';
import { AuthService } from './auth.service';

export interface CreatePollPayload {
  title: string;
  optionA: string;
  optionB: string;
}

@Injectable({ providedIn: 'root' })
export class PollsApiService {
  private readonly pollsUrl = `${environment.apiBaseUrl}/polls`;

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService,
  ) {}

  getPolls(): Observable<Poll[]> {
    return this.http.get<Poll[]>(this.pollsUrl, {
      headers: this.authHeaders(),
    });
  }

  createPoll(payload: CreatePollPayload): Observable<Poll> {
    return this.http.post<Poll>(this.pollsUrl, payload, {
      headers: this.authHeaders(),
    });
  }

  private authHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
    });
  }
}
