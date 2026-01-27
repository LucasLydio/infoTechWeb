import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth/auth.guard';
import { CanLoadGuard } from './core/guards/can-load/can-load.guard';

export const routes: Routes = [
  // Prefixo para tópicos
  {
    path: 'home',
    loadChildren: () =>
      import('./features/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'topics',
    loadChildren: () =>
      import('./features/topics/topics.module').then(m => m.TopicsModule)
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'messages',
    loadChildren: () =>
      import('./features/messages/messages.module').then(m => m.MessagesModule),
    canActivate: [AuthGuard],
    canLoad: [CanLoadGuard]
  },
  {
    path: 'profile/me',
    loadChildren: () =>
      import('./features/profile/profile.module').then(m => m.ProfileModule),
    canActivate: [AuthGuard],
    canLoad: [CanLoadGuard]
  },
  {
    path: 'news',
    loadChildren: () =>
      import('./features/news/news.module').then(m => m.NewsModule),
    canActivate: [AuthGuard],
    canLoad: [CanLoadGuard]
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.module').then(m => m.AuthModule),
    canLoad: [CanLoadGuard]
  },
  // Redirecione a raiz para /topics
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
