import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  template: '',
})
export class HomeComponent implements OnInit {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    if (this.authService.hasRole('admin')) {
      void this.router.navigate(['/create-poll']);
      return;
    }

    void this.router.navigate(['/polls']);
  }
}
