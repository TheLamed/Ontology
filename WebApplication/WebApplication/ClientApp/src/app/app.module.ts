import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';

import { MatProgressSpinnerModule } from '@angular/material';

const routes: Routes = [
  {
    path: '',
  },
  {
    path: 'a',
    loadChildren: () => import('./main/admin/admin.module').then(m => m.AdminModule),
  }
];

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    BrowserAnimationsModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes),

    MatProgressSpinnerModule,
  ],
  providers: []
})
export class AppModule { }
