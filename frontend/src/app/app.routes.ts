import { Routes } from '@angular/router';
import { adminGuard } from './auth/admin.guard';
import { authGuard } from './auth/auth.guard';
import { CreatePollComponent } from './features/create-poll/create-poll.component';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/login/login.component';
import { PollListComponent } from './features/polls/poll-list.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: HomeComponent, canActivate: [authGuard] },
  { path: 'polls', component: PollListComponent, canActivate: [authGuard] },
  {
    path: 'create-poll',
    component: CreatePollComponent,
    canActivate: [authGuard, adminGuard],
  },
  { path: '**', redirectTo: '' },
];
