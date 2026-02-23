import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../core/auth.service';
import { PollsApiService } from '../../core/polls-api.service';
import { Poll } from '../../shared/models/poll.model';

@Component({
  selector: 'app-poll-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './poll-list.component.html',
  styleUrl: './poll-list.component.scss',
})
export class PollListComponent {
  polls: Poll[] = [];
  loading = false;
  error = '';

  constructor(
    private readonly pollsApiService: PollsApiService,
    readonly authService: AuthService,
  ) {}

  loadPolls(): void {
    this.loading = true;
    this.error = '';

    this.pollsApiService
      .getPolls()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (polls) => {
          this.polls = polls;
        },
        error: () => {
          this.error = 'Failed to load polls.';
        },
      });
  }
}
