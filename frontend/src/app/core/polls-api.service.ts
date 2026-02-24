import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Poll } from '../shared/models/poll.model';

export interface CreatePollPayload {
  title: string;
  optionA: string;
  optionB: string;
}

@Injectable({ providedIn: 'root' })
export class PollsApiService {
  private readonly pollsUrl = `${environment.apiBaseUrl}/polls`;

  constructor(private readonly http: HttpClient) {}

  getPolls(): Observable<Poll[]> {
    return this.http.get<Poll[]>(this.pollsUrl);
  }

  createPoll(payload: CreatePollPayload): Observable<Poll> {
    return this.http.post<Poll>(this.pollsUrl, payload);
  }
}
