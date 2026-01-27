import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Topic } from '../../../shared/models/topic.model';
import { Reply } from '../../../shared/models/reply.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RepliesService } from '../../../core/services/replies/replies.service';
import { TopicsService } from '../../../core/services/topics/topics.service';

@Component({
  selector: 'app-topic-details',
  templateUrl: './topic-details.component.html',
  styleUrls: ['./topic-details.component.scss']
})
export class TopicDetailsComponent implements OnInit {
  topic?: Topic;
  replies: Reply[] = [];
  loading = true;
  replyLoading = false;
  replyForm: FormGroup;
  sending = false;
  errorMsg = '';

  constructor(
    private route: ActivatedRoute,
    private topicsService: TopicsService,
    private repliesService: RepliesService,
    private fb: FormBuilder
  ) {
    this.replyForm = this.fb.group({
      body: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
    const topicId = this.route.snapshot.paramMap.get('id');
    if (topicId) {
      this.fetchTopic(topicId);
      this.loadReplies(topicId);
    }
  }

  fetchTopic(id: string): void {
    this.loading = true;
    this.topicsService.getById(id).subscribe({
      next: res => {
        this.topic = res.topic;
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }

  loadReplies(topicId: string): void {
    this.replyLoading = true;

    this.repliesService.listByTopic(topicId).subscribe({
      next: replies => {
        this.replies = replies;
        this.replyLoading = false;
      },
      error: () => (this.replyLoading = false)
    });
  }

  submitReply(): void {
    if (this.replyForm.invalid || !this.topic) return;

    this.sending = true;
    this.errorMsg = '';

    this.repliesService.create(this.topic.id, this.replyForm.value).subscribe({
      next: reply => {
        this.replies.push(reply);
        this.replyForm.reset();
        this.sending = false;
      },
      error: () => {
        this.errorMsg = 'Erro ao enviar resposta.';
        this.sending = false;
      }
    });
  }
}
