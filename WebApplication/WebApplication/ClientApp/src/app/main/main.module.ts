import { Route } from "@angular/compiler/src/core";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CommonModule } from "@angular/common";
import { MatSnackBarModule, MatDialogModule, MatProgressSpinnerModule } from "@angular/material";
import { UsabilitiesService } from "../services/usabilities.service";
import { DialogService } from "../services/dialog.service";
import { LoginApiService } from "../services/api/api-login.service";
import { AuthService } from "../services/auth.service";
import { ThemesApiService } from "../services/api/api-themes.service";
import { ThemesService } from "../services/themes.service";
import { ConfirmDialogModule } from "./shared/dialogs/confirm-dialog/confirm-dialog.module";
import { TermsApiService } from "../services/api/api-terms.service";
import { TermsService } from "../services/term.service";
import { InformationApiService } from "../services/api/api-information.service";
import { InformationService } from "../services/information.service";

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

    ConfirmDialogModule,

    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
  ],
  providers: [
    UsabilitiesService,
    DialogService,

    LoginApiService,
    ThemesApiService,
    TermsApiService,
    InformationApiService,

    AuthService,
    ThemesService,
    TermsService,
    InformationService,
  ],
})
export class MainModule { }
