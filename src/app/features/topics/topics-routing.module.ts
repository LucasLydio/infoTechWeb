import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TopicsListComponent } from './topics-list/topics-list.component';
import { TopicDetailsComponent } from './topic-details/topic-details.component';
import { TopicCreateComponent } from './topic-create/topic-create.component';
import { AuthGuard } from '../../core/guards/auth/auth.guard';
import { CanLoadGuard } from '../../core/guards/can-load/can-load.guard';

const routes: Routes = [
  { path: '', component: TopicsListComponent, pathMatch: 'full' }, // /topics
  { path: 'new', component: TopicCreateComponent, canActivate: [AuthGuard], canLoad: [CanLoadGuard] }, // /topics/new
  { path: ':id', component: TopicDetailsComponent }, // /topics/:id
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TopicsRoutingModule {}
