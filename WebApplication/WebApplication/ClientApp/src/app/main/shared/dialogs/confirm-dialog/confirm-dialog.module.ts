import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule, MatDialogModule } from '@angular/material';
import { ConfirmDialogComponent } from './confirm-dialog.component';

@NgModule({
  declarations: [
    ConfirmDialogComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatDialogModule,
    MatButtonModule,
  ],
  entryComponents: [
    ConfirmDialogComponent
  ]
})
export class ConfirmDialogModule { }
