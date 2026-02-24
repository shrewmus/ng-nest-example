import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { PollsApiService } from '../../core/polls-api.service';

@Component({
  selector: 'app-create-poll',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './create-poll.component.html',
  styleUrl: './create-poll.component.scss',
})
export class CreatePollComponent {
  showConfirmDialog = false;
  showForm = false;
  saving = false;
  error = '';
  readonly form;

  constructor(
    private readonly fb: FormBuilder,
    private readonly pollsApiService: PollsApiService,
    private readonly router: Router,
  ) {
    this.form = this.fb.nonNullable.group({
      title: ['', [Validators.required, Validators.maxLength(255)]],
      optionA: ['', [Validators.required, Validators.maxLength(255)]],
      optionB: ['', [Validators.required, Validators.maxLength(255)]],
    });
  }

  openDialog(): void {
    this.showConfirmDialog = true;
    this.showForm = false;
  }

  cancelDialog(): void {
    this.showConfirmDialog = false;
    this.showForm = false;
  }

  continueToForm(): void {
    this.showConfirmDialog = false;
    this.showForm = true;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.error = '';

    this.pollsApiService
      .createPoll(this.form.getRawValue())
      .pipe(finalize(() => (this.saving = false)))
      .subscribe({
        next: () => {
          this.form.reset({ title: '', optionA: '', optionB: '' });
          void this.router.navigate(['/polls']);
        },
        error: () => {
          this.error = 'Failed to create poll.';
        },
      });
  }
}
