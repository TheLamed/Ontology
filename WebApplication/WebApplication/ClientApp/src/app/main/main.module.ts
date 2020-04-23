import { Route } from "@angular/compiler/src/core";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CommonModule } from "@angular/common";
import { MatSnackBarModule, MatDialogModule, MatProgressSpinnerModule } from "@angular/material";
import { UsabilitiesService } from "../services/usabilities.service";
import { DialogService } from "../services/dialog.service";
import { LoginApiService } from "../services/api/api-login.service";
import { AuthService } from "../services/auth.service";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'a'
  },
  {
    path: 'a',
    loadChildren: './admin/admin.module#AdminModule',
  }
]

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,

    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
  ],
  providers: [
    UsabilitiesService,
    DialogService,

    LoginApiService,
    AuthService,
  ],
})
export class MainModule { }
