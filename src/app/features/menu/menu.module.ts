import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuActionsComponent } from './menu-actions.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MenuMobileComponent } from './menu-mobile/menu-mobile.component';



@NgModule({
  declarations: [
    MenuActionsComponent,
    MenuMobileComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  exports: [
    MenuActionsComponent,
    MenuMobileComponent
  ]
})
export class MenuModule { }
