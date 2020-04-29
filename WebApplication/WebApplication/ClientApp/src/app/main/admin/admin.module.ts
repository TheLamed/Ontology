import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule, MatTableModule, MatAutocompleteModule, MatChipsModule } from '@angular/material';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '../../guards/admin.guard';
import { AuthoriseGuard } from '../../guards/authorise.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { ThemesComponent } from './themes/themes.component';
import { AddThemeDialogComponent } from './themes/add-theme-dialog/add-theme-dialog.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login'
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    //canActivate: [AuthoriseGuard],
  },
  {
    path: 'themes',
    component: ThemesComponent,
    canActivate: [AdminGuard],
  },
  //{
  //  path: '**',
  //  redirectTo: 'login'
  //}
];

@NgModule({
  declarations: [
    LoginComponent,
    DashboardComponent,
    ThemesComponent,

    AddThemeDialogComponent,
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
    MatTableModule,
    MatMenuModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatChipsModule,

  ],
  providers: [
    AdminGuard,
    AuthoriseGuard,
  ],
  entryComponents: [
    AddThemeDialogComponent,
  ]
})
export class AdminModule { }
