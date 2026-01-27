import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsCreateComponent } from './pages/news-create/news-create.component';
import { NewsDetailsComponent } from './pages/news-details/news-details.component';
import { NewsListComponent } from './pages/news-list/news-list.component';
import { ReplyNewsComponent } from './reply-news/reply-news.component';
import { RouterModule } from '@angular/router';
import { NewsRoutingModule } from './news-routing.module';
import { SharedModule } from "../../shared/shared.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewsFeedComponent } from './pages/news-feed/news-feed.component';
import { NewsToolbarComponent } from './components/news-toolbar/news-toolbar.component';
import { NewsItemComponent } from './components/news-item/news-item.component';
import { NewsHighlightsComponent } from './components/news-highlights/news-highlights.component';
import { NewsSideComponent } from './components/news-side/news-side.component';


@NgModule({
  declarations: [
    NewsListComponent,
    NewsDetailsComponent,
    NewsCreateComponent,
    ReplyNewsComponent,
    NewsFeedComponent,
    NewsToolbarComponent,
    NewsItemComponent,
    NewsHighlightsComponent,
    NewsSideComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    NewsRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    NewsListComponent,
    NewsSideComponent
  ],
})

export class NewsModule { }
