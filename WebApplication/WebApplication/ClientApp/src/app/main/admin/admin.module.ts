import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { AdminGuard } from '../../guards/admin.guard';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatFormField, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule } from '@angular/material';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
    //canActivate: [AdminGuard],
  },
  {
    path: 'login',
    component: LoginComponent
  },
];

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule.forChild(routes),

    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,

    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,

  ],
  providers: [
    AdminGuard,
  ]
})
export class AdminModule { }
