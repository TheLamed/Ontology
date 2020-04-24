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
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthoriseGuard } from '../../guards/authorise.guard';
import { ThemesComponent } from './themes/themes.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthoriseGuard],
  },
  {
    path: 'themes',
    component: ThemesComponent,
    canActivate: [AdminGuard],
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  declarations: [
    LoginComponent,
    DashboardComponent,
    ThemesComponent,
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
    AuthoriseGuard,
  ]
})
export class AdminModule { }
