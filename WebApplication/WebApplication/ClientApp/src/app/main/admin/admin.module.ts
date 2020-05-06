import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule, MatTableModule, MatAutocompleteModule, MatChipsModule, MatTabsModule, MatPaginatorModule, MatSortModule, MatCheckboxModule } from '@angular/material';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '../../guards/admin.guard';
import { AuthoriseGuard } from '../../guards/authorise.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { ThemesComponent } from './themes/themes.component';
import { AddThemeDialogComponent } from './themes/add-theme-dialog/add-theme-dialog.component';
import { TermsComponent } from './terms/terms.component';
import { AddTermDialogComponent } from './terms/add-term-dialog/add-term-dialog.component';
import { ManageThemesDialogComponent } from './terms/manage-themes-dialog/manage-themes-dialog.component';

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
  //{
  //  path: 'themes',
  //  component: ThemesComponent,
  //  canActivate: [AdminGuard],
  //},
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
    TermsComponent,
    AddTermDialogComponent,
    ManageThemesDialogComponent,
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
    MatTabsModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,

  ],
  providers: [
    AdminGuard,
    AuthoriseGuard,
  ],
  entryComponents: [
    AddThemeDialogComponent,
    ManageThemesDialogComponent,
    AddTermDialogComponent,
    ThemesComponent,
    TermsComponent,
  ]
})
export class AdminModule { }
