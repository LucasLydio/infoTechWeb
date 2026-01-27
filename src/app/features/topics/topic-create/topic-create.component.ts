import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TopicsService } from '../../../core/services/topics/topics.service';

@Component({
  selector: 'app-topic-create',
  templateUrl: './topic-create.component.html',
  styleUrls: ['./topic-create.component.scss']
})
export class TopicCreateComponent {
  topicForm: FormGroup;
  submitting = false;
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private topicsService: TopicsService,
    private router: Router
  ) {
    this.topicForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(6)]],
      body: ['', [Validators.required, Validators.minLength(12)]]
    });
  }

  submitTopic() {
    if (this.topicForm.invalid) return;
    this.submitting = true;
    this.errorMsg = '';
    this.topicsService.create(this.topicForm.value).subscribe({
      next: topic => {
        this.submitting = false;
        this.router.navigate(['/topics', topic.id]);
      },
      error: (err) => {
        console.error('Erro ao criar tópico:', err);
        this.errorMsg = 'Erro ao criar tópico. Tente novamente.';
        this.submitting = false;
      }
    });
  }
}
