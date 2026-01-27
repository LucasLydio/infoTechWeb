import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopicsListComponent } from './topics-list/topics-list.component';
import { TopicDetailsComponent } from './topic-details/topic-details.component';
import { TopicCreateComponent } from './topic-create/topic-create.component';
import { SharedModule } from '../../shared/shared.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TopicsRoutingModule } from './topics-routing.module';
import { RouterModule } from '@angular/router';
import { NewsModule } from "../news/news.module";



@NgModule({
  declarations: [
    TopicsListComponent,
    TopicDetailsComponent,
    TopicCreateComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    TopicsRoutingModule,
    NewsModule
]
})
export class TopicsModule { }
