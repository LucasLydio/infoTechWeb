import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsListComponent } from './pages/news-list/news-list.component';
import { NewsDetailsComponent } from './pages/news-details/news-details.component';
import { NewsCreateComponent } from './pages/news-create/news-create.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth/auth.guard';
import { CanLoadGuard } from '../../core/guards/can-load/can-load.guard';
import { NewsFeedComponent } from './pages/news-feed/news-feed.component';

const routes: Routes = [
  { path: 'list', component: NewsListComponent }, // /news
  { path: '', component: NewsFeedComponent },
  { path: 'new', component: NewsCreateComponent, canActivate: [AuthGuard], canLoad: [CanLoadGuard] },
  { path: ':id', component: NewsDetailsComponent },
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class NewsRoutingModule { }
