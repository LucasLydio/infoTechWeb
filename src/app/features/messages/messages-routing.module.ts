import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InboxComponent } from './components/inbox/inbox.component';
import { SendComponent } from './components/send/send.component';

const routes: Routes = [
  { path: 'inbox', component: InboxComponent },
  { path: 'send', component: SendComponent },
  // Opcional: para responder alguém
  { path: 'send/:to', component: SendComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MessagesRoutingModule { }
