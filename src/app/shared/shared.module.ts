import {  NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './components/button/button.component';
import { CardComponent } from './components/card/card.component';
import { InputComponent } from './components/input/input.component';
import { SkeletonComponent } from './components/skeleton/skeleton.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { UserAvatarComponent } from './components/user-avatar/user-avatar.component';
import { UserPickerComponent } from './components/user-picker/user-picker.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ButtonComponent,
    CardComponent,
    InputComponent,
    SkeletonComponent,
    SpinnerComponent,
    UserAvatarComponent,
    UserPickerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    ButtonComponent,
    CardComponent,
    InputComponent,
    SkeletonComponent,
    SpinnerComponent,
    UserAvatarComponent,
    UserPickerComponent
  ]
})
export class SharedModule { }
